# Iniciativa T20 — Fase 0 + Tema Visual (Frente A) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir o Homebrewery localmente e criar o tema `themes/V3/Tormenta20/` (base `Blank`) que reproduz o Modelo de RPG de Tormenta 20 (2 colunas, 205×275mm, paleta/fontes/assets do kit), aparecendo e renderizando no editor.

**Architecture:** Tema V3 novo herdando de `Blank`. O servidor concatena o CSS Blank→Tormenta20 (cascata). Tudo é LESS compilado no build do Vite para `build/themes/V3/Tormenta20/style.css` e injetado no iframe de preview. Fontes em `themes/fonts/Tormenta20/` (WOFF2), imagens em `themes/assets/tormenta20/`.

**Tech Stack:** Node ≥20.18 <25, Vite 7, LESS, React 19, MongoDB (só boot/save), CodeMirror. Fontes: Tormenta20 / Iowan Old Style / Source Sans Pro. fontTools (conversão WOFF2).

**Documentos-base:** [`docs/kit-t20-estudo.md`](../../kit-t20-estudo.md) · [`docs/homebrewery-arquitetura-t20.md`](../../homebrewery-arquitetura-t20.md) · [`spec`](../specs/2026-06-16-iniciativa-t20-design.md).

**Escopo deste plano:** Fase 0 (infra+esqueleto) + Frente A (tema visual). Frentes B (snippets), C (UI PT-BR) e Deploy são planos separados.

**Convenção de verificação:** CSS não tem teste unitário. Para cada tarefa visual, "verificar" = (1) `npm run build` compila sem erro **e** (2) checagem visual no preview (`http://localhost:8000`). O build inteiro QUEBRA se o `style.less` tiver erro de LESS ou se faltar `dropdownTexture.png`/`dropdownPreview.png`.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `themes/V3/Tormenta20/settings.json` | Metadados do tema (baseTheme Blank) |
| `themes/V3/Tormenta20/style.less` | CSS-fonte da pele T20 (importa fonts+assets+componentes) |
| `themes/V3/Tormenta20/snippets.js` | Manifesto de snippets (vazio nesta fase) |
| `themes/V3/Tormenta20/dropdownTexture.png` | Miniatura no dropdown (obrigatório) |
| `themes/V3/Tormenta20/dropdownPreview.png` | Preview no dropdown (obrigatório) |
| `themes/fonts/Tormenta20/fonts.less` | `@font-face` das 3 famílias |
| `themes/fonts/Tormenta20/*.woff2` | Fontes convertidas |
| `themes/assets/tormenta20/*.png` | 19 assets do kit (kebab-case) |
| `themes/assets/tormenta20/tormenta20-assets.less` | Variáveis LESS dos assets |

---

## Fase 0 — Infra e esqueleto

### Task 1: Subir o app localmente (baseline)

**Files:** nenhum (ambiente).

- [ ] **Step 1: Instalar dependências**

Run (na raiz do repo):
```bash
npm install
```
Expected: instala e roda `postinstall`→`npm run build` (gera `build/`). Pode demorar. Sem erro fatal no fim.

- [ ] **Step 2: Subir MongoDB de dev (Docker)**

Run:
```bash
docker run --name hb-mongo -d -p 27017:27017 -v hbdata:/data/db mongo:latest
```
Expected: container `hb-mongo` rodando (`docker ps` mostra). Se não tiver Docker, instalar MongoDB Community e rodar `mongod`.

- [ ] **Step 3: Subir o app em modo dev**

Run (PowerShell):
```powershell
$env:NODE_ENV="local"; npm start
```
Expected: console mostra `Mongo connected!` e servidor em `http://localhost:8000`.

- [ ] **Step 4: Validar baseline no navegador**

Abrir `http://localhost:8000/new`. Expected: editor abre, preview renderiza com tema **5e PHB** (dropdown de tema em Propriedades lista 5e PHB, 5e DMG, Blank, Journal, UnearthedArcana). Isso confirma o pipeline antes de mexer.

---

### Task 2: Esqueleto do tema Tormenta20 (aparece no dropdown)

**Files:**
- Create: `themes/V3/Tormenta20/settings.json`
- Create: `themes/V3/Tormenta20/style.less`
- Create: `themes/V3/Tormenta20/snippets.js`
- Create: `themes/V3/Tormenta20/dropdownTexture.png` (cópia provisória do Blank)
- Create: `themes/V3/Tormenta20/dropdownPreview.png` (cópia provisória do Blank)

