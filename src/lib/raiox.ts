// Configure aqui os links de checkout / VSL / WhatsApp.
export const LINK_MAPA = "[LINK_MAPA]";
export const LINK_PLANILHA = "[LINK_PLANILHA]";
export const LINK_REFERENCIA = "[LINK_REFERENCIA]";
export const LINK_GI = "[LINK_GI]";
export const LINK_VSL_METODO = "[LINK_VSL_METODO]";
export const NUMERO_WHATSAPP = "[NUMERO]";

export const withOrigem = (link: string, origem: string) =>
  `${link}${link.includes("?") ? "&" : "?"}origem=${origem}`;

export const whats = (texto: string) =>
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

export const whatsComNome = (nome: string, perfil: string) =>
  whats(`Oi, sou ${nome}, fiz o Diagnóstico da Autopeça e caí no perfil ${perfil}`);

export type Answers = Record<number, string>;

export type ResultKey = "ASPIRANTE" | "PLANILHA" | "REFERENCIA" | "GI" | "METODO" | "PIKA";

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
    title: ["Qual o", "faturamento", "médio mensal da sua loja hoje?"],
    options: [
      { key: "a", label: "Até R$20 mil" },
      { key: "b", label: "R$20 mil a R$60 mil" },
      { key: "c", label: "R$60 mil a R$150 mil" },
      { key: "d", label: "Acima de R$150 mil" },
    ],
  },
  {
    id: 3,
    title: ["O que mais te", "trava", "hoje?"],
    options: [
      { key: "a", label: "Não sei precificar direito, sinto que deixo dinheiro na mesa" },
      { key: "b", label: "Não sei onde comprar peça barata e certa" },
      {
        key: "c",
        label: "Minha operação é bagunçada: sem controle de processo, time ou financeiro",
      },
      { key: "d", label: "Já sei operar, não sei como escalar" },
    ],
  },
  {
    id: 4,
    title: ["Se alguém te desse a", "solução certa", "amanhã, você:"],
    options: [
      { key: "a", label: "Aplicaria sozinho com um material ou planilha" },
      { key: "b", label: "Pagaria por um sistema completo pra implementar com apoio" },
      { key: "c", label: "Prefiro que alguém monte isso comigo, mesmo pagando mais caro" },
    ],
  },
  {
    id: 5,
    title: ["Você já tentou resolver isso", "sozinho", "antes?"],
    options: [
      { key: "a", label: "Não tentei ainda" },
      { key: "b", label: "Tentei e não resolveu" },
      { key: "c", label: "Tentei, resolvi em parte, mas travou de novo" },
    ],
  },
  {
    id: 6,
    title: ["Você pensa em abrir", "mais lojas", "nos próximos 12 meses?"],
    options: [
      { key: "a", label: "Não, foco é essa loja" },
      { key: "b", label: "Sim, quero abrir mais 1 ou 2" },
      { key: "c", label: "Sim, quero montar uma rede" },
    ],
  },
];

export function resolveResult(a: Answers): ResultKey {
  if (a[1] === "c") return "ASPIRANTE";
  if (a[2] === "d" || a[6] === "c") return "PIKA";
  if (a[4] === "c" && a[2] !== "a") return "METODO";
  if (a[2] === "a") return "PLANILHA";
  if (a[2] === "b") {
    if (a[3] === "a") return "PLANILHA";
    if (a[3] === "b") return "REFERENCIA";
    if (a[3] === "c") return "GI";
    return "METODO";
  }
  return "METODO";
}

type Cta =
  | { label: string; kind: "link"; href: string; variant: "primary" | "ghost" }
  | { label: string; kind: "whats"; perfil: string; variant: "primary" | "ghost" };

export type ResultContent = {
  badge: string;
  title: string[];
  wrong: string;
  right: string;
  body: string;
  ctas: Cta[];
};

