from typing import Optional
import torch
from  torch import nn


class MaskedGAP(nn.Module):
    def forward(
            self,
            feats: torch.Tensor,
            mask: torch.Tensor
    ) -> torch.Tensor:
        masked = feats * mask
        denom = mask.sum(dim=-1).clamp_min(1.0)
        return masked.sum(dim=-1) / denom

class TCNBlock(nn.Module):
    def __init__(
            self,
            ch,
            ks=9,
            dil=1,
            p=0.2
    ) -> None:
        super().__init__()
        pad = (ks-1)//2 * dil
        self.net = nn.Sequential(
            nn.Conv1d(ch, ch, kernel_size=ks, dilation=dil, padding=pad),
            nn.BatchNorm1d(ch),
            nn.ReLU(),
            nn.Dropout(p),
            nn.Conv1d(ch, ch, kernel_size=ks, dilation=dil, padding=pad),
            nn.BatchNorm1d(ch),
        )
        self.act = nn.ReLU()

    def forward(self, x) -> torch.Tensor:
        return self.act(self.net(x) + x)


class SE1D(nn.Module):
    def __init__(self, ch, r=8) -> None:
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(ch, ch//r),
            nn.ReLU(),
            nn.Linear(ch//r, ch),
            nn.Sigmoid()
        )

    def forward(self, x) -> torch.Tensor:
        w = x.mean(dim=-1)
        s = self.fc(w).unsqueeze(-1)
        return x * s


class GlobalTCN(nn.Module):
    def __init__(
            self,
            in_ch=2,
            width=128,
            ks=9,
            dilations=(1,2,4,8,16,32),
            p=0.2
    ) -> None:
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv1d(in_ch, width, kernel_size=5, padding=2, stride=1),
            nn.ReLU()
        )
        self.blocks = nn.Sequential(*[TCNBlock(width, ks=ks, dil=d, p=p) for d in dilations])
        self.se = SE1D(width)
        self.gap = MaskedGAP()

    def forward(self, x) -> torch.Tensor:
        flux, mask = x[:, :1, :], x[:, 1:2, :]
        h = torch.cat([flux, mask], dim=1)
        h = self.stem(h)
        h = self.blocks(h)
        h = self.se(h)
        pooled = self.gap(h, mask)
        return pooled


class InceptionModule1D(nn.Module):
    def __init__(
            self,
            in_ch,
            out_ch,
            ks_list=(3,5,9,15),
            bottleneck=32
    ) -> None:
        super().__init__()
        self.reduce = nn.Conv1d(in_ch, bottleneck, kernel_size=1)
        self.branches = nn.ModuleList([
            nn.Conv1d(
                bottleneck,
                out_ch//len(ks_list),
                kernel_size=ks,
                padding=ks//2
            )
            for ks in ks_list
        ])
        self.bn = nn.BatchNorm1d(out_ch)
        self.act = nn.ReLU()

    def forward(self, x) -> torch.Tensor:
        x = self.reduce(x)
        outs = [b(x) for b in self.branches]
        y = torch.cat(outs, dim=1)
        return self.act(self.bn(y))


class LocalInception(nn.Module):
    def __init__(self, in_ch=2, width=128) -> None:
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv1d(in_ch,
                      64,
                      kernel_size=5,
                      padding=2
                      ),
            nn.ReLU()
        )
        self.inc1 = InceptionModule1D(64, width)
        self.inc2 = InceptionModule1D(width, width)
        self.gap  = MaskedGAP()

    def forward(self, x) -> torch.Tensor:
        flux, mask = x[:, :1, :], x[:, 1:2, :]
        h = torch.cat([flux, mask], dim=1)
        h = self.stem(h)
        h = self.inc1(h)
        h = self.inc2(h)
        pooled = self.gap(h, mask)
        return pooled


class DualViewNet(nn.Module):
    def __init__(
            self,
            gv_width=128,
            lv_width=128,
            use_meta=False,
            meta_dim=0
    ) -> None:
        super().__init__()
        self.global_branch = GlobalTCN(in_ch=2, width=gv_width)
        self.local_branch  = LocalInception(in_ch=2, width=lv_width)
        in_dim = gv_width + lv_width
        if use_meta and meta_dim > 0:
            self.meta = nn.Sequential(
                nn.Linear(meta_dim, 64), nn.BatchNorm1d(64), nn.ReLU(), nn.Dropout(0.2)
            )
            in_dim += 64
        else:
            self.meta = None
        self.head = nn.Sequential(
            nn.BatchNorm1d(in_dim),
            nn.Dropout(0.3),
            nn.Linear(in_dim, 128), nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1)
        )

    def forward(
            self,
            gv,
            lv,
            meta: Optional[torch.Tensor]=None
    ) -> torch.Tensor:
        g = self.global_branch(gv)
        l = self.local_branch(lv)
        feats = torch.cat([g, l], dim=1)
        if self.meta is not None and meta is not None:
            feats = torch.cat([feats, self.meta(meta)], dim=1)
        logit = self.head(feats).squeeze(1)
        return logit
