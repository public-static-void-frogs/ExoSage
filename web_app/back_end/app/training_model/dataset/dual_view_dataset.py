import pandas as pd
from typing import List, Tuple
import numpy as np
from torch.utils.data import Dataset
import torch


def nan_to_zero_and_mask(X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    mask = (~np.isnan(X)).astype(np.float32)
    X_filled = np.nan_to_num(X, nan=0.0).astype(np.float32)
    return X_filled, mask

def uniform_downsample(x: np.ndarray, factor: int) -> np.ndarray:
    T = x.shape[-1]
    newT = T // factor
    return x[..., :newT*factor].reshape(*x.shape[:-1], newT, factor).mean(axis=-1)

def extract_local_window(
        x: np.ndarray,
        mask: np.ndarray,
        win_len: int
) -> Tuple[np.ndarray, np.ndarray]:
    flux, m = x[0], mask[0]
    T = flux.shape[-1]
    if win_len >= T:
        return x[..., :win_len], mask[..., :win_len]
    step = max(1, win_len // 4)
    best_s, best_i = -1, 0
    for i in range(0, T - win_len + 1, step):
        seg = flux[i:i+win_len]
        mv = m[i:i+win_len] > 0
        if mv.sum() < max(8, win_len//16):
            continue
        s = np.var(seg[mv])
        if s > best_s:
            best_s, best_i = s, i
    i = best_i
    return x[..., i:i+win_len], mask[..., i:i+win_len]


class DualViewDataset(Dataset):
    def __init__(
        self,
        df_X: pd.DataFrame,
        downsample_factor: int = 4,
        local_len: int = 1024
    ) -> None:
        self.length = df_X.shape[0]
        X = df_X.to_numpy(dtype=np.float32, na_value=np.nan)
        X, mask = nan_to_zero_and_mask(X)
        self.global_views: List[np.ndarray] = []
        self.local_views:  List[np.ndarray] = []
        for i in range(X.shape[0]):
            flux = X[i][None, :]
            msk  = mask[i][None, :]
            g = np.concatenate([flux, msk], axis=0)
            g_ds = uniform_downsample(g, factor=downsample_factor)
            l_win, l_m = extract_local_window(
                g,
                np.concatenate([msk, msk], axis=0),
                local_len,
            )
            self.global_views.append(g_ds.astype(np.float32))
            self.local_views.append(l_win.astype(np.float32))

    def __len__(self): return self.length

    def __getitem__(self, i):
        gv = torch.from_numpy(self.global_views[i])
        lv = torch.from_numpy(self.local_views[i])
        return gv, lv
