# Arquitetura do Homebrewery — Mapa Tecnico para o fork Iniciativa T20

> Documento-base consolidado a partir de 6 investigacoes do repositorio real. Caminhos no formato `arquivo:linha` refletem o que os pesquisadores citaram. Itens nao verificados empiricamente estao marcados como **(a confirmar)**.

---

## 1. Visao geral do fluxo (editor -> markdown/marked -> HTML -> iframe + CSS do tema)

O Homebrewery V4 e um app **Express (`server.js`) + Vite/React** que renderiza "brews" (documentos) no navegador. O fluxo de um brew ate a pagina estilizada:

1. **Edicao**: o usuario digita markdown no editor (CodeMirror, `client/components/codeEditor/codeEditor.jsx`). Snippets injetam blocos de markdown no cursor via `view.state.replaceSelection(text)` (`codeEditor.jsx:329-336`).
2. **Renderizacao markdown -> HTML**: o renderer V3 (baseado em `marked`) converte o markdown em HTML, interpretando a sintaxe propria do Homebrewery — blocos `{{classe ...}}`, `\page`, `\column`, definicoes `**Rotulo** :: valor`. **(a confirmar)** o arquivo exato do renderer V3 nao foi mapeado nestas investigacoes.
3. **Aplicacao do CSS do tema**: o CSS do tema NAO e embutido no HTML; ele e carregado separadamente como um "themeBundle" (ver Secao 2) e injetado dentro de um **iframe de preview**.
4. **Iframe de preview**: `client/homebrew/brewRenderer/brewRenderer.jsx` usa `react-frame-component` (`<Frame>`, `brewRenderer.jsx:351-355`). O `INITIAL_CONTENT` (linha 30-36) ja inclui `<link href='/homebrew/bundle.css'>`. A funcao `renderStyle()` (`brewRenderer.jsx:183-187`) injeta:
   - `themeBundle.joinedStyles` (os `@import` das CSS de tema, em ordem pai->filho);
   - depois `<style>${props.style}</style>` (a aba "Style" do brew, com prioridade maxima na cascata).
5. **Preview = print/PDF**: o print imprime o proprio iframe (mesmo DOM/CSS/origem). Nao ha pipeline separado de PDF; fontes (`/fonts/...`) e imagens (`/assets/...`) ja resolvidas no preview valem identicas no print.

**Pontos de entrada relevantes do cliente:** `newPage.jsx:66` e `sharePage.jsx:40` chamam `fetchThemeBundle` para carregar o tema. As paginas `/new` e `/edit` renderizam o brew **client-side**, sem precisar do Mongo para LER/RENDERIZAR (so o save permanente toca o banco — ver Secao 7).

---

## 2. Sistema de temas e LESS (heranca baseTheme, compilacao, onde criar themes/V3/Tormenta20)

### Estrutura de um tema V3 no disco

Um tema vive em `themes/V3/<Nome>/` e contem:

| Arquivo | Funcao |
|---|---|
| `style.less` | CSS-fonte (LESS). Compilado para `style.css` no build. |
| `settings.json` | Metadados: `name`, `renderer`, `baseTheme`, `baseSnippets`. **Fonte de verdade.** |
| `snippets.js` (+ `snippets/`) | Manifesto de snippets (ver Secao 3). Deve existir mesmo que vazio (`export default []`). |
| `dropdownTexture.png` | Miniatura/fundo do item no dropdown. **OBRIGATORIO.** |
| `dropdownPreview.png` | Preview grande ao passar o mouse. **OBRIGATORIO.** |

`themes/V3/Blank/style.less:1-8` e a **raiz** (`baseTheme:false`): importa todas as fontes + `assets.less` e define o esqueleto fisico da pagina (`.page` 215.9x279.4mm, `.useColumns()` = `column-count:2` em `style.less:36-39`), TOC, index, page numbers, watercolors, imageMasks.

