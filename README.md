# Raio-X do Negócio

Crie um web app mobile-first chamado "Raio-X do Negócio", um quiz de diagnóstico para donos de loja de autopeças. Tom de voz: direto, concreto, sem jargão de marketing digital ("guru", "mentoria", "high-ticket"). Fale como quem já tem loja falando com quem tem loja. FLUXO: Tela 1 (abertura): título "Descubra o que está travando sua loja" + botão "Começar o Raio-X". Sem formulário de e-mail antes do quiz, sem fricção. Perguntas (uma por tela, botões de resposta única, barra de progresso 1/6): P1. Hoje você já tem uma loja de autopeças rodando? a) Sim, uma loja b) Sim, mais de uma loja c) Ainda não, mas quero abrir -> se (c), pular direto pra TELA FINAL "ASPIRANTE" (ver abaixo), ignorando as perguntas seguintes. P2. Qual o faturamento médio mensal da sua loja hoje? a) Até R$20 mil b) R$20 mil a R$60 mil c) R$60 mil a R$150 mil d) Acima de R$150 mil P3. O que mais te trava hoje? a) Não sei precificar direito, sinto que deixo dinheiro na mesa b) Não sei onde comprar peça barata e certa c) Minha operação é bagunçada: sem controle de processo, time ou financeiro d) Já sei operar, não sei como escalar P4. Se alguém te desse a solução certa amanhã, você: a) Aplicaria sozinho com um material ou planilha b) Pagaria por um sistema completo pra implementar com apoio c) Prefiro que alguém monte isso comigo, mesmo pagando mais caro P5. Você já tentou resolver isso sozinho antes? a) Não tentei ainda b) Tentei e não resolveu c) Tentei, resolvi em parte, mas travou de novo P6. Você pensa em abrir mais lojas ou ter uma operação maior nos próximos 12 meses? a) Não, foco é essa loja b) Sim, quero abrir mais 1 ou 2 c) Sim, quero montar uma rede LÓGICA DE ROTEAMENTO (mesma ordem de antes, o que muda é o destino):

1. P1 = (c) -> ASPIRANTE -> link de checkout [LINK_MAPA]?origem=raiox_aspirante

2. P2 = (d) OU P6 = (c) -> PIKA -> WhatsApp direto

3. P4 = (c) E P2 != (a) -> METODO -> VSL + WhatsApp soft opt-in

4. P2 = (a) -> PLANILHA -> checkout

5. P2 = (b): P3=(a)->PLANILHA checkout | P3=(b)->REFERENCIA checkout |

   P3=(c)->GI checkout | P3=(d)->METODO (VSL + opt-in)

6. P2 = (c) -> METODO (VSL + opt-in)

TELA FINAL por resultado:

- ASPIRANTE: nomeia a dor de começar sem chutar. Botão único "Quero o Mapa"

  -> [LINK_MAPA]?origem=raiox_aspirante (checkout direto, sem WhatsApp).

- PLANILHA: nomeia a dor de precificação. Botão único "Quero a Planilha"

  -> [LINK_PLANILHA]?origem=raiox_planilha (checkout direto).

- REFERENCIA: nomeia a dor de fonte de compra. Botão único "Quero acessar"

  -> [LINK_REFERENCIA]?origem=raiox_referencia (checkout direto).

- GI: nomeia bagunça de processo/pessoas/financeiro (não puxar "estoque"

  como carro-chefe, isso é do Método). Botão único "Quero o Sistema GI"

  -> [LINK_GI]?origem=raiox_gi (checkout direto).

- METODO: nomeia que ele já opera mas precisa de sistema e suporte pra

  crescer. Dois botões: (1) "Assistir a aula gratuita" -> [LINK_VSL_METODO]

  ?origem=raiox_metodo ; (2) "Já entrar na lista da call" -> abre

  https://wa.me/[NUMERO]?text=RAIOX-METODO-ASCENSAO. Os dois aparecem

  juntos, nenhum deles fecha a tela sozinho.

- PIKA: reconhece que ele já é grande ou quer virar rede. Botão único

  "Falar com a equipe agora" -> https://wa.me/[NUMERO]?text=RAIOX-PIKA-IMERSAO.

Se P5 = (b) ou (c), adicionar linha extra reconhecendo tentativa anterior,

em todos os resultados exceto ASPIRANTE e PIKA.

siga esse design:

DESIGN (identidade visual do Método Peça.com, manter consistência de marca):

- Paleta: fundo preto/quase preto (#0A0A0A) na tela de abertura e nas

  transições entre perguntas; fundo branco (#FFFFFF) nas telas de pergunta

  e resultado. Cor de destaque verde-menta vibrante (#22D3A6), usada em

  badges, na palavra-chave de cada headline, nos botões de CTA e nos

  números de progresso ("PERGUNTA 0X").

- Cards de resposta: fundo cinza muito claro (#F7F7F8), borda fina

  (1px, cinza claro), cantos arredondados, sem sombra pesada.

- Tipografia de título: fonte condensada bold, caixa alta, tracking

  apertado, estilo cartaz (referência: Archivo Black ou Anton). Usar nos

  títulos de cada pergunta e no título do resultado final.

- Tipografia de corpo: sans-serif moderna, peso regular (referência:

  Inter ou Manrope). Usar nos textos de apoio e alternativas de resposta.

- Tipografia de rótulo: monospace, caixa alta, letter-spacing largo,

  tamanho pequeno (referência: JetBrains Mono ou Space Mono). Usar na

  barra de progresso, em "PERGUNTA 0X" e em badges tipo pill.

- Barra de progresso no topo: fundo verde-menta sólido com texto escuro

  em caixa alta monospace, mesma linguagem da barra de anúncio do site

  principal.

- Recurso de reforço na tela de resultado: mostrar uma frase riscada em

  cinza com a suposição errada ("sua loja não tem jeito" ou similar),

  embaixo a frase certa em verde-menta revelando o diagnóstico real. Esse

  é o mesmo recurso visual usado na página do Método, reforça que o

  raio-x é da mesma casa.

- Sem imagem de banco de imagem genérica. Se precisar de foto, usar

  espaço reservado neutro (não gerar rosto ou ambiente falso).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://as-raio-x.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96ed5217-65f2-4c6f-963d-efd66c740b58).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
