"use strict";
/* ===== Missão 1 — Abstração, Classes e Objetos ===== */
class Disciplina {
  #codigo; #nome; #categoria; #horas;
  constructor(codigo, nome, categoria, horas) {
    this.#codigo = codigo; this.#nome = nome; this.#categoria = categoria;
    this.#horas = Number.isInteger(horas) && horas > 0 ? horas : 2;
  }
  getCodigo() { return this.#codigo; }
  getNome() { return this.#nome; }
  getCategoria() { return this.#categoria; }
  getCargaHorariaSemanalHoras() { return this.#horas; }
  calcularCargaEmMinutos() { return this.#horas * 60; }
  exibirResumo() {
    return `[${this.#codigo}] ${this.#nome} (${this.#categoria}) — ${this.#horas}h/semana (${this.calcularCargaEmMinutos()} min)`;
  }
}

/* ===== Missão 6 — Interfaces (contratos por duck typing) ===== */
const cumpreContrato = (obj, ...metodos) => metodos.every(m => typeof obj?.[m] === "function");
const verificarNotificador = obj => cumpreContrato(obj, "obterCanal", "enviarAlerta"); // INotificador
const verificarExportavel = obj => cumpreContrato(obj, "paraJson");                    // IExportavelJson

/* ===== Missão 2 — Encapsulamento ===== */
class MetaEstudo { // implementa IExportavelJson
  #metaMinutosSemana = 30; #minutosCumpridos = 0;
  constructor(metaMinutosSemana) { this.redefinirMeta(metaMinutosSemana); }
  redefinirMeta(novaMeta) {
    const n = Math.trunc(Number(novaMeta));
    this.#metaMinutosSemana = Math.min(3000, Math.max(30, Number.isNaN(n) ? 30 : n));
  }
  registrarAvanco(minutos) {
    if (!Number.isInteger(minutos) || minutos <= 0 || minutos > 480) return false;
    this.#minutosCumpridos += minutos;
    return true;
  }
  getMetaMinutosSemana() { return this.#metaMinutosSemana; }
  getMinutosCumpridos() { return this.#minutosCumpridos; }
  calcularPercentual() { return Math.min(100, (this.#minutosCumpridos * 100) / this.#metaMinutosSemana); }
  estaCumprida() { return this.#minutosCumpridos >= this.#metaMinutosSemana; }
  paraJson() {
    return JSON.stringify({ metaMinutosSemana: this.#metaMinutosSemana, minutosCumpridos: this.#minutosCumpridos });
  }
}

/* ===== Missão 4 — Polimorfismo dinâmico ===== */
class SessaoEstudo { // abstrata; implementa IExportavelJson
  #disciplina; #duracaoMinutos;
  constructor(disciplina, duracaoMinutos) {
    if (new.target === SessaoEstudo) throw new Error("Classe abstrata!");
    if (!(disciplina instanceof Disciplina)) throw new TypeError("Informe uma Disciplina válida.");
    if (!(duracaoMinutos > 0)) throw new RangeError("A duração deve ser maior que zero.");
    this.#disciplina = disciplina; this.#duracaoMinutos = duracaoMinutos;
  }
  getDisciplina() { return this.#disciplina; }
  getDuracaoMinutos() { return this.#duracaoMinutos; }
  obterModalidade() { throw new Error("Método abstrato: obterModalidade()"); }
  calcularXp() { throw new Error("Método abstrato: calcularXp()"); }
  gerarFeedback() {
    return `${this.obterModalidade()} em ${this.#disciplina.getNome()} (${this.#duracaoMinutos} min) -> +${this.calcularXp()} XP`;
  }
  paraJson() {
    return JSON.stringify({
      disciplina: this.#disciplina.getNome(), tipoModalidade: this.obterModalidade(),
      duracaoMinutos: this.#duracaoMinutos, xpGanho: this.calcularXp(), resumoFeedback: this.gerarFeedback()
    });
  }
}
class SessaoPomodoro extends SessaoEstudo {
  #ciclos;
  constructor(disciplina, duracaoMinutos, ciclosCompletos) { super(disciplina, duracaoMinutos); this.#ciclos = ciclosCompletos; }
  obterModalidade() { return "Pomodoro"; }
  calcularXp() { return this.getDuracaoMinutos() * 2 + this.#ciclos * 15; }
  gerarFeedback() { return `${super.gerarFeedback()} | ${this.#ciclos} ciclo(s) concluído(s)`; }
}
class SessaoExercicios extends SessaoEstudo {
  #total; #acertos;
  constructor(disciplina, duracaoMinutos, totalQuestoes, acertos) {
    super(disciplina, duracaoMinutos);
    if (!(totalQuestoes > 0) || acertos < 0 || acertos > totalQuestoes) throw new RangeError("Acertos inválidos para o total de questões.");
    this.#total = totalQuestoes; this.#acertos = acertos;
  }
  obterModalidade() { return "Exercicios"; }
  calcularXp() { return this.getDuracaoMinutos() + this.#acertos * 10; }
  gerarFeedback() {
    return `${super.gerarFeedback()} | acerto de ${Math.round(this.#acertos * 100 / this.#total)}% (${this.#acertos}/${this.#total})`;
  }
}
class SessaoLeitura extends SessaoEstudo {
  #paginas; #fezResumo;
  constructor(disciplina, duracaoMinutos, paginasLidas, fezResumo) { super(disciplina, duracaoMinutos); this.#paginas = paginasLidas; this.#fezResumo = !!fezResumo; }
  obterModalidade() { return "Leitura"; }
  calcularXp() { return this.getDuracaoMinutos() + this.#paginas * 3 + (this.#fezResumo ? 25 : 0); }
  gerarFeedback() { return `${super.gerarFeedback()} | ${this.#paginas} página(s)${this.#fezResumo ? " + resumo" : ""}`; }
}

/* ===== Missão 3 — Classe abstrata e herança (+ Missão 5 e 7) ===== */
class Usuario {
  #id; #nome; #email; #senha;
  constructor(id, nome, email, senha) {
    if (new.target === Usuario) throw new Error("Classe abstrata!");
    this.#id = id; this.#nome = nome; this.#email = email; this.#senha = senha;
  }
  getId() { return this.#id; }
  getNome() { return this.#nome; }
  getEmail() { return this.#email; }
  autenticar(senhaDigitada) { return senhaDigitada === this.#senha; }
  obterTipoPerfil() { throw new Error("Método abstrato: obterTipoPerfil()"); }
  gerarPainelResumo() { throw new Error("Método abstrato: gerarPainelResumo()"); }
}
class Administrador extends Usuario {
  #cargo;
  constructor(id, nome, email, senha, cargo) { super(id, nome, email, senha); this.#cargo = cargo; }
  obterTipoPerfil() { return "Administrador"; }
  gerarPainelResumo() { return `Administrador: ${this.getNome()} — ${this.#cargo}`; }
}
class Responsavel extends Usuario {
  #parentesco; #discentes = []; #metas = new Map(); // associação: Responsavel ——> Discente
  constructor(id, nome, email, senha, parentesco) { super(id, nome, email, senha); this.#parentesco = parentesco; }
  obterTipoPerfil() { return "Responsavel"; }
  vincularDiscente(discente, meta) {
    if (!this.#discentes.includes(discente)) this.#discentes.push(discente);
    if (meta) this.#metas.set(discente.getId(), meta);
  }
  obterMeta(discente) { return this.#metas.get(discente.getId()); }
  getDiscentes() { return [...this.#discentes]; }
  gerarPainelResumo() {
    return `Responsável: ${this.getNome()} (${this.#parentesco}) — acompanha ${this.#discentes.length} discente(s)`;
  }
}
class Discente extends Usuario {
  #ra; #xpTotal = 0; #historico = [];
  constructor(id, nome, email, senha, ra) { super(id, nome, email, senha); this.#ra = ra; }
  getRa() { return this.#ra; }
  getXpTotal() { return this.#xpTotal; }
  getHistorico() { return [...this.#historico]; }
  adicionarXp(pontos) { if (pontos > 0) this.#xpTotal += pontos; }
  obterTipoPerfil() { return "Discente"; }
  gerarPainelResumo() { return `Discente: ${this.getNome()} — RA ${this.#ra} — ${this.#xpTotal} XP`; }
  // Missão 5 — sobrecarga simulada: um método, três formas de chamada
  registrarEstudo(a, b, c, d) {
    if (a instanceof SessaoEstudo) {                                   // Forma 1
      this.#historico.push(a); this.adicionarXp(a.calcularXp()); return a;
    }
    if (a instanceof Disciplina && c === undefined) {                  // Forma 2 (atalho)
      return this.registrarEstudo(new SessaoPomodoro(a, b, Math.max(1, Math.floor(b / 25))));
    }
    if (a instanceof Disciplina) {                                     // Forma 3 (por horário)
      return this.registrarEstudo(new SessaoLeitura(a, (c - b) * 60, d, true));
    }
    throw new TypeError("Argumentos inválidos para registrarEstudo().");
  }
}

/* ===== Missão 6 — Notificadores ===== */
class NotificadorSimulado { // implementa INotificador
  #canal; #saida;
  constructor(canal, saida = console.log) { this.#canal = canal; this.#saida = saida; }
  obterCanal() { return this.#canal; }
  enviarAlerta(destinatario, mensagem) {
    if (!destinatario || !mensagem) return false;
    this.#saida(`[${this.#canal}] para ${destinatario}: ${mensagem}`);
    return true;
  }
}
class NotificadorEmail extends NotificadorSimulado { constructor(saida) { super("E-mail", saida); } }
class NotificadorWhatsApp extends NotificadorSimulado { constructor(saida) { super("WhatsApp", saida); } }
class NotificadorPainel extends NotificadorSimulado { constructor(saida) { super("Painel", saida); } }

/* ===== Missão 7 — Agregação ===== */
class TrilhaEstudo {
  #titulo; #admin; #disciplinas = [];
  constructor(titulo, administrador) { this.#titulo = titulo; this.#admin = administrador; }
  getTitulo() { return this.#titulo; }
  adicionarDisciplina(d) { if (!this.#disciplinas.includes(d)) this.#disciplinas.push(d); }
  calcularCargaHorariaTotal() { return this.#disciplinas.reduce((t, d) => t + d.getCargaHorariaSemanalHoras(), 0); }
}

/* ===== Missão 8 — Composição e Dependência ===== */
class ItemCronograma {
  constructor(diaSemana, minutosPlanejados) { this.diaSemana = diaSemana; this.minutosPlanejados = minutosPlanejados; }
}
class PlanoEstudo {
  #itens = [];
  adicionarItem(diaSemana, minutos) { if (minutos > 0) this.#itens.push(new ItemCronograma(diaSemana, minutos)); }
  listarItens() { return this.#itens.map(i => `${i.diaSemana}: ${i.minutosPlanejados} min`); } // nunca devolve a lista interna
  calcularMinutosPlanejados() { return this.#itens.reduce((t, i) => t + i.minutosPlanejados, 0); }
}
class ServicoAlertaResponsavel { // sem campos: apenas depende dos parâmetros
  avaliarDiscente(discente, meta, responsavel, notificador) {
    if (!verificarNotificador(notificador)) throw new TypeError("O notificador não cumpre o contrato INotificador.");
    const msg = meta.estaCumprida()
      ? `Parabéns! ${discente.getNome()} atingiu 100% da meta semanal.`
      : `${discente.getNome()} está com ${Math.floor(meta.calcularPercentual())}% da meta semanal.`;
    return notificador.enviarAlerta(responsavel.getEmail(), msg);
  }
}

/* ===== Missão 10 — Cliente do backend (C# + MySQL) ===== */
class ClienteBackendEstudo {
  #urlBase;
  constructor(urlBase = "http://localhost:5080") { this.#urlBase = urlBase; }
  async #requisitar(caminho, opcoes) {
    const resposta = await fetch(this.#urlBase + caminho, opcoes);
    const corpo = await resposta.json().catch(() => ({}));
    if (!resposta.ok) throw new Error(corpo.erro || `Erro HTTP ${resposta.status}`);
    return corpo;
  }
  obterStatus() { return this.#requisitar("/api/status"); }
  listarSessoes(discente = "") { return this.#requisitar(`/api/sessoes?discente=${encodeURIComponent(discente)}`); }
  listarMetas(discente = "") { return this.#requisitar(`/api/metas?discente=${encodeURIComponent(discente)}`); }
  obterRelatorio(discente) { return this.#requisitar(`/api/relatorio/${encodeURIComponent(discente)}`); }
  salvarSessao(nomeDiscente, sessao) {
    if (!verificarExportavel(sessao)) throw new TypeError("A sessão não implementa IExportavelJson.");
    return this.#requisitar("/api/sessoes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discenteNome: nomeDiscente, ...JSON.parse(sessao.paraJson()) })
    });
  }
}

/* ===== Missão 9 — Tela (só lê controles e delega aos objetos) ===== */
const MODALIDADES = {
  Pomodoro:   { campos: [["ciclos", "Ciclos completos", 1]],
                criar: (d, min, v) => new SessaoPomodoro(d, min, v.ciclos) },
  Exercicios: { campos: [["total", "Total de questões", 10], ["acertos", "Acertos", 8]],
                criar: (d, min, v) => new SessaoExercicios(d, min, v.total, v.acertos) },
  Leitura:    { campos: [["paginas", "Páginas lidas", 10], ["resumo", "Fez resumo?", true]],
                criar: (d, min, v) => new SessaoLeitura(d, min, v.paginas, v.resumo) }
};

class TelaEstudo {
  #cliente; #disciplinas; #discente; #responsavel; #meta; #servico; #notificadores;
  constructor(cliente = new ClienteBackendEstudo()) {
    this.#cliente = cliente;
    this.#disciplinas = [
      new Disciplina("ADS201", "Programação Orientada a Objetos", "Computação", 4),
      new Disciplina("ADS202", "Banco de Dados e Modelagem SQL", "Dados", 4),
      new Disciplina("ADS203", "Projeto Interdisciplinar (PI)", "Prática", 6)
    ];
    this.#discente = new Discente(3, "Lucas Silva", "lucas.silva@edu.fecap.br", "123", "RA-2026101");
    this.#responsavel = new Responsavel(2, "Carlos Silva (Pai do Lucas)", "carlos@email.com", "123", "Pai");
    this.#meta = new MetaEstudo(180);
    this.#responsavel.vincularDiscente(this.#discente, this.#meta);
    this.#servico = new ServicoAlertaResponsavel();
    const aviso = msg => this.#toast(msg);
    this.#notificadores = { "E-mail": new NotificadorEmail(aviso), WhatsApp: new NotificadorWhatsApp(aviso), Painel: new NotificadorPainel(aviso) };
  }
  #$(id) { return document.getElementById(id); }
  #toast(msg, erro = false) {
    const t = this.#$("toast"); t.textContent = msg; t.className = "show" + (erro ? " erro" : "");
    clearTimeout(this._t); this._t = setTimeout(() => (t.className = ""), 3500);
  }
  #opcoes(select, textos) { textos.forEach(([valor, texto]) => select.add(new Option(texto, valor))); }

  async iniciar() {
    this.#opcoes(this.#$("sel-disc"), this.#disciplinas.map((d, i) => [i, d.getNome()]));
    this.#opcoes(this.#$("sel-mod"), Object.keys(MODALIDADES).map(m => [m, m]));
    this.#opcoes(this.#$("sel-not"), Object.keys(this.#notificadores).map(n => [n, n]));
    this.#$("catalogo").replaceChildren(...this.#disciplinas.map(d => Object.assign(document.createElement("li"), { textContent: d.exibirResumo() })));
    this.#$("sel-mod").addEventListener("change", () => this.#montarExtras());
    this.#$("btn-reg").addEventListener("click", () => this.#registrar());
    this.#$("btn-not").addEventListener("click", () => this.#notificar());
    this.#$("btn-srv").addEventListener("click", () => this.#carregarServidor());
    this.#montarExtras(); this.#atualizar();
    await this.#sincronizar();
  }
  #montarExtras() {
    const campos = MODALIDADES[this.#$("sel-mod").value].campos;
    this.#$("extras").replaceChildren(...campos.map(([id, rotulo, padrao]) => {
      const label = document.createElement("label"); label.textContent = rotulo + " ";
      const input = document.createElement("input"); input.id = "ex-" + id;
      if (typeof padrao === "boolean") { input.type = "checkbox"; input.checked = padrao; }
      else { input.type = "number"; input.min = 0; input.value = padrao; }
      label.append(input); return label;
    }));
  }
  #lerExtras() {
    const v = {};
    MODALIDADES[this.#$("sel-mod").value].campos.forEach(([id, , padrao]) => {
      const el = this.#$("ex-" + id); v[id] = typeof padrao === "boolean" ? el.checked : Number(el.value);
    });
    return v;
  }
  async #sincronizar() { // traz meta e XP já gravados no banco para os objetos
    const status = this.#$("status");
    try {
      const [metaSrv] = await this.#cliente.listarMetas(this.#discente.getNome());
      if (metaSrv) {
        this.#meta.redefinirMeta(metaSrv.metaMinutosSemana);
        for (let r = metaSrv.minutosCumpridos; r > 0; r -= 480) this.#meta.registrarAvanco(Math.min(r, 480));
      }
      const rel = await this.#cliente.obterRelatorio(this.#discente.getNome());
      this.#discente.adicionarXp(rel.totalXpAcumulado);
      const st = await this.#cliente.obterStatus();
      status.textContent = "Backend online — " + st.modoBanco; status.className = "badge on";
      this.#atualizar();
    } catch {
      status.textContent = "Backend offline (inicie o iniciar_backend.bat)"; status.className = "badge off";
    }
  }
  async #registrar() {
    try {
      const disciplina = this.#disciplinas[Number(this.#$("sel-disc").value)];
      const minutos = Number(this.#$("inp-dur").value);
      const sessao = MODALIDADES[this.#$("sel-mod").value].criar(disciplina, minutos, this.#lerExtras());
      if (!this.#meta.registrarAvanco(minutos)) return this.#toast("Duração inválida: use de 1 a 480 minutos.", true);
      this.#discente.registrarEstudo(sessao);
      this.#atualizar();
      try {
        await this.#cliente.salvarSessao(this.#discente.getNome(), sessao);
        this.#toast("Sessão registrada e salva no banco! +" + sessao.calcularXp() + " XP");
      } catch (e) { this.#toast("Registrada só na tela — backend indisponível: " + e.message, true); }
    } catch (e) { this.#toast(e.message, true); }
  }
  #notificar() {
    const canal = this.#notificadores[this.#$("sel-not").value];
    if (!this.#servico.avaliarDiscente(this.#discente, this.#meta, this.#responsavel, canal)) this.#toast("Falha ao notificar.", true);
  }
  #atualizar() {
    const pct = this.#meta.calcularPercentual();
    this.#$("perfil-discente").textContent = this.#discente.gerarPainelResumo();
    this.#$("perfil-resp").textContent = this.#responsavel.gerarPainelResumo();
    this.#$("barra").style.width = pct + "%";
    this.#$("pct").textContent = `${pct.toFixed(1)}% — ${this.#meta.getMinutosCumpridos()} de ${this.#meta.getMetaMinutosSemana()} min` + (this.#meta.estaCumprida() ? " ✅ meta cumprida!" : "");
    this.#$("lista").replaceChildren(...this.#discente.getHistorico().reverse().map(s => Object.assign(document.createElement("li"), { textContent: s.gerarFeedback() })));
  }
  async #carregarServidor() {
    try {
      const nome = this.#discente.getNome();
      const rel = await this.#cliente.obterRelatorio(nome);
      this.#$("srv-resumo").textContent = `${rel.totalSessoes} sessões · ${rel.totalMinutosEstudados} min · ${rel.totalXpAcumulado} XP · ${rel.percentualMetaConcluida}% da meta — ${rel.statusAcompanhamento}`;
      const sessoes = await this.#cliente.listarSessoes(nome);
      this.#$("srv-lista").replaceChildren(...sessoes.map(s => Object.assign(document.createElement("li"), { textContent: `#${s.id} ${s.dataRegistro} — ${s.resumoFeedback}` })));
    } catch (e) { this.#toast("Não foi possível carregar do servidor: " + e.message, true); }
  }
}

if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => new TelaEstudo().iniciar());
if (typeof module !== "undefined") module.exports = { Disciplina, MetaEstudo, Usuario, Administrador, Responsavel, Discente, SessaoEstudo, SessaoPomodoro, SessaoExercicios, SessaoLeitura, NotificadorEmail, NotificadorWhatsApp, NotificadorPainel, TrilhaEstudo, PlanoEstudo, ServicoAlertaResponsavel, ClienteBackendEstudo, verificarNotificador, verificarExportavel };
