import { useState } from "react";
import "../../Style/Css/Pages/Home.css";

const atalhosBusca = [
  {
    titulo: "Funcionários",
    descricao: "Consultar colaboradores cadastrados",
    tipo: "Gestão de pessoas",
  },
  {
    titulo: "Departamentos",
    descricao: "Visualizar áreas e setores da empresa",
    tipo: "Organização",
  },
  {
    titulo: "Perfil",
    descricao: "Acessar dados do usuário logado",
    tipo: "Conta",
  },
];

const notificacoes = [
  {
    titulo: "Férias aguardando análise",
    descricao: "7 solicitações precisam de acompanhamento.",
    tempo: "Hoje",
  },
  {
    titulo: "Cadastro atualizado",
    descricao: "Maria Oliveira teve dados revisados pelo RH.",
    tempo: "2h atrás",
  },
  {
    titulo: "Folha processada",
    descricao: "Processamento mensal concluído com sucesso.",
    tempo: "1 dia atrás",
  },
];

function obterPrimeiroNomeUsuario() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return "";
  }

  try {
    const usuario = JSON.parse(usuarioSalvo) as { nome?: string };
    const primeiroNome = usuario.nome?.trim().split(" ")[0];

    return primeiroNome || "";
  } catch {
    return "";
  }
}

