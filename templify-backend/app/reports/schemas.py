# from pydantic import BaseModel
# from typing import Dict, Any
#
# class TemplateCreate(BaseModel):
#     template_id: str
#     template_name: str
#     version: str
#     layout_json: Dict[str, Any]
#
# class TemplateResponse(TemplateCreate):
#     id: int
#     class Config:
#         orm_mode = True
#

from pydantic import BaseModel
from typing import Dict, Any, Optional, Any
from datetime import datetime

class TemplateCreate(BaseModel):
    template_id: str
    template_name: str
    version: Optional[str] = "1.0"
    folder_id: Optional[str] = "root"
    folder_name: Optional[str] = "My Templates"
    meta: Optional[Dict[str, Any]] = {}
    layout_json: Dict[str, Any]


class TemplateResponse(TemplateCreate):
    id: int
    created_at:datetime

    class Config:
        orm_mode = True
