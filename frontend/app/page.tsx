import ProjectImportForm from "./components/project-import-form";
import StudySessionForm from "@/app/components/study-session-form";
import StudySessionEdit from "@/app/components/study-session-edit";

type Skill = {
  id: number;
  nome: string;
  categoria: string;
  nivel: number;
  horas_estudo: number;
  projetos: number;
};

type DashboardSummary = {
  skills: number;
  horas_estudo: number;
  horas_estudo_formatado: string;
  projetos: number;
  certificados: number;
  renda_tech: number;
  meta_renda: number;
};

type Project = {
  id: number;
  nome: string;
  descricao: string | null;
  status: string;
  repositorio: string | null;
  deploy: string | null;
  tecnologias: string | null;
};
type Certificate = {
  id: number;
  titulo: string;
  instituicao: string;
  categoria: string | null;
  data_conclusao: string | null;
  url: string | null;
  arquivo: string | null;
};

type StudySession = {
  id: number;
  skill_id: number;
  data: string;
  hora_inicio: string | null;
  hora_fim: string | null;
  minutos: number;
  assunto: string;
  origem: string | null;
  observacao: string | null;
};
type StudyBySkill = {
  skill_id: number;
  skill: string;
  minutos: number;
  horas: number;
  sessoes: number;
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

async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/dashboard/summary",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar o dashboard.");
  }

  return response.json();
}

async function getProjects(): Promise<Project[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/projects",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar os projetos.");
  }

  return response.json();
}
async function getCertificates(): Promise<Certificate[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/certificates",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os certificados."
    );
  }

  return response.json();
}

