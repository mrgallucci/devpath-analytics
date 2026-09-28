"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  certificateId: number;
  titulo: string;
};

export default function CertificateDelete({
  certificateId,
  titulo,
}: Props) {
  const router = useRouter();

  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function excluir() {
    const confirmado = window.confirm(
      `Excluir o certificado "${titulo}"?`
    );

    if (!confirmado) {
      return;
    }

    setExcluindo(true);
    setErro("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/certificates/${certificateId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let mensagem = "Não foi possível excluir o certificado.";

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
          : "Erro ao excluir certificado."
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={excluir}
        disabled={excluindo}
        className="text-xs font-medium text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {excluindo ? "Excluindo..." : "Excluir"}
      </button>

      {erro && (
        <p className="mt-2 text-xs text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}