- [ ] **Step 1: Criar `settings.json`**

```json
{
  "name": "Tormenta 20",
  "renderer": "V3",
  "baseTheme": "Blank",
  "baseSnippets": false
}
```
(Não incluir `path` — o build injeta.)

- [ ] **Step 2: Criar `style.less` mínimo**

```less
// Tema Iniciativa T20 — Modelo de RPG (Tormenta 20)
// Material não-oficial de fã. Identidade visual © Jambô Editora.
@import (less) './themes/assets/assets.less';

:root {
	--HB_Color_Background : #f6f6f6; // BG geral T20
}
```

- [ ] **Step 3: Criar `snippets.js` vazio**

```js
export default [];
```

- [ ] **Step 4: Copiar PNGs provisórios do Blank (obrigatórios p/ o build não quebrar)**

Run (PowerShell):
```powershell
Copy-Item themes/V3/Blank/dropdownTexture.png themes/V3/Tormenta20/dropdownTexture.png
Copy-Item themes/V3/Blank/dropdownPreview.png themes/V3/Tormenta20/dropdownPreview.png
```

- [ ] **Step 5: Rebuild e verificar registro**

Run:
```bash
npm run build
```
Expected: build sem erro. Conferir que `themes/themes.json` agora tem a entrada `"Tormenta20"` em `V3` com `"baseTheme":"Blank"` e `"path":"Tormenta20"`.

- [ ] **Step 6: Verificar no editor**

Reiniciar `npm start`, abrir `/new` → Propriedades → dropdown de tema. Expected: **"Tormenta 20"** aparece na lista; selecioná-lo renderiza o brew (fundo `#f6f6f6`, layout do Blank) sem quebrar.

- [ ] **Step 7: Commit**

```bash
git add themes/V3/Tormenta20 themes/themes.json
git commit -m "feat(theme): esqueleto do tema Tormenta20 (base Blank)"
```

---

## Frente A — Tema visual

### Task 3: Fontes T20 (conversão WOFF2 + @font-face)

**Files:**
- Create: `themes/fonts/Tormenta20/*.woff2` (8 arquivos)
- Create: `themes/fonts/Tormenta20/fonts.less`
- Modify: `themes/V3/Tormenta20/style.less` (adicionar import das fontes)

- [ ] **Step 1: Converter as fontes do kit para WOFF2**

O pipeline não converte fontes. Converter com fontTools.

Run:
```bash
pip install fonttools brotli
```

Criar `scripts/convert-fonts-t20.py`:
```python
from fontTools.ttLib import TTFont
import os

KIT = r"Kit da Iniciativa T20/Projeto Gráfico Homebrew T20/Fontes"
OUT = "themes/fonts/Tormenta20"
os.makedirs(OUT, exist_ok=True)

MAP = {
    "Tormenta20.ttf":                 "Tormenta20.woff2",
    "Iowan Old Style Regular.ttf":    "IowanOldStyle-Regular.woff2",
    "Iowan Old Style Bold.otf":       "IowanOldStyle-Bold.woff2",
    "Iowan Old Style Italic.ttf":     "IowanOldStyle-Italic.woff2",
    "Iowan Old Style Bold Italic.ttf":"IowanOldStyle-BoldItalic.woff2",
    "Source Sans Pro Regular.ttf":    "SourceSansPro-Regular.woff2",
    "Source Sans Pro Bold.ttf":       "SourceSansPro-Bold.woff2",
    "Source Sans Pro Italic.ttf":     "SourceSansPro-Italic.woff2",
}
for src, dst in MAP.items():
    f = TTFont(os.path.join(KIT, src))
    f.flavor = "woff2"
    f.save(os.path.join(OUT, dst))
    print("ok:", dst)
```

Run:
```bash
python scripts/convert-fonts-t20.py
```
Expected: 8 linhas `ok: ...` e 8 `.woff2` em `themes/fonts/Tormenta20/`.

- [ ] **Step 2: Criar `themes/fonts/Tormenta20/fonts.less`**

