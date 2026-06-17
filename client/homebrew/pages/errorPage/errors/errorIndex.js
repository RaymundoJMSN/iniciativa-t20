import dedent from 'dedent';

const loginUrl = 'https://www.naturalcrit.com/login';

// Prevent parsing text (e.g. document titles) as markdown
const escape = (text = '')=>{
	return text.split('').map((char)=>`&#${char.charCodeAt(0)};`).join('');
};

//001-050 : Brew errors
//050-100 : Other pages errors

const errorIndex = (props)=>{
	return {
		// Default catch all
		'00' : dedent`
			## Ocorreu um erro desconhecido!

			Não temos certeza do que aconteceu, mas nosso servidor não conseguiu encontrar o que
			você estava procurando.`,

		// General Google load error
		'01' : dedent`
			## Ocorreu um erro ao recuperar este documento do Google Drive!

			O Google consegue ver o documento neste link, mas relatou um erro ao tentar recuperá-lo.

			### Renovando suas Credenciais do Google

			Esse problema provavelmente é causado por uma falha nas suas credenciais do Google; se você é o dono deste arquivo, os passos a seguir podem resolver o problema:

			- Acesse https://www.naturalcrit.com/login e clique em logout, se houver (em texto pequeno na parte inferior da página).
			- Clique em "Sign In with Google", o que renovará suas credenciais do Google.
			- Após concluir o processo de login, retorne à Iniciativa T20 e atualize/recarregue a página para que ela possa captar as credenciais atualizadas.
			- Se essa era a origem do problema, ele já deve estar resolvido.

			Se seguir esses passos não resolver o problema, por favor avise-nos!`,

		// Google Drive - 404 : brew deleted or access denied
		'02' : dedent`
			## Não conseguimos encontrar este documento no Google Drive!

			Este arquivo foi salvo no Google Drive, mas este link não funciona mais.
			${props.brew.authors?.length > 0
		? `Observe que este documento pertence à conta da Iniciativa T20 **${props.brew.authors[0]}**,
				${props.brew.account
		? `que é
						${props.brew.authors[0] == props.brew.account
		? `a sua conta.`
		: `não é a sua conta (você está conectado no momento como **${props.brew.account}**).`
}`
		: 'e você não está conectado a nenhuma conta no momento.'
}`
		: ''
}
			A Iniciativa T20 não consegue excluir arquivos do Google Drive por conta própria, então
			há três possibilidades mais prováveis:
			:
			- **Os arquivos no Google Drive podem ter sido excluídos acidentalmente.** Verifique
			na conta do Google Drive que é dona deste documento (ou peça ao dono que faça isso),
			e certifique-se de que a pasta da Iniciativa T20 ainda está lá, e de que ela contém seus documentos
			como arquivos de texto.
			- **Você pode ter alterado as configurações de compartilhamento dos seus arquivos.** Se os arquivos
			ainda estão no Google Drive, altere todos eles para serem compartilhados *com qualquer pessoa que tenha
			o link* para que a Iniciativa T20 possa acessá-los.
			- **A Conta do Google pode estar encerrada.** O Google pode ter removido a conta
			por inatividade ou por violar uma política do Google. Certifique-se de que o dono ainda consegue
			acessar o Google Drive normalmente e enviar/baixar arquivos nele.

			Se o arquivo não for encontrado, o Google Drive geralmente coloca seu arquivo na Lixeira por
			30 dias. Supondo que a lixeira ainda não tenha sido esvaziada, pode valer a pena verificar.
			Você também pode encontrar a aba Atividade no lado direito da página do Google Drive, que
			mostra a atividade recente no Google Drive. Isso pode ajudar a identificar a data exata
			em que o documento foi excluído ou movido, e por quem.
			:
			Se o documento ainda não for encontrado, algumas pessoas tiveram sucesso pedindo ao Google para recuperar
			arquivos excluídos acidentalmente neste link:
			https://support.google.com/drive/answer/1716222?hl=en&ref_topic=7000946.
			Na parte inferior da página há um botão que diz *Send yourself an Email*
			e você receberá instruções sobre como solicitar a restauração dos arquivos.
			:
			Observe também que, se você preferir não usar seu Google Drive para armazenamento, sempre pode
			alterar o local de armazenamento de um documento clicando no ícone do Google Drive ao lado do
			título do documento e escolhendo *transferir meu documento para/do Google Drive*.`,

		// User is not Authors list
		'03' : dedent`
		## O usuário conectado no momento não tem acesso de edição a este documento.

		Se você acredita que deveria ter acesso a este documento, peça a um de seus autores que o convide
		como autor abrindo a página de Edição do documento, acessando a aba {{fa,fa-info-circle}}
		**Propriedades** e adicionando seu nome de usuário à lista de "autores convidados". Em seguida,
		você pode tentar acessar este documento novamente.

		:

		**Título do Documento:** ${escape(props.brew.brewTitle) || 'Não foi possível mostrar o título'}

		**Autores Atuais:** ${props.brew.authors?.map((author)=>{return `[${author}](/user/${encodeURIComponent(author)})`;}).join(', ') || 'Não foi possível listar os autores'}

		[Clique aqui para ser redirecionado à página de compartilhamento do documento.](/share/${props.brew.shareId})`,

		// User is not signed in; must be a user on the Authors List
		'04' : dedent`
		## É necessário entrar para editar este documento.

		Você precisa estar conectado a uma das contas listadas como autora deste documento.
		O usuário não está conectado. Por favor, entre [aqui](${loginUrl}).

		:

		**Título do Documento:** ${escape(props.brew.brewTitle) || 'Não foi possível mostrar o título'}

		**Autores Atuais:** ${props.brew.authors?.map((author)=>{return `[${author}](/user/${encodeURIComponent(author)})`;}).join(', ') || 'Não foi possível listar os autores'}

		[Clique aqui para ser redirecionado à página de compartilhamento do documento.](/share/${props.brew.shareId})`,


		// Brew load error
		'05' : dedent`
		## Nenhum documento da Iniciativa T20 foi encontrado.

		O servidor não conseguiu localizar o documento da Iniciativa T20. Provavelmente foi excluído por
		seu dono.

		:

		**Acesso solicitado:** ${props.brew.accessType}

		**ID do Documento:**  ${props.brew.brewId}`,

		// Brew save error
		'06' : dedent`
		## Não foi possível salvar o documento da Iniciativa T20.

		Ocorreu um erro ao tentar salvar o documento da Iniciativa T20.`,

		// Brew delete error
		'07' : dedent`
		## Não foi possível excluir o documento da Iniciativa T20.

		Ocorreu um erro ao tentar remover o documento da Iniciativa T20.

		:

		**ID do Documento:**  ${props.brew.brewId}`,

		// Author delete error
		'08' : dedent`
		## Não foi possível remover o usuário do documento da Iniciativa T20.

		Ocorreu um erro ao tentar remover o usuário da lista de autores do documento da Iniciativa T20!

		:

		**ID do Documento:**  ${props.brew.brewId}`,

		// Theme load error
		'09' : dedent`
		## Nenhum documento de tema da Iniciativa T20 foi encontrado.

		O servidor não conseguiu localizar o documento da Iniciativa T20. Provavelmente foi excluído por
		seu dono.

		:

		**Acesso solicitado:** ${props.brew.accessType}

		**ID do Documento:**  ${props.brew.brewId}`,

		// Theme Not Valid
		'10' : dedent`
		## O tema selecionado não está marcado como um tema.

		O documento selecionado como tema existe, mas não foi marcado para uso como tema com a tag \`theme:meta\`.

		Se o documento selecionado é o seu, você pode designá-lo como tema adicionando a tag \`theme:meta\`.`,

		// ID validation error
		'11' : dedent`
		## Nenhum documento da Iniciativa T20 foi encontrado.

		O servidor não conseguiu localizar o documento da Iniciativa T20. O ID do Documento falhou na verificação de validação.

		:

		**ID do Documento:**  ${props.brew.brewId}`,

		// Google ID validation error
		'12' : dedent`
		## Nenhum documento do Google foi encontrado.

		O servidor não conseguiu localizar o documento do Google. O ID do Google falhou na verificação de validação.

		:

		**ID do Documento:**  ${props.brew.brewId}`,

		// Database Connection Lost
		'13' : dedent`
		## A conexão com o banco de dados foi perdida.

		O servidor não conseguiu se comunicar com o banco de dados.`,

		//account page when account is not defined
		'50' : dedent`
		## Você não está conectado

		Você está tentando acessar a página da conta, mas não está conectado a nenhuma conta.

		Por favor, entre ou cadastre-se em nossa [página de login](https://www.naturalcrit.com/login?redirect=https://homebrewery.naturalcrit.com/account).`,

		// Brew locked by Administrators error
		'51' : dedent`
		## Este documento foi bloqueado.

		Apenas um autor pode solicitar que este bloqueio seja removido.

		:

		**ID do Documento:**  ${props.brew.brewId}

		**Título do Documento:** ${escape(props.brew.brewTitle)}

		**Autores do Documento:**  ${props.brew.authors?.map((author)=>{return `[${author}](/user/${encodeURIComponent(author)})`;}).join(', ') || 'Não foi possível listar os autores'}`,

		// ####### Admin page error #######
		'52' : dedent`
		## Acesso Negado
		Você precisa fornecer as credenciais corretas de administrador para acessar esta página.`,

		// ####### Lock Errors

		'60' : dedent`Erro de Bloqueio: Geral`,

		'61' : dedent`Erro ao Obter Bloqueio: Não foi possível obter a contagem de bloqueios`,

		'62' : dedent`Erro ao Definir Bloqueio: Não foi possível bloquear`,

		'63' : dedent`Erro ao Definir Bloqueio: Documento não encontrado`,

		'64' : dedent`Erro ao Definir Bloqueio: Já está bloqueado`,

		'65' : dedent`Erro ao Remover Bloqueio: Não foi possível desbloquear`,

		'66' : dedent`Erro ao Remover Bloqueio: Documento não encontrado`,

		'67' : dedent`Erro ao Remover Bloqueio: Não está bloqueado`,

		'68' : dedent`Erro ao Obter Revisão de Bloqueio: Não foi possível obter as solicitações de revisão`,

		'69' : dedent`Erro ao Definir Revisão de Bloqueio: Não foi possível definir a solicitação de revisão`,

		'70' : dedent`Erro ao Definir Revisão de Bloqueio: Documento não encontrado`,

		'71' : dedent`Erro ao Definir Revisão de Bloqueio: Revisão já solicitada`,

		'72' : dedent`Erro ao Remover Revisão de Bloqueio: Não foi possível limpar a solicitação de revisão`,

		'73' : dedent`Erro ao Remover Revisão de Bloqueio: Documento não encontrado`,

		// ####### Other Errors

		'90' : dedent` Ocorreu um erro inesperado ao procurar por estes documentos.  
            Tente novamente em alguns minutos.`,

		'91' : dedent` Ocorreu um erro inesperado ao tentar obter o total de documentos.`,
	};
};

export default errorIndex;