`themes/V3/5ePHB/style.less:1` e o **modelo a copiar** para o Tormenta20: herda de Blank, importa SO `assets.less`, e redefine cores via custom properties `--HB_Color_*`, fontes, e componentes (`.monster`, `.note`, `.descriptive`, capas `.page:has(.frontCover)`, footer).

### Heranca baseTheme — NAO usa `@import` de LESS

Confirmado: filhos (`5eDMG/style.less:1`, `Journal/style.less:1-2`) nunca importam o `style.less` do pai. A heranca acontece em dois lugares:

1. **`settings.json` declara o pai** (ex.: `5ePHB` => `"baseTheme":"Blank"`). O plugin de build le todos os `settings.json` e gera `themes/themes.json` (`generateAssetsPlugin.js:36-58`).
2. **O servidor resolve e concatena a cadeia.** `server/homebrew.api.js`, `api.getThemeBundle` (linhas 317-376) percorre subindo por `baseTheme` (`homebrew.api.js:362`), empilha `@import url("/themes/<renderer>/<id>/style.css")` (`:358`) e **inverte a ordem** (`completeStyles.reverse()`) => pai primeiro, filho depois. Rota: `GET /api/theme/:renderer/:id` (`homebrew.api.js:576`). A cascata CSS garante: Blank entra primeiro (estrutura), filho sobrescreve (cores/skin).

Cliente: `shared/helpers.js:140-155` `fetchThemeBundle` faz o GET, recebe `styles[]` e monta `themeBundle.joinedStyles = styles.map(s=>`<style>${s}</style>`).join('\n\n')`.

### Compilacao LESS -> CSS (build Vite, NAO runtime)

`vitePlugins/generateAssetsPlugin.js` no hook `buildStart`:
- Le cada `themes/V3/<dir>/settings.json`, injeta `path = <dir>` (`:40`), monta `themes.V3[dir]`.
- Compila `style.less` via `less.render` (pacote `less`, `:3`) -> `build/themes/V3/<dir>/style.css` (`:51-54`). Como `less.render` recebe o conteudo sem `filename`, os `@import (less) './themes/...'` resolvem a partir do **cwd = raiz do repo** (por isso os caminhos sao relativos a raiz, nao ao diretorio do tema).
- Copia `dropdownTexture.png`/`dropdownPreview.png` **sem try/catch** (`:42-49`) — se faltarem, o build inteiro QUEBRA.
- Gera `themes/themes.json` (`:58`).

Roda em `npm run build` (`vite build`) e tambem em dev, porque `server.js:11-16` instancia o Vite em `middlewareMode` e `app.use(vite.middlewares)` (`server/app.js:59`) dispara o mesmo `buildStart`.

> `scripts/phb.js` (`npm run phb`) compila um arquivo DIFERENTE (`client/homebrew/phbStyle/phb.style.less` -> `phb.standalone.css`) e NAO faz parte do pipeline de temas; so confirma que o engine e o `less`.

### Servido como estatico

`server/app.js:62`: `app.use('/', serveCompressedStaticAssets('build'))`. URL `/themes/V3/<tema>/style.css` resolve para `build/themes/V3/<tema>/style.css`. (O `build/` nao existe neste clone — precisa rodar o build uma vez.)

### Onde criar o Tormenta20

Criar `themes/V3/Tormenta20/` com:
- `settings.json`: `{ "name": "...", "renderer": "V3", "baseTheme": "Blank", "baseSnippets": <decisao> }` — **NAO incluir `path`** (injetado pelo gerador).
- `style.less`: espelhar `5ePHB/style.less` — importar `assets.less` (e o `fonts.less` proprio), redefinir `--HB_Color_*`, fontes e componentes. NAO importar `Blank/style.less` (duplicaria regras; o bundle do servidor cuida disso).
- `dropdownTexture.png` + `dropdownPreview.png` (provisoriamente copiar os do Blank).
- `snippets.js` (ver Secao 3).