```less
/* Tormenta20 — display (capa, títulos de capítulo, nº de página, selo) */
@font-face {
	font-family : "Tormenta20";
	font-style  : normal;
	font-weight : normal;
	src         : url('../../../fonts/Tormenta20/Tormenta20.woff2');
}

/* Iowan Old Style — serifada (seções small-caps, títulos de tabela, citações) */
@font-face {
	font-family : "IowanOldStyle";
	font-style  : normal;
	font-weight : normal;
	src         : url('../../../fonts/Tormenta20/IowanOldStyle-Regular.woff2');
}
@font-face {
	font-family : "IowanOldStyle";
	font-style  : normal;
	font-weight : bold;
	src         : url('../../../fonts/Tormenta20/IowanOldStyle-Bold.woff2');
}
@font-face {
	font-family : "IowanOldStyle";
	font-style  : italic;
	font-weight : normal;
	src         : url('../../../fonts/Tormenta20/IowanOldStyle-Italic.woff2');
}
@font-face {
	font-family : "IowanOldStyle";
	font-style  : italic;
	font-weight : bold;
	src         : url('../../../fonts/Tormenta20/IowanOldStyle-BoldItalic.woff2');
}

/* Source Sans Pro — sans (corpo 9pt, legendas, fichas) */
@font-face {
	font-family : "SourceSansPro";
	font-style  : normal;
	font-weight : normal;
	src         : url('../../../fonts/Tormenta20/SourceSansPro-Regular.woff2');
}
@font-face {
	font-family : "SourceSansPro";
	font-style  : normal;
	font-weight : bold;
	src         : url('../../../fonts/Tormenta20/SourceSansPro-Bold.woff2');
}
@font-face {
	font-family : "SourceSansPro";
	font-style  : italic;
	font-weight : normal;
	src         : url('../../../fonts/Tormenta20/SourceSansPro-Italic.woff2');
}
```

- [ ] **Step 3: Importar as fontes no `style.less`**

No topo de `themes/V3/Tormenta20/style.less`, logo após o import de assets:
```less
@import (less) './themes/assets/assets.less';
@import (less) './themes/fonts/Tormenta20/fonts.less';
```

- [ ] **Step 4: Build + verificação**

Run: `npm run build`
Expected: compila sem erro; `build/fonts/Tormenta20/` tem os 8 `.woff2`. (Aplicação visual das fontes vem nas tarefas de tipografia.)

- [ ] **Step 5: Commit**

```bash
git add scripts/convert-fonts-t20.py themes/fonts/Tormenta20 themes/V3/Tormenta20/style.less
git commit -m "feat(theme): fontes T20 (WOFF2 + @font-face)"
```

---

### Task 4: Assets gráficos (19 PNG + variáveis LESS)

**Files:**
- Create: `themes/assets/tormenta20/*.png` (19 arquivos, kebab-case)
- Create: `themes/assets/tormenta20/tormenta20-assets.less`
- Modify: `themes/V3/Tormenta20/style.less` (importar variáveis de asset)

- [ ] **Step 1: Copiar e renomear os 19 PNG (kebab-case ASCII)**

Criar `scripts/copy-assets-t20.ps1`:
```powershell
$src = "Kit da Iniciativa T20/Projeto Gráfico Homebrew T20/Imagens"
$dst = "themes/assets/tormenta20"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
$map = @{
  "Borda Esquerda.png"                       = "borda-esquerda.png"
  "Borda Direita.png"                        = "borda-direita.png"
  "Background.png"                            = "background.png"
  "Box Vermelho peq.png"                     = "box-vermelho-peq.png"
  "Box Vermelho med.png"                     = "box-vermelho-med.png"
  "Box Vermelho gde.png"                     = "box-vermelho-gde.png"
  "Box Vermelho Completo.png"                = "box-vermelho-completo.png"
  "Box Vermelho Horizontal peq.png"          = "box-h-peq.png"
  "Box Vermelho Horizontal gde.png"          = "box-h-gde.png"
  "Abertura de Capítulo pg1.png"             = "abertura-capitulo-1.png"
  "Abertura de Capítulo pg2.png"             = "abertura-capitulo-2.png"
  "Título de Partes de Capítulos.png"        = "titulo-partes.png"
  "Abertura e Fechamento de Tabela.png"      = "regua-tabela.png"
  "Abertura e Fechamento de Tabela gde.png"  = "regua-tabela-gde.png"
  "Divisor Vermelho Capa.png"                = "divisor-capa.png"
  "Faixa Embaixo de Intertítulo.png"         = "faixa-intertitulo.png"
  "Número de Página.png"                     = "numero-pagina.png"
  "Rodapé Esquerdo.png"                      = "rodape-esquerdo.png"
  "Rodapé Direito.png"                       = "rodape-direito.png"
}
foreach ($k in $map.Keys) { Copy-Item (Join-Path $src $k) (Join-Path $dst $map[$k]) }
Write-Output "copiados: $($map.Count)"
```

