# Estudo do Kit da Iniciativa T20

> **Documento mestre de referencia para implementacao do tema "Iniciativa T20" no Homebrewery.**
> Sintese fiel de todos os estudos dos pesquisadores sobre o conteudo do "Kit da Iniciativa T20" da Jambo Editora. Onde uma especificacao nao foi extraida diretamente das fontes, esta marcada como **(a confirmar)**.

---

## 1. Visao geral do kit (o que e, o que cada pasta contem)

### 1.1 O que e a Iniciativa T20

A **Iniciativa T20** e a plataforma oficial da **Jambo Editora** para publicacao e venda de **obras digitais de fas** de Tormenta (RPG Tormenta20 + cenario de Arton). O autor envia conteudo de RPG ou literatura; se aprovado, vai a venda na loja on-line da editora, com **60% de royalties** ao autor por venda. O **"Kit da Iniciativa T20"** e o pacote de materiais que a editora distribui para padronizar essas obras.

O kit e baixado por um link do Google Drive embutido no Manual:
`https://drive.google.com/drive/folders/1k4inrsQAW3FNVJHl8xHVJUgOSUsI4NjA?usp=sharing`

### 1.2 Composicao oficial do kit (citada no Manual)

1. **Guia de Estilo de Tormenta** (regras editoriais e de redacao).
2. **Selo da Iniciativa T20** (badge de identificacao obrigatoria).
3. **Modelos de diagramacao** = **Modelo de RPG** e **Modelo de Literatura**.

### 1.3 Estrutura de pastas observada no disco

> Atencao: no disco, as pastas usam acentos (ç/ã). Caminho-base: `E:\rayna\Documents\Claude\Projects\IniciativaT20\Kit da Iniciativa T20\`

| Pasta / arquivo | Conteudo | Relevancia para o tema |
|---|---|---|
| `Manual.docx` | Regulamento institucional da plataforma (regras de conteudo, obrigacoes de capa, precos, pagamentos). Usa fontes/tema **padrao do Word** (Calibri/Georgia) — **nao** carrega identidade Tormenta. | Define obrigacoes de capa: selo + frase "Nao oficial e nao canonico" + aviso de spoiler; politica comercial. |
| `20 Regras para Autores de Tormenta.pdf` (7 pp.) | "Guia de Estilo Tormenta20" / as 20 regras editoriais, da coluna "Dicas de Mestre" da Dragao Brasil, por "Paladino". | Regras narrativas + algumas com impacto visual direto (box de regra, fichas compactas, curadoria de imagens). |
| `Guia de Estilo.pdf` (8 pp.) | Coluna "Dicas de Mestre — Guia de Estilo", por Rafael Dei Svaldi (diretor de regras T20). Padrao de redacao de regras, fichas e terminologia. | Terminologia oficial T20, modelo de ficha de criatura, convencoes de prosa. |
| `Modelos de Diagramação - InDesign\Modelo de RPG\` | PDF de 3 paginas (capa, 2 colunas, box+tabela) + `Document Fonts\` (5 fontes + `AdobeFnt22.lst`). | **Fonte primaria do layout** que o tema CSS imita. |
| `Modelos de Diagramação - InDesign\Modelo de Literatura\` | PDF de 5 paginas (capa, verso em branco, abertura de capitulo, continuacao) + `Document Fonts\` (8 arquivos). | Layout alternativo (1 coluna). |
| `Modelos de Diagramação - Word\` | Versoes Word dos modelos + `Fontes\` (10 arquivos). | Referencia secundaria; fontes auxiliares. |
| `Projeto Gráfico Homebrew T20\Imagens\` | **19 PNG** de assets graficos (bordas, boxes, faixas, rodapes, numero de pagina, abertura de capitulo). | **Assets visuais do tema.** |
| `Projeto Gráfico Homebrew T20\Fontes\` | **As 3 familias do tema** (Tormenta20, Iowan Old Style, Source Sans Pro) + Benguiat solta (nao e do tema). | **Fontes canonicas do tema.** |
| `Selo\` | 5 arquivos do selo: PNG Cor, PNG PB, PDF, AI, EPS. | Badge obrigatorio. |

### 1.4 Conclusao para a implementacao

A identidade visual de Tormenta **nao** vem do Manual.docx (que e Office default). Vem dos **modelos de diagramacao** (sobretudo o **Modelo de RPG**), do **Projeto Grafico Homebrew T20** (assets PNG + fontes) e do **Guia de Estilo** (terminologia). **O tema Homebrewery deve imitar o Modelo de RPG** (2 colunas). Nenhum CSS de tema "Iniciativa T20"/"Tormenta20" existe ainda no repositorio — esta pesquisa e a base para constru-lo.

---

## 2. Especificacoes de pagina (tamanho, margens, colunas, BG)

Parametros comuns aos dois modelos de diagramacao (verdade-base):

| Parametro | Valor |
|---|---|
| **Tamanho da pagina** | **205 mm × 275 mm** |
| **Margem superior** | **20 mm** |
| **Margem inferior** | **24 mm** |
| **Margem interna (lombada)** | **25 mm** |
| **Margem externa** | **18 mm** |
| **Tipo de margem** | **Assimetrica → paginas espelhadas** (encadernacao; mais respiro na lombada) |
| **Fundo (imagem de BG)** | Opacidade **75%** |
| **Grid — Modelo de RPG** | **2 colunas** com calha (o tema imita este) |
| **Grid — Modelo de Literatura** | **1 coluna** corrida |

**Orientacao CSS:**
```less
.page { width: 205mm; height: 275mm; }
// padding/margens espelhadas via :nth-child(even/odd):
//   interna 25mm / externa 18mm; topo 20mm; base 24mm
// grid de conteudo (RPG): column-count: 2 + column-gap
// imagem de fundo (Background.png) a opacity .75, background-size: cover
```

---

## 3. Paleta de cores (tabela hex → uso)

> **Verdade-base fornecida (paleta de diagramacao do Kit / Projeto Grafico Homebrew T20).** Esta e a paleta do **tema**. (Nota: o `Guia de Estilo.pdf` usa internamente outra paleta de revista — roxo `#42307d`, quase-preto `#231f20`, branco — que **nao** e a do tema; ver Secao 4.6.)

