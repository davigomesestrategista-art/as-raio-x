import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  questions,
  resolveResult,
  getResultContent,
  linhaTentativa,
  whatsComNome,
  type Answers,
} from "@/lib/raiox";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diagnóstico da Sua Autopeça | Onde sua loja perde dinheiro" },
      {
        name: "description",
        content:
          "Responda 6 perguntas e descubra em 2 minutos o que está travando o lucro da sua loja de autopeças.",
      },
      { property: "og:title", content: "Diagnóstico da Sua Autopeça" },
      {
        property: "og:description",
        content:
          "6 perguntas rápidas para descobrir onde sua loja de autopeças está perdendo dinheiro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Diagnostico,
});

type Stage = "intro" | "quiz" | "result";

function Diagnostico() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const q = questions[step]!;

  function pick(key: string) {
    const next = { ...answers, [q.id]: key };
    setAnswers(next);
    if (q.id === 1 && key === "c") {
      setStage("result");
      return;
    }
    if (q.id === 3 && key === "d") {
      setStage("result");
      return;
    }
    if (step === questions.length - 1) {
      setStage("result");
      return;
    }
    setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setStage("intro");
  }

  if (stage === "intro") return <Intro onStart={() => setStage("quiz")} />;
  if (stage === "result") return <Result answers={answers} onRestart={restart} />;

  return (
    <main className="min-h-screen bg-background">
      <ProgressBar current={step + 1} total={questions.length} />
      <div className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          Pergunta {String(step + 1).padStart(2, "0")}
        </span>
        <h1 className="mt-3 font-display text-[26px] uppercase leading-[1.05] tracking-tight text-foreground sm:text-3xl">
          {q.title[0]} <span className="text-accent">{q.title[1]}</span>
          {q.title[2]}
        </h1>

        <div className="mt-7 flex flex-col gap-3">
          {q.options.map((o) => (
            <button
              key={o.key}
              onClick={() => pick(o.key)}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent hover:bg-accent/10 active:scale-[0.995]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-background font-mono text-xs uppercase text-muted-foreground">
                {o.key}
              </span>
              <span className="min-w-0 text-[15px] leading-snug text-foreground">{o.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </button>
        )}
      </div>
    </main>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="sticky top-0 z-10 bg-accent">
      <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
          Diagnóstico da Sua Autopeça
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
          {current}/{total}
        </span>
      </div>
      <div className="h-1 w-full bg-accent-foreground/20">
        <div
          className="h-full bg-accent-foreground transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-screen flex-col bg-ink px-5 py-10 text-ink-foreground">
      <span className="inline-flex w-fit rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
        Pra dono de autopeça que sente que tá travado
      </span>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-14">
        <h1 className="font-display text-[38px] uppercase leading-[0.95] tracking-tight sm:text-5xl">
          <span className="block text-ink-foreground/45 line-through decoration-2">
            Sua autopeça não tá sem sorte.
          </span>
          <span className="mt-2 block">
            Ela tá <span className="text-accent">sem diagnóstico</span>.
          </span>
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-foreground/70">
          Estoque parado, margem que some, caixa apertado. 6 perguntas pra descobrir exatamente
          onde tá o vazamento da sua loja e o que fazer sobre isso agora.
        </p>

        <button
          onClick={onStart}
          className="mt-9 w-full rounded-xl bg-accent px-6 py-4 font-display text-base uppercase tracking-tight text-accent-foreground transition-transform hover:brightness-95 active:scale-[0.99]"
        >
          Começar o Diagnóstico
        </button>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-foreground/40">
          Leva 2 minutos.
        </p>
      </div>
    </main>
  );
}

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const key = resolveResult(answers);
  const c = getResultContent(key);
  const extra = key === "ASPIRANTE" || key === "PIKA" ? null : linhaTentativa(answers[3]);

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const n = nome.trim();
    const w = whatsapp.trim();
    if (!n || !w) {
      setErro("Preencha nome e WhatsApp.");
      return;
    }
    setEnviando(true);
    setErro(null);
    const { error } = await supabase.from("raiox_respostas").insert({
      nome: n.slice(0, 120),
      whatsapp: w.slice(0, 40),
      p1: answers[1] ?? null,
      p2: answers[2] ?? null,
      p3: answers[3] ?? null,
      p4: answers[4] ?? null,
      p5: answers[5] ?? null,
      p6: answers[6] ?? null,
      resultado: key,
    });
    setEnviando(false);
    if (error) {
      setErro("Não deu pra enviar agora. Tente de novo.");
      return;
    }
    setEnviado(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-accent">
        <div className="mx-auto max-w-xl px-5 py-2.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
            Diagnóstico concluído
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl px-5 pb-20 pt-8">
        <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
          {c.badge}
        </span>

        <h1 className="mt-4 font-display text-[30px] uppercase leading-[1.02] tracking-tight text-foreground sm:text-4xl">
          {c.title[0]} {c.title[1]} <span className="text-accent">{c.title[2]}</span>
          {c.title[3]}
        </h1>

        <div className="mt-7 rounded-xl border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            O que você achava
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground line-through">{c.wrong}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            O que o diagnóstico mostra
          </p>
          <p className="mt-1 text-[15px] font-semibold text-accent">{c.right}</p>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-foreground/80">{c.body}</p>
        {extra && (
          <p className="mt-3 border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-foreground/70">
            {extra}
          </p>
        )}

        {!enviado && (
          <form
            onSubmit={enviar}
            className="mt-8 rounded-xl border border-border bg-card p-5"
            noValidate
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Libere seu diagnóstico completo
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                maxLength={120}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
              />
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Seu WhatsApp (com DDD)"
                inputMode="tel"
                maxLength={40}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
              />
            </div>
            {erro && <p className="mt-3 text-[13px] text-destructive">{erro}</p>}
            <button
              type="submit"
              disabled={enviando}
              className="mt-4 w-full rounded-xl bg-accent px-6 py-4 font-display text-[15px] uppercase tracking-tight text-accent-foreground transition hover:brightness-95 disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Ver meu diagnóstico completo"}
            </button>
          </form>
        )}

        {enviado && (
          <div className="mt-8 flex flex-col gap-3">
            {c.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.kind === "whats" ? whatsComNome(nome.trim(), cta.perfil) : cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  cta.variant === "primary"
                    ? "rounded-xl bg-accent px-6 py-4 text-center font-display text-[15px] uppercase tracking-tight text-accent-foreground transition hover:brightness-95"
                    : "rounded-xl border border-ink/25 bg-background px-6 py-4 text-center font-display text-[15px] uppercase tracking-tight text-foreground transition hover:bg-card"
                }
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}

        <button
          onClick={onRestart}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          Refazer o diagnóstico
        </button>
      </div>
    </main>
  );
}
