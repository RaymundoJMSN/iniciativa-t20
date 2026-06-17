# Iniciativa T20 — Design de Implementação

> Spec de design do fork **Iniciativa T20**: o Homebrewery reestilizado para Tormenta 20 (modelo RPG, 2 colunas), com snippets T20 e UI 100% em PT-BR, auto-hospedado em servidor Ubuntu (Oracle Cloud).
>
> Documentos-base (leitura obrigatória antes de implementar):
> - [`docs/kit-t20-estudo.md`](../../kit-t20-estudo.md) — estudo do Kit (paleta, tipografia, 20 regras, 19 assets, fichas, selo/disclaimer).
> - [`docs/homebrewery-arquitetura-t20.md`](../../homebrewery-arquitetura-t20.md) — arquitetura real do Homebrewery (tema/LESS, snippets, fontes/assets, i18n, deploy), com `arquivo:linha`.

---

## 0. Decisões travadas

| # | Decisão | Valor |
|---|---------|-------|
| D1 | Base do tema | `baseTheme: "Blank"` — pele T20 do zero, sem herdar 5ePHB |
| D2 | Escopo de layout | **Somente modelo RPG (2 colunas)**. Sem modelo Literatura |
| D3 | UI | **100% traduzida para PT-BR** (in-place, sem framework de i18n) |
| D4 | Fontes | Embutir as 3 (Tormenta20, Iowan Old Style, Source Sans Pro) com **crédito à Jambô** |
| D5 | Tema padrão | Tormenta20 vira o padrão do fork (novos brews já nascem T20) |
| D6 | Deploy | Servidor próprio **Ubuntu Linux `ubuntu@devilsworks`** (Oracle Cloud) + MongoDB. Dev no Windows |
| D7 | Legal | Todo documento exibe **Selo + disclaimer** obrigatórios (snippet de créditos) |
| D8 | GitHub | Repositório **público com tudo** (inclui fontes/Kit/assets proprietários — risco de copyright assumido pelo usuário; mitigar com crédito à Jambô visível) |
| D9 | CI/CD | **Deploy automático via GitHub Actions** (push na branch principal → SSH no devilsworks → pull+build+restart) |
| D10 | Domínio | `caseiro.raynathus.com.br` → DNS A para o IP do devilsworks → nginx/HTTPS → app :8000 |

---

## 1. Visão e escopo

**Objetivo:** quem usar o editor cria materiais que *parecem* páginas do livro de Tormenta 20 (Modelo de RPG), escrevendo markdown, com a interface toda em português e blocos prontos (ficha de ameaça, magia, box, capa) com terminologia T20.

**Dentro do escopo:**
- Novo tema `themes/V3/Tormenta20/` (visual completo do modelo RPG).
- Fontes T20 embutidas + 19 assets gráficos do kit.
- Snippets T20 em PT-BR.
- Tradução PT-BR de toda a UI voltada ao usuário.
- Tornar Tormenta20 o tema/template padrão.
- Deploy em Ubuntu (Oracle).

**Fora do escopo (agora):**
- Modelo Literatura (1 coluna).
- Painel `/admin` (fica em inglês no MVP).
- Framework de i18n / multi-idioma (fork é mono-idioma PT-BR).
- Rebrand de logos do próprio Homebrewery além do necessário.

---

## 2. Arquitetura da solução (decomposição)

Quatro frentes, conforme o grafo de dependências do mapa técnico (§8 da arquitetura):

```
Fase 0 — Infra + esqueleto do tema  (pré-requisito de tudo)
   ├──> A · Tema visual (CSS/LESS/fontes/assets)
   ├──> B · Snippets T20   (B fica visualmente correto só depois de A4)
   └──> C · UI PT-BR        (independente; paralelo desde o início)
                 └──> Fase Final · tornar Tormenta20 o padrão (depende de A,B,C)
   └──> Deploy · Ubuntu/Oracle (após MVP utilizável)
```

Cada frente A/B/C/Deploy vira um plano de implementação próprio. Este spec define o **design** de todas; o detalhamento passo-a-passo virá no(s) plano(s).

