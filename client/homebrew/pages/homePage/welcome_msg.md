```css
.page {
	padding-bottom : 1.1cm;
}
```

# A Iniciativa T20 *V3*
Bem-vindo, viajante de Arton. Sente-se e conte-nos o que viu: as ameaças que espreitam sob a Tempestade, os artefatos perdidos cujos mistérios ainda aguardam, os poderes e perícias que você dominou ao longo da jornada.

### Material de Tormenta 20 do jeito fácil
A **Iniciativa T20** facilita criar e compartilhar materiais com a cara dos livros de Tormenta 20. Você escreve em [Markdown](https://help.github.com/articles/markdown-basics/) e um toque de CSS dá vida às suas obras.

**Experimente!** Edite o texto à esquerda e veja a *atualização ao vivo* à direita. Nem todo botão aparece nesta página de demonstração — clique em **Novo** {{fas,fa-plus-square}} na barra acima para começar com todos os recursos!

### Editando e compartilhando
Ao criar um novo documento, ele recebe um *link de edição* e um *link de compartilhamento*.

O *link de edição* é onde você escreve. Se editar logado, você é adicionado como autor da obra, e ninguém mais pode editá-la até que você adicione essa pessoa como autor pela aba {{fa,fa-info-circle}} **Propriedades**. Obras sem nenhum autor ainda podem ser editadas por qualquer um com o *link de edição* — cuidado com quem compartilha.

Qualquer pessoa com o *link de compartilhamento* acessa uma versão somente-leitura da sua obra.

{{note
##### Gerando PDF
A impressão em PDF funciona melhor no Google Chrome. Se tiver problemas de qualidade/consistência, prefira o Chrome.

Depois de clicar em **Imprimir** na barra, uma nova aba abre com a caixa de impressão:
* Em **Destino**, escolha "Salvar como PDF"
* Em **Opções**, ative "Gráficos de plano de fundo"
* As páginas já vêm no tamanho do livro (205×275 mm)
* Mande imprimir e pronto!
}}

{{ameaca,position:absolute,bottom:130px,left:90px,width:240px
## Lobo Atroz
**ND** :: 1 (animal)
**Defesa** :: 13
**Pontos de Vida** :: 13

---
**Iniciativa** :: +5
**Percepção** :: +7 (faro)
**Deslocamento** :: 12m (8q)
**Ataque** :: mordida +6 (1d8+4)
}}

{{creditos,position:absolute,bottom:150px,left:360px,width:200px
<div class='selo'></div>
<div class='disclaimer'>Este conteúdo é um material gratuito não-oficial, feito por fãs, sem aprovação ou orientação da Jambô Editora, e sem fins lucrativos. Parte do material utilizado é propriedade da Jambô Editora.</div>
}}

{{pageNumber 1}}

\column

## Crie como nos livros
O tema **Tormenta 20** reproduz o Modelo de RPG: página de 205×275 mm em duas colunas, a paleta oficial, as fontes do kit (Tormenta20, Iowan Old Style e Source Sans Pro) e blocos prontos — ficha de ameaça, box, magia, capa e mais.

Use os **trechos** {{fas,fa-dragon}} no topo do editor para inserir esses blocos sem decorar sintaxe: posicione o cursor, escolha o trecho e ajuste o conteúdo.

### Sempre evoluindo
A Iniciativa T20 é um projeto de fã, gratuito e de código aberto. Veja as novidades no [changelog](/changelog).

### Dúvidas ou problemas?
* Confira primeiro as [Perguntas Frequentes](/faq).
* Relate problemas técnicos no [repositório no GitHub](https://github.com/RaymundoJMSN/iniciativa-t20).

### Sobre os direitos
A ferramenta é baseada no [Homebrewery](https://github.com/naturalcrit/homebrewery) (licença MIT). **Tormenta 20**, o cenário de **Arton** e a identidade visual aqui reproduzida são propriedade da **Jambô Editora**; este é um material de fã, não-oficial, sem fins lucrativos.

\page

## Markdown+
A Iniciativa T20 quer deixar a criação o mais simples possível: um editor ao vivo com sintaxe Markdown, mais legível e rápida de escrever do que HTML cru. A partir do renderizador V3, há uma versão estendida do Markdown com sintaxe extra.

### Chaves duplas
O Markdown padrão não tem equivalente às tags `span`/`div`. Por isso usamos `{{ }}` para criar elementos com classes, ids e CSS — separados por vírgula, sem espaços. Use aspas duplas quando um valor tiver espaços.

#### Span
Meu autor favorito é {{caneta,#autor,color:orange,font-family:"trebuchet ms" Leonel Caldela}}. O texto laranja tem a classe `caneta`, id `autor`, cor laranja e outra fonte. O primeiro espaço fora das aspas marca o início do conteúdo.

#### Bloco
{{roxo,#livro,text-align:center,background:#aa88aa55
Meu livro favorito é o Livro Básico. Este bloco tem a classe `roxo`, id `livro` e texto centralizado com fundo colorido. As chaves de abertura e fechamento ficam em linhas separadas do conteúdo.
}}

#### Injeção
Para qualquer elemento fora de um span/bloco, você pode *injetar* atributos com a mesma sintaxe, mas com chave simples, na linha imediatamente após o elemento.

Elementos em linha como *itálico* {color:#b02b2e} exigem a injeção na mesma linha.

##### Um Título Vermelho
{color:#b02b2e,text-align:center}

### Espaçamento vertical
Uma linha em branco maior é feita com uma sequência de `:` sozinhos numa linha. Mais `:` = mais espaço.

::

Bem melhor que vários `<br>`.

### Listas de definição
**Exemplo** :: O V3 usa *listas de definição* do HTML para criar "listas" com recuo deslocado — perfeitas para fichas e blocos de magia.

### Quebras de coluna e página
Quebre colunas e páginas com `\column` e `\page`.

\column

### Tabelas
As tabelas saem zebradas, com cabeçalho em versalete marrom — a cara das tabelas do livro.

##### Exemplo
| Perícia      | Atributo | Treinada |
|:-------------|:--------:|:--------:|
| Acrobacia    |   Des    |   não    |
| Atletismo    |   For    |   não    |
| Conhecimento |   Int    |   sim    |
| Misticismo   |   Int    |   sim    |

## Imagens
Imagens precisam estar hospedadas online (ex.: [Imgur](https://www.imgur.com)). Use o endereço da imagem para referenciá-la na sua obra. Com a *injeção de chaves* você dá id, classes ou CSS à imagem.

## Trechos (snippets)
A Iniciativa T20 traz uma série de *trechos de código* no topo do editor para você criar rápido. Posicione o cursor, escolha um trecho e ajuste o que precisar.

## Editor de Estilo
{{fa,fa-paint-brush}} À direita da barra de trechos fica a aba **Estilo**, que aceita CSS sem precisar de tags `<style>` — tudo que iria dentro delas pode entrar ali.

{{pageNumber 2}}
