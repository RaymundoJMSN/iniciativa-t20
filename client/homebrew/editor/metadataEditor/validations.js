export default {
	title : [
		(value)=>{
			return value?.length > 100 ? 'Tamanho máximo do título: 100 caracteres' : null;
		}
	],
	description : [
		(value)=>{
			return value?.length > 500 ? 'Tamanho máximo da descrição: 500 caracteres.' : null;
		}
	],
	thumbnail : [
		(value)=>{
			return value?.length > 256 ? 'Tamanho máximo da URL: 256 caracteres.' : null;
		},
		(value)=>{
			if(value?.length == 0){return null;}
			try {
				Boolean(new URL(value));
				return null;
			} catch {
				return 'Deve ser uma URL válida';
			}
		}
	],
	lang : [
		(value)=>{
			return new RegExp(/^([a-zA-Z]{2,3})(-[a-zA-Z]{4})?(-(?:[0-9]{3}|[a-zA-Z]{2}))?$/).test(value) === false && (value.length > 0) ? 'Código de idioma inválido.' : null;
		}
	],
	theme : [
		(value)=>{
			const URL = global.config.baseUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); //Escape any regex characters
			const shareIDPattern = '[a-zA-Z0-9-_]{12}';
			const shareURLRegex  = new RegExp(`^${URL}\\/share\\/${shareIDPattern}$`);
			const shareIDRegex   = new RegExp(`^${shareIDPattern}$`);
			if(value?.length === 0)       return null;
			if(shareURLRegex.test(value)) return null;
			if(shareIDRegex.test(value))  return null;

			return 'Deve ser uma URL de Compartilhar válida ou um ID de 12 caracteres.';
		}
	]
};



