import { createFileRoute } from "@tanstack/react-router";
import { LINK_MAPA, withOrigem } from "@/lib/raiox";

export const Route = createFileRoute("/aula-mapa")({
  head: () => ({
    meta: [
      { title: "Aula Gratuita | Mapa das Autopeças" },
      {
        name: "description",
        content: "Como abrir uma loja de autopeças sem chutar fornecedor, sem travar estoque e sem queimar caixa no primeiro mês.",
      },
    ],
  }),
  component: AulaMapa,
});

// [PLACEHOLDER] Trocar pelo link real do vídeo (Vimeo, YouTube unlisted ou player próprio) quando o Yago mandar.
const VIDEO_URL = "[LINK_VIDEO_AULA_MAPA]";
const VIDEO_DURACAO = "[DURAÇÃO]";

function AulaMapa() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-accent">
        <div className="mx-auto max-w-xl px-5 py-2.5 text-center">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
            Aula gratuita · Mapa das Autopeças
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl px-5 pb-20 pt-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-accent" aria-hidden="true">●</span>
          Acesso liberado agora
        </span>

        <h1 className="mt-4 font-display text-[34px] uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Como eu abri <span className="text-accent">4 autopeças</span> em 4 anos começando do 0
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/80">
          Nessa aula vou te mostrar o passo a passo que uso pra abrir loja sem
          chutar fornecedor, sem travar estoque parado e sem queimar caixa no
          primeiro mês.
        </p>

        <div className="mt-7 aspect-video w-full overflow-hidden rounded-2xl bg-ink">
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full flex-col items-center justify-center gap-3"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent transition-transform hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-accent-foreground" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-foreground/60">
              Assistir a aula · {VIDEO_DURACAO}
            </span>
          </a>
        </div>

        <a
          href={withOrigem(LINK_MAPA, "vsl_aspirante")}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-soft-pulse mt-7 block w-full rounded-xl bg-accent px-6 py-4 text-center font-display text-[15px] uppercase tracking-tight text-accent-foreground transition hover:brightness-95"
        >
          Quero o Mapa
        </a>
      </div>
    </main>
  );
}
