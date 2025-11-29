# from sqlalchemy import Column, Integer, String, JSON, DateTime, func
# from app.database.connection import Base
#
# class ReportTemplate(Base):
#     __tablename__ = "report_templates"
#
#     id = Column(Integer, primary_key=True, index=True)
#     template_id = Column(String, unique=True, index=True)
#     template_name = Column(String, nullable=False)
#     version = Column(String, default="1.0")
#     layout_json = Column(JSON, nullable=False)
#
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, JSON, DateTime, func, Text
from app.database.connection import Base
import os

class ReportTemplate(Base):
    __tablename__ = "report_templates"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True)
    template_name = Column(String, nullable=False, index=True)
    version = Column(String, default="1.0")
    folder_id = Column(String, nullable=False, index=True, default="root")
    folder_name = Column(String, nullable=False, default="My Templates")
    layout_json = Column(JSON, nullable=False)
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def write_to_disk(self, storage_root="templates_storage"):
        """
        Persist layout_json into a file templates_storage/<folder_id>/<template_id>.json
        Called after create/update to keep JSON snapshots.
        """
        folder = os.path.join(storage_root, self.folder_id)
        os.makedirs(folder, exist_ok=True)
        path = os.path.join(folder, f"{self.template_id}.json")
        import json
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.layout_json, f, ensure_ascii=False, indent=2)
        return path
