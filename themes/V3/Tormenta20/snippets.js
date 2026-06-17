import dedent from 'dedent';

// Trechos (snippets) do tema Tormenta 20 — inserem markdown estilizado pelo tema.
export default [{
	groupName : 'Tormenta 20',
	icon      : 'fas fa-dragon',
	view      : 'text',
	snippets  : [
		{
			name : 'Capa',
			icon : 'fas fa-scroll',
			gen  : dedent`
				\\page
				{{frontCover

				# Título da Obra


				## por Seu Nome
				}}

				`,
		},
		{
			name : 'Capítulo',
			icon : 'fas fa-bookmark',
			gen  : dedent`
				\\page
				{{capitulo
				# Capítulo 1: O Nome do Capítulo
				}}

				Texto de abertura do capítulo, apresentando o tema das próximas páginas.

				`,
		},
		{
			name : 'Box / Quadro',
			icon : 'fas fa-square',
			gen  : dedent`
				{{note
				##### Título do Quadro
				Texto do quadro. Use para destacar uma regra importante ou uma informação à parte.
				}}

				`,
		},
		{
			name : 'Ficha de Ameaça',
			icon : 'fas fa-skull',
			gen  : dedent`
				{{ameaca
				## Nome da Ameaça
				**ND** :: 1 (tipo)
				**Defesa** :: 15
				**Pontos de Vida** :: 20

				---
				**Iniciativa** :: +5
				**Percepção** :: +7
				**Deslocamento** :: 9m (6q)
				**Ataque** :: arma +7 (1d8+3)
				**Atributos** :: For 2, Des 1, Con 2, Int 0, Sab 1, Car 0
				**Perícias** :: Luta +7, Furtividade +5
				**Equipamento** :: arma, armadura
				}}

				`,
		},
		{
			name : 'Magia',
			icon : 'fas fa-hand-sparkles',
			gen  : dedent`
				{{magia
				#### Nome da Magia
				<div class='tipo'>Arcana, 1º círculo</div>
				**Execução** :: padrão
				**Alcance** :: curto
				**Alvo** :: 1 criatura
				**Duração** :: instantânea
				**Resistência** :: Reflexos reduz à metade

				Descrição do efeito da magia.
				}}

				`,
		},
		{
			name : 'Poder',
			icon : 'fas fa-bolt',
			gen  : dedent`
				{{poder
				##### Nome do Poder
				Descrição do poder ou habilidade. Indique se é passivo ou a ação de ativação.
				}}

				`,
		},
		{
			name : 'Tabela',
			icon : 'fas fa-table',
			gen  : dedent`
				##### Título da Tabela
				| Coluna A | Coluna B |
				|:---------|:--------:|
				| 1A       | 1B       |
				| 2A       | 2B       |

				`,
		},
		{
			name : 'Créditos + Selo',
			icon : 'fas fa-stamp',
			gen  : dedent`
				{{creditos
				<div class='selo'></div>
				<div class='disclaimer'>Este conteúdo é um material gratuito não-oficial, feito por fãs, sem aprovação ou orientação da Jambô Editora, e sem fins lucrativos. Parte do material utilizado é propriedade da Jambô Editora.</div>
				}}

				`,
		},
	],
}];
