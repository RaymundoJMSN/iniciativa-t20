import React from 'react';
import moment from 'moment';
import UIPage from '../basePages/uiPage/uiPage.jsx';
import NaturalCritIcon from '../../../components/svg/naturalcrit-d20.svg.jsx';

let SAVEKEY = '';

const AccountPage = (props)=>{
	// destructure props and set state for save location
	const { accountDetails, brew } = props;
	const [saveLocation, setSaveLocation] = React.useState('');

	// initialize save location from local storage based on user id
	React.useEffect(()=>{
		if(!saveLocation && accountDetails.username) {
			SAVEKEY = `HB_editor_defaultSave_${accountDetails.username}`;
			// if no SAVEKEY in local storage, default save location to Google Drive if user has Google account.
			let saveLocation = window.localStorage.getItem(SAVEKEY);
			saveLocation = saveLocation ?? (accountDetails.googleId ? 'GOOGLE-DRIVE' : 'HOMEBREWERY');
			setActiveSaveLocation(saveLocation);
		}
	}, []);

	const setActiveSaveLocation = (newSelection)=>{
		if(saveLocation === newSelection) return;
		window.localStorage.setItem(SAVEKEY, newSelection);
		setSaveLocation(newSelection);
	};

	// todo: should this be a set of radio buttons (well styled) since it's either/or choice?
	const renderSaveLocationButton = (name, key, shouldRender = true)=>{
		if(!shouldRender) return null;
		return (
			<button className={saveLocation === key ? 'active' : ''} onClick={()=>{setActiveSaveLocation(key);}}>
				{name}
			</button>
		);
	};

	// render the entirety of the account page content
	const renderAccountPage = ()=>{
		return (
			<>
				<div className='dataGroup'>
					<h1>Informações da Conta <i className='fas fa-user'></i></h1>
					<p><strong>Usuário: </strong>{accountDetails.username || 'Nenhum usuário conectado no momento'}</p>
					<p><strong>Último Acesso: </strong>{moment(accountDetails.issued).format('dddd, MMMM Do YYYY, h:mm:ss a ZZ') || '-'}</p>
				</div>
				<div className='dataGroup'>
					<h3>Informações da Iniciativa T20 <NaturalCritIcon /></h3>
					<p><strong>Documentos na Iniciativa T20: </strong>{accountDetails.mongoCount}</p>
				</div>
				<div className='dataGroup'>
					<h3>Informações do Google <i className='fab fa-google-drive'></i></h3>
					<p><strong>Vinculado ao Google: </strong>{accountDetails.googleId ? 'SIM' : 'NÃO'}</p>
					{accountDetails.googleId && (
						<p>
							<strong>Documentos no Google Drive: </strong>{accountDetails.googleCount ?? (
								<>
									Não foi possível recuperar os arquivos - <a href='https://github.com/naturalcrit/homebrewery/discussions/1580'>siga estes passos para renovar suas credenciais do Google.</a>
								</>
							)}
						</p>
					)}
				</div>
				<div className='dataGroup'>
					<h4>Local de Salvamento Padrão</h4>
					{renderSaveLocationButton('Iniciativa T20', 'HOMEBREWERY')}
					{renderSaveLocationButton('Google Drive', 'GOOGLE-DRIVE', accountDetails.googleId)}
				</div>
			</>
		);
	};

	// return the account page inside the base layout wrapper (with navbar etc).
	return (
		<UIPage brew={brew}>
			{renderAccountPage()}
		</UIPage>);
};

export default AccountPage;
