import numpy as np

def fill_nan_fourier(row, n_components):
    x = np.arange(len(row))
    y = row.values.copy()
    mask = ~np.isnan(y)
    x_valid = x[mask]
    y_valid = y[mask]

    if len(y_valid) == 0:
        return row  # all NaNs, nothing to do

    y_interp = np.interp(x, x_valid, y_valid)
    fft_coeffs = np.fft.rfft(y_interp)
    if n_components:
        fft_coeffs[n_components:] = 0
    y_smooth = np.fft.irfft(fft_coeffs, n=len(y_interp))

    y_filled = row.astype(np.float32).copy()
    y_filled[np.isnan(row)] = y_smooth[np.isnan(row)].astype(np.float32)
    return y_filled
