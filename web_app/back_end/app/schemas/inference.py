from typing import List, Dict
from pydantic import BaseModel


class ResponseInference(BaseModel):
    data: List[Dict[str, int|str|None]]