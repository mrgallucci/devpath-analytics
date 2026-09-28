"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TechIncomeFormProps = {
  categorias?: string[];
};

export default function TechIncomeForm({
  categorias = [
    "Freelance",
    "Emprego",
    "Projeto",
    "Bug bounty",
    "Consultoria",
    "Outro",
  ],
}: TechIncomeFormProps) {
  const router = useRouter();

  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Freelance");
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valorNumerico = Number(
      valor.replace(",", ".")
    );

    if (!data || !descricao || !valorNumerico || valorNumerico <= 0) {
      setMensagem("Preencha data, descrição e um valor válido.");
      return;
    }

    setSalvando(true);
    setMensagem("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/tech-incomes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
            descricao,
            categoria,
            valor: valorNumerico,
            observacao: observacao || null,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(
          erro.detail || "Não foi possível registrar a renda."
        );
      }

      setData("");
      setDescricao("");
      setCategoria("Freelance");
      setValor("");
      setObservacao("");

      setMensagem("Renda registrada com sucesso.");

      router.refresh();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao registrar renda."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Data
          <input
            type="date"
            value={data}
            onChange={(event) => setData(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Categoria
          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          >
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-slate-300">
        Descrição
        <input
          type="text"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Ex.: Landing page para cliente"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          required
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-300">
        Valor (R$)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          placeholder="0,00"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          required
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-300">
        Observação
        <textarea
          value={observacao}
          onChange={(event) => setObservacao(event.target.value)}
          placeholder="Informações adicionais..."
          className="resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          rows={3}
        />
      </label>

      <button
        type="submit"
        disabled={salvando}
        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {salvando ? "Salvando..." : "Registrar renda"}
      </button>

      {mensagem && (
        <p className="text-sm text-slate-300">
          {mensagem}
        </p>
      )}
    </form>
  );
}