> **Divergencia entre investigacoes a resolver:** alguns trechos recomendam `baseTheme:"Blank"` (escrever o skin do zero), outros `baseTheme:"5ePHB"` (herdar layout RPG + componentes prontos). Decisao de produto. Recomendacao do arquiteto: comecar com `baseTheme:"5ePHB"` para herdar `.monster`/`.note`/capas prontos e sobrescrever so a paleta/fontes; migrar para `"Blank"` se quiser controle total. **(a confirmar com o usuario)**

---

## 3. Sistema de snippets (formato .gen.js, snippetbar, molde de snippet T20)

### Formato de `snippets.js` (manifesto do tema)

`themes/V3/5ePHB/snippets.js:11` faz `export default [ ...grupos ]`. Cada **grupo**:
```js
{ groupName: 'PHB', icon: 'fas fa-book', view: 'text', snippets: [ ... ] }
```
`view` ('text' | 'style' | 'snippet' | 'meta') define em qual aba o grupo aparece (`snippetbar.jsx:186-204` filtra por `view === props.view`).

Cada **snippet** (`snippets.js:48-52`):
```js
{ name: 'Spell', icon: 'fas fa-magic', gen: MagicGen.spell, experimental: true, subsnippets: [...] }
```
O campo `gen` aceita 3 formas reais: **string literal** (`'\n\\page\n'`, Blank/snippets.js:31), **template dedent** (5ePHB/snippets.js:20), ou **funcao** `()=>string` (`MagicGen.spell`).

### Formato dos `snippets/*.gen.js` (geradores)

Tres assinaturas reais, todas via `export default`:

- **(a) Objeto com varias funcoes** — `magic.gen.js:57`: `export default { spell(){...}, spellList(){...}, item(){...} }`. Usado como `MagicGen.spell`.
- **(b) Factory parametrizada** — `monsterblock.gen.js:155`: `export default { monster(classes, genLines){ return dedent`{{${classes} ...}}` } }`. Em `snippets.js:104` chama-se `MonsterBlockGen.monster('monster,frame', 2)` — isso EXECUTA a factory na montagem; o `gen` final fica sendo a string retornada.
- **(c) Funcao unica** — `classfeature.gen.js:4`, `quote.gen.js:43`: `export default function(classname){ return dedent`...` }`. Usado direto: `gen: ClassFeatureGen`.

Os `.gen.js` so produzem **string de markdown Homebrewery** — `name`/`icon` vivem no manifesto. Usam `lodash` (`_.sample`, `_.random`, `_.times`) e `dedent`.

### Como a barra carrega, funde e injeta

`client/homebrew/editor/snippetbar/snippetbar.jsx`:
- Importa estaticamente cada manifesto (`:12-16`) e monta o dicionario `ThemeSnippets` com chaves `V3_5ePHB`, `V3_Blank`, etc. (`:18-24`).
- `compileSnippets()` (`:132-153`): le `props.themeBundle.snippets` (array de strings vindo do servidor). Para cada string (ex. `'V3_5ePHB'`) troca pelo modulo real `ThemeSnippets[snippets]` (`:139-140`). Funde pai+filho com `_.mergeWith(..., mergeCustomizer)`; `mergeCustomizer` (`:125-130`) faz `_.unionBy(..., 'name')` dando preferencia ao filho e filtra os que tem `gen || subsnippets`. Acrescenta snippets do proprio brew via `brewSnippetsToJSON` (`:149-150`).
- Clique: `SnippetGroup.handleSnippetClick` (`:322-325`) chama `execute(snippet.gen, props)` (`:46-49` — se funcao, chama; senao retorna string), sobe por `onInject` ate `editor.jsx:153 handleInject` -> `codeEditor.injectText` (`:329-336`).

### Ligacao tema->snippets — o GARGALO

Apesar de `themes.json` ter `baseSnippets`, **o servidor NAO usa esse campo** ao montar o bundle. `getThemeBundle` (`homebrew.api.js:317-376`) segue `baseTheme` (`:362`) e empilha a STRING `${renderer}_${id}` (`:357-359`). O cliente resolve essa string via o **mapa hardcoded `ThemeSnippets`** (`snippetbar.jsx:18-24`).