---

## 3. Fase 0 — Infra e esqueleto

Objetivo: ter o ambiente rodando e o tema "Tormenta20" aparecendo (mesmo vazio) no dropdown, destravando A/B/C.

1. **Ambiente dev (Windows):** `npm install` (engines: Node ≥20.18 <25, npm ≥10.8 <12; confirmar `npm -v`). `postinstall` roda `npm run build`.
2. **Mongo dev:** subir um MongoDB local p/ dev (Docker `mongo:latest` na 27017) — só pra `npm start` não dar `process.exit(1)`. Autoria/preview do tema é client-side, mas o servidor exige Mongo no boot.
3. **Rodar dev:** `NODE_ENV=local` + `npm start` → `http://localhost:8000` com Vite em middleware (HMR).
4. **Esqueleto do tema** `themes/V3/Tormenta20/`:
   - `settings.json` → `{ "name": "Tormenta 20", "renderer": "V3", "baseTheme": "Blank", "baseSnippets": false }` (sem `path`).
   - `style.less` mínimo (só um comentário + import de assets).
   - `snippets.js` → `export default [];`.
   - `dropdownTexture.png` + `dropdownPreview.png` (provisórios: copiar do Blank — **obrigatórios, build quebra sem eles**).
5. Rebuild → confirmar `themes/themes.json` regenerado com a entrada Tormenta20 e o tema visível no dropdown do metadataEditor.

> ⚠️ `generateAssetsPlugin.js` copia os 2 PNG sem try/catch e compila `style.less` via `less.render`; **qualquer erro de LESS ou PNG faltando quebra o build inteiro** (e o dev server). Validar o `.less` isolado antes de commitar.

---

## 4. Frente A — Tema visual

### 4.1 Estrutura de arquivos a criar

```
themes/V3/Tormenta20/
  settings.json            # baseTheme Blank
  style.less               # pele T20 (importa fontes + assets + variáveis)
  variables.less           # (opcional) paleta + caminhos de asset
  snippets.js              # manifesto (frente B)
  snippets/*.gen.js        # geradores (frente B)
  dropdownTexture.png      # arte final T20
  dropdownPreview.png      # arte final T20
themes/fonts/Tormenta20/
  fonts.less               # @font-face (3 famílias) — profundidade ../../../
  *.woff2                  # fontes convertidas
themes/assets/tormenta20/
  *.png                    # 19 assets do kit, renomeados kebab-case ASCII
```

### 4.2 Página (Modelo RPG)

Sobrescrever o `.page` do Blank (que é 215.9×279.4mm / Letter):

- **Tamanho:** `width: 205mm; height: 275mm;`
- **Margens espelhadas** (encadernação): interna 25mm / externa 18mm / topo 20mm / base 24mm — via `.page:nth-of-type(odd|even)` (par/ímpar) para alternar interna/externa. *(mecanismo exato de paridade a confirmar na impl)*
- **Colunas:** 2 colunas com calha (column-count:2). O Blank já tem `.useColumns()`; aplicar ao corpo da página.
- **Fundo:** `Background.png` a `background-size: cover` com opacidade 75% (camada de fundo, ex. `.page::before` com `opacity:.75`).

### 4.3 Paleta → custom properties

Mapear a paleta do kit (estudo §3) para `--HB_Color_*` (padrão do Homebrewery) + variáveis LESS do tema:

| Variável | Hex | Uso |
|----------|-----|-----|
| `@cor-titulo` | `#3f0f12` | títulos de capítulo/seção, nome de autores, molduras |
| `@cor-tabela` | `#6f3c27` | rodapé, títulos de tabela |
| `@vermelho` | `#b02b2e` | destaque, boxes/faixas sólidas, links |
| `@dourado` | `#f0dc82` | nº de página, aspas, título de box |
| `@bege` | `#e8d1b5` | fundo de logo/intertítulo de capa |
| `@cinza-magia` | `#727175` | label "tipo de magia" |
| `@zebra-a` | `#ddd9d5` | linha A de tabela |
| `@zebra-b` / `@bg` | `#f6f6f6` | linha B + fundo geral |
| `@texto` | `#000000` | corpo |
| `@texto-claro` | `#ffffff` | texto sobre fundo escuro |