Run:
```powershell
pwsh scripts/copy-assets-t20.ps1
```
Expected: `copiados: 19` e 19 PNG em `themes/assets/tormenta20/`.

- [ ] **Step 2: Criar `themes/assets/tormenta20/tormenta20-assets.less`**

```less
// Assets gráficos do Kit da Iniciativa T20 (servidos em /assets/tormenta20/)
@t20-background        : url('/assets/tormenta20/background.png');
@t20-borda-esquerda    : url('/assets/tormenta20/borda-esquerda.png');
@t20-borda-direita     : url('/assets/tormenta20/borda-direita.png');
@t20-box-peq           : url('/assets/tormenta20/box-vermelho-peq.png');
@t20-box-med           : url('/assets/tormenta20/box-vermelho-med.png');
@t20-box-gde           : url('/assets/tormenta20/box-vermelho-gde.png');
@t20-box-completo      : url('/assets/tormenta20/box-vermelho-completo.png');
@t20-box-h-peq         : url('/assets/tormenta20/box-h-peq.png');
@t20-box-h-gde         : url('/assets/tormenta20/box-h-gde.png');
@t20-abertura-cap-1    : url('/assets/tormenta20/abertura-capitulo-1.png');
@t20-abertura-cap-2    : url('/assets/tormenta20/abertura-capitulo-2.png');
@t20-titulo-partes     : url('/assets/tormenta20/titulo-partes.png');
@t20-regua-tabela      : url('/assets/tormenta20/regua-tabela.png');
@t20-regua-tabela-gde  : url('/assets/tormenta20/regua-tabela-gde.png');
@t20-divisor-capa      : url('/assets/tormenta20/divisor-capa.png');
@t20-faixa-intertitulo : url('/assets/tormenta20/faixa-intertitulo.png');
@t20-numero-pagina     : url('/assets/tormenta20/numero-pagina.png');
@t20-rodape-esquerdo   : url('/assets/tormenta20/rodape-esquerdo.png');
@t20-rodape-direito    : url('/assets/tormenta20/rodape-direito.png');
@t20-selo              : url('/assets/tormenta20/selo-cor.png');
```

- [ ] **Step 3: Copiar o selo (cor) para os assets**

Run (PowerShell):
```powershell
Copy-Item "Kit da Iniciativa T20/Selo/Iniciativa T20 - Selo (Cor).png" themes/assets/tormenta20/selo-cor.png
```

- [ ] **Step 4: Importar as variáveis no `style.less`**

Após os imports existentes:
```less
@import (less) './themes/assets/tormenta20/tormenta20-assets.less';
```

- [ ] **Step 5: Build + verificação**

Run: `npm run build`
Expected: compila; `build/assets/tormenta20/` tem os 20 PNG (19 + selo). Variáveis ainda não usadas (sem efeito visual).

- [ ] **Step 6: Commit**

```bash
git add scripts/copy-assets-t20.ps1 themes/assets/tormenta20 themes/V3/Tormenta20/style.less
git commit -m "feat(theme): assets gráficos T20 + selo + variáveis LESS"
```

---

### Task 5: Paleta de cores (custom properties + variáveis LESS)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Definir a paleta**

Substituir o bloco `:root` mínimo por (e adicionar variáveis LESS do tema):
```less
:root {
	--HB_Color_Background      : #f6f6f6; // BG geral
	--HB_Color_HeaderText      : #3f0f12; // vinho — títulos
	--HB_Color_HorizontalRule  : #b02b2e; // vermelho
	--HB_Color_TableTitle      : #6f3c27; // marrom — títulos de tabela/rodapé
	--HB_Color_CaptionText     : #6f3c27;
	--HB_Color_Footnotes       : #f0dc82; // dourado — nº de página
	--TOC                      : 'include';
}

// Variáveis LESS da paleta T20 (estudo §3)
@t20-vinho      : #3f0f12;
@t20-tabela     : #6f3c27;
@t20-vermelho   : #b02b2e;
@t20-dourado    : #f0dc82;
@t20-bege       : #e8d1b5;
@t20-cinza      : #727175;
@t20-zebra-a    : #ddd9d5;
@t20-zebra-b    : #f6f6f6;
@t20-texto      : #000000;
@t20-texto-claro: #ffffff;
```

