from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from .models import ReportTemplate
from .schemas import TemplateCreate, TemplateResponse
from typing import List
from pydantic import BaseModel
from .gemini_generator import  generate_code
import uuid

router = APIRouter(prefix="/templates", tags=["Templates"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class GenerateResponse(BaseModel):
    template_id: str
    target: str
    code: str


@router.post("/{template_id}/generate", response_model=GenerateResponse)
def generate_from_saved_template(
        template_id: str,
        target: str = Query(..., description="odoo | erpnext | sap_ui5 | shopify"),
        db: Session = Depends(get_db),
):
    tpl = db.query(ReportTemplate).filter(ReportTemplate.template_id == template_id).first()
    if not tpl:
        raise HTTPException(404, "template not found")

    layout = tpl.layout_json
    meta = tpl.meta or {}

    # Call LLM (Gemini)
    code = generate_code(target, layout, meta)

    return GenerateResponse(template_id=template_id, target=target, code=code)


@router.post("/", response_model=TemplateResponse)
def create_template(data: TemplateCreate, db: Session = Depends(get_db)):
    """
    If a template with same template_name & folder_id exists --> update (override).
    Else create new record and store JSON on disk in folder.
    """
    # normalize template_id if missing
    template_id = data.template_id or f"template_{int(uuid.uuid4().int>>64)}"
    # check existing by name + folder
    existing = db.query(ReportTemplate).filter(ReportTemplate.template_name == data.template_name, ReportTemplate.folder_id == data.folder_id).first()
    if existing:
        # update in-place (override)
        existing.version = data.version
        existing.layout_json = data.layout_json
        existing.meta = data.meta
        db.add(existing)
        db.commit()
        db.refresh(existing)
        existing.write_to_disk()
        return existing

    # else create new
    tpl = ReportTemplate(
        template_id=template_id,
        template_name=data.template_name,
        version=data.version,
        folder_id=data.folder_id,
        folder_name=data.folder_name,
        layout_json=data.layout_json,
        meta=data.meta
    )
    db.add(tpl)
    db.commit()
    db.refresh(tpl)
    tpl.write_to_disk()
    return tpl

@router.get("/", response_model=List[TemplateResponse])
def list_templates(folder_id: str = Query(None), db: Session = Depends(get_db)):
    q = db.query(ReportTemplate)
    if folder_id:
        q = q.filter(ReportTemplate.folder_id == folder_id)
    return q.order_by(ReportTemplate.created_at.desc()).all()

@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(template_id: str, db: Session = Depends(get_db)):
    tpl = db.query(ReportTemplate).filter(ReportTemplate.template_id == template_id).first()
    if not tpl:
        raise HTTPException(404, "template not found")
    return tpl

@router.delete("/{id}", response_model=dict)
def delete_template(id: int, db: Session = Depends(get_db)):
    tpl = db.query(ReportTemplate).filter(ReportTemplate.id == id).first()
    if not tpl:
        raise HTTPException(404, "template not found")
    # delete file on disk if present
    try:
        storage = "templates_storage"
        import os
        path = os.path.join(storage, tpl.folder_id, f"{tpl.template_id}.json")
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass
    db.delete(tpl)
    db.commit()
    return {"status": "deleted"}

@router.get("/folders", response_model=List[dict])
def list_folders(db: Session = Depends(get_db)):
    # simple list of folders with counts
    rows = db.query(ReportTemplate.folder_id, ReportTemplate.folder_name).distinct().all()
    return [{"folder_id": r[0], "folder_name": r[1]} for r in rows]


@router.post("/{template_id}/generate", response_model=GenerateResponse)
def generate_from_saved_template(
        template_id: str,
        target: str = Query(..., description="odoo | erpnext | sap_ui5 | shopify"),
        db: Session = Depends(get_db),
):
    tpl = db.query(ReportTemplate).filter(ReportTemplate.template_id == template_id).first()
    print(tpl)
    if not tpl:
        raise HTTPException(404, "template not found")

    layout = tpl.layout_json
    meta = tpl.meta or {}

    # Call LLM (Gemini)
    code = generate_code(layout, target, meta)
    return GenerateResponse(template_id=template_id, target=target, code=code)