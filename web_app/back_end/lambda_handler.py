import json
import base64
import torch
from torch.utils.data import DataLoader
from io import BytesIO
import pandas as pd

from app.dependencies.config_dataset_validator import ID_COLUMN, THRESHOLD, PATH_WEIGHTS
from app.training_model.model.model import DualViewNet
from app.training_model.dataset.dual_view_dataset import DualViewDataset


def lambda_handler(event, context):
    try:
        if "body" not in event:
            return _response(400, {"detail": "No file provided"})

        if event.get("isBase64Encoded", False):
            file_content = base64.b64decode(event["body"])
        else:
            file_content = event["body"].encode("utf-8")

        try:
            bytes_io_object = BytesIO(file_content)
            X = pd.read_csv(bytes_io_object)
        except Exception as e:
            return _response(400, {"detail": f"Invalid CSV {e}"})

        columns_df = X.columns.tolist()
        is_labels = True if ID_COLUMN in columns_df else False

        diff_cols = X.columns.difference([ID_COLUMN]).tolist()
        numerical_diff = X[diff_cols].select_dtypes(include="number").columns.tolist()
        if diff_cols != numerical_diff:
            return _response(
                400,
                {"detail": f"Flux columns '{diff_cols}' must be numeric"},
            )

        if is_labels:
            labels_data = X[ID_COLUMN]
            df_to_send = X.drop(columns=[ID_COLUMN])
            labels = labels_data.tolist()
        else:
            df_to_send = X
            labels = []

        model = DualViewNet()
        if torch.cuda.is_available():
            state_dict = torch.load(PATH_WEIGHTS)
        else:
            state_dict = torch.load(PATH_WEIGHTS, map_location=torch.device("cpu"))

        model.load_state_dict(state_dict)
        model.eval()

        ds_te = DualViewDataset(df_to_send)
        loader = DataLoader(ds_te, batch_size=1, num_workers=1, pin_memory=True)

        predictions = []
        with torch.no_grad():
            for gv, lv in loader:
                outputs = model(gv, lv)
                prob = torch.sigmoid(outputs).float().detach().cpu().numpy().reshape(-1)
                predictions.append(int(prob >= THRESHOLD))

        data = []
        for i in range(len(predictions)):
            item = {
                "label": labels[i] if labels else i + 1,
                "prediction": "FALSE POSITIVE" if predictions[i] else "CANDIDATE",
            }
            data.append(item)

        return _response(200, {"data": data})

    except Exception as e:
        return _response(500, {"detail": str(e)})


def _response(status_code: int, body: dict):
    """Helper to format API Gateway Lambda proxy response"""
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