| Hex | Nome | Uso no tema |
|---|---|---|
| `#000000` | Preto | Texto de corpo (corpo de regras) |
| `#062936` | Verde-petroleo escuro | Borda de titulo de mapa |
| `#3f0f12` | Vinho escuro | Borda de nome de autores; intertitulo de capa; **titulo de capitulo**; imagens monocromaticas; **texturas de seda** (bordas, abertura de capitulo, manchas, banner de partes); moldura do selo |
| `#6f3c27` | Marrom-tijolo | **Rodape**; **titulos de tabela** |
| `#b02b2e` | Vermelho vivo | Texto de destaque/links; **boxes e faixas solidas**; disco interno do selo |
| `#f0dc82` | Dourado | Aspas de capitulo; **numero de pagina**; **titulo de box/quadro** |
| `#e8d1b5` | Bege claro | Fundo da logo; intertitulo de capa |
| `#727175` | Cinza | Label "tipo de magia" |
| `#ddd9d5` | Cinza-claro (zebra A) | Linha A de tabela zebrada |
| `#f6f6f6` | Off-white (zebra B / BG) | Linha B de tabela zebrada; **fundo geral** |
| `#ffffff` | Branco | Texto sobre fundos escuros |

---

## 4. Tipografia (familia → papel → tamanhos/cores/small-caps)

### 4.1 Familias do tema (do pacote InDesign do Modelo de RPG)

- **Tormenta20** — display: capa, titulos de capitulo, abertura de capitulo, selo.
- **Iowan Old Style** — serifada: titulos de secao (small-caps), titulos de tabela, citacoes. *(Na verdade Bitstream Iowan Old Style BT — ver Secao 7.)*
- **Source Sans Pro** — sans: corpo ~9 pt, legendas, linhas de ficha.
- **Minion Pro** — serifada auxiliar/fallback (consta no pacote do RPG).

### 4.2 Por elemento (Modelo de RPG — o que o tema imita)

| Elemento | Familia | Tamanho | Cor | Notas |
|---|---|---|---|---|
| **Titulo de capa** (titulo da obra) | Tormenta20 | display grande (a confirmar pt) | (a confirmar; provavelmente `#3f0f12`) | Em duas linhas: "Titulo / da Obra" |
| **Intertitulo de capa** | (display) | (a confirmar) | `#3f0f12` / `#e8d1b5` | Realce no nome dos autores `#3f0f12` |
| **Titulo de capitulo** | Tormenta20 | display (a confirmar pt) | `#3f0f12` | Tarja vermelha + selo (assets de abertura) |
| **Titulo de secao** | Iowan Old Style | small-caps (a confirmar pt) | `#3f0f12` | Abre a area de texto; serifado small-caps |
| **Subtitulo 1/2/3** | (a confirmar — provavelmente Iowan) | hierarquizados (a confirmar) | (a confirmar) | Subcabecalhos internos; faixa decorativa abaixo |
| **Titulo de tabela** | Iowan Old Style | (a confirmar pt) | `#6f3c27` | Acima da tabela |
| **Corpo de texto** | Source Sans Pro | **~9 pt** | `#000000` | A partir do 2o paragrafo: recuo de 1a linha |
| **Texto de abertura** (1o paragrafo de secao) | Source Sans Pro | ~9 pt | `#000000` | **Sem recuo**; primeiras palavras destacadas |
| **Box / quadro** | titulo dourado | (a confirmar) | titulo `#f0dc82` sobre fundo vermelho `#b02b2e` | "Titulo de Quadro" + "Texto de quadro" |
| **Linhas de ficha** (rotulos) | Source Sans Pro Bold (small-caps / SC700) | 1a letra ~12 pt + resto ~8 pt (versalete) | conforme fundo | Iniciativa, Defesa, Deslocamento, Ataque… |
| **Linhas de ficha** (valores) | Source Sans Pro Regular | ~12 pt | conforme fundo | Valores e corpo da linha |
| **Atributos** (For/Des/Con…) | Source Sans Pro Bold | ~12 pt | conforme fundo | — |
| **Numero de pagina** | (rodape) | (a confirmar pt) | `#f0dc82` | Sobre mancha vinho `#3f0f12` (asset "Numero de Pagina.png") |
| **Cabecalho/rodape corrente** | (a confirmar) | (a confirmar) | dourado/marrom | Verso: "n Iniciativa T20"; recto: "Titulo da Obra" |

### 4.3 Modelo de Literatura (1 coluna) — por elemento

| Elemento | Tratamento |
|---|---|
| **Titulo de capa** | CAIXA ALTA, display, 2 linhas (Tormenta20) |
| **Nome do autor** | CAIXA ALTA |
| **Rotulo de capitulo** | "CAPITULO N", caixa alta, centralizado |
| **Titulo do capitulo** | Display, caixa alta, 2 linhas, centralizado, cor `#3f0f12` |
| **1o paragrafo** | Primeiras palavras em **versalete/caixa alta**, **sem recuo** |
| **Paragrafos seguintes** | Com recuo de 1a linha, justificados, 1 coluna |
| **Numero de pagina** | Centralizado no rodape |

### 4.4 Convencoes de capitalizacao (terminologia T20)

