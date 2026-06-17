import React from 'react';
import dedent from 'dedent';
import Nav from './nav.jsx';

const getShareId = (brew)=>(
	brew.googleId && !brew.stubbed
		? brew.googleId + brew.shareId
		: brew.shareId
);

const getRedditLink = (brew)=>{
	const text = dedent`
			Ola, pessoal! Estou trabalhando neste material. Adoraria receber seu feedback. Deem uma olhada.

			**[Link da Iniciativa T20](${global.config.baseUrl}/share/${getShareId(brew)})**`;

	return `https://www.reddit.com/r/UnearthedArcana/submit?title=${encodeURIComponent(brew.title.toWellFormed())}&text=${encodeURIComponent(text)}`;
};

export default ({ brew, currentPage })=>(
	<Nav.dropdown>
		<Nav.item color='teal' icon='fas fa-share-alt'>
			compartilhar
		</Nav.item>
		<Nav.item color='blue' href={`/share/${getShareId(brew)}`}>
			visualizar
		</Nav.item>
		<Nav.item color='blue' onClick={()=>{navigator.clipboard.writeText(`${global.config.baseUrl}/share/${getShareId(brew)}`);}}>
			copiar url
		</Nav.item>
		{currentPage > 1 &&
			<Nav.item
				color='blue'
				onClick={()=>{navigator.clipboard.writeText(`${global.config.baseUrl}/share/${getShareId(brew)}#p${currentPage}`);}}>
				copiar url (pagina {currentPage})
			</Nav.item>}
		<Nav.item color='blue' href={getRedditLink(brew)} newTab rel='noopener noreferrer'>
			publicar no reddit
		</Nav.item>
	</Nav.dropdown>
);
