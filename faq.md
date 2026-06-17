```css
h5 {
	font-size: .35cm !important;
}

.taskList li {
	list-style-type : none;
}

.taskList li input {
	margin-left : -0.52cm;
	transform: translateY(.05cm);
	filter: brightness(1.1) drop-shadow(1px 2px 1px #222);
}

.taskList li input[checked] {
	filter: sepia(100%) hue-rotate(60deg) saturate(3.5) contrast(4) brightness(1.1) drop-shadow(1px 2px 1px #222);
}

pre + * {
	margin-top: 0.17cm;
}

pre {
	margin-top: 0.17cm;
}

.page pre code {
	word-break:break-word;
}

.page p + pre {
	margin-top : 0.1cm;
}

.page h1 + p:first-letter {
	all:unset;
}

.page .toc ul {
	margin-top:0;
}

.page h3 {
	font-family:inherit;
	font-size:inherit;
	border:inherit;
	margin-top:12px;
	margin-bottom:5px
}

.page h3:before {
	content:'P.';
	position:absolute;
	font-size:2em;
	margin-left:-1.2em;	
}

.page .columnSplit + h3 {
	margin-top:0;
}
```

# Perguntas Frequentes
{{wide Atualizado em 15 de abril de 2023}}


### Existe uma forma de restaurar uma versão anterior do meu documento?

No seu documento existe um ícone, :fas_clock_rotate_left:, que abre um menu com as versões do seu documento, guardadas da mais nova para a mais antiga, com até uma semana de idade. Por causa da quantidade de duplicatas que essa função cria, essas informações ficam guardadas **no seu navegador**. Então, se você desinstalá-lo, limpar seus cookies e dados do site, ou trocar de computador, as informações não estarão mais lá.


### Trabalhei num documento por X horas e, de repente, todo o texto sumiu!

Isso normalmente acontece quando você seleciona todo o texto sem querer (arrastando o cursor) e começa a digitar, o que sobrescreve a seleção. Não entre em pânico e não atualize a página nem recarregue o documento ainda, pois provavelmente ele já foi salvo automaticamente nesse estado. Basta apertar CTRL+Z quantas vezes forem necessárias para desfazer suas últimas alterações e você voltará para onde estava. Depois, lembre-se de salvar o documento no estado "bom".

Você também pode carregar uma versão do histórico antiga o bastante para ter todo o texto, usando o botão de versões do histórico :fas_clock_rotate_left:.

\column

### Por que só o Chrome é suportado?

Navegadores diferentes têm capacidades diferentes de lidar com a estilização da web (ou "CSS"). Por exemplo, o Firefox atualmente não consegue lidar bem com quebras de coluna, mas o Chrome não tem problema algum. Além disso, cada navegador tem pequenas diferenças na forma de exibir as páginas, o que pode ser um pesadelo de compensar. Essas capacidades mudam com o tempo e temos esperança de que cada atualização dos navegadores preencha essas lacunas e adicione mais recursos. Até lá, vamos desenvolver pensando em um único navegador.

### Tanto eu quanto meu amigo usamos o Chrome, mas os documentos ainda ficam diferentes. Por quê?

Um pixel pode ser renderizado de forma diferente dependendo do navegador, sistema operacional, computador ou tela. A menos que você e seu amigo tenham exatamente a mesma configuração, é provável que o seu documento online tenha diferenças bem pequenas. Porém, às vezes alguns pixels são tudo o que basta para criar diferenças *grandes*... por exemplo, um pixel a mais pode fazer uma linha de texto inteira, ou até uma ficha de ameaça, ficar sem espaço na coluna atual e ser empurrada para a próxima coluna ou até para fora da página.

A melhor forma de evitar isso é deixar um espaço no fim da coluna equivalente a uma ou duas linhas de texto. Ou crie um PDF do seu documento para compartilhar — os PDFs são feitos para serem renderizados da mesma forma em todos os dispositivos.

### Por que preciso criar uma nova página manualmente? Por que o texto não flui entre as páginas?

Um documento da Iniciativa T20 é, em sua essência, um documento HTML e CSS, e atualmente é limitado pelas especificações dessas tecnologias. No momento não é possível fazer o conteúdo fluir de dentro de uma caixa ("página") para dentro de outra caixa. Parece provável que um dia o CSS adicione essa capacidade e, se/quando isso acontecer, a Iniciativa T20 vai adotá-la o mais rápido possível.

### Onde consigo imagens?
A Iniciativa T20 não fornece imagens para uso além de alguns elementos de página e imagens de exemplo para os trechos. Você precisará encontrar suas próprias imagens e garantir que está seguindo os requisitos de licença adequados.

Depois de ter uma imagem que queira usar, recomenda-se hospedá-la em algum lugar que não vá desaparecer; é comum as pessoas hospedarem suas imagens no [Imgur](https://www.imgur.com). Crie uma conta e envie suas imagens para lá, e use o *Link Direto* que aparece quando você clica na imagem dentro da galeria, no seu documento da Iniciativa T20.

\page

### Uma fonte específica não funciona no meu idioma. O que faço?
As fontes usadas podem não conter um glifo/caractere de que você precisa. Infelizmente, pode ser difícil adicionar mais glifos (especialmente glifos complicados). Se precisar de algo rápido, talvez seja necessário procurar uma fonte alternativa no [Google Fonts](https://fonts.google.com).

### Tenho bordas brancas na parte de baixo/nas laterais da pré-visualização de impressão.

O tamanho de papel da Iniciativa T20 e o tamanho de papel da sua impressão não combinam.

Verifique se, na caixa de diálogo "Imprimir", o Tamanho do Papel corresponde ao tamanho de página configurado na Iniciativa T20.


### Digitar `#### Aderência` no editor de texto não mostra o cabeçalho na página finalizada?

Seu software de bloqueio de anúncios está confundindo o seu texto com um anúncio. Recomendamos adicionar a Iniciativa T20 à lista de permissões do seu bloqueador de anúncios, já que não temos nenhum anúncio.

### Meu nome de usuário aparece como _oculto_ quando vejo meus documentos no Cofre. Por quê?

Seu nome de usuário provavelmente é o seu endereço de e-mail, e nosso código está identificando isso e protegendo a sua identidade. Isso permanecerá assim, mas nenhuma informação será vazada ou compartilhada.