async function getStudySessions(): Promise<StudySession[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/study-sessions",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar as sessões de estudo."
    );
  }

  return response.json();
}
async function getStudyBySkill(): Promise<StudyBySkill[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/analytics/study-by-skill",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os dados analíticos."
    );
  }

  return response.json();
}
export default async function Home() {
  const [
  skills,
  summary,
  projects,
  certificates,
  studySessions,
  studyBySkill,
] = await Promise.all([
  getSkills(),
  getDashboardSummary(),
  getProjects(),
  getCertificates(),
  getStudySessions(),
  getStudyBySkill(),
]);

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

          <p className="mt-2 text-sm text-slate-500">
            by{" "}
            <span className="font-semibold text-slate-300">
              SARG Technology
            </span>
          </p>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Skills</p>
            <p className="mt-2 text-3xl font-bold">
              {summary.skills}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Horas de estudo
            </p>

            <p className="mt-2 text-3xl font-bold">
              {summary.horas_estudo_formatado}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Projetos</p>

            <p className="mt-2 text-3xl font-bold">
              {summary.projetos}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Certificados
            </p>

            <p className="mt-2 text-3xl font-bold">
              {summary.certificados}
            </p>
          </article>

          <article className="rounded-xl border border-emerald-900 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Renda Tech
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              R$ {summary.renda_tech.toLocaleString("pt-BR")}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Meta: R${" "}
              {summary.meta_renda.toLocaleString("pt-BR")}/mês
            </p>
          </article>
        </section>
          <section className="mt-10">
            <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
                  Desenvolvimento contínuo
            </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
                  Registro de estudos
          </h2>

            <p className="mt-1 text-sm text-slate-400">
                  Registre sessões de estudo e prática para acompanhar sua evolução.
            </p>
            </div>

          <StudySessionForm skills={skills} />
          <div className="mt-6">
  <div className="mb-3 flex items-center justify-between">
    <h3 className="font-semibold text-white">
      Histórico recente
    </h3>

    <span className="text-sm text-slate-400">
      {studySessions.length} sessões
    </span>
  </div>
  
  <section className="mt-10">
  <div className="mb-5">
    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
      Analytics
    </p>

    <h2 className="mt-1 text-2xl font-bold text-white">
      Tempo por competência
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Distribuição do tempo registrado entre as competências estudadas.
    </p>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="space-y-5">
      {studyBySkill.map((item) => {
        const maiorValor = Math.max(
          ...studyBySkill.map((skill) => skill.minutos)
        );

        const percentual =
          maiorValor > 0
            ? (item.minutos / maiorValor) * 100
            : 0;

        const horas = Math.floor(item.minutos / 60);
        const minutos = item.minutos % 60;

        return (
          <div key={item.skill_id}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">
                  {item.skill}
                </p>

                <p className="text-xs text-slate-500">
                  {item.sessoes}{" "}
                  {item.sessoes === 1 ? "sessão" : "sessões"}
                </p>
              </div>

              <span className="text-sm font-semibold text-slate-300">
                {horas > 0 && `${horas}h`}
                {minutos > 0 && `${minutos}min`}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${percentual}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

  <div className="space-y-3">
    {studySessions.map((session) => {
      const skill = skills.find(
        (item) => item.id === session.skill_id
      );

      const horas = Math.floor(session.minutos / 60);
      const minutos = session.minutos % 60;

      return (
        <article
          key={session.id}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                {skill?.nome ?? "Skill"}
              </p>

              <h4 className="mt-1 font-semibold text-white">
                {session.assunto}
              </h4>

              {session.origem && (
                <p className="mt-1 text-sm text-slate-400">
                  {session.origem}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">
                {horas > 0 && `${horas}h`}
                {minutos > 0 && `${minutos}min`}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {session.hora_inicio} → {session.hora_fim}
              </p>
              <StudySessionEdit
                sessionId={session.id}
                horaFimAtual={session.hora_fim}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>
              {new Date(
                `${session.data}T00:00:00`
              ).toLocaleDateString("pt-BR")}
            </span>

            {session.observacao && (
              <span>• {session.observacao}</span>
            )}
          </div>
        </article>
      );
    })}
  </div>
</div>
          </section>

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
                  <span>
                    {Math.floor(skill.horas_estudo / 60)}h
                    {skill.horas_estudo % 60 > 0
                      ? `${skill.horas_estudo % 60}min`
                      : ""}{" "}
                      de estudo
                  </span>

                  <span>
                    {skill.projetos} projetos
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Portfólio
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Projetos
              </h2>
            </div>

            <span className="text-sm text-slate-400">
              {projects.length} projetos
            </span>
          </div>
          
          <ProjectImportForm />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-white">
                    {project.nome}
                  </h3>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    {project.status}
                  </span>
                </div>

                {project.descricao && (
                  <p className="mt-3 text-sm text-slate-400">
                    {project.descricao}
                  </p>
                )}

                <p className="mt-4 text-sm text-slate-300">
                  {project.tecnologias ||
                    "Tecnologias não identificadas"}
                </p>

                {project.repositorio && (
                  <a
                    href={project.repositorio}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    Ver no GitHub →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="mt-10">
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
        Formação contínua
      </p>

      <h2 className="mt-1 text-2xl font-bold text-white">
        Certificados
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Cursos, formações e credenciais da minha trajetória em tecnologia.
      </p>
    </div>

    <span className="text-sm text-slate-400">
      {certificates.length} certificados
    </span>
  </div>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {certificates.map((certificate) => (
      <article
        key={certificate.id}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              {certificate.instituicao}
            </p>

            <h3 className="mt-2 font-semibold text-white">
              {certificate.titulo}
            </h3>
          </div>

          {certificate.categoria && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {certificate.categoria}
            </span>
          )}
        </div>

        {certificate.data_conclusao && (
          <p className="mt-4 text-sm text-slate-400">
            Conclusão:{" "}
            {new Date(
              `${certificate.data_conclusao}T00:00:00`
            ).toLocaleDateString("pt-BR")}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {certificate.arquivo && (
            <a
              href={`http://127.0.0.1:8000${certificate.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Ver certificado
            </a>
          )}

          {certificate.url && (
            <a
              href={certificate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Ver credencial
            </a>
          )}
        </div>
      </article>
    ))}
  </div>
</section>

      </div>
    </main>
  );
}