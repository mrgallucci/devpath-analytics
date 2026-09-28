"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Skill = {
  id: number;
  nome: string;
};

type StudySessionFormProps = {
  skills: Skill[];
};

export default function StudySessionForm({
  skills,
}: StudySessionFormProps) {
  const router = useRouter();

  const [skillId, setSkillId] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [assunto, setAssunto] = useState("");
  const [origem, setOrigem] = useState("");
  const [observacao, setObservacao] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setEnviando(true);
    setMensagem("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/study-sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill_id: Number(skillId),
            data,
            hora_inicio: horaInicio,
            hora_fim: horaFim,
            minutos: null,
            assunto,
            origem: origem || null,
            observacao: observacao || null,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        throw new Error(
          erro.detail || "Não foi possível registrar o estudo."
        );
      }

      setMensagem("Sessão registrada com sucesso!");

      setSkillId("");
      setData("");
      setHoraInicio("");
      setHoraFim("");
      setAssunto("");
      setOrigem("");
      setObservacao("");

      router.refresh();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao registrar sessão."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={skillId}
          onChange={(event) => setSkillId(event.target.value)}
          required
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        >
          <option value="">Selecione a skill</option>

          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          required
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <input
          type="time"
          value={horaInicio}
          onChange={(event) => setHoraInicio(event.target.value)}
          required
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <input
          type="time"
          value={horaFim}
          onChange={(event) => setHoraFim(event.target.value)}
          required
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <input
          type="text"
          value={assunto}
          onChange={(event) => setAssunto(event.target.value)}
          placeholder="O que você estudou?"
          required
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white md:col-span-2"
        />

        <input
          type="text"
          value={origem}
          onChange={(event) => setOrigem(event.target.value)}
          placeholder="Origem: curso, projeto, documentação..."
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white md:col-span-2"
        />

        <textarea
          value={observacao}
          onChange={(event) => setObservacao(event.target.value)}
          placeholder="Observações"
          rows={3}
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white md:col-span-2"
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {enviando ? "Registrando..." : "Registrar estudo"}
        </button>

        {mensagem && (
          <p className="text-sm text-slate-300">
            {mensagem}
          </p>
        )}
      </div>
    </form>
  );
}