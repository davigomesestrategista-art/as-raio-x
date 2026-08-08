// Configure aqui os links de checkout / VSL / WhatsApp.
export const LINK_MAPA = "[LINK_MAPA]";
export const LINK_PLANILHA = "[LINK_PLANILHA]";
export const LINK_PRIMEIRACOMPRA = "[LINK_PRIMEIRACOMPRA]";
export const LINK_METODO_PRECIFICACAO = "[LINK_METODO_PRECIFICACAO]";
export const LINK_GI = "[LINK_GI]";
export const LINK_VSL_METODO = "[LINK_VSL_METODO]";
export const NUMERO_WHATSAPP = "[NUMERO]";

export const withOrigem = (link: string, origem: string) =>
  `${link}${link.includes("?") ? "&" : "?"}origem=${origem}`;

export const whats = (texto: string) =>
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

export const whatsComNome = (nome: string, perfil: string) =>
  whats(`Oi, sou ${nome}, fiz o Diagnóstico da Sua Autopeça e caí no perfil ${perfil}`);

export type Answers = Record<number, string>;

export type ResultKey =
  | "ASPIRANTE"
  | "PLANILHA"
  | "PRIMEIRACOMPRA"
  | "METODO"
  | "PIKA"
  | "ASCENSAO";

export const questions = [
  {
    id: 1,
    title: ["Hoje você já tem uma loja de autopeças", "rodando", "?"],
    options: [
      { key: "a", label: "Sim, uma loja" },
      { key: "b", label: "Sim, mais de uma loja" },
      { key: "c", label: "Ainda não, mas quero abrir" },
    ],
  },
  {
    id: 2,
    title: ["O que mais te", "trava", " hoje?"],
    options: [
      { key: "a", label: "Compro no achismo, não sei se a peça vai girar" },
      { key: "b", label: "Dou desconto no escuro e a margem some" },
      {
        key: "c",
        label: "Minha operação é bagunça: estoque, processo e financeiro fora de controle",
      },
      { key: "d", label: "Já sei operar, não sei como crescer de verdade" },
    ],
  },
  {
    id: 3,
    title: ["Você já tentou", "resolver isso", " antes?"],
    options: [
      { key: "a", label: "Não tentei ainda" },
      { key: "b", label: "Tentei sozinho, YouTube ou dica de grupo, nunca virou sistema" },
      { key: "c", label: "Já comprei uma planilha ou produto de entrada do Yago" },
      { key: "d", label: "Já sou aluno do Método Peça.com" },
    ],
  },
  {
    id: 4,
    title: ["Qual o", "faturamento", " médio mensal da sua loja hoje?"],
    options: [
      { key: "a", label: "Até R$20 mil" },
      { key: "b", label: "R$20 mil a R$60 mil" },
      { key: "c", label: "R$60 mil a R$150 mil" },
      { key: "d", label: "Acima de R$150 mil" },
    ],
  },
  {
    id: 5,
    title: ["Se alguém te desse a", "solução certa", " amanhã, você:"],
    options: [
      { key: "a", label: "Aplicaria sozinho com um material ou planilha" },
      { key: "b", label: "Pagaria por um sistema completo pra implementar com apoio" },
      { key: "c", label: "Prefiro que alguém monte isso comigo, custe o que custar" },
    ],
  },
  {
    id: 6,
    title: ["Você pensa em abrir", "mais lojas", " nos próximos 12 meses?"],
    options: [
      { key: "a", label: "Não, foco é essa loja" },
      { key: "b", label: "Sim, quero abrir mais 1 ou 2" },
      { key: "c", label: "Sim, quero montar uma rede" },
    ],
  },
];

export function resolveResult(a: Answers): ResultKey {
  if (a[1] === "c") return "ASPIRANTE";
  if (a[3] === "d") return "ASCENSAO";
  if (a[4] === "d" || a[6] === "c") return "PIKA";
  if (a[5] === "c" && a[4] !== "a") return "METODO";
  if (a[4] === "a") return a[3] === "c" ? "METODO" : "PLANILHA";
  if (a[4] === "b") {
    if (a[2] === "a") return a[3] === "c" ? "METODO" : "PRIMEIRACOMPRA";
    if (a[2] === "b") return a[3] === "c" ? "METODO" : "PLANILHA";
    return "METODO";
  }
  return "METODO";
}

type Cta =
  | { label: string; kind: "link"; href: string; variant: "primary" | "ghost" }
  | { label: string; kind: "whats"; perfil: string; variant: "primary" | "ghost" };

