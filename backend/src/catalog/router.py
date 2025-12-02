from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.catalog.schemas import InhabitantsShowList, DiseasesShow, InhabitantsShowOne, InhabitantsFilter
from src.catalog.service import get_all_inhabitants, get_all_diseases, get_inhabitant_logic
from src.monitoring.schemas import SymptomDTO, SmartDiagnosisRequest
from src.catalog.service import diagnose_disease_smart
from src.catalog.models import CatalogSymptom

router = APIRouter(prefix="/catalog", tags=["Catalog 📚"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/inhabitants/", response_model=List[InhabitantsShowList])
async def get_inhabitants(db:db_dependency, user:user_dependency, filters: InhabitantsFilter = Depends()):
    return get_all_inhabitants(db=db, user_id=user.get("user_id"), filters=filters)


@router.get("/disease/", response_model=List[DiseasesShow])
async def get_diseases(db:db_dependency, user:user_dependency):
    return get_all_diseases(db=db, user_id=user.get("user_id"))

@router.get("/inhabitants/{inhabitant_id}", response_model=InhabitantsShowOne)
async def get_inhabitant(db:db_dependency, inhabitant_id:int, user_id:user_dependency):
    return get_inhabitant_logic(db=db, inhabitant_id=inhabitant_id, user_id=user_id.get("user_id"))

@router.get("/symptoms", response_model=List[SymptomDTO])
def get_all_symptoms(db: Session = Depends(get_db)):
    return db.query(CatalogSymptom).all()

@router.post("/diagnose-smart")
def run_smart_diagnosis(
    body: SmartDiagnosisRequest,
    db: Session = Depends(get_db)
):
    return diagnose_disease_smart(db, body.symptom_ids)