### 4.4 Tipografia

`@font-face` em `themes/fonts/Tormenta20/fonts.less` (importado no topo do `style.less`):

| Família | Cortes | Papel |
|---------|--------|-------|
| **Tormenta20** | Regular | títulos display, capa, abertura de capítulo, nº de página, selo |
| **Iowan Old Style** | Regular/Bold/Italic/BoldItalic | títulos de seção (small-caps), títulos de tabela, citações |
| **Source Sans Pro** | Regular/Bold/Italic | corpo 9pt, legendas, linhas de ficha |

Escala por elemento conforme estudo §4 (`h1`=Tormenta20 display `#3f0f12`; seção=Iowan small-caps `#3f0f12`; tabela=Iowan `#6f3c27`; corpo=Source Sans 9pt; box=título dourado etc.). 1º parágrafo de seção sem `text-indent`; demais com recuo.

### 4.5 Componentes T20 → classes CSS + assets

| Componente | Classe/seletor | Assets do kit |
|------------|----------------|---------------|
| Capa | `.page:has(.frontCover)` / `.frontCover` | Divisor Vermelho Capa, fundo bege |
| Abertura de capítulo | `h1` / `.page:has(h1)::before` | Abertura de Capítulo pg1/pg2 |
| Título de partes/seção | `h2`/`h3` + `::after` | Título de Partes de Capítulos, Faixa Embaixo de Intertítulo |
| Tabela zebrada | `table`, `thead`, `tr:nth-child()` | Abertura e Fechamento de Tabela (régua via `border-image`) |
| Box vermelho | `.note` + variantes `.box-peq/.box-med/.box-gde/.box-h` | Box Vermelho peq/med/gde/completo/horizontal (`border-image`) |
| Ficha de ameaça | `.ameaca` (statblock T20) | Box vermelho como moldura; estrutura própria |
| Magia | `.magia` | label cinza `#727175`, nome em itálico |
| Poder | `.poder` | — |
| Bordas laterais | `.page::before/::after` | Borda Esquerda/Direita (espelhadas por paridade) |
| Rodapé + nº de página | `.pageNumber` / footer | Rodapé Esquerdo/Direito, Número de Página (dígito dourado) |
| Selo + disclaimer | `.creditos` (snippet B) | Iniciativa T20 - Selo (Cor).png |

Assets serrilhados → preferir `border-image` (escala melhor que background esticado). Pares espelhados (bordas/rodapés) → `:nth-of-type(even/odd)` mantém a mancha na margem interna.

### 4.6 Conversão de assets (pré-trabalho)

- **Fontes:** TTF/OTF → **WOFF2** (pipeline não converte). Ferramenta: `fonttools`/`woff2` ou online.
- **Imagens:** copiar os 19 PNG para `themes/assets/tormenta20/` com nomes **kebab-case ASCII** (sem espaço/acento — evita atrito de encoding no print). Manter PNG (com transparência onde houver).

---

## 5. Frente B — Snippets T20

### 5.1 Inventário de snippets (grupo "Tormenta 20")

| Snippet | Ícone | Gera |
|---------|-------|------|
| Capa | `fa-scroll` | título + autores `#3f0f12` + frase "Não oficial e não canônico" + divisor |
| Capítulo | `fa-bookmark` | tarja de abertura + título Tormenta20 |
| Box / Quadro | `fa-square` | aside vermelho, título dourado (modelo "regra importante", regra 16) |
| Ficha de Ameaça | `fa-skull` | statblock compacto, campos 1–22 (estudo §5.4), rótulos small-caps |
| Magia | `fa-hand-sparkles` | bloco de magia (tipo, execução, alcance, resistência) |
| Poder | `fa-bolt` | bloco de poder/habilidade (passiva/ativa) |
| Tabela T20 | `fa-table` | tabela com réguas serrilhadas + zebra |
| Créditos + Selo | `fa-stamp` | Selo (Cor) + disclaimer longo (obrigatório, §7/§8 estudo) |