export function getResultContent(key: ResultKey): ResultContent {
  switch (key) {
    case "ASPIRANTE":
      return {
        badge: "Resultado: Aspirante",
        title: ["Você não está travado.", "Você está", "sem mapa", "."],
        wrong: "abrir loja de autopeças é sorte",
        right: "abrir sem mapa é que é caro",
        body: "Você ainda não abriu. O problema não é falta de vontade, é não saber a ordem das coisas: onde comprar, quanto investir, que mix de peça girar e o que evitar nos primeiros meses. Quem chuta essa parte queima capital antes da loja andar.",
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
        badge: "Resultado: Precificação",
        title: ["Sua loja vende.", "Sua margem", "vaza", "."],
        wrong: "sua loja não dá lucro",
        right: "sua loja dá lucro, você está entregando ele no preço",
        body: "Você tem giro, mas o preço sai no feeling. Sem markup por curva, frete e imposto na conta, você vende bastante e sobra pouco. Isso se resolve com cálculo, não com mais venda.",
        ctas: [
          {
            label: "Quero a Planilha",
            kind: "link",
            href: withOrigem(LINK_PLANILHA, "raiox_planilha"),
            variant: "primary",
          },
        ],
      };
    case "REFERENCIA":
      return {
        badge: "Resultado: Compra",
        title: ["O problema está", "antes", "da venda."],
        wrong: "seu cliente só quer preço baixo",
        right: "você está comprando caro e culpando o cliente",
        body: "Comprando na mão do representante errado, sua peça já entra cara na loja. Fornecedor certo, peça certa e condição certa mudam sua margem sem você mexer uma vírgula na venda.",
        ctas: [
          {
            label: "Quero acessar",
            kind: "link",
            href: withOrigem(LINK_REFERENCIA, "raiox_referencia"),
            variant: "primary",
          },
        ],
      };
    case "GI":
      return {
        badge: "Resultado: Gestão",
        title: ["Não falta venda.", "Falta", "controle", "."],
        wrong: "você precisa vender mais",
        right: "você precisa saber o que já acontece dentro da sua loja",
        body: "Processo na cabeça do dono, time sem rotina definida e financeiro misturado com o pessoal. Assim a loja depende de você o dia inteiro e ninguém sabe o número real do mês.",
        ctas: [
          {
            label: "Quero o Sistema GI",
            kind: "link",
            href: withOrigem(LINK_GI, "raiox_gi"),
            variant: "primary",
          },
        ],
      };
    case "METODO":
      return {
        badge: "Resultado: Método",
        title: ["Você já opera.", "Falta", "sistema", "pra crescer."],
        wrong: "é só apertar mais o time",
        right: "sem sistema e acompanhamento, crescer só aumenta a bagunça",
        body: "Você já sabe tocar a loja no dia a dia. O próximo degrau não é esforço, é estrutura: compra, precificação, estoque e time funcionando junto, com alguém acompanhando a implementação.",
        ctas: [
          {
            label: "Quero acelerar",
            kind: "whats",
            perfil: "RAIOX-METODO-ASCENSAO",
            variant: "primary",
          },
          {
            label: "Assistir a aula gratuita",
            kind: "link",
            href: withOrigem(LINK_VSL_METODO, "raiox_metodo"),
            variant: "ghost",
          },
        ],
      };
    case "PIKA":
      return {
        badge: "Resultado: Operação grande",
        title: ["Seu jogo não é loja.", "É", "rede", "."],
        wrong: "seu próximo passo é um curso",
        right: "seu próximo passo é estrutura de rede e decisão de dono",
        body: "No seu patamar o gargalo muda de lugar: padronização entre unidades, poder de compra, gente pra tocar sem você e caixa pra bancar a expansão. Isso se resolve conversando caso a caso.",
        ctas: [
          {
            label: "Quero acelerar",
            kind: "whats",
            perfil: "RAIOX-PIKA-IMERSAO",
            variant: "primary",
          },
        ],
      };
  }
}

export const linhaTentativa = (p5?: string) => {
  if (p5 === "b")
    return "Você já tentou resolver isso por conta e não saiu do lugar — não foi falta de esforço, foi falta de método.";
  if (p5 === "c")
    return "Você já resolveu em parte e travou de novo — isso é sinal de solução solta, sem sistema por trás.";
  return null;
};