- Nomes de **pericias** em MAIUSCULA; **especializacao** em minuscula — ex.: `Oficio (artesao)`.
- Nomes de **acoes** sempre em minuscula — ex.: "teste de Atletismo para natacao".
- **Categorias de tamanho** com inicial maiuscula (Minusculo, Pequeno, Medio…).
- Small-caps (versalete) em: titulos de secao (Iowan), rotulos de ficha (Source Sans Pro SC), abertura de paragrafo da literatura.

### 4.5 So existe 1 corte de Tormenta20 (Regular)
Bold/Italic de titulos display devem ser ajustados via tamanho/cor — **evitar faux bold** em fonte display.

### 4.6 Nota — tipografia do `Guia de Estilo.pdf` (NAO e a do tema)
Por ser pagina de revista, esse PDF usa **Aktiv Grotesk** (Cd/Regular/Black) para titulos, **Proxima Nova** para corpo e **Source Sans Pro** nas linhas de ficha; cores `#42307d` (roxo), `#231f20` (quase-preto), `#ffffff`. **Nao** aplicar ao tema; o tema segue a paleta/fontes da Secao 3 e 4.1.

---

## 5. Regras editoriais e de estilo

### 5.1 As 20 Regras para Autores de Tormenta (condensadas)

Contexto: "Guia de Estilo Tormenta20", publicado em 2 partes (regras 1–10 e 11–20) na coluna "Dicas de Mestre" da Dragao Brasil, assinado por "Paladino". Distingue 3 papeis (analogia Star Wars): **Pai** = criador original; **Filho** = autores (fieis, com responsabilidades); **Espirito Santo** = fas (liberdade total). Triade essencial: **Tormenta20** (a "biblia"), **Atlas de Arton**, **Ameacas de Arton**.

| # | Regra | Sintese | Impacto UI/tema |
|---|---|---|---|
| 1 | **O Basico** | Fidelidade absoluta ao livro basico + Atlas + Ameacas. Leitor deve reconhecer qual poder/magia esta em uso. | Indireto (consistencia terminologica) |
| 2 | **Mundo de Problemas** | "Um mundo de problemas"; estrutura de 3 atos (Apresentacao, Confrontacao, Resolucao); vitoria nao garantida. | Nenhum |
| 3 | **Os Herois** | Protagonistas absolutos; nem todos bondosos, mas salvam o mundo. | Nenhum |
| 4 | **Os Grupos** | Trabalho em equipe; grupo ideal 4–6 (trios na ficcao); ninguem e "melhor". | Nenhum |
| 5 | **Racas e Povos** | Nenhuma raca e naturalmente maligna; bem/mal sao escolhas; redencao sempre possivel. Supremacia Purista = viloes, ponto. | Nenhum |
| 6 | **Diversidade** | Sem restricao de genero/orientacao; casamentos do mesmo sexo abencoados; magia pode refletir genero. Excecoes mecanicas: minotauros (so machos); dahllan/medusas (so femeas); nagah; Lena (clerigas mulheres / paladinos homens). | Indireto (representacao sem assimetria) |
| 7 | **Ambientacao** | Descrever de forma grandiosa, superlativa, convincente; arquitetura colossal. A Tormenta = oposto de tudo ("antivida"). | Indireto (estetica grandiosa; contraste Arton/Tormenta) |
| 8 | **Cosmologia** | Arton nao e a Terra; universo "artoncentrico"; 2 continentes (Arton/Remnor e Lamnor); Tormenta vem de uma Anticriacao. | Nenhum |
| 9 | **Anacronismos** | Espada & feiticaria pouco acima da Idade Media; armas de fogo sao o limite (polvora de deuses malignos). Termos: "lagarto-trovao" (dinossauro), "golem/construto" (robo), "orbe" (planeta). Elementos modernos so em ilustracoes leves de humor, nunca em texto/protagonistas. | **Direto (moderado)** — evitar anacronismos visuais |
| 10 | **Perguntas e Misterios** | Autor fiel ao basico, mas deixa misterios/finais abertos; usar rumores ("dizem que…"); preferir opcoes a restricoes. Cronologia divisor-de-aguas so dos criadores. | Nenhum |
| 11 | **Violencia e Sexo** | Tormenta NAO e +18. Tortura/mutilacao citadas mas nao detalhadas; efeitos de armas exagerados para enfatizar o atacante, nao o sofrimento. Sexo: romance entre adultos ok; sem genitais; atos consensuais citados, nunca narrados; estupro = crime hediondo, jamais como motivacao. **Imagens:** sem mutilacao/sangue excessivo em capas; nudez total/genitais/sexo explicito PROIBIDOS; nudez parcial so breve (quadro de HQ), nunca capa; evitar "sensualidade burra" e assimetria gratuita entre herois. | **Direto (forte)** — curadoria de imagens, capas, nudez |
| 12 | **Identidade** | Raca e classe **imediata e visualmente reconheciveis** por vestes/equipamentos/maneirismos. "Se todos sao especiais, ninguem e." Reservar a estranheza para protagonistas. | **Direto** — identidade visual |
| 13 | **Nomes** | Ver pp. 108, 347, 350 do basico. Nunca referenciar pessoas reais/celebridades/personagens de outras obras; sem parodias/trocadilhos; checar pronunciabilidade e Google. Localidades com titulos (Valkaria, a Cidade sob a Deusa). | Nenhum |
| 14 | **Os Deuses** | Os 20 deuses sao centrais e onipresentes; nao todo-poderosos nem infaliveis; tratar como pessoas excentricas; agem via clerigos/paladinos/campeoes. | Nenhum |
| 15 | **A Tormenta** | Sempre vira o TEMA CENTRAL onde aparece; genero proprio = horror cosmico, jamais engracado; historias sem Tormenta sao validas mas devem ter sinais sutis; quando surge, permanece ate o fim. | Indireto (contraste visual) |
| 16 | **Claro e Breve** | Minimo de texto para o maximo de informacao (conto "A Mensagem", de Millor Fernandes — "OVOS"). Termos T20: "passar no teste", "lancar magia", "acessorio", "ficha". **REGRAS IMPORTANTES PRECISAM SER DESTACADAS visualmente** (box). Nao esconder regra em paragrafo. **Ficha de NPC/criatura no MENOR espaco possivel.** | **Direto (forte)** — box de "regra importante", fichas compactas |
| 17 | **Regras e Material de Campanha** | Sem distincao titulo-jogador vs titulo-mestre. Acessorio exige so o livro basico; novas regras no proprio acessorio (copiar-e-colar em vez de "consulte pagina X"); dependencia de outro acessorio avisada na **contracapa**. Proteger liberdade do jogador. | **Direto (moderado)** — autossuficiencia; aviso na contracapa |
| 18 | **Novatos e Veteranos** | Acessivel a novatos (repetir info necessaria) E agradavel a veteranos (easter eggs, NPCs queridos). Ao repetir, reescrever de outro modo. | Indireto |
| 19 | **O Passado e Passado** | Obras antigas violaram regras (ex.: mangá Holy Avenger nao cita a Tormenta — viola regra 15); seguem canonicas, mas nao validam violacoes. | Nenhum |
| 20 | **A Comunidade** | Primeiro dever do autor e com a comunidade; mas agradar nao e fazer tudo que pedem (Henry Ford: "um cavalo mais rapido"). Descobrir e surpreender. | Nenhum |