### 5.2 Formato e registro

- `snippets/*.gen.js` exportam string de markdown Homebrewery (`{{classe ...}}`, `**Rótulo** :: valor`). Conteúdo já em PT-BR.
- `snippets.js` = manifesto `[{ groupName:'Tormenta 20', icon, view:'text', snippets:[...] }]`.
- **Registro obrigatório no cliente:** editar `client/homebrew/editor/snippetbar/snippetbar.jsx` (~linhas 12-24): `import V3_Tormenta20 from '@themes/V3/Tormenta20/snippets.js';` + chave `V3_Tormenta20` em `ThemeSnippets`. (Sem isso os botões não aparecem — gargalo conhecido.)
- As classes CSS emitidas (`.ameaca`, `.magia`, etc.) precisam existir no `style.less` (A4) para o preview ficar correto.

---

## 6. Frente C — UI PT-BR

### 6.1 Abordagem

**Tradução in-place, arquivo por arquivo, sem framework** (fork mono-idioma). ~120-180 strings em ~30 arquivos + 3 blocos de prosa.

### 6.2 Glossário PT-BR (proposto — revisar)

| EN | PT-BR proposto |
|----|----------------|
| brew | **documento** (ou "material") |
| theme | **tema** |
| snippet | **bloco** |
| Vault | **Cofre** |
| Share | **Compartilhar** |
| New / from blank / from file | **Novo / em branco / de arquivo** |
| Save / Saved | **Salvar / Salvo** |
| Get PDF / Print | **Baixar PDF / Imprimir** |
| Source / Style / Properties | **Código / Estilo / Propriedades** |
| front cover | **capa** |

### 6.3 Ordem de tradução

1. `index.html` (`lang="pt-BR"`, `<title>`, prefixos do script inline).
2. Navbar + navitems (`client/homebrew/navbar/*`).
3. Páginas (`client/homebrew/pages/*` — home, edit, new, account, vault, share, error, user).
4. `metadataEditor.jsx` + `toolBar.jsx` (atenção a `title=`/tooltips e `confirm()`).
5. `errorPage/errors/errorIndex.js` — **preservar interpolações `${props...}` e markdown**.
6. Reescrever `welcome_msg.md` / `faq.md` com sabor T20 (mais reescrita que tradução).
7. `/admin` → fica em inglês (fora do MVP).

---

## 7. Fase Final — Tornar Tormenta20 o padrão

1. `server/brewDefaults.js` (~:14) → `theme: 'Tormenta20'` (mantém `renderer:'V3'`).
2. `metadataEditor.jsx` (~:35-37) → defaults `renderer:'V3'`, `theme:'Tormenta20'`.
3. Template inicial de `/new` (welcome) → conteúdo de exemplo T20 em PT-BR (localizar arquivo do welcome text — `welcome_msg.md` ou server; a confirmar).

---

## 8. GitHub + Deploy (CI/CD → Ubuntu/Oracle)

### 8.1 Papéis (GitHub não roda o app)

GitHub Pages só serve estático; o Homebrewery é Node+Mongo → **não roda no GitHub**. Divisão:
- **GitHub** = repositório do código (**público, com tudo** — D8) + automação (Actions).
- **`ubuntu@devilsworks`** (Oracle Ubuntu) = roda o app (Node + MongoDB + nginx).
- **Domínio** `caseiro.raynathus.com.br` → DNS **A** para o IP público do devilsworks → nginx 443 → app 8000.

```
git push (branch main) ─► GitHub Actions ─►(SSH)─► devilsworks: git pull + npm ci + build + restart serviço
caseiro.raynathus.com.br ─► DNS A ─► IP devilsworks ─► nginx (HTTPS) ─► localhost:8000 (app)
```