- [ ] **Step 2: Build + verificação**

Run: `npm run build`. Expected: compila. Fundo do preview = `#f6f6f6`.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): paleta de cores T20"
```

---

### Task 6: Geometria da página (205×275mm, margens espelhadas, fundo)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Sobrescrever `.page`**

Adicionar (o Blank define 215.9×279.4mm; sobrescrevemos depois na cascata):
```less
// *****************************
// *   PÁGINA (Modelo RPG)
// *****************************/
.useColumns(@multiplier : 1, @fillMode: auto) {
	column-count : 2;
	column-fill  : @fillMode;
	column-gap   : 0.9cm;
}
.page {
	.useColumns();
	width            : 205mm;
	height           : 275mm;
	padding          : 20mm 18mm 24mm 25mm; // topo · externa(dir) · base · interna(esq) — ímpares
	font-family      : 'SourceSansPro';
	font-size        : 9pt;
	line-height      : 1.3;
	color            : @t20-texto;
	background-color : var(--HB_Color_Background);
	background-image : @t20-background;
	background-size  : cover;
}
// Margens espelhadas: páginas pares invertem interna/externa (lombada à direita)
.page:nth-of-type(even) {
	padding : 20mm 25mm 24mm 18mm;
}
```

> Nota de execução: a opacidade 75% do BG (estudo §2) será aplicada via camada `::before` em tarefa posterior se o `background-image` direto ficar forte demais; por ora `cover` direto.

- [ ] **Step 2: Build + verificação visual**

Run: `npm run build` + reiniciar. Abrir `/new`, tema Tormenta 20. Expected: página em 205×275mm (mais estreita/baixa que antes), 2 colunas, fundo do kit, corpo em Source Sans. Inserir `\page` no markdown e conferir que a 2ª página espelha as margens.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): geometria da página 205x275mm + margens espelhadas + BG"
```

---

### Task 7: Tipografia base (corpo, parágrafos, listas)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Regras de corpo**

```less
// *****************************
// *   CORPO
// *****************************/
.page {
	p {
		line-height : 1.3;
		& + p { text-indent : 1em; } // 2º parágrafo em diante recua
	}
	// 1º parágrafo de seção (após título) sem recuo
	h1 + p, h2 + p, h3 + p, h4 + p { text-indent : 0; }
	ul, ol {
		padding-left  : 1.2em;
		margin-bottom : 0.6em;
		line-height   : 1.3;
	}
	em { font-style : italic; }
	strong { font-weight : bold; }
	// Texto vermelho de destaque
	.vermelho { color : @t20-vermelho; }
}
```

- [ ] **Step 2: Build + verificação visual**

