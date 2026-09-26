from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from database import Base, engine
import models
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevPath Analytics API",
    version="0.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class SkillCreate(BaseModel):
    nome: str
    categoria: str
    nivel: float = 0
    horas_estudo: float = 0
    projetos: int = 0


@app.get("/")
def root():
    return {
        "app": "DevPath Analytics",
        "status": "online",
        "version": "0.1.0"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }
@app.post("/api/skills")
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db)
):
    nova_skill = models.Skill(
        nome=skill.nome,
        categoria=skill.categoria,
        nivel=skill.nivel,
        horas_estudo=skill.horas_estudo,
        projetos=skill.projetos
    )

    db.add(nova_skill)
    db.commit()
    db.refresh(nova_skill)

    return nova_skill


@app.get("/api/skills")
def list_skills(
    db: Session = Depends(get_db)
):
    return db.query(models.Skill).all()