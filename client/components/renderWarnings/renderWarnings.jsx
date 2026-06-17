import './renderWarnings.less';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'lodash';

import Dialog from '../dialog.jsx';

const RenderWarnings = createReactClass({
	displayName     : 'RenderWarnings',
	getInitialState : function() {
		return {
			warnings : {}
		};
	},
	componentDidMount : function() {
		this.checkWarnings();
		window.addEventListener('resize', this.checkWarnings);
	},
	componentWillUnmount : function() {
		window.removeEventListener('resize', this.checkWarnings);
	},
	warnings : {
		chrome : function(){
			const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
			if(!isChrome){
				return <li key='chrome'>
					<em>Feito para o Chrome </em> <br />
					Outros navegadores não foram testados quanto à compatibilidade. Se
					você tiver problemas com seu documento não sendo exibido ou impresso
					corretamente, tente usar a versão mais recente do Chrome antes
					de enviar um relatório de bug.
				</li>;
			}
		},
	},
	checkWarnings : function(){
		this.setState({
			warnings : _.reduce(this.warnings, (r, fn, type)=>{
				const element = fn();
				if(element) r[type] = element;
				return r;
			}, {})
		});
	},
	render : function(){
		if(_.isEmpty(this.state.warnings)) return null;

		const DISMISS_KEY = 'dismiss_render_warning';
		const DISMISS_TEXT = <i className='fas fa-times dismiss' />;

		return <Dialog className='renderWarnings' dismissKey={DISMISS_KEY} closeText={DISMISS_TEXT}>
			<i className='fas fa-exclamation-triangle ohno' />
			<h3>Avisos de exibição</h3>
			<small>Se este documento estiver sendo exibido de forma incorreta, pode ser por causa do seguinte:</small>
			<ul>{_.values(this.state.warnings)}</ul>
		</Dialog>;
	}
});

export default RenderWarnings;
