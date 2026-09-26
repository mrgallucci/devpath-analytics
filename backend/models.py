from sqlalchemy import Column, Integer, String, Float

from database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)
    categoria = Column(String, nullable=False)
    nivel = Column(Float, default=0)
    horas_estudo = Column(Float, default=0)
    projetos = Column(Integer, default=0)