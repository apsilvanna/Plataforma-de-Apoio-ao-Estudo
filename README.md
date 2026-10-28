Plataforma de Apoio ao Estudo — Mini-Projeto PI (Aula 09)

Front-end em JavaScript puro (HTML + CSS + JS, sem frameworks) que aplica os conceitos de Programação Orientada a Objetos das Missões 1 a 10 e se integra ao backend C# (BackendEstudoAPI) com MySQL.

Estrutura
Arquivo	Função
index.html	Estrutura da tela (perfis, formulário, meta, servidor)
estilo.css	Visual e responsividade (celular e telas grandes)
app.js	Todas as classes (Missões 1–8), a tela (Missão 9) e o cliente do backend (Missão 10)
Como executar
Com o backend (integração real)
Extraia o Backend.zip e dê duplo-clique em iniciar_backend.bat (Windows). O servidor sobe em http://localhost:5080 e a janela preta deve ficar aberta.
Com MySQL ligado, os dados são gravados no banco. Sem MySQL, o backend usa um arquivo JSON local com as mesmas rotas.
Se o MySQL tiver senha, ajuste o mysql_config.txt da pasta Backend.
Abra o index.html no navegador. O selo no topo deve ficar verde ("Backend online").
Escolha disciplina e modalidade, informe a duração e clique em Registrar Estudo.
Use Carregar Histórico do Servidor / Relatório para ver o que foi gravado.
Sem o backend (GitHub Pages)

O GitHub só hospeda a tela; o backend roda no computador de quem o inicia. Se a página não encontrar o servidor, ela entra em modo local (selo amarelo): as sessões, o XP, a meta e o relatório ficam salvos no localStorage do navegador, usando as mesmas rotas simuladas.

Para publicar: envie os três arquivos para a raiz do repositório e ative Settings → Pages → Deploy from branch → main / (root).

Mapa das missões
Missão	Conceito	Onde está no app.js
1	Abstração, classes e objetos	Disciplina
2	Encapsulamento (campos #privados, validações)	MetaEstudo
3	Classe abstrata e herança	Usuario → Administrador, Responsavel, Discente
4	Polimorfismo dinâmico	SessaoEstudo → SessaoPomodoro, SessaoExercicios, SessaoLeitura
5	Sobrecarga simulada (3 formas de chamada)	Discente.registrarEstudo()
6	Interfaces (contratos por duck typing)	INotificador (NotificadorEmail, NotificadorWhatsApp, NotificadorPainel) e IExportavelJson (paraJson())
7	Associação e agregação	Responsavel ↔ Discente/MetaEstudo, TrilhaEstudo
8	Composição e dependência	PlanoEstudo + ItemCronograma, ServicoAlertaResponsavel
9	Interface com o usuário	TelaEstudo (só lê os campos e delega aos objetos)
10	Integração com o backend	ClienteBackendEstudo
Fórmulas de XP
Pomodoro: duração × 2 + ciclos × 15
Exercícios: duração + acertos × 10
Leitura: duração + páginas × 3 + 25 (se fez resumo)
Rotas do backend utilizadas
Método	Rota	Uso
GET	/api/status	Verificar se o backend está no ar e o modo de banco
GET	/api/sessoes?discente=	Histórico de sessões gravadas
POST	/api/sessoes	Gravar uma nova sessão (corpo gerado por paraJson())
GET	/api/metas?discente=	Meta semanal e minutos cumpridos
GET	/api/relatorio/{nome}	Totais de sessões, minutos, XP e % da meta
Observações
Os dados de teste usam o discente Lucas Silva e o responsável Carlos Silva, já existentes no banco de exemplo (banco_estudo.sql).
A duração de cada sessão deve ficar entre 1 e 480 minutos (regra de MetaEstudo.registrarAvanco).
No Safari, o link do GitHub Pages não consegue falar com o localhost; nesse caso, abra o index.html direto no computador com o backend ligado.
