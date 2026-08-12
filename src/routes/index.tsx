import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  questions,
  resolveResult,
  getResultContent,
  buildChips,
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

type Stage = "intro" | "quiz" | "computing" | "result";

function Diagnostico() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  const q = questions[step]!;

  function goToResult(final: Answers) {
    // Sem P2/P4 não dá pra montar as linhas dinâmicas: vai direto pro resultado.
    if (final[1] === "c" || final[3] === "d") {
      setStage("result");
      return;
    }
    setStage("computing");
  }


  function pick(key: string) {
    if (selected) return;
    setSelected(key);
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
    const next = { ...answers, [q.id]: key };
    setAnswers(next);

    const isLast =
      (q.id === 1 && key === "c") ||
      (q.id === 3 && key === "d") ||
      step === questions.length - 1;

    setTimeout(() => setLeaving(true), 260);
    setTimeout(() => {
      if (isLast) {
        goToResult(next);
      } else {
        setStep(step + 1);
      }
      setSelected(null);
      setLeaving(false);
    }, 420);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setSelected(null);
    setLeaving(false);
    setStage("intro");
  }

  function back() {
    if (selected) return;
    setStep(step - 1);
  }

  if (stage === "intro") return <Intro onStart={() => setStage("quiz")} />;
  if (stage === "computing")
    return <Computing answers={answers} onDone={() => setStage("result")} />;
  if (stage === "result") return <Result answers={answers} onRestart={restart} />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <ProgressBar current={step + 1} total={questions.length} />
      <div
        key={step}
        className={`mx-auto w-full max-w-xl px-5 pb-16 pt-8 transition-all duration-200 ease-out ${
          leaving ? "-translate-x-4 opacity-0" : "translate-x-0 opacity-100 animate-fade-in"
        }`}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          Pergunta {String(step + 1).padStart(2, "0")}
        </span>
        <h1 className="mt-3 font-display text-[26px] uppercase leading-[1.05] tracking-tight text-foreground sm:text-3xl">
          {q.title[0]} <span className="text-accent">{q.title[1]}</span>
          {q.title[2]}
        </h1>

        <div className="mt-7 flex flex-col gap-3">
          {q.options.map((o) => {
            const active = selected === o.key;
            return (
              <button
                key={o.key}
                onClick={() => pick(o.key)}
                className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200 ease-out active:scale-[0.995] ${
                  active
                    ? "border-accent bg-accent"
                    : "border-border bg-card hover:border-accent hover:bg-accent/10"
                } ${selected && !active ? "opacity-40" : ""}`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border font-mono text-xs uppercase transition-all duration-200 ${
                    active
                      ? "border-accent-foreground bg-accent-foreground text-accent"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {active ? (
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M7.6 14.2 3.9 10.5l1.3-1.3 2.4 2.4 6.2-6.2 1.3 1.3z" />
                    </svg>
                  ) : (
                    o.key
                  )}
                </span>
                <span
                  className={`min-w-0 text-[15px] leading-snug transition-colors duration-200 ${
                    active ? "font-semibold text-accent-foreground" : "text-foreground"
                  }`}
                >
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>

        {step > 0 && (
          <button
            onClick={back}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </button>
        )}
      </div>
    </main>
  );
}

const FADE = 180;

function Computing({ answers, onDone }: { answers: Answers; onDone: () => void }) {
  const p2 = questions[1]!.options.find((o) => o.key === answers[2])?.label ?? "";
  const p4 = questions[3]!.options.find((o) => o.key === answers[4])?.label ?? "";

  const lines: { text: string; ms: number }[] = [
    { text: "Analisando suas respostas...", ms: 500 },
    { text: `Entendemos: ${p2}.`, ms: 1000 },
    { text: "Cruzando com seu faturamento...", ms: 500 },
    { text: `${p4} e ainda travado nisso.`, ms: 800 },
    { text: "Buscando o padrão em mais de 1.000 autopeças...", ms: 700 },
    { text: "Diagnóstico pronto.", ms: 600 },
  ];

  const total = lines.reduce((s, l) => s + l.ms, 0);

  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(6);

  useEffect(() => {
    const t = setTimeout(() => setPct(100), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const line = lines[i];
    if (!line) return;
    setVisible(true);
    const out = setTimeout(() => setVisible(false), Math.max(line.ms - FADE, 60));
    const next = setTimeout(() => {
      if (i === lines.length - 1) onDone();
      else setI(i + 1);
    }, line.ms);
    return () => {
      clearTimeout(out);
      clearTimeout(next);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-ink-foreground">
      <p
        className={`min-h-[3.5rem] max-w-sm text-center font-mono text-[13px] uppercase leading-relaxed tracking-[0.22em] text-accent transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {lines[i]?.text}
      </p>
      <div className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-ink-foreground/15">
        <div
          className="h-full bg-accent ease-linear"
          style={{ width: `${pct}%`, transition: `width ${total}ms linear` }}
        />
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
          className="h-full bg-accent-foreground transition-[width] duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}


function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-screen flex-col bg-ink px-5 py-10 text-ink-foreground">
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-accent bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        <span className="text-accent" aria-hidden="true">●</span>
        Pra dono de autopeça travado
      </span>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-14">
        <h1 className="font-display text-[38px] uppercase leading-[0.95] tracking-tight sm:text-5xl">
          <span className="block text-ink-foreground/45 line-through decoration-2">
            Sua autopeça não tá sem esforço.
          </span>
          <span className="mt-2 block">
            Ela tá <span className="text-accent">sem diagnóstico</span>.
          </span>
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-foreground/70">
          Estoque parado, margem que some, caixa apertado.{" "}
          <strong className="text-ink-foreground">
            6 perguntas pra descobrir exatamente onde tá o vazamento da sua loja
          </strong>{" "}
          e o que fazer sobre isso agora.
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

function Rise({
  delay,
  className,
  as: Tag = "div",
  children,
}: {
  delay: number;
  className?: string;
  as?: "div" | "p" | "h1";
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={`animate-rise-in ${className ?? ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const key = resolveResult(answers);
  const c = getResultContent(key);
  const chips = buildChips(key, answers);
  const podeReconhecer = key === "PLANILHA" || key === "PRIMEIRACOMPRA" || key === "METODO";
  const extra = podeReconhecer ? linhaTentativa(answers[3]) : null;

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
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
      email: email.trim().slice(0, 160) || null,
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

  const d = (n: number) => n * 160;

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
        {/* Camada 1 + 2 */}
        <Rise delay={d(0)} className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
            {c.badge}
          </span>
          {c.urgency && (
            <span
              className={`inline-flex rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                c.urgency.tone === "hot"
                  ? "bg-accent text-accent-foreground"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {c.urgency.text}
            </span>
          )}
        </Rise>

        {/* Camada 3 */}
        <Rise
          delay={d(1)}
          as="h1"
          className="mt-4 font-display text-[28px] uppercase leading-[1.04] tracking-tight text-foreground sm:text-4xl"
        >
          <span className="block text-muted-foreground line-through decoration-2">
            {c.headline.struck}
          </span>
          <span className="mt-2 block">
            {c.headline.pre} <span className="text-accent">{c.headline.accent}</span>
            {c.headline.post}
          </span>
        </Rise>

        {/* Camada 4 */}
        <Rise delay={d(2)} className="mt-7 rounded-xl border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            O que você achava
          </p>
          <p className="relative mt-1 inline-block text-[15px] text-muted-foreground">
            {c.compare.wrong}
            <span
              aria-hidden="true"
              className="animate-strike-draw absolute left-0 top-1/2 h-px w-full bg-muted-foreground"
              style={{ animationDelay: `${d(2) + 300}ms`, animationFillMode: "both" }}
            />
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            O que o diagnóstico mostra
          </p>
          <p className="mt-1 text-[15px] font-semibold text-accent">{c.compare.right}</p>
        </Rise>

        {/* Camada 5 */}
        <Rise delay={d(3)} className="mt-6">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{c.closing}</p>
        </Rise>

        {/* Camada condicional */}
        {extra && (
          <Rise
            delay={d(4)}
            as="p"
            className="mt-4 border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-foreground/70"
          >
            {extra}
          </Rise>
        )}

        {/* Camada 6 */}
        <Rise delay={d(extra ? 5 : 4)} className="mt-8 flex items-center gap-3">
          {/* Espaço reservado para a foto real do Yago (substituir por src/assets/yago.jpg). */}
          <div
            className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-card font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
            aria-hidden="true"
          >
            Foto
          </div>
          <p className="text-[13px] leading-snug text-foreground/70">{c.proofCaption}</p>
        </Rise>

        {!enviado && (
          <Rise delay={d(extra ? 6 : 5)}>
            <form
              onSubmit={enviar}
              className="mt-4 rounded-xl border border-border bg-card p-5"
              noValidate
            >
              {/* Camada 7 */}
              <p className="text-[14px] font-semibold leading-snug text-foreground">
                {c.anticipation}
              </p>

              {/* Camada 8 */}
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
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail (opcional)"
                  inputMode="email"
                  maxLength={160}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
                />
              </div>
              {erro && <p className="mt-3 text-[13px] text-destructive">{erro}</p>}
              <button
                type="submit"
                disabled={enviando}
                className="animate-soft-pulse mt-4 w-full rounded-xl bg-accent px-6 py-4 font-display text-[15px] uppercase tracking-tight text-accent-foreground transition hover:brightness-95 disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Ver meu diagnóstico completo"}
              </button>
            </form>
          </Rise>
        )}

        {/* Camada 9 */}
        {enviado && (
          <div className="mt-6 flex animate-rise-in flex-col gap-3">
            {c.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.kind === "whats" ? whatsComNome(nome.trim(), cta.perfil) : cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  cta.variant === "primary"
                    ? "animate-soft-pulse rounded-xl bg-accent px-6 py-4 text-center font-display text-[15px] uppercase tracking-tight text-accent-foreground transition hover:brightness-95"
                    : "rounded-xl border border-ink/25 bg-background px-6 py-4 text-center font-display text-[15px] uppercase tracking-tight text-foreground transition hover:bg-card"
                }
              >
                {cta.label}
              </a>
            ))}
            {c.secondary && (
              <a
                href={
                  c.secondary.href.startsWith("https://wa.me")
                    ? whatsComNome(nome.trim(), "RAIOX-METODO-ASCENSAO")
                    : c.secondary.href
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {c.secondary.label}
              </a>
            )}
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