**Consequencia:** criar a pasta + settings.json faz o tema aparecer no dropdown e aplica o CSS, mas os snippets so aparecem se voce adicionar manualmente no `snippetbar.jsx`:
```js
import V3_Tormenta20 from '@themes/V3/Tormenta20/snippets.js';
// ...
const ThemeSnippets = { ..., V3_Tormenta20 };
```
A chave DEVE ser exatamente `V3_<pathDaPasta>` (= `V3_Tormenta20`), casando com o que o servidor emite.

### Molde de snippet T20

`themes/V3/Tormenta20/snippets.js`:
```js
import AmeacaGen from './snippets/ameaca.gen.js';
import MagiaGen  from './snippets/magia.gen.js';
export default [{
  groupName: 'Tormenta 20', icon: 'fas fa-dragon', view: 'text',
  snippets: [
    { name: 'Ficha de Ameaca', icon: 'fas fa-skull', gen: AmeacaGen.ameaca('monster,frame', 2) },
    { name: 'Magia', icon: 'fas fa-hand-sparkles', gen: MagiaGen.magia },
  ]
}];
```
`ameaca.gen.js` segue o padrao factory (igual `monsterblock.gen.js`); campos `**Rotulo** :: valor` usam a sintaxe de definicao em duas colunas do renderer V3. O conteudo ja pode ser escrito em PT-BR diretamente. Para classes CSS proprias (ex. `{{ameaca,frame ...}}`), estiliza-las no `style.less` do tema.

> **A confirmar:** se ha lista de classes permitidas no parser markdown V3 para `{{classe ...}}`, ou se qualquer classe e aceita e so depende do CSS existir.

---

## 4. Fontes e assets (onde por arquivos, como referenciar, preview + print)

### Modelo de referencia (confirmado)

- **Fontes**: NAO ficam em `@font-face` dentro do `style.less` do tema. Ficam em **`fonts.less` compartilhados** com **URL RELATIVA de 3 niveis**: `themes/fonts/5e/fonts.less:6` => `src: url('../../../fonts/5e/Bookinsanity.woff2')`. O 5ePHB herda esses `@font-face` porque o Blank importa `themes/fonts/5e/fonts.less` (`Blank/style.less:2`).
- **Imagens**: ficam em `themes/assets/` e sao referenciadas por **URL ABSOLUTA da raiz** em `themes/assets/assets.less:4` => `@backgroundImage: url('/assets/parchmentBackground.jpg')`.

### Build: copia crua, sem otimizacao

`generateAssetsPlugin.js`: copia `themes/fonts` -> `build/fonts` (`:61`), `themes/assets` -> `build/assets` (`:62`), `shared/naturalcrit/styles/*` -> `build/fonts/` (`:16-19`), `client/icons` -> `build/icons` (`:63`). **Nao ha imagemin, nem conversao TTF/OTF->WOFF2** (grep negativo em `vite.config.js`). O `@import (less)` do fonts.less e **inlinado** no `style.css` final, entao os `@font-face` ficam embutidos no CSS servido.

### Resolucao de URL no iframe (ponto critico)

O `style.css` e servido em `/themes/V3/<tema>/style.css`. O navegador resolve URLs relativas a partir dai:
- `../../../fonts/5e/Bookinsanity.woff2` => **`/fonts/5e/Bookinsanity.woff2`** (existe em `build/fonts/5e/`). O offset de 3 `../` sobe ate a raiz e bate em `/fonts/`, exatamente onde o plugin copiou.
- `/assets/parchmentBackground.jpg` (absoluta) => igual no preview e no print.

### Onde por os arquivos do T20

**Fontes** em `themes/fonts/Tormenta20/` (idealmente `.woff2`). Criar `themes/fonts/Tormenta20/fonts.less` copiando o padrao do 5e, com a MESMA profundidade de 3 niveis (`url('../../../fonts/Tormenta20/...')`). Importar no topo do `style.less` (caminho relativo a raiz: `@import (less) './themes/fonts/Tormenta20/fonts.less';`).

