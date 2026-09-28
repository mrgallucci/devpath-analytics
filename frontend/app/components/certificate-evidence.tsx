"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "../lib/api";
type Props = {
  certificateId: number;
  arquivoAtual: string | null;
  urlAtual: string | null;
};

export default function CertificateEvidence({
  certificateId,
  arquivoAtual,
  urlAtual,
}: Props) {
  const router = useRouter();

  const [modo, setModo] = useState<"arquivo" | "url" | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [url, setUrl] = useState(urlAtual ?? "");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function salvarArquivo() {
    if (!arquivo) return;

    setSalvando(true);
    setMensagem("");

    try {
      const formData = new FormData();
      formData.append("file", arquivo);

      const uploadResponse = await fetch(
        `${API_URL}/api/certificates/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Erro ao enviar arquivo.");
      }

      const uploadData = await uploadResponse.json();

      const response = await fetch(
        `${API_URL}/api/certificates/${certificateId}/arquivo`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            arquivo: uploadData.arquivo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao vincular arquivo.");
      }

      setMensagem("Arquivo vinculado.");
      setModo(null);
      router.refresh();
    } catch (error) {
      setMensagem(
        error instanceof Error ? error.message : "Erro inesperado."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function salvarUrl() {
    if (!url.trim()) return;

    setSalvando(true);
    setMensagem("");

    try {
      const response = await fetch(
        `${API_URL}/api/certificates/${certificateId}/url`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao vincular link.");
      }

      setMensagem("Link vinculado.");
      setModo(null);
      router.refresh();
    } catch (error) {
      setMensagem(
        error instanceof Error ? error.message : "Erro inesperado."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (arquivoAtual || urlAtual) {
    const destino = arquivoAtual
      ? `${API_URL}${arquivoAtual}`
      : urlAtual!;

    return (
      <a
        href={destino}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Ver certificado ↗
      </a>
    );
  }

  return (
    <div className="mt-3">
      {!modo && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setModo("arquivo")}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            + Arquivo
          </button>

          <button
            type="button"
            onClick={() => setModo("url")}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            + Link
          </button>
        </div>
      )}

      {modo === "arquivo" && (
        <div className="mt-3 grid gap-2">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) =>
              setArquivo(event.target.files?.[0] ?? null)
            }
            className="text-xs text-slate-400"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={salvarArquivo}
              disabled={!arquivo || salvando}
              className="text-sm font-medium text-emerald-400 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar arquivo"}
            </button>

            <button
              type="button"
              onClick={() => setModo(null)}
              className="text-sm text-slate-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modo === "url" && (
        <div className="mt-3 grid gap-2">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={salvarUrl}
              disabled={!url.trim() || salvando}
              className="text-sm font-medium text-emerald-400 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar link"}
            </button>

            <button
              type="button"
              onClick={() => setModo(null)}
              className="text-sm text-slate-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mensagem && (
        <p className="mt-2 text-xs text-slate-400">
          {mensagem}
        </p>
      )}
    </div>
  );
}
