"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectImportForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/projects/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Não foi possível importar o projeto."
        );
      }

      setMessage("Projeto importado com sucesso!");
      setUrl("");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao importar projeto."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          GitHub Import
        </p>

        <h3 className="mt-1 text-lg font-semibold text-white">
          Adicionar projeto
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Cole a URL de um repositório público do GitHub.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://github.com/usuario/repositorio"
          required
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Importando..." : "Importar"}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-emerald-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}