import pandas as pd
from typing import List, Tuple

import numpy as np
from torch.utils.data import Dataset
import torch


def nan_to_zero_and_mask(X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """X: (N, T) із трейлінговими NaN. Повертає X_filled, mask (1=valid,0=pad)."""
    mask = (~np.isnan(X)).astype(np.float32)
    X_filled = np.nan_to_num(X, nan=0.0).astype(np.float32)
    return X_filled, mask


def uniform_downsample(x: np.ndarray, factor: int) -> np.ndarray:
    """Просте рівномірне даунсемплювання по осі T: (C,T)->(C,T/factor)."""
    T = x.shape[-1]
    newT = T // factor
    return x[..., :newT*factor].reshape(*x.shape[:-1], newT, factor).mean(axis=-1)


def extract_local_window(x: np.ndarray, mask: np.ndarray, win_len: int) -> Tuple[np.ndarray, np.ndarray]:
    """
    Якщо період/епохи немає: беремо вікно довжини win_len із найбільшою локальною дисперсією
    (оцінка по валідних точках). Повертає (x_win, mask_win) форми (C, win_len).
    """
    # x: (C=2, T), де ch0=flux, ch1=mask
    flux, m = x[0], mask[0]
    T = flux.shape[-1]
    if win_len >= T:
        # просто падимо справа (маска вже 0)
        return x[..., :win_len], mask[..., :win_len]
    # ковзна дисперсія на валідних ділянках
    # для простоти: дисперсія на блоках без перекриття, потім беремо найкращий блок
    step = max(1, win_len // 4)
    best_s, best_i = -1, 0
    for i in range(0, T - win_len + 1, step):
        seg = flux[i:i+win_len]
        mv = m[i:i+win_len] > 0
        if mv.sum() < max(8, win_len//16):  # замало валідних
            continue
        s = np.var(seg[mv])
        if s > best_s:
            best_s, best_i = s, i
    i = best_i
    return x[..., i:i+win_len], mask[..., i:i+win_len]


class DualViewDataset(Dataset):
    """
    Будує дві репрезентації:
      - global_view: [2, Tg] (після даунсемплу)
      - local_view:  [2, Tl] (вікно з найбільшою варіативністю або фазоване вікно)
    y: бінарна мітка 0/1
    """
    def __init__(
        self,
        df_X: pd.DataFrame,
        downsample_factor: int = 4,   # 70001 -> ~17500
        local_len: int = 1024
    ):
        self.length = df_X.shape[0]
        X = df_X.to_numpy(dtype=np.float32, na_value=np.nan)
        X, mask = nan_to_zero_and_mask(X)

        # формуємо 2-канальні представлення
        self.global_views: List[np.ndarray] = []
        self.local_views:  List[np.ndarray] = []
        for i in range(X.shape[0]):
            flux = X[i][None, :]          # [1, T]
            msk  = mask[i][None, :]       # [1, T]
            g = np.concatenate([flux, msk], axis=0)  # [2, T]
            # global: даунсемпл (економія пам'яті і краще для TCN)
            g_ds = uniform_downsample(g, factor=downsample_factor)  # [2, Tg]
            # local: топ-вікно за дисперсією (або сюди підставиш фазоване вікно)
            l_win, l_m = extract_local_window(g, np.concatenate([msk, msk], axis=0), local_len)
            self.global_views.append(g_ds.astype(np.float32))
            self.local_views.append(l_win.astype(np.float32))

    def __len__(self): return self.length

    def __getitem__(self, i):
        gv = torch.from_numpy(self.global_views[i])  # [2, Tg]
        lv = torch.from_numpy(self.local_views[i])   # [2, Tl]
        return gv, lv
