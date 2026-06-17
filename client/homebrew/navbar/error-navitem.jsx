import './error-navitem.less';
import React from 'react';
import Nav from './nav.jsx';

const ErrorNavItem = ({ error = '', clearError })=>{
	const response    = error.response;
	const errorCode   = error.code;
	const status      = response?.status;
	const HBErrorCode = response?.body?.HBErrorCode;
	const message     = response?.body?.message;

	let errMsg = '';
	try {
		errMsg += `${error.toString()}\n\n`;
		errMsg += `\`\`\`\n${error.stack}\n`;
		errMsg += `${JSON.stringify(response?.error, null, '  ')}\n\`\`\``;
		console.log(errMsg);
	} catch {}

	if(status === 409) {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				{message ?? 'Conflito: atualize a pagina para obter as mudancas mais recentes'}
			</div>
		</Nav.item>;
	}

	if(status === 412) {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				{message ?? 'Seu cliente esta desatualizado. Salve suas mudancas em outro lugar e atualize a pagina.'}
			</div>
		</Nav.item>;
	}

	if(HBErrorCode === '04') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				Voce nao esta mais autenticado como autor
				deste documento! Voce foi desconectado em outra
				janela? Acesse nossa pagina de login e tente novamente!
				<br></br>
				<a target='_blank' rel='noopener noreferrer'
					href={`https://www.naturalcrit.com/login?redirect=${window.location.href}`}>
					<div className='confirm'>
						Entrar
					</div>
				</a>
				<div className='deny'>
					Agora nao
				</div>
			</div>
		</Nav.item>;
	}

	if(response?.body?.errors?.[0].reason == 'storageQuotaExceeded') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
		Ops!
			<div className='errorContainer' onClick={clearError}>
			Nao foi possivel salvar porque seu Google Drive parece estar cheio!
			</div>
		</Nav.item>;
	}

	if(response?.req.url.match(/^\/api.*Google.*$/m)){
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				Parece que suas credenciais do Google
				expiraram! Acesse nossa pagina de login para sair
				e entrar novamente com o Google,
				e entao tente salvar de novo!
				<br></br>
				<a target='_blank' rel='noopener noreferrer'
					href={`https://www.naturalcrit.com/login?redirect=${window.location.href}`}>
					<div className='confirm'>
						Entrar
					</div>
				</a>
				<div className='deny'>
					Agora nao
				</div>
			</div>
		</Nav.item>;
	}

	if(HBErrorCode === '09') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				Parece que houve um problema ao recuperar
				o tema, ou um tema do qual ele herda,
				para este documento. Verifique se o documento <a className='lowercase' target='_blank' rel='noopener noreferrer' href={`/share/${response.body.brewId}`}>
					{response.body.brewId}</a> ainda existe!
			</div>
		</Nav.item>;
	}

	if(HBErrorCode === '10') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				Parece que o documento que voce selecionou
				como tema nao esta marcado para uso como
				tema. Verifique se o
				documento <a className='lowercase' target='_blank' rel='noopener noreferrer' href={`/share/${response.body.brewId}`}>
					{response.body.brewId}</a> possui a tag <span className='lowercase'>meta:theme</span>!
			</div>
		</Nav.item>;
	}

	if(HBErrorCode === '13') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				O servidor perdeu a conexao com o banco de dados.
			</div>
		</Nav.item>;
	}

	if(errorCode === 'ECONNABORTED') {
		return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
			Ops!
			<div className='errorContainer' onClick={clearError}>
				A requisicao ao servidor foi interrompida ou expirou.
				Isso pode acontecer por um problema de rede, ou ao
				tentar salvar um documento especialmente grande.
				Verifique sua conexao com a internet e tente novamente.
			</div>
		</Nav.item>;
	}

	return <Nav.item className='save error' icon='fas fa-exclamation-triangle'>
		Ops!
		<div className='errorContainer'>
			Parece que houve um problema ao salvar. <br />
			Relate o problema <a target='_blank' rel='noopener noreferrer' href={`https://github.com/naturalcrit/homebrewery/issues/new?template=save_issue.yml&error-code=${encodeURIComponent(errMsg)}`}>
			aqui
			</a>.
		</div>
	</Nav.item>;
};

export default ErrorNavItem;
