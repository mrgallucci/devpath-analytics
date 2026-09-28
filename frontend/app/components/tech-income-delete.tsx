"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  incomeId: number;
  descricao: string;
};

export default function TechIncomeDelete({
  incomeId,
  descricao,
}: Props) {
  const router = useRouter();

  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function excluir() {
    const confirmado = window.confirm(
      `Excluir a renda "${descricao}"?`
    );

    if (!confirmado) {
      return;
    }

    setExcluindo(true);
    setErro("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tech-incomes/${incomeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let mensagem = "Não foi possível excluir a renda.";

        try {
          const dados = await response.json();
          mensagem = dados.detail || mensagem;
        } catch {
          // Mantém a mensagem padrão.
        }

        throw new Error(mensagem);
      }

      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao excluir renda."
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={excluir}
        disabled={excluindo}
        className="text-xs font-medium text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {excluindo ? "Excluindo..." : "Excluir"}
      </button>

      {erro && (
        <p className="max-w-48 text-right text-xs text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}