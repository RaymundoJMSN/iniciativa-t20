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
				<div class='nd'>ND 1</div>
				## Nome da Ameaça
				*Humanoide (tipo) Médio*

				**Iniciativa** +5, **Percepção** +7
				**Defesa** 15, **Fort** +10, **Ref** +5, **Von** +1
				**Pontos de Vida** 20
				**Deslocamento** 9m (6q)

				---
				**Corpo a Corpo** arma +7 (1d8+3)
				**À Distância** arma +6 (1d6+2)

				---
				{{atributos For 2, Des 1, Con 2, Int 0, Sab 1, Car 0}}

				---
				**Perícias** Luta +7, Furtividade +5
				**Equipamento** arma, armadura. **Tesouro** Padrão.
				}}

				`,
		},
		{
			name : 'Classe',
			icon : 'fas fa-shield-halved',
			gen  : dedent`
				{{classe
				# Nome da Classe
				*Frase de conceito que resume a classe.*

				### Características de Classe
				**Pontos de Vida** começa com X + Constituição; ganha Y + Con por nível.
				**Pontos de Mana** Z por nível.
				**Perícias** treinado em duas perícias à escolha (+ Inteligência).
				**Proficiências** armas simples; armaduras leves.

				##### Tabela da Classe
				| Nível | Habilidades de Classe | PM |
				|:-----:|:----------------------|:--:|
				| 1º | Habilidade inicial | — |
				| 2º | Poder de classe | 1 |
				| 3º | Habilidade do 3º nível | 2 |

				### Habilidades de Classe
				##### Nome da Habilidade
				Descrição da habilidade de classe e quando se aplica.
				}}

				`,
		},
		{
			name : 'Raça',
			icon : 'fas fa-people-group',
			gen  : dedent`
				{{raca
				## Nome da Raça
				*Texto de apresentação da raça, com seu tom e cultura.*

				**Atributos** +2 em um atributo, +1 em outro, –1 em outro.
				**Tamanho** Médio. **Deslocamento** 9m.

				##### Nome do Traço Racial
				Descrição do traço racial concedido pela raça.
				}}

				`,
		},
		{
			name : 'Magia',
			icon : 'fas fa-hand-sparkles',
			gen  : dedent`
				{{magia
				#### Nome da Magia
				{{tipo Arcana, 1º círculo}}
				**Execução** padrão · **Alcance** curto
				**Alvo** 1 criatura · **Duração** instantânea
				**Resistência** Reflexos reduz à metade

				Descrição do efeito da magia.

				**Aprimoramentos:** +1 PM: descrição do aprimoramento.
				}}

				`,
		},
		{
			name : 'Poder',
			icon : 'fas fa-bolt',
			gen  : dedent`
				{{poder
				##### Nome do Poder
				*Pré-requisitos: atributo ou treinamento exigido.*
				Descrição do poder ou habilidade. Indique se é passivo ou a ação de ativação.
				}}

				`,
		},
		{
			name : 'Item Mágico',
			icon : 'fas fa-wand-magic-sparkles',
			gen  : dedent`
				{{item
				**Nome do Item.**
				{{preco Item mágico · CD de fabricação 20 · T$ 1.000}}
				Descrição do item mágico, sua aparência e os efeitos que concede a quem o usa.
				}}

				`,
		},
		{
			name : 'Divindade',
			icon : 'fas fa-place-of-worship',
			gen  : dedent`
				{{divindade
				## Nome do Deus
				*Epíteto ou domínio da divindade.*

				**Crenças e Objetivos** o que a divindade prega e busca.
				**Símbolo Sagrado** descrição do símbolo.
				**Energia** Positiva ou Negativa.
				**Devotos** quem segue esta divindade.
				**Poderes Concedidos** lista de poderes concedidos.
				**Obrigações & Restrições** deveres e proibições dos devotos.
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
