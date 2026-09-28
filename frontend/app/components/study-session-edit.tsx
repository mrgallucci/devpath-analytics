"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "../lib/api";
type StudySessionEditProps = {
  sessionId: number;
  horaFimAtual: string | null;
};

export default function StudySessionEdit({
  sessionId,
  horaFimAtual,
}: StudySessionEditProps) {
  const router = useRouter();

  const [editando, setEditando] = useState(false);
  const [horaFim, setHoraFim] = useState(horaFimAtual ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar() {
    if (!horaFim) {
      setErro("Informe o horário final.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const response = await fetch(
        `${API_URL}/api/study-sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hora_fim: horaFim,
          }),
        }
      );

      if (!response.ok) {
        const dados = await response.json();

        throw new Error(
          dados.detail || "Não foi possível atualizar a sessão."
        );
      }

      setEditando(false);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar sessão."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!editando) {
    return (
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="mt-3 text-xs font-semibold text-emerald-500 hover:text-emerald-400"
      >
        Editar horário final
      </button>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="time"
          value={horaFim}
          onChange={(event) => setHoraFim(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />

        <button
          type="button"
          onClick={salvar}
          disabled={salvando}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setHoraFim(horaFimAtual ?? "");
            setEditando(false);
            setErro("");
          }}
          className="px-2 py-2 text-xs text-slate-400 hover:text-white"
        >
          Cancelar
        </button>
      </div>

      {erro && (
        <p className="mt-2 text-xs text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}
