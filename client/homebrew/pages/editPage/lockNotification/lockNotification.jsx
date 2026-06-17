import './lockNotification.less';
import * as React from 'react';
import request from '../../../utils/request-middleware.js';
import Dialog from '../../../../components/dialog.jsx';

function LockNotification(props) {
	props = {
		shareId         : 0,
		disableLock     : ()=>{},
		lock            : {},
		message         : 'Nao foi possivel recuperar a mensagem de bloqueio',
		reviewRequested : false,
		...props
	};

	const [reviewState, setReviewState] = React.useState(props.reviewRequested);

	const removeLock = async ()=>{
		await request.put(`/api/lock/review/request/${props.shareId}`)
			.then(()=>{
				setReviewState(true);
			});
	};

	const renderReviewButton = function(){
		if(reviewState){ return <button className='inactive'>REVISAO SOLICITADA</button>; };
		return <button onClick={removeLock}>SOLICITAR REMOCAO DO BLOQUEIO</button>;
	};

	return <Dialog className='lockNotification' blocking closeText='CONTINUAR PARA O EDITOR' >
		<h1>DOCUMENTO BLOQUEADO</h1>
		<p>Este documento foi bloqueado pelos Administradores. Ele nao podera ser acessado por nenhum metodo alem do Editor ate que o bloqueio seja removido.</p>
		<hr />
		<h3>MOTIVO DO BLOQUEIO</h3>
		<p>{props.message}</p>
		<hr />
		<p>Assim que tiver resolvido o problema, clique em SOLICITAR REMOCAO DO BLOQUEIO para notificar os Administradores para revisao.</p>
		<p>Clique em CONTINUAR PARA O EDITOR para ocultar temporariamente esta notificacao; ela reaparecera na proxima vez que a pagina for recarregada.</p>
		{renderReviewButton()}
	</Dialog>;
};

export default LockNotification;