**Imagens** (ex. os 19 PNG do kit) em `themes/assets/tormenta20/`; referenciar por `url('/assets/tormenta20/...')`. Recomendado criar um `.less` proprio de variaveis (nao alterar o `assets.less` do 5e). Preferir nomes **kebab-case ASCII** (evitar espacos/acentos em url() para nao ter atrito de encoding no print/Brotli).

> **(a confirmar)** — necessidade de conversao manual de fontes para .woff2 (o pipeline nao converte) e **questoes de licenca** das fontes Tormenta20/Iowan/Bitstream para deploy publico (fora do escopo tecnico, relevante antes de redistribuir).

---

## 5. Registro de tema e metadata (checklist para registrar "Tormenta20" e torna-lo padrao)

### Checklist para REGISTRAR o tema

**A) Criar a pasta** `themes/V3/Tormenta20/`:
1. `settings.json` (sem `path`).
2. `style.less` (compilado para `style.css` no build).
3. `snippets.js` (no minimo `export default [];`).
4. `dropdownTexture.png` + `dropdownPreview.png` (**obrigatorios** — build quebra sem eles).
5. (opcional) assets em `themes/assets/tormenta20/`.

**B) Registrar snippets no cliente** (OBRIGATORIO para os botoes aparecerem) — editar `client/homebrew/editor/snippetbar/snippetbar.jsx:12-24`: adicionar `import V3_Tormenta20 from '@themes/V3/Tormenta20/snippets.js';` e a chave `V3_Tormenta20` em `ThemeSnippets`.

**C) Rebuildar** (`vite build` ou subir o dev server) — regenera `themes/themes.json` e compila `style.css`. `themes/themes.json` e tracked no git mas reescrito pelo build; **commitar a versao gerada**.

> `metadataEditor.jsx` importa `@themes/themes.json` (`:11`) e monta o dropdown (`renderThemeDropdown`, `:185-242`), referenciando `/themes/<renderer>/<path>/dropdownPreview.png` (`:191-192`). O dropdown so funciona no renderer V3 (no Legacy fica desabilitado, `:210-214`). **(a confirmar)** se ha allowlist/curadoria filtrando temas exibidos, ou se todo tema de `themes.json` aparece automaticamente.

### Checklist para TORNAR o Tormenta20 PADRAO

1. `server/brewDefaults.js:14` — trocar `theme: '5ePHB'` por `theme: 'Tormenta20'` (manter `renderer: 'V3'`). Muda o default de TODO brew novo (verdade dos brews novos).
2. `metadataEditor.jsx:35-37` — ajustar `getDefaultProps` para `renderer:'V3'`, `theme:'Tormenta20'` (fallback do componente).
3. `metadataEditor.jsx:95-96` — `handleRenderer` forca `theme='5ePHB'` ao escolher legacy; revisar opcionalmente (so afeta legacy).
4. **Template inicial do brew** (welcome text de `/new`) — NAO esta em `newbrew.navitem.jsx`; fica em outro arquivo (provavel `welcome_msg.md` / server). Apontar para um template T20 em PT-BR. **(a confirmar)** localizacao exata de onde `/new` carrega o conteudo default.

---

## 6. UI / i18n PT-BR (ha i18n? superficies a traduzir, abordagem, esforco)

### NAO ha i18n

Confirmado por busca direta: zero dependencias (`react-intl`/`i18next`/`formatMessage`), zero arquivos de locale/strings, nenhuma funcao `t()`. Falsos positivos: `localeCompare` (ordenacao), `locale: req.brew.lang` (PDF), `Intl.DisplayNames` (dropdown de idiomas). O campo `lang` (`metadataEditor.jsx:37,244-255`) e so o atributo HTML do brew (hifenizacao/spellcheck do documento), **nao** o idioma da UI.

### Superficies a traduzir

