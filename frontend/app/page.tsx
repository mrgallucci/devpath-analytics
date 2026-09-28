import ProjectImportForm from "./components/project-import-form";
import StudySessionForm from "@/app/components/study-session-form";
import StudySessionEdit from "@/app/components/study-session-edit";
import TechIncomeForm from "./components/tech-income-form";
import CertificateForm from "./components/certificate-form";
import CertificateEvidence from "./components/certificate-evidence";
import TechIncomeDelete from "./components/tech-income-delete";
import CertificateDelete from "./components/certificate-delete";
import { API_URL } from "./lib/api";
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
type TechIncome = {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  observacao: string | null;
};
type AnalyticsSummary = {
  total_sessoes: number;
  total_minutos: number;
  media_minutos_sessao: number;
  skills_estudadas: number;
};

type ProjectTechnology = {
  tecnologia: string;
  projetos: number;
};

async function getSkills(): Promise<Skill[]> {
  const response = await fetch(
    `${API_URL}/api/skills`,
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
    `${API_URL}/api/dashboard/summary`,
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
    `${API_URL}/api/projects`,
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
    `${API_URL}/api/certificates`,
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
    `${API_URL}/api/study-sessions`,
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
    `${API_URL}/api/analytics/study-by-skill`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os dados analíticos."
    );
  }

  return response.json();
}
async function getTechIncomes(): Promise<TechIncome[]> {
  const response = await fetch(
    `${API_URL}/api/tech-incomes`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar a renda tech."
    );
  }

  return response.json();
}
async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await fetch(
    `${API_URL}/api/analytics/summary`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar o resumo analítico."
    );
  }

  return response.json();
}
async function getProjectTechnologies(): Promise<ProjectTechnology[]> {
  const response = await fetch(
    `${API_URL}/api/analytics/project-technologies`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar as tecnologias dos projetos."
    );
  }

  return response.json();
}