**Snippet citado no proprio leiaute (regra 16):** a frase **"Faca isto para destacar uma regra importante."** aparece dentro de um **box de destaque** — modelo direto do snippet de caixa de regra do tema.

### 5.2 Guia de Estilo (Rafael Dei Svaldi) — convencoes de redacao

**Tipografia/prosa:**
- **Italico** (em regras): so para itens magicos, encantos e nomes de magias; tambem nomes de obras (livros, filmes, jogos…); enfase pontual permitida se nao confundir com magia.
- **Meia-risca `–`** (nunca hifen `-`) para negativos: "Voce sofre –5". Atalho: Alt Gr + 0150. Tambem em intervalos: `pp. 22–25`.
- **Acoes** sempre minusculas.
- **Dinheiro (tibares):** `T$` + numeral COM espaco — certo: `T$ 100`, `T$ 3d10`; errado: `T$100`, `100T$`, `100 T$`.
- **Referencias:** fonte em italico + pagina, entre parenteses — "(*Tormenta20*, p. 328)". Abreviar "pagina"→"p."; varias→"pp. 22–25".
- **"Etc."** sempre com ponto, nunca antecedido por virgula.
- **Prosa de regras:** clara, concisa, coloquial — "Se passar em um teste" (nao "Se for bem-sucedido"); "O alvo fica caido" (nao "sob a condicao caido").

**Sujeitos (obrigatorio com regras):** **Personagem** (protagonistas), **Aliado** (amigas em geral), **Parceiro** (mecanicamente parceiros), **Inimigo** (oponentes). Sem regras, sinonimos livres.

**Testes/CD/resistencias:**
- Pericia em MAIUSCULA, especializacao minuscula; CD entre parenteses depois — "Atletismo (CD 15)"; alternativa "contra CD 25".
- Resistencias abreviadas: **Fort / Ref / Von** + CD + efeito — "Fort CD 20 evita; Ref CD 15 reduz a metade".
- Testes estendidos: "(CD 15), 3 sucessos"; com duracao e consequencias boas/ruins.
- Todo teste deve ter consequencia (oportunidade ou complicacao).

**Bonus e penalidades:**
- Geral: sem "em testes de" — "+5 em Furtividade".
- Especifico: com "em testes de" — "+10 em testes de Atletismo para nadar".
- Bonus antes de penalidades; nunca misturar. Cumulativo escrito expressamente.

**Fichas de ameacas:** nome completo na 1a vez, depois encurtado; "(ja contabilizado)" / "(ja incluso)"; magias copiadas de *Ameacas de Arton*; Equipamento (itens em uso) vs Tesouro (riqueza nao usada). Parceiros na ordem "tipo e nivel". Habilidades sempre passivas ou ativas (ativas indicam a acao, exceto livre/reacao).

### 5.3 Terminologia oficial T20 (glossario)

- **Abreviacoes:** `p.` · `pp.` · `CD` (classe de dificuldade) · `ND` (nivel de desafio) · `PM` (pontos de mana) · `Fort/Ref/Von` · `T$` (tibar) · `For/Des/Con/Int/Sab/Car` · `Xm (Xq)` (deslocamento m/quadrados) · `x2`,`x3` · `19/x3`, `20/x2` (margem/critico).
- **Atributos:** Forca, Destreza, Constituicao, Inteligencia, Sabedoria, Carisma.
- **Tipos de criatura:** Animal, Construto, Espirito, Humanoide, Monstro, Morto-vivo.
- **Tamanhos:** Minusculo, Pequeno, Medio, Grande, Enorme, Colossal.
- **Papeis de combate:** solo, lacaio, especial (+ bando).
- **Acoes:** Reacao, Livre, Movimento, Padrao, Completa.
- **Tipos de tesouro:** Nenhum, Metade, Padrao, Dobro, Triplo.
- **ND possiveis:** 1/4, 1/2, 1 a 20, S, S+.
- **Produtos (em italico):** *Tormenta20*, *Atlas de Arton*, *Ameacas de Arton*.

