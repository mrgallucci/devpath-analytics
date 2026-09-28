from datetime import datetime
from pathlib import Path
from uuid import uuid4
import httpx

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

from database import Base, engine, get_db
import models

class StudySessionUpdate(BaseModel):
    hora_fim: str

class CertificateCreate(BaseModel):
    titulo: str
    instituicao: str
    categoria: str | None = None
    data_conclusao: str | None = None
    url: str | None = None
    arquivo: str | None = None

UPLOAD_DIR = Path("uploads/certificates")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class ProjectImport(BaseModel):
    url: str

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevPath Analytics API",
    version="0.1.0"
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
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

class StudySessionCreate(BaseModel):
    skill_id: int
    data: str
    hora_inicio: str | None = None
    hora_fim: str | None = None
    minutos: int | None = None
    assunto: str
    origem: str | None = None
    observacao: str | None = None

class TechIncomeCreate(BaseModel):
    data: str
    descricao: str
    categoria: str
    valor: float
    observacao: str | None = None

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
    skills = db.query(models.Skill).all()

    resultado = []

    for skill in skills:
        sessoes = (
            db.query(models.StudySession)
            .filter(models.StudySession.skill_id == skill.id)
            .all()
        )

        total_minutos = sum(
            sessao.minutos for sessao in sessoes
        )

        resultado.append({
            "id": skill.id,
            "nome": skill.nome,
            "categoria": skill.categoria,
            "nivel": skill.nivel,
            "horas_estudo": total_minutos,
            "projetos": skill.projetos,
        })

    return resultado

