"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificateForm() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [url, setUrl] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!titulo || !instituicao) {
      setMensagem(
        "Informe pelo menos o título e a instituição."
      );
      return;
    }

    setSalvando(true);
    setMensagem("");

    try {
      let caminhoArquivo: string | null = null;

      if (arquivo) {
        const formData = new FormData();
        formData.append("file", arquivo);

        const uploadResponse = await fetch(
          "http://127.0.0.1:8000/api/certificates/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const erro = await uploadResponse.json();

          throw new Error(
            erro.detail ||
              "Não foi possível enviar o arquivo."
          );
        }

        const uploadData = await uploadResponse.json();

        caminhoArquivo = uploadData.arquivo;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/certificates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo,
            instituicao,
            categoria: categoria || null,
            data_conclusao: dataConclusao || null,
            url: url || null,
            arquivo: caminhoArquivo,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        throw new Error(
          erro.detail ||
            "Não foi possível cadastrar o certificado."
        );
      }

      setTitulo("");
      setInstituicao("");
      setCategoria("");
      setDataConclusao("");
      setUrl("");
      setArquivo(null);

      setMensagem("Certificado cadastrado com sucesso.");

      router.refresh();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar certificado."
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
          Título
          <input
            type="text"
            value={titulo}
            onChange={(event) =>
              setTitulo(event.target.value)
            }
            placeholder="Ex.: Python para Análise de Dados"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Instituição
          <input
            type="text"
            value={instituicao}
            onChange={(event) =>
              setInstituicao(event.target.value)
            }
            placeholder="Ex.: DIO"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Categoria
          <input
            type="text"
            value={categoria}
            onChange={(event) =>
              setCategoria(event.target.value)
            }
            placeholder="Ex.: Python"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Data de conclusão
          <input
            type="date"
            value={dataConclusao}
            onChange={(event) =>
              setDataConclusao(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-slate-300">
        Link do certificado
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-300">
        Arquivo do certificado
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) =>
            setArquivo(event.target.files?.[0] ?? null)
          }
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300"
        />

        <span className="text-xs text-slate-500">
          PDF, JPG, JPEG ou PNG.
        </span>
      </label>

      <p className="text-xs text-slate-500">
        Você pode informar um link, enviar um arquivo ou usar
        as duas opções.
      </p>

      <button
        type="submit"
        disabled={salvando}
        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {salvando
          ? "Salvando..."
          : "Adicionar certificado"}
      </button>

      {mensagem && (
        <p className="text-sm text-slate-300">
          {mensagem}
        </p>
      )}
    </form>
  );
}