### 8.2 Setup do GitHub
1. Criar repo **público** (ex. `raynathus/iniciativa-t20`); `git remote` apontando o clone atual; primeiro push (`main`).
2. Decidir versionar tudo (D8): fontes Tormenta20/Iowan, Kit, 19 PNG vão ao repo. Garantir **crédito à Jambô** no README + rodapé do app.
3. **Secrets do repo** (Settings → Secrets): `SSH_HOST` (IP/host devilsworks), `SSH_USER` (`ubuntu`), `SSH_KEY` (chave privada de deploy), `MONGODB_URI` se aplicável.

### 8.3 Provisionar o servidor `devilsworks` (uma vez)
- **Node** ≥20.18 <25 (nvm); **MongoDB** via apt (`mongodb-org`) ou Docker, em `mongodb://127.0.0.1/homebrewery`.
- **nginx** reverse proxy (443→8000) + **Let's Encrypt** (certbot) para `caseiro.raynathus.com.br`.
- **Firewall:** abrir 80/443 no Security List da Oracle **e** no `ufw`/`iptables` (a Oracle bloqueia por padrão em ambos os níveis).
- **Processo:** app como serviço (**systemd** unit ou **pm2**) com `NODE_ENV=production`.
- Chave SSH pública de deploy autorizada em `~ubuntu/.ssh/authorized_keys`.

### 8.4 GitHub Action (deploy)
`.github/workflows/deploy.yml`: on push em `main` → job que faz `ssh` no devilsworks e roda script de deploy: `cd <repo> && git pull && npm ci && npm run build && (pm2 restart iniciativa-t20 || systemctl --user restart ...)`. (Build no servidor; alternativamente buildar no Action e enviar `build/` via rsync.)

### 8.5 DNS (lado do usuário)
No painel do domínio `raynathus.com.br`: criar registro **A** `caseiro` → IP público do devilsworks. (Se IPv6, AAAA também.) Propagar antes do certbot.

### 8.6 Observações
- **Legal:** crédito à Jambô no README + rodapé/sobre; snippet de créditos garante Selo + disclaimer nos documentos.
- *(a confirmar)* versão do npm no servidor (`>=10.8 <12`); Google OAuth fica off (sem client id) — login via `/local/login` ou ajustar `local_environments`.
- *(a confirmar)* `devilsworks` = a instância Oracle Ubuntu (assumido).

---

## 9. Verificação (por frente)

| Frente | Como validar |
|--------|--------------|
| Fase 0 | `npm start` sobe; tema Tormenta20 aparece no dropdown; build não quebra |
| A | Preview de um brew T20 bate com o Modelo de RPG (cores, fontes, 2 colunas, margens); print/PDF idêntico ao preview |
| B | Cada snippet insere markdown; preview renderiza o componente estilizado (depende de A4) |
| C | Navegar toda a UI sem texto em inglês (exceto /admin); sem string quebrada; interpolações de erro intactas |
| Final | `/new` nasce com tema T20 e exemplo PT-BR |
| Deploy | App no Ubuntu acessível via domínio/HTTPS; brews salvam no Mongo |

---

## 10. Riscos e questões em aberto

- **Paridade de margens espelhadas:** mecanismo exato no Homebrewery (`:nth-of-type` por página) a confirmar na implementação.
- **Renderer V3 `{{classe ...}}`:** confirmar se há allowlist de classes no parser ou se qualquer classe passa (depende só do CSS existir).
- **Conversão de fontes p/ WOFF2:** manual (pipeline não converte). Definir ferramenta.
- **Template de `/new`:** localizar o arquivo do welcome text para apontar ao exemplo T20.
- **Glossário (§6.2):** confirmar terminologia (sobretudo `brew`→? e `snippet`→?).
- **`themes/themes.json`** é tracked mas reescrito pelo build — commitar a versão gerada, não editar à mão.
- **Licença de fontes:** ok para o servidor pessoal com crédito à Jambô; reavaliar se algum dia virar público.

---

## 11. Próximos passos

1. Revisão deste spec pelo usuário.
2. Ajustar glossário (§6.2) e itens "a confirmar".
3. Gerar plano(s) de implementação (writing-plans), começando por **Fase 0 → Frente A**.