### 5.4 Modelo de ficha de criatura (campos 1–22, do Guia de Estilo)

**Cabecalho (1–7):** (1) nome — completo so na 1a vez; (2) ND; (3) tipo; (4) subtipo (humanoide = raca); (5) tamanho; (6) papel de combate (+ bando depois); (7) ataques (corpo a corpo antes de a distancia).
**Campos (8–22):** (8) nome do ataque (italico se magico; "Duas garras", "Espada curta x2"); (9) tipo de dano so se nao predefinido; (10) margem de ameaca so se ≠ 20/x2; (11) alcance; (12) habilidades em ordem alfabetica, depois "Magias", por fim fraquezas; (13) acoes (passivas nao mostram); (14) tipo de efeito (italico se nao evidente); (15) recarga (italico); (16) "Magias" sempre penultima (so antes de fraquezas); (17) classe de conjurador ("conjurador arcano/divino" se nenhuma); (18) limite de PM so se ≠ ND; (19) magias em ordem alfabetica; (20) itens em ordem alfabetica com multiplicador; (21) tesouro (CD extrair = 15 + ND); (22) familiar/parceiro no fim.

---

## 6. Inventario de assets graficos

> Pasta: `Projeto Gráfico Homebrew T20\Imagens\` · 19 PNG. Paleta dos assets: vermelho vivo `#b02b2e` (boxes/faixas solidas), vinho `#3f0f12` (texturas de seda/manchas), off-white `#f6f6f6` (BG), dourado `#f0dc82`/branco (rotulos/numero). Quase todas as pecas tem **bordas serrilhadas/rasgadas** → favorecem `border-image`. Pares espelhados por paridade de pagina.

| Arquivo | Dimensoes (px) | Papel | Aplicacao CSS |
|---|---|---|---|
| **Borda Esquerda.png** | 117 × 3248 | Moldura lateral externa esquerda (dentes na borda interna/direita) | `background:no-repeat left top / auto 100%` na `.page`, ou `.page::before` colado em `left:0` |
| **Borda Direita.png** | 117 × 3248 | Moldura lateral externa direita (espelhada) | `.page::after` colado em `right:0`; alternar com `:nth-of-type(even/odd)` |
| **Background.png** | 581 × 780 (~3:4) | Fundo geral de paginas de conteudo (off-white) | `background-image` da `.page`, `background-size:cover`, opacidade 75% |
| **Box Vermelho peq.png** | 922 × 852 | Caixa de destaque/sidebar pequena | `background-image`/`border-image` de `.note`; classe `.box-peq` |
| **Box Vermelho med.png** | 923 × 1419 | Caixa de destaque media | classe `.box-med` |
| **Box Vermelho gde.png** | 922 × 2954 | Caixa de destaque grande (sidebar longa) | classe `.box-gde` |
| **Box Vermelho Completo.png** | 1158 × 3248 | Box full-height (coluna/pagina inteira) | container full-page ou `.page` |
| **Box Vermelho Horizontal peq.png** | 2421 × 639 | Faixa/box horizontal full-width | `background-size:100% 100%` ou `border-image`; `.box-h-peq` |
| **Box Vermelho Horizontal gde.png** | 2421 × 1082 | Faixa/box horizontal grande | `.box-h-gde` |
| **Abertura de Capítulo pg1.png** | 274 × 2097 | Ornamento vertical da pagina de abertura de capitulo (rotulo "CAPITULO" + selo p/ numero) | `background` a esquerda na 1a pagina do capitulo, ou `h1::before` |
| **Abertura de Capítulo pg2.png** | 2125 × 351 | Tarja horizontal do titulo de capitulo (full-width, topo) | `h1::before` / `background` full-width no topo |
| **Título de Partes de Capítulos.png** | 957 × 137 | Fundo do titulo de PARTES/secoes (banner seda com pontas seta/losango) | `background:no-repeat center` atras de `h2/h3`; texto em Iowan small-caps por cima |
| **Abertura e Fechamento de Tabela.png** | 922 × 41 | Regua sup./inf. de tabela (largura de 1 coluna) | `border-image-source` no `<table>` (top/bottom) ou `table::before/::after` |
| **Abertura e Fechamento de Tabela gde.png** | 1916 × 33 | Regua de tabela larga (largura total) | idem, variante full-width |
| **Divisor Vermelho Capa.png** | 579 × 25 | Separador decorativo da capa (entre titulo e autores) | `h1::after` da capa ou `<hr>` com `background-image`, centralizado |
| **Faixa Embaixo de Intertítulo.png** | 920 × 14 | Sublinhado abaixo de intertitulos (h2/h3) | `h2::after`/`h3::after` (`border-bottom` via `border-image`) |
| **Número de Página.png** | 184 × 185 | Fundo (mancha/selo vinho) do numero de pagina | `background` do `.pageNumber` (`no-repeat center`, ~30–40 px); digito dourado por cima |
| **Rodapé Esquerdo.png** | 2184 × 181 | Ornamento de rodape (mancha na esquerda/lombada) | `background:bottom left` no rodape; `:nth-of-type` correspondente |
| **Rodapé Direito.png** | 2185 × 181 | Ornamento de rodape espelhado (mancha na direita) | `background:bottom right`; paridade oposta |

**Recomendacoes:** bordas e rodapes sao pares espelhados → use `:nth-of-type(even/odd)` para manter a mancha sempre na margem interna; pecas serrilhadas finas → `border-image` (slice/stretch) escala melhor que background esticado; boxes vem em escada (peq/med/gde + horizontais + completo) → classes utilitarias e/ou `border-image` fluido.

---

## 7. Inventario de fontes

