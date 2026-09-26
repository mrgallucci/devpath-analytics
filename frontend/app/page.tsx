type Skill = {
  id: number;
  nome: string;
  categoria: string;
  nivel: number;
  horas_estudo: number;
  projetos: number;
};

async function getSkills(): Promise<Skill[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/skills",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar as skills.");
  }

  return response.json();
}

export default async function Home() {
  const skills = await getSkills();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Career & Learning Analytics
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            DevPath Analytics
          </h1>

          <p className="mt-3 text-slate-400">
            Minha evolução em desenvolvimento, dados e inteligência artificial.
          </p>
        </header>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Skills
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-emerald-400">
                      {skill.categoria}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      {skill.nome}
                    </h3>
                  </div>

                  <span className="text-2xl font-bold">
                    {skill.nivel}%
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${skill.nivel}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-sm text-slate-400">
                  <span>{skill.horas_estudo}h de estudo</span>
                  <span>{skill.projetos} projetos</span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}