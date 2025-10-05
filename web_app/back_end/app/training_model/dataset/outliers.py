import torch
import pandas as pd

def remove_outliers_torch_cpu(
    df: pd.DataFrame,
    sigma: float = 3.0,
    method: str = "median",
    fill_value=float("nan"),
    batch_size: int = 2048,
) -> pd.DataFrame:
    """
    Robust outlier removal on CPU using PyTorch.
    Supports NaN-safe mean/median and batched processing.
    """

    # Move all data to CPU
    data_cpu = torch.tensor(df.to_numpy(dtype="float32"), device="cpu")
    n_rows = data_cpu.shape[0]
    result = torch.empty_like(data_cpu)

    for start in range(0, n_rows, batch_size):
        end = min(start + batch_size, n_rows)
        batch = data_cpu[start:end]

        nan_mask = torch.isnan(batch)

        # Compute center (median or mean) ignoring NaNs
        if method == "median":
            center = torch.nanmedian(batch, dim=1, keepdim=True).values
        else:
            center = torch.nanmean(batch, dim=1, keepdim=True)

        # --- custom nanstd implementation ---
        diff = batch - center
        diff[nan_mask] = 0
        count = (~nan_mask).sum(dim=1, keepdim=True).clamp(min=1)
        var = (diff ** 2).sum(dim=1, keepdim=True) / count
        std = torch.sqrt(var)
        # ------------------------------------

        mask = (torch.abs(batch - center) > sigma * std) & ~nan_mask

        # Replace outliers with fill_value or NaN
        if torch.isnan(torch.tensor(fill_value)):
            batch = torch.where(mask, torch.tensor(float("nan")), batch)
        else:
            batch = torch.where(mask, torch.tensor(fill_value, dtype=batch.dtype), batch)

        result[start:end] = batch

    # Convert back to DataFrame
    return pd.DataFrame(result.numpy(), index=df.index, columns=df.columns)
