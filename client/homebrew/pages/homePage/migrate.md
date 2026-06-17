# Como converter um documento Legado para o v3

A **Iniciativa T20** é um fork do Homebrewery reestilizado para o **Tormenta 20**.

Este guia ajuda a converter documentos do renderizador **Legado** para o renderizador **v3**, que é o motor usado nos materiais novos.

**O primeiro passo é mudar o renderizador do editor de `Legado` para `v3`.** Esse é o renderizador para o qual desenvolvemos os recursos daqui em diante.

## Substituições simples

A tabela abaixo mostra elementos do formato Legado e seus equivalentes no v3. Um simples localizar/substituir resolve a maior parte.

| Legado / Outro  | v3                           |
|:----------------|:-----------------------------|
| `\pagebreak`    | `\page`                      |
| `======`        | `\page`                      |
| `\pagebreaknum` | `{{pageNumber,auto}}\n\page` |
| `@=====`        | `{{pageNumber,auto}}\n\page` |
| `\columnbreak`  | `\column`                    |
| `.phb`          | `.page`                      |

## Divs com classe ou estilo

Qualquer trecho que dependa da sintaxe abaixo pode ser trocado pela nova sintaxe de chaves do v3:

```
<div class="classTable wide">
...
</div>
```

O exemplo acima equivale ao seguinte na sintaxe v3:

```
{{classTable,wide
...
}}
```

## Notas

No Legado, as notas usam a sintaxe de citação do markdown (`>`). No v3, isso é substituído pela sintaxe de chaves:

```
{{note
##### Título
Informação
}}
```

## Blocos de citação

Blocos de citação começam com o caractere `>` no início da linha. No renderizador v3 eles praticamente não têm significado nem estilo de CSS, então você pode usá-los livremente ao montar seu documento ou criar temas, sem se preocupar que o CSS afete outras partes do material.
