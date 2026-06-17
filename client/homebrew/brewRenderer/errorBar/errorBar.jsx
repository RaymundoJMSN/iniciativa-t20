import './errorBar.less';
import React from 'react';

import Dialog from '../../../components/dialog.jsx';

const DISMISS_BUTTON = <i className='fas fa-times dismiss' />;

const ErrorBar = (props)=>{
	if(!props.errors.length) return null;
	let hasOpenError = false, hasCloseError = false, hasMatchError = false;

	props.errors.map((err)=>{
		if(err.id === 'OPEN')     hasOpenError  = true;
		if(err.id === 'CLOSE')    hasCloseError = true;
		if(err.id === 'MISMATCH') hasMatchError = true;
	});

	const renderErrors = ()=>(
		<ul>
			{props.errors.map((err, idx)=>{
				return <li key={idx}>
					Linha {err.line} : {err.text}, tag '{err.type}'
				</li>;
			})}
		</ul>
	);

	const renderProtip = ()=>(
		<div className='protips'>
			<h4>Dicas!</h4>
			{hasOpenError  && <div>Tag de abertura sem correspondência. Feche suas tags, assim {'</div>'}. Combine os tipos!</div>}
			{hasCloseError && <div>Tag de fechamento sem correspondência. Remova-a ou verifique onde ela foi aberta.</div>}
			{hasMatchError && <div>Tipos incompatíveis. Você fechou uma tag com um tipo diferente.</div>}
		</div>
	);

	return (
		<Dialog className='errorBar' closeText={DISMISS_BUTTON} >
			<div>
				<i className='fas fa-exclamation-triangle' />
				<h2> Há erros de HTML no seu código</h2>
				<small>
					Se não forem corrigidos, seu documento não será exibido corretamente ao imprimir em PDF ou compartilhar
				</small>
				{renderErrors()}
			</div>
			<hr />
			{renderProtip()}
		</Dialog>
	);
};

export default ErrorBar;