Expected: parágrafos com recuo a partir do 2º; 1º parágrafo após título sem recuo; listas alinhadas.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): tipografia base do corpo T20"
```

---

### Task 8: Títulos (capítulo h1, seção h2/h3 small-caps + faixa)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos de cabeçalho**

```less
// *****************************
// *   TÍTULOS
// *****************************/
.page {
	h1, h2, h3, h4, h5 { color : var(--HB_Color_HeaderText); }

	// h1 = título de capítulo (Tormenta20 display, largura total)
	h1 {
		column-span   : all;
		font-family   : 'Tormenta20';
		font-size     : 20pt;
		line-height   : 1.1;
		margin-bottom : 0.2cm;
	}
	// h2 = título de seção (Iowan small-caps)
	h2 {
		font-family    : 'IowanOldStyle';
		font-weight    : bold;
		font-variant   : small-caps;
		font-size      : 14pt;
		letter-spacing : 0.02em;
	}
	// h3 = intertítulo (Iowan small-caps + faixa decorativa embaixo)
	h3 {
		font-family    : 'IowanOldStyle';
		font-weight    : bold;
		font-variant   : small-caps;
		font-size      : 11pt;
		padding-bottom : 0.12cm;
		background     : @t20-faixa-intertitulo bottom left / 100% auto no-repeat;
	}
	h4, h5 {
		font-family  : 'IowanOldStyle';
		font-weight  : bold;
		font-variant : small-caps;
		font-size    : 9.5pt;
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Expected: `# Título` vira display Tormenta20 vinho em largura total; `## Seção` e `### Intertítulo` em Iowan small-caps; h3 com a faixa embaixo.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): títulos de capítulo/seção/intertítulo T20"
```

---

### Task 9: Tabelas (zebra + título marrom + réguas)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos de tabela**

```less
// *****************************
// *   TABELAS
// *****************************/
.page {
	table {
		width       : 100%;
		font-family : 'SourceSansPro';
		font-size   : 8.5pt;
		border-collapse : collapse;
		thead {
			font-family  : 'IowanOldStyle';
			font-weight  : bold;
			font-variant : small-caps;
			color        : var(--HB_Color_TableTitle);
			border-bottom : 2px solid @t20-tabela;
		}
		// Zebra: linha A (ímpar) e linha B (par)
		tbody tr:nth-child(odd)  { background-color : @t20-zebra-a; }
		tbody tr:nth-child(even) { background-color : @t20-zebra-b; }
		td, th { padding : 1px 0.4em; }
		// Régua decorativa topo/base via border-image
		border-image        : @t20-regua-tabela 41 / 41px / 0 round;
	}
}
```

> Nota: `border-image` da régua precisa de ajuste de `slice` (41px) conforme a altura real do PNG (`regua-tabela.png` ~41px). Ajustar visualmente.

- [ ] **Step 2: Build + verificação visual**

Inserir tabela markdown. Expected: cabeçalho marrom small-caps, linhas zebradas `#ddd9d5`/`#f6f6f6`, réguas nas bordas.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): tabelas zebradas T20"
```

---

### Task 10: Box vermelho (`.note` + variantes)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos de box**

```less
// *****************************
// *   BOX / QUADRO
// *****************************/
.page {
	.note {
		margin       : 0.3cm 0;
		padding      : 0.5cm 0.6cm;
		color        : @t20-texto-claro;
		background   : @t20-vermelho;
		border-image : @t20-box-med 120 fill / 120px / 0 stretch;
		h1, h2, h3, h4, h5 {
			font-family  : 'SourceSansPro';
			font-weight  : bold;
			color        : @t20-dourado; // título de box dourado
		}
		p { color : @t20-texto-claro; }
		// Variantes de tamanho (mesma moldura, alturas diferentes)
		&.completo { border-image-source : @t20-box-completo; }
		&.horizontal { border-image-source : @t20-box-h-gde; }
	}
}
```

> Nota: o `slice` do `border-image` (120) é provisório — ajustar conforme as bordas serrilhadas reais de cada `box-vermelho-*.png` para a moldura não distorcer.

- [ ] **Step 2: Build + verificação visual**

Inserir `{{note}}...{{/note}}`. Expected: caixa vermelha, título dourado, texto branco, moldura serrilhada do kit.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): box vermelho/quadro T20"
```

---

### Task 11: Ficha de Ameaça (`.ameaca` — statblock)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos do statblock**

A ficha usa a sintaxe de definição do renderer (`**Rótulo** :: valor` → `dl/dt/dd`).
```less
// *****************************
// *   FICHA DE AMEAÇA
// *****************************/
.page {
	.ameaca {
		padding      : 0.4cm 0.5cm;
		font-family  : 'SourceSansPro';
		font-size    : 8.5pt;
		color        : @t20-texto;
		background   : @t20-zebra-b;
		border       : 1.5px solid @t20-vinho;
		break-inside : avoid;
		// Nome da ameaça (h1/h2 dentro do bloco)
		h1, h2 {
			font-family  : 'Tormenta20';
			font-size    : 14pt;
			color        : @t20-vinho;
			column-span  : initial;
			margin-bottom: 0.1cm;
		}
		// Rótulos de ficha (Iniciativa, Defesa, Deslocamento...) em small-caps bold vermelho
		dt {
			font-weight  : bold;
			font-variant : small-caps;
			color        : @t20-vermelho;
		}
		hr {
			height     : 2px;
			margin     : 0.15cm 0;
			background : @t20-vinho;
			border     : none;
		}
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Testar com markdown:
```
{{ameaca
## Goblin Saqueador
**ND** :: 1/2
**Iniciativa** :: +3
**Defesa** :: 14
}}
```
Expected: bloco com nome Tormenta20 vinho, rótulos small-caps vermelhos, moldura vinho.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): ficha de ameaça (statblock) T20"
```

---

### Task 12: Blocos de Magia e Poder

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos**

```less
// *****************************
// *   MAGIA / PODER
// *****************************/
.page {
	.magia, .poder {
		margin      : 0.2cm 0;
		font-family : 'SourceSansPro';
		font-size   : 8.5pt;
		break-inside: avoid;
		h4, h5 {
			font-family : 'IowanOldStyle';
			font-weight : bold;
			font-style  : italic; // nome de magia em itálico
			color       : @t20-vinho;
		}
		// Linha "tipo de magia" (cinza)
		.tipo { color : @t20-cinza; font-weight : bold; }
		dt { font-weight : bold; color : @t20-vermelho; }
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Expected: nome em itálico vinho; rótulos vermelhos; `.tipo` em cinza.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): blocos de magia e poder T20"
```

---

### Task 13: Capa (`.frontCover`)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos de capa**

```less
// *****************************
// *   CAPA
// *****************************/
.page:has(.frontCover) {
	column-count     : 1;
	background-color : @t20-vinho;
	background-image : none;
	color            : @t20-bege;
	text-align       : center;
	.frontCover {
		display        : flex;
		flex-direction : column;
		align-items    : center;
		justify-content: center;
		height         : 100%;
	}
	h1 {
		font-family : 'Tormenta20';
		font-size   : 42pt;
		line-height : 1.05;
		color       : @t20-bege;
	}
	// Divisor decorativo entre título e autores
	h1::after {
		content    : '';
		display    : block;
		width      : 60%;
		height     : 18px;
		margin     : 0.4cm auto;
		background : @t20-divisor-capa center / contain no-repeat;
	}
	.autores, h2 {
		font-family : 'Tormenta20';
		font-size   : 16pt;
		color       : @t20-texto-claro;
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Testar `{{frontCover}}# Título da Obra{{/frontCover}}`. Expected: capa vinho, título Tormenta20 bege grande, divisor abaixo.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): capa (frontCover) T20"
```

---

### Task 14: Abertura de capítulo (tarja no h1)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Tarja de abertura de capítulo**

Uma página de capítulo usa a classe `.capitulo`; o h1 ganha a tarja do kit:
```less
// *****************************
// *   ABERTURA DE CAPÍTULO
// *****************************/
.page:has(.capitulo) {
	h1 {
		padding       : 0.6cm 0.4cm;
		margin-bottom : 0.4cm;
		color         : @t20-texto-claro;
		background    : @t20-abertura-cap-2 center / 100% 100% no-repeat;
		text-align    : center;
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Testar `{{capitulo}}# Capítulo 1: Arton{{/capitulo}}`. Expected: h1 com a tarja horizontal do kit, texto branco centralizado.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): abertura de capítulo T20"
```

---

### Task 15: Bordas laterais, rodapé e número de página (espelhados)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Bordas, rodapé e nº de página**

```less
// *****************************
// *   BORDAS + RODAPÉ + Nº PÁGINA
// *****************************/
.page {
	// Bordas laterais (mancha na margem interna = esquerda em ímpares)
	&::before {
		content    : '';
		position   : absolute;
		top        : 0; bottom : 0; left : 0;
		width      : 12mm;
		background : @t20-borda-esquerda left top / auto 100% no-repeat;
		z-index    : 20;
		pointer-events : none;
	}
	&:nth-of-type(even)::before {
		left  : auto; right : 0;
		background : @t20-borda-direita right top / auto 100% no-repeat;
	}
	// Número de página dourado sobre a mancha do kit
	.pageNumber {
		width            : 26px; height : 26px;
		font-family      : 'Tormenta20';
		font-size        : 11pt;
		line-height      : 26px;
		color            : @t20-dourado;
		background       : @t20-numero-pagina center / contain no-repeat;
	}
}
```

> Nota: o `.pageNumber` do Blank já espelha esquerda/direita em `:nth-child(even)`. O rodapé decorativo (`rodape-esquerdo/direito.png`) pode entrar como `background` adicional da `.page` na margem inferior — ajustar posição visualmente.

- [ ] **Step 2: Build + verificação visual**

Expected: borda lateral na margem interna (alterna lado em páginas pares); número de página dourado sobre a mancha vinho.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): bordas laterais, rodapé e número de página T20"
```

---

### Task 16: Créditos + Selo (`.creditos`)

**Files:**
- Modify: `themes/V3/Tormenta20/style.less`

- [ ] **Step 1: Estilos de créditos/selo (obrigatório legal)**

```less
// *****************************
// *   CRÉDITOS + SELO (obrigatório: disclaimer Jambô)
// *****************************/
.page {
	.creditos {
		font-family : 'SourceSansPro';
		font-size   : 8pt;
		text-align  : center;
		color       : @t20-texto;
		.selo {
			display    : block;
			width      : 3cm; height : 3cm;
			margin     : 0.4cm auto;
			background : @t20-selo center / contain no-repeat;
		}
		.disclaimer { font-style : italic; color : @t20-tabela; }
	}
}
```

- [ ] **Step 2: Build + verificação visual**

Testar bloco `{{creditos}}` com `<div class="selo"></div>` + disclaimer. Expected: selo centralizado + texto do disclaimer em itálico marrom. (O snippet que gera esse conteúdo vem na Frente B.)

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/style.less
git commit -m "feat(theme): bloco de créditos + selo T20"
```

---

### Task 17: Arte do dropdown (texture + preview)

**Files:**
- Modify: `themes/V3/Tormenta20/dropdownTexture.png`
- Modify: `themes/V3/Tormenta20/dropdownPreview.png`

- [ ] **Step 1: Gerar as artes do dropdown**

Substituir os PNG provisórios (cópias do Blank) por artes T20:
- `dropdownTexture.png`: amostra de textura/fundo T20 (ex.: recorte do `background.png` com o vinho `#3f0f12`).
- `dropdownPreview.png`: screenshot de uma página renderizada com o tema (capturar do preview após Task 16).

Pode-se capturar o preview via navegador (print/screenshot da `.page`) e salvar nos dois arquivos por ora, refinando depois.

- [ ] **Step 2: Build + verificação**

Run: `npm run build`. Expected: dropdown de tema mostra a textura T20 e o preview ao passar o mouse.

- [ ] **Step 3: Commit**

```bash
git add themes/V3/Tormenta20/dropdownTexture.png themes/V3/Tormenta20/dropdownPreview.png
git commit -m "feat(theme): arte do dropdown do tema T20"
```

---

### Task 18: QA visual final + ajuste fino

**Files:**
- Modify: `themes/V3/Tormenta20/style.less` (ajustes pontuais)

- [ ] **Step 1: Brew de teste cobrindo todos os componentes**

Criar um documento de teste no editor com: capa, abertura de capítulo, seções h2/h3, parágrafos, lista, tabela, box, ficha de ameaça, magia, créditos+selo, várias páginas (`\page`).

- [ ] **Step 2: Comparar com o Modelo de RPG do kit**

Abrir lado a lado `Kit da Iniciativa T20/Modelos de Diagramação - InDesign/Modelo de RPG/Modelo de RPG.pdf` e o preview. Conferir: cores (paleta §3), fontes (§4), 2 colunas, margens espelhadas, réguas/molduras serrilhadas sem distorção, nº de página dourado. Ajustar `slice` de `border-image`, tamanhos em pt e posições conforme necessário.

- [ ] **Step 3: Verificar print/PDF**

No editor, "Imprimir/Get PDF" → conferir que o PDF bate com o preview (fontes embutidas resolvem, assets aparecem).

- [ ] **Step 4: Build final + commit**

```bash
npm run build
git add themes/V3/Tormenta20/style.less
git commit -m "fix(theme): ajuste fino visual do tema T20 (QA contra Modelo RPG)"
```

---

## Self-review (cobertura do spec)

- Spec §3 Fase 0 → Tasks 1–2 ✓
- Spec §4.1 estrutura de arquivos → Tasks 2–4 ✓
- Spec §4.2 página 205×275mm/margens/colunas/BG → Task 6 ✓
- Spec §4.3 paleta → Task 5 ✓
- Spec §4.4 tipografia (fontes + escala) → Tasks 3, 7, 8 ✓
- Spec §4.5 componentes (capa, capítulo, seção, tabela, box, ficha, magia, bordas, rodapé, nº página, selo) → Tasks 8–16 ✓
- Spec §4.6 conversão de assets/fontes → Tasks 3, 4 ✓
- Spec §9 verificação (build + visual + print) → Task 18 ✓

**Itens fora deste plano (planos próprios):** snippets que geram o markdown dos componentes (Frente B — registro em `snippetbar.jsx`), UI PT-BR (Frente C), tornar Tormenta20 padrão (Fase Final), deploy (GitHub Actions + Ubuntu).

**Questões a resolver durante execução:** valores de `slice` dos `border-image` (dependem da altura real de cada PNG); opacidade 75% do BG; posição exata do rodapé decorativo; tamanhos em pt finos dos títulos (kit não dá todos — calibrar contra o PDF do Modelo de RPG).