export type ResultContent = {
  /** Camada 1 — rótulo narrativo, nunca taxonomia interna. */
  badge: string;
  /** Camada 2 — só existe quando a urgência é real (agenda do Ítalo) ou prova social. */
  urgency?: { text: string; tone: "hot" | "soft" };
  /** Camada 3 */
  headline: { struck: string; pre: string; accent: string; post: string };
  /** Camada 4 */
  compare: { wrong: string; right: string };
  /** Camada 5 — linha de fechamento depois dos chips. */
  closing: string;
  /** Camada 6 — legenda da foto do Yago. */
  proofCaption: string;
  /** Camada 7 */
  anticipation: string;
  /** Camada 9 */
  ctas: Cta[];
  secondary?: { label: string; href: string };
};

const AGENDA = "Só 2 horários de call por semana com o Ítalo";

export function getResultContent(key: ResultKey): ResultContent {
  switch (key) {
    case "ASPIRANTE":
      return {
        badge: "Seu diagnóstico: quer abrir e não sabe por onde",
        urgency: { text: "Mais de 1.000 donos já passaram por aqui", tone: "soft" },
        headline: {
          struck: "Não é que falta dinheiro pra abrir.",
          pre: "É que falta",
          accent: "a ordem certa",
          post: ".",
        },
        compare: {
          wrong: "abrir autopeça é questão de coragem",
          right: "abrir sem curva de compra é queimar caixa no mês 1",
        },
        closing: "O primeiro passo é saber o que comprar antes de gastar o primeiro real.",
        proofCaption: "Material direto do time do Yago",
        anticipation: "Libere abaixo o acesso ao Mapa da Primeira Loja.",
        ctas: [
          {
            label: "Quero o Mapa",
            kind: "link",
            href: withOrigem(LINK_MAPA, "raiox_aspirante"),
            variant: "primary",
          },
        ],
      };
    case "PLANILHA":
      return {
        badge: "Seu diagnóstico: vende bem, sobra pouco",
        urgency: { text: "Mais de 1.000 donos já aplicaram", tone: "soft" },
        headline: {
          struck: "Não é que sua loja vende pouco.",
          pre: "É que sua margem",
          accent: "vaza no balcão",
          post: ".",
        },
        compare: {
          wrong: "sua loja não dá lucro",
          right: "sua loja dá lucro e você entrega ele no desconto",
        },
        closing: "Preço não se sente, se calcula.",
        proofCaption: "Material direto do time do Yago",
        anticipation: "Libere abaixo o acesso à Planilha de Precificação.",
        ctas: [
          {
            label: "Quero a Planilha",
            kind: "link",
            href: withOrigem(LINK_PLANILHA, "raiox_planilha"),
            variant: "primary",
          },
        ],
        secondary: {
          label: "Já sei precificar, quero ir mais fundo com o Yago e o Ítalo",
          href: withOrigem(LINK_METODO_PRECIFICACAO, "raiox_planilha_upsell"),
        },
      };
    case "PRIMEIRACOMPRA":
      return {
        badge: "Seu diagnóstico: compra no achismo",
        urgency: { text: "Mais de 1.000 donos já aplicaram", tone: "soft" },
        headline: {
          struck: "Não é que você compra mal.",
          pre: "É que ninguém te deu",
          accent: "uma curva",
          post: ".",
        },
        compare: {
          wrong: "peça parada é azar de mix",
          right: "peça parada é compra sem curva de giro",
        },
        closing: "Dá pra saber o que gira antes de pagar por ela.",
        proofCaption: "Material direto do time do Yago",
        anticipation: "Libere abaixo o acesso à Planilha de Primeira Compra.",
        ctas: [
          {
            label: "Quero a Planilha de Primeira Compra",
            kind: "link",
            href: withOrigem(LINK_PRIMEIRACOMPRA, "raiox_primeiracompra"),
            variant: "primary",
          },
        ],
      };
    case "METODO":
      return {
        badge: "Seu diagnóstico: opera no braço, sem sistema",
        urgency: { text: AGENDA, tone: "hot" },
        headline: {
          struck: "Não é que você não sabe tocar a loja.",
          pre: "É que tocar no braço",
          accent: "tem teto",
          post: ".",
        },
        compare: {
          wrong: "é só apertar mais o time e vender mais",
          right: "sem sistema, crescer só aumenta a bagunça",
        },
        closing: "O próximo degrau não é esforço, é estrutura com quem já montou.",
        proofCaption: "Você vai assistir com o Yago",
        anticipation:
          "Libere abaixo a aula gratuita e sua vaga na lista de espera da call com o Ítalo.",
        ctas: [
          {
            label: "Assistir a aula gratuita",
            kind: "link",
            href: withOrigem(LINK_VSL_METODO, "raiox_metodo"),
            variant: "primary",
          },
        ],
        secondary: {
          label: "Quero entrar na lista de espera da call",
          href: whats("RAIOX-METODO-ASCENSAO"),
        },
      };
    case "PIKA":
      return {
        badge: "Seu diagnóstico: seu jogo já é de rede",
        urgency: { text: AGENDA, tone: "hot" },
        headline: {
          struck: "Não é que falta venda na sua operação.",
          pre: "É que falta",
          accent: "estrutura de rede",
          post: ".",
        },
        compare: {
          wrong: "seu próximo passo é mais um curso",
          right: "seu próximo passo é decisão de dono, caso a caso",
        },
        closing: "Nesse patamar o caminho se define em conversa, não em material.",
        proofCaption: "Você vai falar com a equipe do Yago",
        anticipation: "Libere abaixo a conversa direta com o Ítalo sobre a sua operação.",
        ctas: [
          {
            label: "Falar com a equipe agora",
            kind: "whats",
            perfil: "RAIOX-PIKA-IMERSAO",
            variant: "primary",
          },
        ],
      };
    case "ASCENSAO":
      return {
        badge: "Seu diagnóstico: aluno pronto pro próximo nível",
        urgency: { text: AGENDA, tone: "hot" },
        headline: {
          struck: "Não é que o Método não funcionou pra você.",
          pre: "É que você já passou",
          accent: "do tamanho dele",
          post: ".",
        },
        compare: {
          wrong: "falta você aplicar melhor o que já tem",
          right: "falta acompanhamento de perto pro próximo patamar",
        },
        closing: "Daqui pra frente o ganho está no que é feito junto com você.",
        proofCaption: "Você vai falar com a equipe do Yago",
        anticipation: "Libere abaixo a conversa direta com o Ítalo sobre a sua ascensão.",
        ctas: [
          {
            label: "Falar com a equipe agora",
            kind: "whats",
            perfil: "RAIOX-ASCENSAO",
            variant: "primary",
          },
        ],
      };
  }
}

