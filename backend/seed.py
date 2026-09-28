from database import SessionLocal
from models import Skill


skills_iniciais = [
    ("HTML5", "Frontend"),
    ("CSS3", "Frontend"),
    ("JavaScript", "Frontend"),
    ("TypeScript", "Frontend"),
    ("React", "Frontend"),
    ("Next.js", "Frontend"),

    ("Python", "Backend"),
    ("FastAPI", "Backend"),

    ("SQL", "Dados"),
    ("PostgreSQL", "Dados"),

    ("Git", "Engenharia"),
    ("GitHub", "Engenharia"),
    ("APIs REST", "Engenharia"),

    ("Análise de Dados", "Data & Analytics"),
    ("Inteligência Artificial Aplicada", "IA"),
    ("Prompt Engineering", "IA"),
    ("Marketing Digital", "Marketing & Growth"),
]


def seed_skills():
    db = SessionLocal()

    try:
        for nome, categoria in skills_iniciais:

            existente = (
                db.query(Skill)
                .filter(Skill.nome == nome)
                .first()
            )

            if existente:
                print(f"{nome}: já existe")
                continue

            skill = Skill(
                nome=nome,
                categoria=categoria,
                nivel=0,
                horas_estudo=0,
                projetos=0,
            )

            db.add(skill)
            print(f"{nome}: adicionada")

        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    seed_skills()