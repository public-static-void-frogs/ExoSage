from fastapi import (
    APIRouter,
    status,
    UploadFile,
    File,
    HTTPException,
)
import torch
from torch.utils.data import DataLoader
from io import BytesIO
import pandas as pd
import onnxruntime as ort

from app.dependencies.config_dataset_validator import ID_COLUMN, THRESHOLD, ONNX_PATH
from app.schemas.inference import ResponseInference
from app.training_model.dataset.dual_view_dataset import DualViewDataset
from app.training_model.dataset.outliers import remove_outliers_torch_cpu
from app.training_model.dataset.nans import fill_nan_fourier

router = APIRouter()


@router.post("/inference", response_model=ResponseInference)
async def inference(
        input_dataset: UploadFile = File(...),
) -> ResponseInference:

    if input_dataset.content_type != "text/csv":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV",
        )
    try:
        file_content = await input_dataset.read()
        bytes_io_object = BytesIO(file_content)
        X = pd.read_csv(bytes_io_object)
        del file_content, bytes_io_object
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Invalid CSV {e}',
        )

    columns_df = X.columns.tolist()
    is_labels = ID_COLUMN in columns_df
    del columns_df

    diff_cols = X.columns.difference([ID_COLUMN]).tolist()
    numerical_diff = X[diff_cols].select_dtypes(include="number").columns.tolist()
    if diff_cols != numerical_diff:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Flux columns '{diff_cols}' must be numeric",
        )
    del diff_cols, numerical_diff

    if is_labels:
        labels_data = X[ID_COLUMN]
        df_to_send = X.drop(columns=[ID_COLUMN])
        labels = labels_data.tolist()
    else:
        df_to_send = X
        labels = []

    df_to_send = remove_outliers_torch_cpu(df_to_send)
    n = df_to_send.shape[1] // 2
    df_to_send = df_to_send.apply(lambda x: fill_nan_fourier(x, n), axis=1)

    ort_session = ort.InferenceSession(ONNX_PATH, providers=["CPUExecutionProvider"])
    ds_te = DualViewDataset(df_to_send)
    loader = DataLoader(ds_te, batch_size=1, num_workers=1, pin_memory=True)
    predictions = []
    try:
        with torch.no_grad():
            for gv, lv in loader:
                gv_np = gv.numpy()
                lv_np = lv.numpy()
                outputs = ort_session.run(None, {
                    "input": gv_np,
                    "onnx::Slice_1": lv_np
                })[0]
                outputs_torch = torch.from_numpy(outputs)
                prob = torch.sigmoid(outputs_torch).float().detach().cpu().numpy().reshape(-1)
                predictions.append(int(prob >= THRESHOLD))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


    data = []
    for i in range(len(predictions)):
        item = dict()
        item["label"] = labels[i] if labels else i + 1
        item["prediction"] = "NOT PLANET" if predictions[i] else "PLANET"
        data.append(item)

    result = ResponseInference(
        data=data,
    )
    return result