/** Camada 5 — chips dinâmicos, puxados das respostas reais. */
export function buildChips(key: ResultKey, a: Answers): string[] {
  const chips: string[] = [];

  const p2: Record<string, string> = {
    a: "Compra no achismo",
    b: "Desconto no escuro",
    c: "Operação bagunçada",
    d: "Teto de crescimento",
  };
  const p4: Record<string, string> = {
    a: "Até R$20 mil/mês",
    b: "R$20 a R$60 mil/mês",
    c: "R$60 a R$150 mil/mês",
    d: "Acima de R$150 mil/mês",
  };
  const p6: Record<string, string> = {
    b: "Quer mais 1 ou 2 lojas",
    c: "Quer montar rede",
  };

  if (key === "ASPIRANTE") {
    return ["Sem fornecedor definido", "Sem mix inicial", "Capital em risco", "Sem ordem de abertura"];
  }
  if (key === "ASCENSAO") {
    chips.push("Já é aluno do Método");
  }

  if (a[2] && p2[a[2]]) chips.push(p2[a[2]]!);
  if (a[4] && p4[a[4]]) chips.push(p4[a[4]]!);
  if (a[3] === "b") chips.push("Tentou sozinho");
  if (a[3] === "c") chips.push("Produto de entrada");
  if (a[6] && p6[a[6]]) chips.push(p6[a[6]]!);
  if (a[5] === "c") chips.push("Quer feito junto");

  if (chips.length < 3) {
    if (key === "PLANILHA") chips.push("Margem sem cálculo");
    if (key === "PRIMEIRACOMPRA") chips.push("Estoque parado");
    if (key === "METODO") chips.push("Depende do dono");
    if (key === "PIKA") chips.push("Padronização entre lojas");
  }

  return chips.slice(0, 5);
}

/** Camada condicional — só PLANILHA, PRIMEIRACOMPRA e METODO. */
export const linhaTentativa = (p3?: string) => {
  if (p3 === "b")
    return "Você já tentou por conta, no YouTube e em dica de grupo, e nunca virou sistema — não foi falta de esforço, foi falta de método.";
  if (p3 === "c")
    return "Você já pegou um material de entrada e resolveu em parte, mas travou de novo — isso é sinal de solução solta, sem sistema por trás.";
  return null;
};