> As 3 familias do tema estao em `Projeto Gráfico Homebrew T20\Fontes\`. TTF/OTF servem direto em `@font-face`; recomenda-se converter para **WOFF2** em producao.

### 7.1 Fontes do tema (embutir no tema)

| Familia | Arquivos (pasta Homebrew) | Cortes | Papel | Licenca |
|---|---|---|---|---|
| **Tormenta20** | `Tormenta20.ttf` (19,5 KB) | so Regular | Titulos display, capa, titulos de capitulo, selo | **Proprietaria Jambo.** Sem licenca de redistribuicao/embed conhecida. **Risco alto.** |
| **Iowan Old Style** (na verdade **Bitstream Iowan Old Style BT**) | `Iowan Old Style Regular.ttf`, `…Bold.otf`, `…Italic.ttf`, `…Bold Italic.ttf` | Regular, Bold, Italic, Bold Italic | Serifada: small-caps de secao, titulos de tabela, citacoes | **Comercial (Bitstream/Monotype).** Sem direito de redistribuicao web. **Risco alto.** |
| **Source Sans Pro** | `Source Sans Pro Regular.ttf`, `…Bold.ttf`, `…Italic.ttf` (sem Bold Italic) | Regular, Bold, Italic | Sans: corpo 9 pt, legendas, linhas de ficha | **OFL 1.1 (Adobe) — open.** Unica livre para embed. Disponivel tambem como "Source Sans 3" (Google/Adobe Fonts). |

**Observacoes:**
- `Tormenta20x.ttf` (27 KB) e variante usada nos modelos InDesign/Word — para o tema usar `Tormenta20.ttf` da pasta Homebrew.
- A Iowan dos arquivos da pasta Homebrew e a **Bitstream BT** (PostScript `IowanOldStyleBT-*`), nao a da Apple. A versao Apple (`Iowan Old Style.ttc`) so aparece nos modelos e nao e usavel direto em `@font-face` (precisa extrair face).
- Para producao, OTF/TTF → WOFF2 (`format('woff2')`), com fallback `truetype`/`opentype`.

### 7.2 Fontes que NAO entram no tema (so dos modelos InDesign/Word)

| Familia | Arquivos | Onde | Licenca |
|---|---|---|---|
| Dante MT Std | `DanteMTStd-*.otf` (6 cortes) | Word; Literatura | Monotype, comercial |
| Minion Pro | `MinionPro-Regular.otf` | RPG (fallback serif) | Adobe, comercial |
| Raizen | `Raizen.otf` | Word; Literatura | (a confirmar) |
| Becker | `BeckerMedium.ttf` | Literatura | (a confirmar) |
| Spiral Initials | `Spiral Initials.ttf` (capitulares) | Word | (a confirmar) |
| Benguiat | `Benguiat (Fonte da DB).ttf` | **solta na pasta Homebrew/Fontes** | ITC/comercial — **fonte do logo Dragao Brasil, NAO e do tema** |
| Iowan (Apple real) | `Iowan Old Style.ttc` (7 faces) | Word; RPG | Apple/comercial |
| Source Sans Pro (OTF maior) | `SourceSansPro-Regular/-Bold.otf` (235 KB) | Word; RPG | OFL 1.1 |

> `AdobeFnt22.lst` (pasta RPG) e cache de indice do InDesign, nao e fonte.

### 7.3 Resumo de licenciamento para deploy
Para deploy web publico, **apenas Source Sans Pro** pode ser servida com seguranca. **Tormenta20** (Jambo) e **Iowan/Bitstream** exigem autorizacao do detentor **ou** substituicao por equivalentes de licenca aberta. O disclaimer fa-nao-oficial mitiga uso, mas **nao concede licenca de embed** das fontes proprietarias.

---

## 8. Selo da Iniciativa T20 e exigencia legal

### 8.1 O Selo

Pasta `Selo\` — 5 versoes. Emblema circular tipo **bussola/rosa-dos-ventos** (4 pontas N/S/L/O); texto "INICIATIVA" no topo + "T20" grande embaixo, onde o **"0" e um d20 estilizado**; uma **pena/lanca vertical** cruza o disco. Lettering em estilo Tormenta20.

| Arquivo | Tipo | Formato | Tamanho | Uso |
|---|---|---|---|---|
| `Iniciativa T20 - Selo (Cor).png` | Raster | 1843×1843, 96 dpi, 32bpp ARGB (transparente) | 248,7 KB | **Web/tela/PDF digital** (padrao). Moldura vinho `#3f0f12`, disco `#b02b2e`, lettering `#ffffff` |
| `Iniciativa T20 - Selo (PB).png` | Raster | 1843×1843, 32bpp ARGB | 410,6 KB | Impressao P&B ou sobre fundos vermelhos. Moldura `#000000`, disco cinza, lettering branco |
| `Iniciativa T20 - Selo.pdf` | Vetor | escalavel | 1070,4 KB | Impressao/documentos |
| `Iniciativa T20 - Selo.ai` | Vetor | Illustrator (editavel) | 2102,2 KB | Master editavel |
| `Iniciativa T20 - Selo.eps` | Vetor | EPS | 2251,6 KB | Pre-impressao |

### 8.2 Exigencia legal — disclaimer obrigatorio (na integra)

**Disclaimer legal (forma longa, obrigatoria no FIM do documento):**

> *"Este conteudo e um material gratuito nao-oficial, feito por fas, sem aprovacao ou orientacao da Jambo Editora, e sem fins lucrativos. Parte do material utilizado e propriedade da Jambo Editora."*

**Forma curta (capa/primeira pagina), do Manual:**

> *"Conteudo publicado pela Iniciativa T20. Nao oficial e nao canonico"*

**Aviso de spoiler (quando aplicavel, capa/primeira pagina):**

> *"ATENCAO! Inclui spoilers de Nome da obra"*

