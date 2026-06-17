import './brewItem.less';
import React, { useCallback } from 'react';
import moment from 'moment';
import request from '../../../../utils/request-middleware.js';

import googleDriveIcon from '../../../../googleDrive.svg';
import homebreweryIcon from '../../../../thumbnail.svg';
import dedent from 'dedent';

const BrewItem = ({
	brew = {
		title       : '',
		description : '',
		authors     : [],
		stubbed     : true,
	},
	updateListFilter = ()=>{},
	reportError = ()=>{},
	renderStorage = true,
})=>{

	const deleteBrew = useCallback(()=>{
		if(brew.authors.length <= 1) {
			if(!window.confirm('Tem certeza de que deseja excluir este documento? Como voce e o unico dono deste documento, ele sera excluido permanentemente.')) return;
			if(!window.confirm('Tem MESMO certeza? Voce nao podera recuperar o documento.')) return;
		} else {
			if(!window.confirm('Tem certeza de que deseja remover este documento da sua colecao? Isso ira remover voce como editor, mas os outros donos ainda poderao acessar o documento.')) return;
			if(!window.confirm('Tem MESMO certeza? Voce perdera o acesso de editor a este documento.')) return;
		}

		request.delete(`/api/${brew.googleId ?? ''}${brew.editId}`).send().end((err, res)=>{
			if(err) reportError(err); else window.location.reload();
		});
	}, [brew, reportError]);

	const updateFilter = useCallback((type, term)=>updateListFilter(type, term), [updateListFilter]);

	const renderDeleteBrewLink = ()=>{
		if(!brew.editId) return null;

		return (
			<a className='deleteLink' onClick={deleteBrew}>
				<i className='fas fa-trash-alt' title='Excluir' />
			</a>
		);
	};

	const renderEditLink = ()=>{
		if(!brew.editId) return null;

		let editLink = brew.editId;
		if(brew.googleId && !brew.stubbed) editLink = brew.googleId + editLink;

		return (
			<a className='editLink' href={`/edit/${editLink}`} target='_blank' rel='noopener noreferrer'>
				<i className='fas fa-pencil-alt' title='Editar' />
			</a>
		);
	};

	const renderShareLink = ()=>{
		if(!brew.shareId) return null;

		let shareLink = brew.shareId;
		if(brew.googleId && !brew.stubbed) {
			shareLink = brew.googleId + shareLink;
		}

		return (
			<a className='shareLink' href={`/share/${shareLink}`} target='_blank' rel='noopener noreferrer'>
				<i className='fas fa-share-alt' title='Compartilhar' />
			</a>
		);
	};

	const renderDownloadLink = ()=>{
		if(!brew.shareId) return null;

		let shareLink = brew.shareId;
		if(brew.googleId && !brew.stubbed) {
			shareLink = brew.googleId + shareLink;
		}

		return (
			<a className='downloadLink' href={`/download/${shareLink}`}>
				<i className='fas fa-download' title='Baixar' />
			</a>
		);
	};

	const renderStorageIcon = ()=>{
		if(!renderStorage) return null;
		if(brew.googleId) {
			return (
				<span title={brew.webViewLink ? 'Seu armazenamento no Google Drive' : 'Armazenamento no Google Drive de outro usuario'}>
					<a href={brew.webViewLink} target='_blank'>
						<img className='googleDriveIcon' src={googleDriveIcon} alt='googleDriveIcon' />
					</a>
				</span>
			);
		}

		return (
			<span title='Armazenamento da Iniciativa T20'>
				<img className='homebreweryIcon' src={homebreweryIcon} alt='homebreweryIcon' />
			</span>
		);
	};

	if(Array.isArray(brew.tags)) {
		brew.tags = brew.tags?.filter((tag)=>tag); // remove tags that are empty strings
		brew.tags.sort((a, b)=>{
			return a.indexOf(':') - b.indexOf(':') !== 0 ? a.indexOf(':') - b.indexOf(':') : a.toLowerCase().localeCompare(b.toLowerCase());
		});
	}

	const dateFormatString = 'YYYY-MM-DD HH:mm:ss';

	return (
		<div className='brewItem'>
			{brew.thumbnail && <div className='thumbnail' style={{ backgroundImage: `url(${brew.thumbnail})` }}></div>}
			<div className='text'>
				<h2>{brew.title}</h2>
				<p className='description'>{brew.description}</p>
			</div>
			<hr />
			<div className='info'>
				{brew.tags?.length ? (
					<div className='brewTags' title={`${brew.tags.length} tags:\n${brew.tags.join('\n')}`}>
						<i className='fas fa-tags' />
						{brew.tags.map((tag, idx)=>{
							const matches = tag.match(/^(?:([^:]+):)?([^:]+)$/);
							return <span key={idx} className={matches[1]} onClick={()=>updateFilter(tag)}>{matches[2]}</span>;
						})}
					</div>
				) : null}
				<span title={`Autores:\n${brew.authors?.join('\n')}`}>
					<i className='fas fa-user' />{' '}
					{brew.authors?.map((author, index)=>(
						<React.Fragment key={index}>
							{author === 'hidden' ? (
								<span title='O nome de usuario continha um endereco de email; ocultado para proteger a privacidade do usuario'>
									{author}
								</span>
							) : (<a href={`/user/${encodeURIComponent(author)}`}>{author}</a>)}
							{index < brew.authors.length - 1 && ', '}
						</React.Fragment>
					))}
				</span>
				<br />
				<span title={`Ultima visualizacao: ${moment(brew.lastViewed).local().format(dateFormatString)}`}>
					<i className='fas fa-eye' /> {brew.views}
				</span>
				{brew.pageCount && (
					<span title={`Numero de paginas: ${brew.pageCount}`}>
						<i className='far fa-file' /> {brew.pageCount}
					</span>
				)}
				<span
					title={dedent` Criado: ${moment(brew.createdAt).local().format(dateFormatString)}
                        Ultima atualizacao: ${moment(brew.updatedAt).local().format(dateFormatString)}`}
				>
					<i className='fas fa-sync-alt' /> {moment(brew.updatedAt).fromNow()}
				</span>
				{renderStorageIcon()}
			</div>

			<div className='links'>
				{renderShareLink()}
				{renderEditLink()}
				{renderDownloadLink()}
				{renderDeleteBrewLink()}
			</div>
		</div>
	);
};

export default BrewItem;
