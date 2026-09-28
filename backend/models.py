from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base



class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)
    categoria = Column(String, nullable=False)
    nivel = Column(Float, default=0)
    horas_estudo = Column(Float, default=0)
    projetos = Column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)
    descricao = Column(String, nullable=True)
    status = Column(String, default="em desenvolvimento")
    repositorio = Column(String, nullable=True)
    deploy = Column(String, nullable=True)
    tecnologias = Column(String, nullable=True)


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    instituicao = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    data_conclusao = Column(String, nullable=True)
    url = Column(String, nullable=True)
    arquivo = Column(String, nullable=True)

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False,
    )

    data = Column(String, nullable=False)
    hora_inicio = Column(String, nullable=True)
    hora_fim = Column(String, nullable=True)
    
    minutos = Column(Integer, nullable=False)
    assunto = Column(String, nullable=False)
    origem = Column(String, nullable=True)
    observacao = Column(String, nullable=True)

class TechIncome(Base):
        __tablename__ = "tech_incomes"

        id = Column(Integer, primary_key=True, index=True)
        data = Column(String, nullable=False)
        descricao = Column(String, nullable=False)
        categoria = Column(String, nullable=False)
        valor = Column(Float, nullable=False)
        observacao = Column(String, nullable=True)