### 8.3 Regras de uso do selo
- O Selo deve aparecer na **capa ou primeira pagina** (Manual: "Voce DEVE"); se um dos modelos de diagramacao for usado, **selo + frase ja vem prontos**.
- **Onde houver disclaimer, deve haver Selo (e vice-versa).** Posicoes recomendadas: contracapa/ultima pagina (com o disclaimer); rodape de creditos; folha de rosto. Ideal: um **snippet/partial unico** que junte Selo + disclaimer no fim de cada documento.
- PNG Cor para web; PNG PB para fundos vermelhos/impressao P&B; vetores para alta qualidade. Por ter fundo transparente, assenta direto sobre o BG `#f6f6f6`.

---

## 9. Anatomia do layout (RPG 2-colunas vs Literatura)

| Aspecto | **RPG (regras)** — o tema imita | **Literatura (romance)** |
|---|---|---|
| Grid | **2 colunas** com calha | **1 coluna** corrida |
| Densidade | Alta (referencia) | Baixa (leitura linear) |
| Titulos | Titulo de secao + Subtitulo 1/2/3 | Abertura de capitulo cerimonial |
| Tabelas/Boxes | Sim (tabela zebrada + quadro) | Nao |
| Listas | Niveis 1 e 2 | Nao demonstradas |
| Cabecalho/rodape | Espelhado: "Titulo da Obra" (recto) / "n Iniciativa T20" (verso); numero dourado | So numero de pagina centralizado |
| Abertura | Texto de abertura sem recuo + primeiras palavras destacadas | "CAPITULO N" + titulo display + 1o paragrafo em versalete sem recuo; verso em branco antes |

**Modelo de RPG (3 paginas):** p1 capa (titulo display 2 linhas + nome do autor `#3f0f12` + bloco de credito) · p2 corpo em 2 colunas (hierarquia: Titulo de secao → Estilo de texto de abertura → Estilo de corpo de texto → Subtitulo 1/2/3 → Lista nivel 1/2) · p3 box/quadro (aside, titulo dourado) + tabela (titulo `#6f3c27`, `<thead>` `Cabecalho|Cabecalho`, corpo 2 colunas, **zebra `#ddd9d5`/`#f6f6f6`**). Cabecalho/rodape espelhados verso×recto; numero de pagina dourado `#f0dc82`.

**Modelo de Literatura (5 paginas):** p1 capa (caixa alta) · p2 verso em branco (capitulo abre em recto/impar) · p3 abertura de capitulo ("CAPITULO 1" centralizado + titulo display caixa alta + 1o paragrafo em versalete sem recuo + demais com recuo, justificados, 1 coluna) · p4–p5 continuacao (so numero de pagina centralizado).

---

## 10. Mapa de implementacao no Homebrewery

> Estado atual: **nao existe** nenhum tema "Iniciativa T20"/"Tormenta20" no repo (busca por less/css/scss e por "iniciativa/tormenta/jambo" nao retornou tema). O caminho abaixo segue a convencao do Homebrewery V3 (tema novo herdando de `Blank`). **(Caminhos de codigo a confirmar contra a estrutura real do repo Homebrewery — `themes/V3/`, `themes/themes.json`, `snippets/`.)**

### 10.1 Novo tema `themes/V3/Tormenta20/`

| Peca do kit | Onde entra no codigo |
|---|---|
| **Pagina 205×275mm, margens espelhadas, BG 75%** | `style.less`: `.page{width:205mm;height:275mm}` + padding espelhado via `:nth-child(even/odd)` (interna 25 / externa 18 / topo 20 / base 24 mm); `Background.png` em `background-size:cover` com opacity .75 |
| **Grid 2 colunas** | `style.less`: `.page{column-count:2; column-gap:…}` (imita Modelo de RPG) |
| **Paleta (Secao 3)** | `style.less`: variaveis LESS (`@cor-titulo:#3f0f12; @cor-tabela:#6f3c27; @vermelho:#b02b2e; @dourado:#f0dc82; @bg:#f6f6f6; @zebraA:#ddd9d5; @zebraB:#f6f6f6;` etc.) |
| **Fontes** | `style.less`: blocos `@font-face` para Tormenta20, Iowan Old Style (4 cortes), Source Sans Pro (3 cortes); arquivos em `themes/V3/Tormenta20/fonts/` (WOFF2). **Ver riscos de licenca abaixo.** |
| **Tipografia por elemento (Secao 4)** | `style.less`: `h1` (Tormenta20 display), titulos de secao Iowan small-caps `#3f0f12`, subtitulos, corpo Source Sans Pro 9pt `#000`, abertura sem `text-indent`, demais com `text-indent` |
| **Bordas/rodapes/numero de pagina (assets)** | `style.less`: `.page::before/::after` (Borda Esquerda/Direita), rodape com Rodape Esquerdo/Direito por paridade, `.pageNumber` com Numero de Pagina.png e digito dourado; cabecalho recto "Titulo da Obra" / verso "n Iniciativa T20" |
| **Tabelas zebradas** | `style.less`: `table` com `<thead>` `#6f3c27`, linhas `:nth-child(even/odd)` `#ddd9d5`/`#f6f6f6`, `border-image` das reguas (Abertura e Fechamento de Tabela) |
| **Box/quadro** | `style.less`: `.note` / classe custom com `border-image` dos Box Vermelho* e titulo dourado `#f0dc82` |
| **Assets PNG** | `themes/V3/Tormenta20/assets/` (os 19 PNG); referenciados por `url(...)` no `style.less` |
| **`settings.json`** | herdar de **Blank** (`"baseTheme":"Blank"` ou equivalente); nome "Tormenta20 / Iniciativa T20", renderer V3. **(formato exato a confirmar no repo)** |
| **Registro** | adicionar entrada do tema em `themes/V3/themes.json` (ou `themes/themes.json`) — id, nome, baseTheme, path. **(arquivo exato a confirmar)** |

