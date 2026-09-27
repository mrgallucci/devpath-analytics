import httpx

from fastapi import FastAPI, Depends, HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from database import Base, engine
import models
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, get_db
import models

class ProjectImport(BaseModel):
    url: str

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
@app.get("/api/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):
    skills = db.query(models.Skill).all()

    total_skills = len(skills)
    total_horas = sum(skill.horas_estudo for skill in skills)
    

    return {
        "skills": total_skills,
        "horas_estudo": total_horas,
        "projetos": db.query(models.Project).count(),
        "certificados": db.query(models.Certificate).count(),
        "renda_tech": 0,
        "meta_renda": 3000
    }
def atualizar_skills_do_projeto(db: Session, tecnologias: list[str]):

    mapa_skills = {
        "HTML": "HTML5",
        "CSS": "CSS3",
        "JavaScript": "JavaScript",
        "TypeScript": "TypeScript",
        "Python": "Python",
        "React": "React",
        "Next.js": "Next.js",
        "FastAPI": "FastAPI",
        "PostgreSQL": "PostgreSQL",
        "Git": "Git",
        "GitHub": "GitHub",
    }

    for tecnologia in tecnologias:
        nome_skill = mapa_skills.get(tecnologia, tecnologia)

        skill = (
            db.query(models.Skill)
            .filter(models.Skill.nome.ilike(nome_skill))
            .first()
        )

        if skill:
            skill.projetos += 1

    db.commit()

def recalcular_projetos_por_skill(db: Session):
    skills = db.query(models.Skill).all()
    projetos = db.query(models.Project).all()

    aliases = {
        "HTML5": ["HTML", "HTML5"],
        "CSS3": ["CSS", "CSS3"],
        "JavaScript": ["JavaScript"],
        "TypeScript": ["TypeScript"],
        "Python": ["Python"],
        "React": ["React"],
        "Next.js": ["Next.js"],
        "FastAPI": ["FastAPI"],
        "PostgreSQL": ["PostgreSQL"],
        "Git": ["Git"],
        "GitHub": ["GitHub"],
    }

    for skill in skills:
        skill.projetos = 0

        nomes_validos = aliases.get(skill.nome, [skill.nome])

        for projeto in projetos:
            if not projeto.tecnologias:
                continue

            tecnologias_projeto = [
                tecnologia.strip()
                for tecnologia in projeto.tecnologias.split(",")
            ]

            if any(
                nome in tecnologias_projeto
                for nome in nomes_validos
            ):
                skill.projetos += 1

    db.commit()
@app.post("/api/skills/recalculate-projects")
def recalculate_skill_projects(
    db: Session = Depends(get_db)
):
    recalcular_projetos_por_skill(db)

    return {
        "message": "Contagem de projetos recalculada com sucesso."
    }
@app.get("/api/projects")
def list_projects(
    db: Session = Depends(get_db)
):
    return db.query(models.Project).all()

@app.delete("/api/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    projeto = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not projeto:
        raise HTTPException(
            status_code=404,
            detail="Projeto não encontrado."
        )

    db.delete(projeto)
    db.commit()

    recalcular_projetos_por_skill(db)

    return {
        "message": "Projeto excluído com sucesso."
    }

@app.post("/api/projects/import")
async def import_project(
    project: ProjectImport,
    db: Session = Depends(get_db)
):
    url = project.url.rstrip("/")

    if "github.com/" not in url:
        raise HTTPException(
            status_code=400,
            detail="Por enquanto, informe uma URL do GitHub."
        )

    partes = url.split("github.com/")[1].split("/")

    if len(partes) < 2:
        raise HTTPException(
            status_code=400,
            detail="URL do GitHub inválida."
        )

    owner = partes[0]
    repo = partes[1]

    api_url = f"https://api.github.com/repos/{owner}/{repo}"

    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)
        

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível acessar o repositório."
            )

        dados = response.json()

        languages_response = await client.get(
            f"{api_url}/languages"
        )

        print("LANGUAGES STATUS:", languages_response.status_code)
        print("LANGUAGES RESPONSE:", languages_response.text)

        languages = (
            languages_response.json()
            if languages_response.status_code == 200
            else {}
            )

                # Procura arquivos que revelam frameworks e dependências
        contents_response = await client.get(
            f"{api_url}/contents"
        )

        if contents_response.status_code == 404:
            raise HTTPException(
        status_code=400,
        detail="O repositório está vazio ou não possui arquivos acessíveis."
    )

        arquivos = (
            contents_response.json()
            if contents_response.status_code == 200
            else []
        )

        nomes_arquivos = [
            arquivo["name"]
            for arquivo in arquivos
            if "name" in arquivo
        ]

    tecnologias = list(languages.keys())
        # package.json → ecossistema JavaScript/TypeScript
    if "package.json" in nomes_arquivos:

        async with httpx.AsyncClient() as client:
            package_response = await client.get(
                f"{api_url}/contents/package.json"
            )

        if package_response.status_code == 200:
            import base64
            import json

            conteudo = package_response.json()

            package_text = base64.b64decode(
                conteudo["content"]
            ).decode("utf-8")

            package_json = json.loads(package_text)

            dependencias = {
                **package_json.get("dependencies", {}),
                **package_json.get("devDependencies", {}),
            }

            if "react" in dependencias:
                tecnologias.append("React")

            if "next" in dependencias:
                tecnologias.append("Next.js")

            if "typescript" in dependencias:
                tecnologias.append("TypeScript")

            if "tailwindcss" in dependencias:
                tecnologias.append("Tailwind CSS")

    if "requirements.txt" in nomes_arquivos:

        async with httpx.AsyncClient() as client:
            requirements_response = await client.get(
                f"{api_url}/contents/requirements.txt"
            )

        if requirements_response.status_code == 200:
            import base64

            conteudo = requirements_response.json()

            requirements_text = base64.b64decode(
                conteudo["content"]
            ).decode("utf-8").lower()

            if "fastapi" in requirements_text:
                tecnologias.append("FastAPI")

            if "sqlalchemy" in requirements_text:
                tecnologias.append("SQLAlchemy")

            if "uvicorn" in requirements_text:
                tecnologias.append("Uvicorn")
                

                

    existente = (
        db.query(models.Project)
        .filter(models.Project.nome == dados["name"])
        .first()
    )

    if existente:
        raise HTTPException(
            status_code=409,
            detail="Este projeto já está cadastrado."
        )

    novo_projeto = models.Project(
        nome=dados["name"],
        descricao=dados.get("description"),
        status="concluído",
        repositorio=dados["html_url"],
        deploy=dados.get("homepage"),
        tecnologias=", ".join(tecnologias),
    )

    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)

    recalcular_projetos_por_skill(db)

    return {
    "projeto": {
        "id": novo_projeto.id,
        "nome": novo_projeto.nome,
        "descricao": novo_projeto.descricao,
        "status": novo_projeto.status,
        "repositorio": novo_projeto.repositorio,
        "deploy": novo_projeto.deploy,
        "tecnologias": novo_projeto.tecnologias,
    },
    "tecnologias_detectadas": tecnologias,
}