@app.get("/api/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):
    skills = db.query(models.Skill).all()
    sessoes = db.query(models.StudySession).all()

    total_skills = len(skills)

    total_minutos = sum(
        sessao.minutos for sessao in sessoes
    )

    rendas = db.query(models.TechIncome).all()
    
    total_renda_tech = sum(
        renda.valor for renda in rendas
    )

    horas = total_minutos // 60
    minutos = total_minutos % 60

    

    return {
        "skills": total_skills,
        "horas_estudo": total_minutos,
        "horas_estudo_formatado": f"{horas}h{minutos:02d}",
        "projetos": db.query(models.Project).count(),
        "certificados": db.query(models.Certificate).count(),
        "renda_tech": total_renda_tech,
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
@app.post("/api/certificates/upload")
async def upload_certificado(
    file: UploadFile = File(...),
):
    extensoes_permitidas = {".pdf", ".jpg", ".jpeg", ".png"}

    extensao = Path(file.filename or "").suffix.lower()

    if extensao not in extensoes_permitidas:
        raise HTTPException(
            status_code=400,
            detail="Formato não permitido. Use PDF, JPG, JPEG ou PNG.",
        )

    nome_arquivo = f"{uuid4().hex}{extensao}"
    caminho_arquivo = UPLOAD_DIR / nome_arquivo

    conteudo = await file.read()

    with open(caminho_arquivo, "wb") as arquivo:
        arquivo.write(conteudo)

    return {
        "filename": nome_arquivo,
        "arquivo": f"/uploads/certificates/{nome_arquivo}",
    }
class CertificateFileUpdate(BaseModel):
    arquivo: str


@app.patch("/api/certificates/{certificate_id}/arquivo")
def atualizar_arquivo_certificado(
    certificate_id: int,
    dados: CertificateFileUpdate,
    db: Session = Depends(get_db),
):
    certificado = (
        db.query(models.Certificate)
        .filter(models.Certificate.id == certificate_id)
        .first()
    )

    if not certificado:
        raise HTTPException(
            status_code=404,
            detail="Certificado não encontrado.",
        )

    certificado.arquivo = dados.arquivo

    db.commit()
    db.refresh(certificado)

    return certificado


@app.get("/api/certificates")
def listar_certificados(db: Session = Depends(get_db)):
    return (
        db.query(models.Certificate)
        .order_by(models.Certificate.id.desc())
        .all()
    )
@app.post("/api/certificates")
def criar_certificado(
    certificate: CertificateCreate,
    db: Session = Depends(get_db),
):
    certificado = models.Certificate(
        titulo=certificate.titulo,
        instituicao=certificate.instituicao,
        categoria=certificate.categoria,
        data_conclusao=certificate.data_conclusao,
        url=certificate.url,
        arquivo=certificate.arquivo,
    )

    db.add(certificado)
    db.commit()
    db.refresh(certificado)

    return certificado
@app.get("/api/study-sessions")
def listar_sessoes_estudo(
    db: Session = Depends(get_db),
):
    return (
        db.query(models.StudySession)
        .order_by(models.StudySession.id.desc())
        .all()
    )

@app.post("/api/study-sessions")
def criar_sessao_estudo(
    session: StudySessionCreate,
    db: Session = Depends(get_db),
):
    skill = (
        db.query(models.Skill)
        .filter(models.Skill.id == session.skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill não encontrada.",
        )

    minutos = session.minutos

    if session.hora_inicio and session.hora_fim:
        try:
            inicio = datetime.strptime(
                session.hora_inicio,
                "%H:%M",
            )

            fim = datetime.strptime(
                session.hora_fim,
                "%H:%M",
            )

            diferenca = fim - inicio
            minutos = int(
                diferenca.total_seconds() / 60
            )

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Use o formato HH:MM para os horários.",
            )

    if minutos is None or minutos <= 0:
        raise HTTPException(
            status_code=400,
            detail="A duração da sessão deve ser maior que zero.",
        )

    nova_sessao = models.StudySession(
        skill_id=session.skill_id,
        data=session.data,
        hora_inicio=session.hora_inicio,
        hora_fim=session.hora_fim,
        minutos=minutos,
        assunto=session.assunto,
        origem=session.origem,
        observacao=session.observacao,
    )

    db.add(nova_sessao)
    db.commit()
    db.refresh(nova_sessao)

    return nova_sessao


@app.patch("/api/study-sessions/{session_id}")
def atualizar_sessao_estudo(
    session_id: int,
    dados: StudySessionUpdate,
    db: Session = Depends(get_db),
):
    sessao = (
        db.query(models.StudySession)
        .filter(models.StudySession.id == session_id)
        .first()
    )

    if not sessao:
        raise HTTPException(
            status_code=404,
            detail="Sessão de estudo não encontrada.",
        )

    if not sessao.hora_inicio:
        raise HTTPException(
            status_code=400,
            detail="A sessão não possui horário inicial.",
        )

    try:
        inicio = datetime.strptime(
            sessao.hora_inicio,
            "%H:%M",
        )

        fim = datetime.strptime(
            dados.hora_fim,
            "%H:%M",
        )

        diferenca = fim - inicio
        minutos = int(
            diferenca.total_seconds() / 60
        )

    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Horários inválidos. Use o formato HH:MM.",
        )

    if minutos <= 0:
        raise HTTPException(
            status_code=400,
            detail="O horário final deve ser posterior ao inicial.",
        )

    sessao.hora_fim = dados.hora_fim
    sessao.minutos = minutos

    db.commit()
    db.refresh(sessao)

    return sessao

@app.get("/api/tech-incomes")
def listar_rendas_tech(
    db: Session = Depends(get_db),
):
    return (
        db.query(models.TechIncome)
        .order_by(models.TechIncome.id.desc())
        .all()
    )
@app.delete("/api/tech-incomes/{income_id}")
def excluir_renda_tech(
    income_id: int,
    db: Session = Depends(get_db),
):
    renda = (
        db.query(models.TechIncome)
        .filter(models.TechIncome.id == income_id)
        .first()
    )

    if not renda:
        raise HTTPException(
            status_code=404,
            detail="Registro de renda não encontrado.",
        )

    db.delete(renda)
    db.commit()

    return {
        "message": "Registro de renda excluído com sucesso."
    }


@app.post("/api/tech-incomes")
def criar_renda_tech(
    income: TechIncomeCreate,
    db: Session = Depends(get_db),
):
    if income.valor <= 0:
        raise HTTPException(
            status_code=400,
            detail="O valor da renda deve ser maior que zero.",
        )

    nova_renda = models.TechIncome(
        data=income.data,
        descricao=income.descricao,
        categoria=income.categoria,
        valor=income.valor,
        observacao=income.observacao,
    )

    db.add(nova_renda)
    db.commit()
    db.refresh(nova_renda)

    return nova_renda

      
@app.get("/api/analytics/study-by-skill")
def estudo_por_skill(
    db: Session = Depends(get_db),
):
    skills = db.query(models.Skill).all()

    resultado = []

    for skill in skills:
        sessoes = (
            db.query(models.StudySession)
            .filter(models.StudySession.skill_id == skill.id)
            .all()
        )

        total_minutos = sum(
            sessao.minutos for sessao in sessoes
        )

        if total_minutos == 0:
            continue

        resultado.append({
            "skill_id": skill.id,
            "skill": skill.nome,
            "minutos": total_minutos,
            "horas": round(total_minutos / 60, 2),
            "sessoes": len(sessoes),
        })

    resultado.sort(
        key=lambda item: item["minutos"],
        reverse=True,
    )

    return resultado    