function Home() {
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [busca, setBusca] = useState("");
  const [nomeUsuario] = useState(() => obterPrimeiroNomeUsuario());

  const sugestoesBusca = atalhosBusca.filter((atalho) => {
    const textoBusca = busca.toLowerCase().trim();

    return (
      textoBusca.length > 0 &&
      `${atalho.titulo} ${atalho.descricao} ${atalho.tipo}`
        .toLowerCase()
        .includes(textoBusca)
    );
  });

  return (
    <main className="home">
      <section className="home__dashboard" aria-labelledby="home-title">
        <header className="home__topbar">
          <div className="home__welcome">
            <h1 id="home-title">
              {nomeUsuario ? `Olá, ${nomeUsuario}!` : "Olá!"}
            </h1>
            <p>Bem-vindo(a) de volta ao PeopleCore</p>
          </div>

          <div className="home__search-wrapper">
            <div className="home__search" aria-label="Busca rápida">
              <span>⌕</span>
              <input
                type="text"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar funcionários, departamentos..."
              />
              <small>Ctrl + K</small>
            </div>

            {busca.length > 0 && (
              <div className="home__search-results">
                {sugestoesBusca.length > 0 ? (
                  sugestoesBusca.map((sugestao) => (
                    <button type="button" key={sugestao.titulo}>
                      <strong>{sugestao.titulo}</strong>
                      <span>{sugestao.descricao}</span>
                      <small>{sugestao.tipo}</small>
                    </button>
                  ))
                ) : (
                  <p>Nenhum resultado encontrado na Home.</p>
                )}
              </div>
            )}
          </div>

          <div className="home__top-actions" aria-label="Ações rápidas">
            <button
              className="home__notification"
              type="button"
              aria-label="3 notificações"
              aria-expanded={notificacoesAbertas}
              onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
            >
              <span className="home__bell"></span>
              <small>3</small>
            </button>

            {notificacoesAbertas && (
              <div className="home__notification-popover">
                <div className="home__popover-header">
                  <strong>Notificações</strong>
                  <button
                    type="button"
                    onClick={() => setNotificacoesAbertas(false)}
                  >
                    Fechar
                  </button>
                </div>

                <ul>
                  {notificacoes.map((notificacao) => (
                    <li key={notificacao.titulo}>
                      <div>
                        <strong>{notificacao.titulo}</strong>
                        <p>{notificacao.descricao}</p>
                      </div>
                      <span>{notificacao.tempo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="home__shortcut"
              type="button"
              aria-label="Abrir atalhos"
            >
              <span className="home__shortcut-icon"></span>
            </button>
          </div>
        </header>

        <section className="home__metrics" aria-label="Resumo da gestão">
          <article className="home__metric-card">
            <span className="home__metric-icon">Equipe</span>
            <div>
              <p>Total de Funcionários</p>
              <strong>128</strong>
              <span className="home__positive">↑ 8% desde o mês passado</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon">Setores</span>
            <div>
              <p>Departamentos</p>
              <strong>12</strong>
              <span>— sem alterações</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon home__metric-icon--warning">
              Cargos
            </span>
            <div>
              <p>Cargos</p>
              <strong>28</strong>
              <span className="home__positive">↑ 3 novos cargos</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon home__metric-icon--warning">
              Férias
            </span>
            <div>
              <p>Férias em andamento</p>
              <strong>15</strong>
              <button type="button">Ver todos</button>
            </div>
          </article>
        </section>

        <section className="home__content-grid">
          <article className="home__panel home__panel--chart">
            <div className="home__panel-header">
              <h2>Funcionários por Departamento</h2>
              <button type="button">Este mês</button>
            </div>

            <div className="home__chart-content">
              <div className="home__donut" aria-label="Total de funcionários">
                <div>
                  <strong>128</strong>
                  <span>funcionários ativos</span>
                </div>
              </div>

              <ul className="home__department-list">
                <li>
                  <span className="home__dot home__dot--teal"></span>
                  Tecnologia <strong>45 (35%)</strong>
                </li>
                <li>
                  <span className="home__dot home__dot--green"></span>
                  Recursos Humanos <strong>28 (22%)</strong>
                </li>
                <li>
                  <span className="home__dot home__dot--yellow"></span>
                  Financeiro <strong>20 (16%)</strong>
                </li>
                <li>
                  <span className="home__dot home__dot--mint"></span>
                  Marketing <strong>18 (14%)</strong>
                </li>
                <li>
                  <span className="home__dot home__dot--cream"></span>
                  Outros <strong>17 (13%)</strong>
                </li>
              </ul>
            </div>
          </article>

          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Aniversariantes do Mês</h2>
              <button type="button">Ver todos</button>
            </div>

            <div className="home__birthday-list">
              <article>
                <img src="/mulher-propaganda-home.png" alt="Mariana Costa" />
                <div>
                  <strong>Mariana Costa</strong>
                  <span>Desenvolvedora Frontend</span>
                </div>
                <small>12 Mai</small>
              </article>

              <article>
                <img src="/homem-propaganda-home.png" alt="Pedro Henrique" />
                <div>
                  <strong>Pedro Henrique</strong>
                  <span>Analista de RH</span>
                </div>
                <small>18 Mai</small>
              </article>

              <article>
                <img src="/mulher-propaganda-home.png" alt="Camila Ribeiro" />
                <div>
                  <strong>Camila Ribeiro</strong>
                  <span>Analista Financeira</span>
                </div>
                <small>30 Mai</small>
              </article>
            </div>
          </article>
        </section>

        <section className="home__bottom-grid">
          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Atividades Recentes</h2>
              <button type="button">Ver todas</button>
            </div>

            <ul className="home__activity-list">
              <li>
                <span>Novo</span>
                <p>Novo funcionário João Santos adicionado em Tecnologia</p>
                <small>2h atrás</small>
              </li>
              <li>
                <span>Férias</span>
                <p>Férias de Ana Paula aprovadas para Junho</p>
                <small>5h atrás</small>
              </li>
              <li>
                <span>Folha</span>
                <p>Folha de pagamento processada com sucesso</p>
                <small>1 dia atrás</small>
              </li>
              <li>
                <span>Dados</span>
                <p>Alteração cadastral de Maria Oliveira atualizada</p>
                <small>2 dias atrás</small>
              </li>
            </ul>
          </article>

          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Solicitações Pendentes</h2>
              <button type="button">Ver todas</button>
            </div>

            <ul className="home__request-list">
              <li>
                Férias <strong>7</strong>
              </li>
              <li>
                Admissões <strong>3</strong>
              </li>
              <li>
                Alterações Cadastrais <strong>5</strong>
              </li>
              <li>
                Rescisões <strong>2</strong>
              </li>
            </ul>
          </article>
        </section>

        <section className="home__news" aria-labelledby="news-title">
          <div className="home__panel-header">
            <div>
              <span className="home__label">News PeopleCore</span>
              <h2 id="news-title">Você sabia?</h2>
            </div>
            <button type="button">Ver novidades</button>
          </div>

          <div className="home__news-viewport">
            <div className="home__news-track">
              <article className="home__news-card">
                <img
                  src="/funcionalidade-funcionario.jpg"
                  alt="Tela de funcionários do PeopleCore"
                />
                <div>
                  <span>Funcionários</span>
                  <h3>Cadastros centralizados</h3>
                  <p>Dados importantes reunidos em uma tela organizada.</p>
                </div>
              </article>

              <article className="home__news-card">
                <img
                  src="/sistema-rh-impacto.png"
                  alt="Indicadores visuais do sistema de RH"
                />
                <div>
                  <span>Indicadores</span>
                  <h3>Resumo visual da gestão</h3>
                  <p>Informações rápidas para apoiar decisões do RH.</p>
                </div>
              </article>

              <article className="home__news-card">
                <img
                  src="/pipoca-organizada.png"
                  alt="Mascote organizada representando rotina de RH"
                />
                <div>
                  <span>Organização</span>
                  <h3>Rotina mais simples</h3>
                  <p>Menos controles espalhados e mais clareza no processo.</p>
                </div>
              </article>

              <article className="home__news-card" aria-hidden="true">
                <img src="/funcionalidade-funcionario.jpg" alt="" />
                <div>
                  <span>Funcionários</span>
                  <h3>Cadastros centralizados</h3>
                  <p>Dados importantes reunidos em uma tela organizada.</p>
                </div>
              </article>

              <article className="home__news-card" aria-hidden="true">
                <img src="/sistema-rh-impacto.png" alt="" />
                <div>
                  <span>Indicadores</span>
                  <h3>Resumo visual da gestão</h3>
                  <p>Informações rápidas para apoiar decisões do RH.</p>
                </div>
              </article>

              <article className="home__news-card" aria-hidden="true">
                <img src="/pipoca-organizada.png" alt="" />
                <div>
                  <span>Organização</span>
                  <h3>Rotina mais simples</h3>
                  <p>Menos controles espalhados e mais clareza no processo.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;