Textos hard-coded em 4 formas: texto entre tags JSX; atributos (`placeholder`/`title`/`data-tooltip-*`/`aria-label`/`alt`); literais em `alert()`/`confirm()` (13 chamadas); prosa markdown via `dedent`.

| Superficie | Arquivos | Notas |
|---|---|---|
| Navbar | `client/homebrew/navbar/*` (12 .jsx) | `new`, `resume draft`, `from blank`, `from file`, `Vault`, `get PDF` |
| Paginas de usuario | `homePage`, `editPage`, `newPage`, `accountPage`, `vaultPage`, `sharePage`, `errorPage`, `userPage` | vaultPage e uma das mais densas |
| metadataEditor | `metadataEditor.jsx` | ~40 strings: labels, tooltips (`:217,259,350,374`), `confirm()` de delete (`:129-133`), `Properties Editor` (`:311`) |
| toolBar | `brewRenderer/toolBar/toolBar.jsx` | ~20 `title=` de tooltips |
| index.html | `index.html` | `lang="en"` (`:2`), `<title>` (`:11`), prefixos de titulo no script inline |
| Prosa grande | `errorPage/errors/errorIndex.js` (~270 linhas, ~30 msgs com markdown + interpolacao `${props.brew}`), `welcome_msg.md` (176), `migrate.md` (202), `faq.md` (134) | esforco desproporcional |
| /admin | `client/admin/*` (13 .jsx) | fora do MVP — deixar em ingles |

**Volume estimado:** ~120-180 strings curtas/medias em ~30 arquivos + 3 blocos grandes de prosa.

### Abordagem recomendada e esforco

**Traducao IN-PLACE, arquivo por arquivo, SEM framework de i18n.** Justificativa: fork mono-idioma (so PT-BR, local). Montar react-intl/i18next adicionaria dependencia, refatoracao de ~30 arquivos para `t('chave')`, catalogo de chaves e merge conflicts com upstream — para suportar 1 idioma. Nao se paga.

- **Esforco (Abordagem A in-place):** ~1.5–2.5 dias. UI curta ~1 dia; `errorIndex.js` (cuidar das interpolacoes e markdown) ~0.5 dia; arquivos .md + index.html ~0.5 dia (mais reescrita-com-sabor-T20 que traducao literal).
- **Abordagem B (modulo central de strings):** ~3–4 dias; so vale para padronizar terminologia rigorosamente. Prosa longa nao cabe num objeto de chaves.

**Plano hibrido pragmatico:** (1) `index.html` lang+title; (2) navbar + paginas in-place; (3) metadataEditor/toolBar (atencao a tooltips e confirms); (4) `errorIndex.js` mantendo INTACTAS interpolacoes e markdown; (5) reescrever `welcome_msg.md`/`faq.md` com sabor T20; (6) /admin em ingles no MVP; (7) snippets = autoria nova em PT-BR (escopo separado).

**Glossario a definir ANTES:** `brew`, `theme`->`tema`, `Vault`->`Cofre`?, `snippet`->`trecho`/`bloco`. **(a confirmar)** quem decide a terminologia oficial.

---

## 7. Rodar localmente (passo-a-passo Windows, dependencia de Mongo e contorno)

### Boot exige MongoDB — sem fallback offline no servidor

`server.js:18-21` e `server/db.js:16-23` chamam `process.exit(1)` se a conexao falhar. URL padrao: `mongodb://127.0.0.1/homebrewery` (`db.js:13`), sobrescritivel por `mongodb_uri`/`MONGODB_URI`. O `idb-keyval`/`localStorage` e SO no cliente (rascunho de `/new` em `newPage.jsx:106-109`; historico de versoes em `versionHistory.js`). `dbCheck.js` bloqueia `/account`, `/vault`, `/user`, `/api/update` com `HBErrorCode 13` se `readyState != 1`.

> **Importante:** autorar e PRE-VISUALIZAR o tema e 100% client-side (localStorage), mas o servidor so sobe com um Mongo no ar. So o **save permanente** e a listagem tocam o banco.

