/* eslint-disable max-lines */
import './metadataEditor.less';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import request from '../../utils/request-middleware.js';
import Combobox from '../../../components/combobox.jsx';
import TagInput from '../tagInput/tagInput.jsx';


import Themes from '@themes/themes.json';
import validations from './validations.js';

import homebreweryThumbnail from '../../thumbnail.png';

const callIfExists = (val, fn, ...args)=>{
	if(val[fn]) {
		val[fn](...args);
	}
};

const MetadataEditor = createReactClass({
	displayName     : 'MetadataEditor',
	getDefaultProps : function() {
		return {
			metadata : {
				editId      : null,
				shareId     : null,
				title       : '',
				description : '',
				thumbnail   : '',
				tags        : [],
				published   : false,
				authors     : [],
				renderer    : 'V3',
				theme       : 'Tormenta20',
				lang        : 'pt-BR'
			},

			onChange    : ()=>{},
			reportError : ()=>{}
		};
	},

	getInitialState : function(){
		return {
			showThumbnail : true
		};
	},

	toggleThumbnailDisplay : function(){
		this.setState({
			showThumbnail : !this.state.showThumbnail
		});
	},

	renderThumbnail : function(){
		if(!this.state.showThumbnail) return;
		return <img className='thumbnail-preview' src={this.props.metadata.thumbnail || homebreweryThumbnail}></img>;
	},

	handleFieldChange : function(name, e){
		// load validation rules, and check input value against them
		const inputRules = validations[name] ?? [];
		const validationErr = inputRules.map((rule)=>rule(e.target.value)).filter(Boolean);

		const debouncedReportValidity = _.debounce((target, errMessage)=>{
			callIfExists(target, 'setCustomValidity', errMessage);
			callIfExists(target, 'reportValidity');
		}, 300); // 300ms debounce delay, adjust as needed

		// if no validation rules, save to props
		if(validationErr.length === 0){
			callIfExists(e.target, 'setCustomValidity', '');
			this.props.onChange({
				...this.props.metadata,
				[name] : e.target.value
			});
			return true;
		} else {
			// if validation issues, display built-in browser error popup with each error.
			const errMessage = validationErr.map((err)=>{
				return `- ${err}`;
			}).join('\n');


			debouncedReportValidity(e.target, errMessage);
			return false;
		}
	},

	handleRenderer : function(renderer, e){
		if(e.target.checked){
			this.props.metadata.renderer = renderer;
			if(renderer == 'legacy')
				this.props.metadata.theme = 'Tormenta20';
		}
		this.props.onChange(this.props.metadata, 'renderer');
	},

	handlePublish : function(val){
		this.props.onChange({
			...this.props.metadata,
			published : val
		});
	},

	handleTheme : function(theme){
		this.props.metadata.renderer = theme.renderer;
		this.props.metadata.theme    = theme.path;

		this.props.onChange(this.props.metadata, 'theme');
	},

	handleThemeWritein : function(e) {
		const shareId = e.target.value.split('/').pop(); //Extract just the ID if a URL was pasted in
		this.props.metadata.theme = shareId;

		this.props.onChange(this.props.metadata, 'theme');
	},

	handleLanguage : function(languageCode){
		this.props.metadata.lang = languageCode;
		this.props.onChange(this.props.metadata);
	},

	handleDelete : function(){
		if(this.props.metadata.authors && this.props.metadata.authors.length <= 1){
			if(!confirm('Tem certeza de que deseja excluir este documento? Como você é o único dono deste documento, ele será excluído permanentemente.')) return;
			if(!confirm('Tem REALMENTE certeza? Você não poderá recuperar o documento.')) return;
		} else {
			if(!confirm('Tem certeza de que deseja remover este documento da sua coleção? Isso removerá você como editor, mas os outros donos ainda poderão acessar o documento.')) return;
			if(!confirm('Tem REALMENTE certeza? Você perderá o acesso de editor a este documento.')) return;
		}

		request.delete(`/api/${this.props.metadata.googleId ?? ''}${this.props.metadata.editId}`)
			.send()
			.end((err, res)=>{
				if(err) {
					this.props.reportError(err);
				} else {
					window.location.href = '/';
				}
			});
	},

	renderPublish : function(){
		if(this.props.metadata.published){
			return <button className='unpublish' onClick={()=>this.handlePublish(false)}>
				<i className='fas fa-ban' /> despublicar
			</button>;
		} else {
			return <button className='publish' onClick={()=>this.handlePublish(true)}>
				<i className='fas fa-globe' /> publicar
			</button>;
		}
	},

	renderDelete : function(){
		if(!this.props.metadata.editId) return;

		return <div className='field delete'>
			<label>excluir</label>
			<div className='value'>
				<button className='publish' onClick={this.handleDelete}>
					<i className='fas fa-trash-alt' /> excluir documento
				</button>
			</div>
		</div>;
	},

	renderAuthors : function(){
		let text = 'Nenhum.';
		if(this.props.metadata.authors && this.props.metadata.authors.length){
			text = this.props.metadata.authors.join(', ');
		}
		return <div className='field authors'>
			<label>autores</label>
			<div className='value'>
				{text}
			</div>
		</div>;
	},

	renderThemeDropdown : function(){
		const mergedThemes = _.merge(Themes, this.props.userThemes);

		const listThemes = (renderer)=>{
			return _.map(_.values(mergedThemes[renderer]), (theme)=>{
				if(theme.path == this.props.metadata.shareId) return;
				const preview = theme.thumbnail || `/themes/${theme.renderer}/${theme.path}/dropdownPreview.png`;
				const texture = theme.thumbnail || `/themes/${theme.renderer}/${theme.path}/dropdownTexture.png`;
				return <div className='item' key={`${renderer}_${theme.name}`} value={`${theme.author ?? renderer} : ${theme.name}`} data={theme} title={''}>
					{theme.author ?? renderer} : {theme.name}
					<div className='texture-container'>
						<img src={texture}/>
					</div>
					<div className='preview'>
						<h6>prévia de {theme.name}</h6>
						<img src={preview}/>
					</div>
				</div>;
			}).filter(Boolean);
		};

		const currentRenderer = this.props.metadata.renderer;
		const currentThemeDisplay = this.props.themeBundle?.name ? `${this.props.themeBundle.author ?? currentRenderer} : ${this.props.themeBundle.name}` : 'Nenhum tema selecionado';
		let dropdown;

		if(currentRenderer == 'legacy') {
			dropdown =
				<div className='disabled value' trigger='disabled'>
					<div> Temas não são suportados no renderer Legacy </div>
				</div>;
		} else {
			dropdown =
				<div className='value' data-tooltip-top='Selecione na lista abaixo (temas internos e documentos que você marcou com "meta:theme"), ou cole a URL de Compartilhar ou o ID de Compartilhar de qualquer documento.'>
					<Combobox trigger='click'
						className='themes-dropdown'
						default={currentThemeDisplay}
						placeholder='Selecione abaixo, ou insira a URL de Compartilhar ou o ID de um documento com a tag meta:theme'
						onSelect={(value)=>this.handleTheme(value)}
						onEntry={(e)=>{
							e.target.setCustomValidity('');	//Clear the validation popup while typing
							if(this.handleFieldChange('theme', e))
								this.handleThemeWritein(e);
						}}
						options={listThemes(currentRenderer)}
						autoSuggest={{
							suggestMethod           : 'includes',
							clearAutoSuggestOnClick : true,
							filterOn                : ['value', 'title']
						}}
					/>
				</div>;
		}

		return <div className='field themes'>
			<label>tema</label>
			{dropdown}
		</div>;
	},

	renderLanguageDropdown : function(){
		const langCodes = ['en', 'de', 'de-ch', 'fr', 'ja', 'es', 'it', 'sv', 'ru', 'zh-Hans', 'zh-Hant'];
		const listLanguages = ()=>{
			return _.map(langCodes.sort(), (code, index)=>{
				const localName = new Intl.DisplayNames([code], { type: 'language' });
				const englishName = new Intl.DisplayNames('en', { type: 'language' });
				return <div className='item' title={englishName.of(code)} key={`${index}`} value={code} detail={localName.of(code)}>
					{code}
					<div className='detail'>{localName.of(code)}</div>
				</div>;
			});
		};

		return <div className='field language'>
			<label>idioma</label>
			<div className='value' data-tooltip-right='Define a propriedade HTML Lang do seu documento. Pode afetar a hifenização ou a verificação ortográfica.'>
				<Combobox trigger='click'
					className='language-dropdown'
					default={this.props.metadata.lang || ''}
					placeholder='en'
					onSelect={(value)=>this.handleLanguage(value)}
					onEntry={(e)=>{
						e.target.setCustomValidity('');	//Clear the validation popup while typing
						this.handleFieldChange('lang', e);
					}}
					options={listLanguages()}
					autoSuggest={{
						suggestMethod           : 'startsWith',
						clearAutoSuggestOnClick : true,
						filterOn                : ['value', 'detail', 'title']
					}}
				/>
			</div>

		</div>;
	},

	renderRenderOptions : function(){
		return <div className='field renderers'>
			<label>Renderer</label>
			<div className='value'>
				<label key='legacy'>
					<input
						type='radio'
						value = 'legacy'
						name = 'renderer'
						checked={this.props.metadata.renderer === 'legacy'}
						onChange={(e)=>this.handleRenderer('legacy', e)} />
					Legacy
				</label>

				<label key='V3'>
					<input
						type='radio'
						value = 'V3'
						name = 'renderer'
						checked={this.props.metadata.renderer === 'V3'}
						onChange={(e)=>this.handleRenderer('V3', e)} />
					V3
				</label>
				<small><a href='/legacy' target='_blank' rel='noopener noreferrer'>Clique aqui para ver a página de demonstração do antigo renderer Legacy!</a></small>
			</div>
		</div>;
	},

	render : function(){
		return <div className='metadataEditor'>
			<h1>Editor de Propriedades</h1>

			<div className='field title'>
				<label>título</label>
				<input type='text' className='value'
					defaultValue={this.props.metadata.title}
					onChange={(e)=>this.handleFieldChange('title', e)} />
			</div>
			<div className='field-group'>
				<div className='field-column'>
					<div className='field description'>
						<label>descrição</label>
						<textarea defaultValue={this.props.metadata.description} className='value'
							onChange={(e)=>this.handleFieldChange('description', e)} />
					</div>
					<div className='field thumbnail'>
						<label>miniatura</label>
						<input type='text'
							defaultValue={this.props.metadata.thumbnail}
							placeholder='https://minha.url.de.miniatura'
							className='value'
							onChange={(e)=>this.handleFieldChange('thumbnail', e)} />
						<button className='display' onClick={this.toggleThumbnailDisplay}>
							<i className={`fas fa-caret-${this.state.showThumbnail ? 'right' : 'left'}`} />
						</button>
					</div>
				</div>
				{this.renderThumbnail()}
			</div>

			<div className='field tags'>
				<label>Tags</label>
				<div className='value' >
					<TagInput
						label='tags'
						valuePatterns={/^\s*(?:(?:group|meta|system|type)\s*:\s*)?[A-Za-z0-9][A-Za-z0-9 \/\\.&_\-]{0,40}\s*$/}
						placeholder='adicionar tag' unique={true}
						values={this.props.metadata.tags}
						onChange={(e)=>this.handleFieldChange('tags', e)}
						tooltip='Você pode iniciar as tags com "type", "system", "group" ou "meta" seguidos de dois-pontos ":"; elas serão coloridas na sua página de usuário.'
					/>
				</div>
			</div>


			{this.renderLanguageDropdown()}

			{this.renderThemeDropdown()}

			{this.renderRenderOptions()}

			<h2>Autores</h2>

			{this.renderAuthors()}

			<div className='field invitedAuthors'>
				<label>Autores convidados</label>
				<div className='value'>
					<TagInput
						label='invited authors'
						valuePatterns={/.+/}
						validators={[(v)=>!this.props.metadata.authors?.includes(v)]}
						placeholder='convidar autor' unique={true}
						tooltip={`Os nomes de usuário dos autores convidados diferenciam maiúsculas de minúsculas.
							Após adicionar um autor convidado, envie a ele o link de edição. Lá, ele poderá escolher aceitar ou recusar o convite.`}
						values={this.props.metadata.invitedAuthors}
						onChange={(e)=>this.handleFieldChange('invitedAuthors', e)}
					/>
				</div>
			</div>


			<h2>Privacidade</h2>

			<div className='field publish'>
				<label>publicar</label>
				<div className='value'>
					{this.renderPublish()}
					<small>Documentos publicados podem ser pesquisados no <a href='/vault'>Cofre</a> e ficam visíveis na sua página de usuário.  Documentos não publicados não são indexados no Cofre nem ficam visíveis na sua página de usuário, mas ainda podem ser compartilhados e indexados por mecanismos de busca.  Você pode despublicar um documento a qualquer momento.</small>
				</div>
			</div>

			{this.renderDelete()}

		</div>;
	}
});

export default MetadataEditor;