export default async function Home() {
const editMode = process.env.NEXT_PUBLIC_EDIT_MODE !== "false";
const [
  skills,
  summary,
  projects,
  certificates,
  studySessions,
  studyBySkill,
  techIncomes,
  analyticsSummary,
  projectTechnologies,
] = await Promise.all([
  getSkills(),
  getDashboardSummary(),
  getProjects(),
  getCertificates(),
  getStudySessions(),
  getStudyBySkill(),
  getTechIncomes(),
  getAnalyticsSummary(),
  getProjectTechnologies(),
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

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950 text-center text-xs text-slate-500">
              Espaço para<br />foto de perfil
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Perfil profissional
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Maxwell Gallucci Rodrigues
              </h2>
              <p className="mt-2 text-slate-300">
                Sommelier e profissional de varejo em transição para tecnologia, conectando experiência em vendas e comportamento do consumidor com desenvolvimento, dados, automação, inteligência artificial e marketing digital.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Desenvolvimento Full Stack · Data Analytics · Applied AI · Marketing Digital
              </p>
              <a
                href="https://github.com/mrgallucci"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                GitHub: mrgallucci →
              </a>
            </div>
          </div>
        </section>

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
      Carreira
    </p>

    <h2 className="text-2xl font-bold text-white">
      Renda Tech
    </h2>

    <p className="mt-1 text-slate-400">
      Acompanhe a evolução da renda gerada com tecnologia.
    </p>
  </div>

  {editMode && <TechIncomeForm />}
  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
  <div className="mb-4 flex items-end justify-between gap-4">
    <div>
      <p className="text-sm text-slate-400">
        Progresso da meta
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        R$ {summary.renda_tech.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
        <span className="text-sm font-normal text-slate-500">
          {" "}de R$ {summary.meta_renda.toLocaleString("pt-BR")}
        </span>
      </p>
    </div>

    <span className="font-semibold text-emerald-400">
      {Math.min(
        100,
        Math.round(
          (summary.renda_tech / summary.meta_renda) * 100
        )
      )}%
    </span>
  </div>

  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all"
      style={{
        width: `${Math.min(
          100,
          (summary.renda_tech / summary.meta_renda) * 100
        )}%`,
      }}
    />
  </div>

  <div className="mt-6">
    <h3 className="font-semibold text-white">
      Histórico de renda
    </h3>

    {techIncomes.length === 0 ? (
      <p className="mt-3 text-sm text-slate-500">
        Nenhuma renda com tecnologia registrada ainda.
      </p>
    ) : (
      <div className="mt-3 grid gap-3">
        {techIncomes.map((income) => (
          <div
            key={income.id}
            className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">
                  {income.descricao}
                </p>

                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {income.categoria}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {income.data.split("-").reverse().join("/")}
              </p>

              {income.observacao && (
                <p className="mt-2 text-sm text-slate-400">
                  {income.observacao}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
  <p className="whitespace-nowrap font-semibold text-emerald-400">
    R$ {income.valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}
  </p>

  {editMode && (
    <TechIncomeDelete
      incomeId={income.id}
      descricao={income.descricao}
    />
  )}
</div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
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

          {editMode && <StudySessionForm skills={skills} />}
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
    
  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">
          Sessões
      </p>
      <p className="mt-2 text-2xl font-bold text-white">
        {analyticsSummary.total_sessoes}
      </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-sm text-slate-400">
      Tempo registrado
    </p>
    <p className="mt-2 text-2xl font-bold text-white">
      {Math.floor(analyticsSummary.total_minutos / 60)}h
      {analyticsSummary.total_minutos % 60 > 0
        ? `${analyticsSummary.total_minutos % 60}min`
        : ""}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-sm text-slate-400">
      Média por sessão
    </p>
    <p className="mt-2 text-2xl font-bold text-white">
      {Math.floor(analyticsSummary.media_minutos_sessao / 60)}h
      {analyticsSummary.media_minutos_sessao % 60 > 0
        ? `${analyticsSummary.media_minutos_sessao % 60}min`
        : ""}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-sm text-slate-400">
      Skills estudadas
    </p>
    <p className="mt-2 text-2xl font-bold text-emerald-400">
      {analyticsSummary.skills_estudadas}
    </p>
  </div>
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
  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
  <div className="mb-5">
    <h3 className="font-semibold text-white">
      Tecnologias no portfólio
    </h3>

    <p className="mt-1 text-sm text-slate-400">
      Frequência das tecnologias detectadas nos projetos importados.
    </p>
  </div>

  <div className="grid gap-4">
    {projectTechnologies.map((item) => {
      const maiorValor = Math.max(
        ...projectTechnologies.map(
          (tecnologia) => tecnologia.projetos
        )
      );

      const percentual =
        maiorValor > 0
          ? (item.projetos / maiorValor) * 100
          : 0;

      return (
        <div key={item.tecnologia}>
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-200">
              {item.tecnologia}
            </span>

            <span className="text-sm text-slate-400">
              {item.projetos}{" "}
              {item.projetos === 1 ? "projeto" : "projetos"}
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
              {editMode && (
                <StudySessionEdit
                  sessionId={session.id}
                  horaFimAtual={session.hora_fim}
                />
              )}
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
          
          {editMode && <ProjectImportForm />}

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
            {editMode && <CertificateForm />}
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

{editMode ? (
  <>
    <CertificateEvidence
      certificateId={certificate.id}
      arquivoAtual={certificate.arquivo}
      urlAtual={certificate.url}
    />
    <CertificateDelete
      certificateId={certificate.id}
      titulo={certificate.titulo}
    />
  </>
) : (
  (certificate.arquivo || certificate.url) && (
    <a
      href={certificate.arquivo ? `${API_URL}${certificate.arquivo}` : certificate.url!}
      target="_blank"
      rel="noreferrer"
      className="mt-4 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
    >
      Ver certificado ↗
    </a>
  )
)}

       
      </article>
    ))}
  </div>
</section>

      </div>
    </main>
  );
}