### Scripts e dev (`package.json`)

- `start`: `node server.js`. Modo dev via `NODE_ENV=local` (nao ha script `dev` separado).
- `build`: `vite build`. `postinstall`: `npm run build` (o install ja compila).
- `isDev = NODE_ENV==='local'` (`server.js:6`) -> Vite em `middlewareMode` (HMR). Sem isso, serve bundles de `build/` (sem hot-reload).
- Porta: `PORT || web_port(8000) || 3000` (`server.js:25`, `config/default.json:6`) -> **http://localhost:8000**.
- nconf le `config/<NODE_ENV>.json` e depois `config/default.json`. So existe `default.json`; rodar com `NODE_ENV=local` NAO exige `config/local.json` (nconf tolera ausencia). `local_environments:['docker','local']` habilita CORS de localhost, `POST /local/login` (login fake sem Google) e desliga forceSSL.
- Google OAuth e **opcional** (sem `google_client_id`/`secret` no default, login Google fica off).

### Passo-a-passo Windows

**1. Subir Mongo** (uma das opcoes):
```powershell
# Opcao A (recomendada): Docker
docker run --name hb-mongo -d -p 27017:27017 -v hbdata:/data/db mongo:latest
```
Opcao B: MongoDB Community nativo (criar `C:\data\db`, rodar `mongod`). Tambem ha `docker-compose.yml` (Mongo + app), mas para dev com HMR prefira o app fora do container.

**2. Subir o app:**
```powershell
$env:NODE_ENV="local"
npm install   # roda npm run build no postinstall
npm start
```
Abrir http://localhost:8000. Console deve mostrar "Mongo connected!" (`db.js:29`).

**Estado do clone:** `node_modules` e `build/` AUSENTES (ainda nao rodou `npm install`). `node v24.13.0` (dentro de engines `>=20.18 <25`). **(a confirmar)** versao do npm (exige `>=10.8 <12`).

> Se quiser app 100% offline sem Mongo, exigiria PATCH (contornar `process.exit(1)` em `server.js`/`db.js` e desativar `dbCheck.js`) — fora do escopo de "rodar como esta". **(a confirmar com o usuario se e desejado.)**

---

## 8. Plano de ataque sugerido (ordem, sub-projetos A/B/C, dependencias)

### Fase 0 — Infra (pre-requisito de tudo)
1. Subir Mongo (Docker) + `npm install` + validar `npm start` em http://localhost:8000.
2. Validar que o `buildStart` roda e gera `build/themes/...` mesmo sem build previo (no dev via middleware). **(a confirmar)**
3. Criar `themes/V3/Tormenta20/` minimo (settings.json + style.less skeleton + snippets.js vazio + os 2 PNG provisorios do Blank) e ver o tema no dropdown apos rebuild. Isso destrava A, B e C.

### Sub-projeto A — Tema visual (CSS/LESS/assets/fontes)
- A1. Decidir `baseTheme` (`5ePHB` vs `Blank`) — **decisao de produto, bloqueia A2/A3**.
- A2. Coletar/converter fontes -> `themes/fonts/Tormenta20/*.woff2` + `fonts.less`.
- A3. Por os PNG em `themes/assets/tormenta20/` (kebab-case) + `.less` de variaveis.
- A4. Escrever `style.less` (paleta `--HB_Color_*`, fontes, componentes `.monster`/`.note`/`.descriptive`/capas/footer, e classes proprias usadas pelos snippets ex. `.ameaca`).
- A5. Arte definitiva de `dropdownTexture.png`/`dropdownPreview.png`.

### Sub-projeto B — Snippets T20
- B1. Criar `themes/V3/Tormenta20/snippets/*.gen.js` (ameaca, magia, box...) + `snippets.js`.
- B2. **Registrar `V3_Tormenta20` em `snippetbar.jsx:12-24`** (obrigatorio).
- **Dependencia:** as classes CSS que os snippets emitem (`{{ameaca,frame ...}}`) precisam existir em A4 para o preview ficar correto. B funcionalmente independe de A (insere texto de qualquer forma), mas o **resultado visual** depende de A4.