### 10.2 Snippets T20 (`snippets/*.gen.js`)

Criar snippets que inserem markdown/HTML estilizado pelo tema. **(Mecanismo exato de registro de snippets a confirmar no repo — provavelmente um modulo em `snippets/` agregado por renderer.)**

| Snippet | Produz | Base no kit |
|---|---|---|
| **capa** | Titulo display + autor `#3f0f12` + bloco de credito "Conteudo publicado pela Iniciativa T20. Nao oficial e nao canonico" + Divisor Vermelho Capa | Capa do Modelo de RPG |
| **capitulo** | Tarja de capitulo (Abertura de Capitulo pg1/pg2) + titulo Tormenta20 + selo p/ numero | Abertura de capitulo |
| **box/quadro (regra importante)** | Aside vermelho com titulo dourado — modelo da frase "Faca isto para destacar uma regra importante." (regra 16) | Box do Modelo de RPG + regra 16 |
| **ficha (criatura/ameaca)** | Bloco compacto com campos 1–22 (Secao 5.4), rotulos small-caps Source Sans Pro SC, atributos For/Des/… | Modelo de ficha do Guia de Estilo + regra 16 (menor espaco) |
| **magia** | Bloco de magia com label "tipo de magia" `#727175`, nome em italico, CD/Fort/Ref/Von | Convencoes do Guia de Estilo |
| **poder** | Bloco de poder/habilidade (passiva/ativa, acao de ativacao) | Habilidades passivas vs ativas |
| **ameaca** | Variante da ficha com Equipamento/Tesouro/Parceiro | Fichas de ameacas |
| **tabela T20** | Tabela com reguas serrilhadas e zebra | Tabela do Modelo de RPG |
| **creditos/selo** | Partial unico: Selo (Cor PNG) + disclaimer longo no fim do doc | Selo + disclaimer (Secao 8) |

### 10.3 Traducao da UI PT-BR
- Localizar os textos da UI do editor para PT-BR (menus, snippets, tooltips, mensagens). **(Mecanismo de i18n do Homebrewery a confirmar — se ha arquivos de string ou textos hard-coded.)**
- Nomes de snippets e rotulos no menu de snippets em PT-BR coerentes com a terminologia T20 (Secao 5.3): "magia", "poder", "ficha", "ameaca", "box", "capa", "capitulo".

### 10.4 Riscos / duvidas em aberto (licenca de fontes, copyright Jambo)
- **Fontes proprietarias (RISCO ALTO):** **Tormenta20** (Jambo, sem licenca de embed conhecida) e **Iowan/Bitstream BT** (comercial) **nao podem ser embutidas em deploy publico**. Opcoes: (a) obter autorizacao da Jambo/detentor; (b) substituir por equivalentes de licenca aberta (display alternativo p/ Tormenta20; serifada old-style aberta p/ Iowan); (c) restringir o tema a uso local/privado. **Source Sans Pro** (OFL) e a unica segura.
- **Copyright Jambo / Tormenta:** o tema replica identidade visual de produto comercial. Mesmo com o disclaimer "fa, nao-oficial, sem fins lucrativos", o uso publico do **selo**, da **fonte Tormenta20** e dos **assets graficos** pode exigir alinhamento com a Jambo. O disclaimer mitiga, mas **nao concede** licenca de embed/redistribuicao.
- **Assets PNG:** verificar se os 19 PNG do Projeto Grafico podem ser redistribuidos publicamente no tema (presumidamente sim, por serem do proprio kit oferecido aos autores — **a confirmar**).
- **Estrutura real do repo:** confirmar nomes/locais de `themes/V3/`, `themes.json`, `snippets/*.gen.js`, `settings.json` e o mecanismo de heranca a partir de `Blank` antes de implementar.

---

## 11. Questoes em aberto / decisoes pendentes para o usuario

1. **Licenca das fontes proprietarias:** embutir Tormenta20 e Iowan/Bitstream assim mesmo (uso privado), buscar autorizacao da Jambo, ou substituir por alternativas abertas? (Decisao bloqueia o deploy publico.)
2. **Escopo do tema:** so o **Modelo de RPG** (2 colunas) ou tambem um modo **Literatura** (1 coluna)? O documento recomenda comecar pelo RPG.
3. **Selo no deploy publico:** incluir o selo `#b02b2e`/`#3f0f12` no tema por padrao, dado que e marca da Jambo? Manter como snippet opcional de creditos?
4. **Especificacoes a confirmar:** tamanhos em pt exatos de titulos de capa/capitulo/secao/subtitulos e do numero de pagina (nao extraidos dos modelos InDesign); cor exata de subtitulos; familia dos Subtitulo 1/2/3.
5. **Tradução da UI:** traduzir toda a UI do Homebrewery para PT-BR ou apenas os snippets/menus do tema T20? Existe i18n no projeto ou os textos sao hard-coded?
6. **Renderer:** confirmar que o tema sera V3 e herdara de `Blank` (vs Legacy V2).
7. **Conversao de assets:** converter os 19 PNG e as fontes para formatos web otimizados (WOFF2; PNG → manter ou otimizar)? Usar `border-image` (recomendado p/ serrilhados) vs background esticado.
8. **Disclaimer e obrigacoes de capa:** automatizar a insercao do selo + frase curta na capa e do disclaimer longo no fim (via snippet/partial), garantindo conformidade com o Manual?
9. **Estrutura do repo:** validar caminhos de `themes/`, `themes.json` e `snippets/` reais antes de gerar codigo (marcados "a confirmar" na Secao 10).