### Sub-projeto C — UI PT-BR
- C1. `index.html` (lang+title).
- C2. Navbar + paginas + metadataEditor + toolBar in-place.
- C3. `errorIndex.js` (preservar interpolacoes/markdown).
- C4. Reescrever `welcome_msg.md`/`faq.md` com sabor T20.
- **Independente de A e B** (so toca `client/homebrew/**`), tem HMR no dev. Pode rodar em paralelo. Definir glossario antes de C2.

### Fase final — Tornar padrao
- `brewDefaults.js:14`, `metadataEditor.jsx:35-37/95-96`, e apontar o template inicial de `/new` para conteudo T20 (depende de C4 estar pronto).

### Grafo de dependencias (resumido)
```
Fase 0 (infra + esqueleto do tema)
   ├──> A (visual)  ──┐
   ├──> B (snippets) ─┼──> [B visualmente correto exige A4]
   └──> C (UI PT-BR) ─┘  (paralelo, independente)
                         └──> Fase final (default) depende de A,B,C maduros
```

**Ordem sugerida:** Fase 0 -> (A2/A3 + B1 em paralelo, gated pela decisao A1) -> A4 -> B2 -> C em paralelo desde o inicio -> Fase final.

---

## 9. Riscos tecnicos e questoes em aberto

**Build / pipeline**
- `build/` ausente no clone; `generateAssetsPlugin.js:42-49` copia os 2 PNG **sem guarda de existencia** — pasta de tema sem eles QUEBRA o build inteiro (e o dev server).
- Um `style.less` com erro de sintaxe ou `@import` inexistente quebra `less.render` e, portanto, todo o build. Validar isoladamente antes de commitar.
- `themes/themes.json` e tracked mas reescrito no build — commitar a versao gerada e evitar editar a mao.
- **(a confirmar)** que o `buildStart` roda e popula `build/` mesmo sem um `npm run build` previo, em dev via middleware.

**Snippets**
- Registro hardcoded em `snippetbar.jsx` e ponto de falha facil de esquecer: chave deve ser exatamente `V3_<path>`.
- `baseSnippets` em `themes.json` esta presente mas **nao e lido** por `getThemeBundle` — possivelmente legado/morto. **(a confirmar)** se algum outro fluxo cliente o consome.
- **(a confirmar)** se ha lista de classes permitidas no parser markdown V3 para `{{classe ...}}`.

**Fontes / assets**
- Sem conversao TTF/OTF->WOFF2 nem otimizacao de PNG no pipeline — converter manualmente.
- Sem geracao de `.br` no buildStart para novos assets — servidos sem Brotli pre-gerado.
- Nomes com espacos/acentos funcionam em `url()` mas geram atrito de encoding no print — usar kebab-case ASCII.
- **Licenca das fontes** (Tormenta20/Iowan/Bitstream) em aberto para deploy publico.

**i18n**
- Sem framework; traducao in-place gera merge conflicts com upstream em cada arquivo tocado. Glossario nao decidido. Escopo de /admin nao definido (recomendado: ingles no MVP).
- `errorIndex.js`: traduzir sem quebrar interpolacoes `${props.brew...}` e sintaxe markdown.

**Infra**
- Servidor exige Mongo no boot (`process.exit(1)`); sem fallback offline. Decisao sobre Docker vs nativo pendente. Versao do npm a confirmar (`>=10.8 <12` com Node 24).
- Template inicial de `/new` (welcome text) nao localizado nestas investigacoes — precisa ser encontrado para apontar a um exemplo T20 PT-BR.

**Produto (decisoes que bloqueiam implementacao)**
- `baseTheme`/`baseSnippets` do Tormenta20: `Blank` (skin do zero) vs `5ePHB` (herda layout/componentes).
- Terminologia PT-BR oficial.
- App deve rodar offline sem Mongo? (exigiria patch fora do escopo padrao).
