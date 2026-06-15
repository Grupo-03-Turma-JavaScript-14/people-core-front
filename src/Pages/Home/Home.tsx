import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarDepartamentos,
  listarFuncionarios,
} from "../../Service/Service";
import type { Departamento, Funcionario } from "../../Service/Types";
import "../../Style/Css/pages/Home.css";

type TipoResultado = "Funcionário" | "Departamento" | "Cargo";

interface ResultadoBusca {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoResultado;
  caminho: string;
  relevancia: number;
}

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
  caminho: string;
}

const CORES_DEPARTAMENTOS = [
  "#00796f",
  "#18b7a7",
  "#f8c917",
  "#5ce1d2",
  "#f8ecd1",
];

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obterPrimeiroNomeUsuario() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) return "";

  try {
    const usuario = JSON.parse(usuarioSalvo) as { nome?: string };
    return usuario.nome?.trim().split(" ")[0] || "";
  } catch {
    return "";
  }
}

function obterCampoTexto(
  item: object,
  campos: string[],
): string | undefined {
  const dados = item as Record<string, unknown>;

  for (const campo of campos) {
    const valor = dados[campo];
    if (typeof valor === "string" && valor.trim()) return valor;
  }

  return undefined;
}

function obterData(item: object, campos: string[]): Date | undefined {
  const valor = obterCampoTexto(item, campos);
  if (!valor) return undefined;

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? undefined : data;
}

function formatarTempo(data?: Date) {
  if (!data) return "Cadastro ativo";

  const diferenca = Date.now() - data.getTime();
  const horas = Math.floor(diferenca / 3_600_000);
  const dias = Math.floor(diferenca / 86_400_000);

  if (diferenca < 0) return data.toLocaleDateString("pt-BR");
  if (horas < 1) return "Agora";
  if (horas < 24) return `${horas}h atrás`;
  if (dias === 1) return "Ontem";
  if (dias < 30) return `${dias} dias atrás`;

  return data.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function Home() {
  const navigate = useNavigate();
  const inputBuscaRef = useRef<HTMLInputElement>(null);
  const buscaRef = useRef<HTMLDivElement>(null);
  const notificacaoRef = useRef<HTMLDivElement>(null);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [nomeUsuario] = useState(() => obterPrimeiroNomeUsuario());

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        const [dadosFuncionarios, dadosDepartamentos] = await Promise.all([
          listarFuncionarios(),
          listarDepartamentos(),
        ]);
        setFuncionarios(dadosFuncionarios);
        setDepartamentos(dadosDepartamentos);
      } catch {
        setErro("Não foi possível carregar os dados da Home.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const cargos = useMemo(
    () =>
      Array.from(
        new Set(
          funcionarios
            .map((funcionario) => funcionario.cargo?.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [funcionarios],
  );

  const resultadosBusca = useMemo(() => {
    const termo = normalizarTexto(busca);
    if (!termo) return [];

    const classificar = (
      nome: string,
      categoriaRelacionada = "",
    ): number | undefined => {
      const nomeNormalizado = normalizarTexto(nome);
      const categoriaNormalizada = normalizarTexto(categoriaRelacionada);

      if (nomeNormalizado.startsWith(termo)) return 0;
      if (nomeNormalizado.includes(termo)) return 1;
      if (categoriaNormalizada.includes(termo)) return 2;
      return undefined;
    };

    const resultados: ResultadoBusca[] = [];

    departamentos.forEach((departamento) => {
      const relevancia = classificar(
        departamento.departamento,
        "departamento setor área",
      );
      if (relevancia === undefined) return;

      resultados.push({
        id: `departamento-${departamento.id ?? departamento.departamento}`,
        nome: departamento.departamento,
        descricao: "Departamento da empresa",
        tipo: "Departamento",
        caminho: `/departamentos?busca=${encodeURIComponent(departamento.departamento)}`,
        relevancia,
      });
    });

    cargos.forEach((cargo) => {
      const relevancia = classificar(cargo, "cargo equipe função");
      if (relevancia === undefined) return;

      resultados.push({
        id: `cargo-${cargo}`,
        nome: cargo,
        descricao: "Cargo vinculado a funcionários",
        tipo: "Cargo",
        caminho: `/funcionarios?cargo=${encodeURIComponent(cargo)}`,
        relevancia,
      });
    });

    funcionarios.forEach((funcionario) => {
      const relevancia = classificar(
        funcionario.nome,
        `${funcionario.cargo} ${funcionario.categoria?.departamento ?? ""} funcionário colaborador`,
      );
      if (relevancia === undefined) return;

      resultados.push({
        id: `funcionario-${funcionario.id ?? funcionario.nome}`,
        nome: funcionario.nome,
        descricao: [
          funcionario.cargo,
          funcionario.categoria?.departamento,
        ]
          .filter(Boolean)
          .join(" · "),
        tipo: "Funcionário",
        caminho: `/funcionarios?busca=${encodeURIComponent(funcionario.nome)}`,
        relevancia,
      });
    });

    const prioridadeTipo: Record<TipoResultado, number> = {
      Departamento: 0,
      Cargo: 1,
      Funcionário: 2,
    };

    return resultados
      .sort(
        (a, b) =>
          a.relevancia - b.relevancia ||
          prioridadeTipo[a.tipo] - prioridadeTipo[b.tipo] ||
          a.nome.localeCompare(b.nome, "pt-BR"),
      )
      .slice(0, 8);
  }, [busca, cargos, departamentos, funcionarios]);

  const funcionariosPorDepartamento = useMemo(() => {
    const contagem = new Map<string, number>();

    funcionarios.forEach((funcionario) => {
      const nome = funcionario.categoria?.departamento || "Sem departamento";
      contagem.set(nome, (contagem.get(nome) || 0) + 1);
    });

    return Array.from(contagem, ([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [funcionarios]);

  const remuneracoes = useMemo(
    () =>
      funcionarios.map((funcionario) => {
        const salarioTotal = Number(funcionario.salarioTotal);
        const valor = Number.isFinite(salarioTotal)
          ? salarioTotal
          : Number(funcionario.salarioBase) *
            Number(funcionario.horasTrabalhadas);

        return {
          funcionario,
          valor: Number.isFinite(valor) ? valor : 0,
        };
      }),
    [funcionarios],
  );

  const folhaEstimada = remuneracoes.reduce(
    (total, item) => total + item.valor,
    0,
  );
  const mediaSalarial =
    remuneracoes.length > 0 ? folhaEstimada / remuneracoes.length : 0;
  const maiorRemuneracao = remuneracoes.reduce(
    (maior, item) => (item.valor > maior.valor ? item : maior),
    { funcionario: undefined as Funcionario | undefined, valor: 0 },
  );

  const movimentacoesRecentes = useMemo(
    () =>
      [
        ...funcionarios.map((funcionario) => ({
          id: `funcionario-${funcionario.id ?? funcionario.nome}`,
          ordem: funcionario.id ?? 0,
          tipo: "Pessoa",
          titulo: funcionario.nome,
          descricao: [
            funcionario.cargo,
            funcionario.categoria?.departamento,
          ]
            .filter(Boolean)
            .join(" · "),
          caminho: `/funcionarios?busca=${encodeURIComponent(funcionario.nome)}`,
        })),
        ...departamentos.map((departamento) => ({
          id: `departamento-${departamento.id ?? departamento.departamento}`,
          ordem: departamento.id ?? 0,
          tipo: "Setor",
          titulo: departamento.departamento,
          descricao: "Departamento disponível para alocação",
          caminho: `/departamentos?busca=${encodeURIComponent(departamento.departamento)}`,
        })),
      ]
        .sort((a, b) => b.ordem - a.ordem)
        .slice(0, 4),
    [departamentos, funcionarios],
  );

  const notificacoes = useMemo<Notificacao[]>(() => {
    const itens: Notificacao[] = [];
    const funcionariosPorData = [...funcionarios].sort(
      (a, b) => (b.id ?? 0) - (a.id ?? 0),
    );

    funcionariosPorData.slice(0, 2).forEach((funcionario) => {
      const data = obterData(funcionario, [
        "createdAt",
        "criadoEm",
        "dataCriacao",
      ]);
      itens.push({
        id: `funcionario-${funcionario.id ?? funcionario.nome}`,
        titulo: data ? "Funcionário cadastrado recentemente" : "Funcionário cadastrado",
        descricao: `${funcionario.nome} · ${funcionario.cargo}`,
        tempo: formatarTempo(data),
        caminho: `/funcionarios?busca=${encodeURIComponent(funcionario.nome)}`,
      });
    });

    [...departamentos]
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 2)
      .forEach((departamento) => {
      const data = obterData(departamento, [
        "createdAt",
        "criadoEm",
        "dataCriacao",
      ]);
      itens.push({
        id: `departamento-${departamento.id ?? departamento.departamento}`,
        titulo: data ? "Departamento criado recentemente" : "Departamento cadastrado",
        descricao: departamento.departamento,
        tempo: formatarTempo(data),
        caminho: `/departamentos?busca=${encodeURIComponent(departamento.departamento)}`,
      });
      });

    return itens.slice(0, 5);
  }, [departamentos, funcionarios]);

  useEffect(() => {
    function tratarAtalhos(evento: KeyboardEvent) {
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "k") {
        evento.preventDefault();
        inputBuscaRef.current?.focus();
        setBuscaAberta(true);
      }

      if (evento.key === "Escape") {
        setNotificacoesAbertas(false);
      }
    }

    function fecharAoClicarFora(evento: MouseEvent) {
      const alvo = evento.target as Node;
      if (buscaRef.current && !buscaRef.current.contains(alvo)) {
        setBuscaAberta(false);
      }
      if (
        notificacaoRef.current &&
        !notificacaoRef.current.contains(alvo)
      ) {
        setNotificacoesAbertas(false);
      }
    }

    window.addEventListener("keydown", tratarAtalhos);
    document.addEventListener("mousedown", fecharAoClicarFora);

    return () => {
      window.removeEventListener("keydown", tratarAtalhos);
      document.removeEventListener("mousedown", fecharAoClicarFora);
    };
  }, []);

  function navegarPara(caminho: string) {
    setBusca("");
    setBuscaAberta(false);
    setNotificacoesAbertas(false);
    navigate(caminho);
  }

  function tratarTecladoBusca(evento: ReactKeyboardEvent<HTMLInputElement>) {
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setIndiceSelecionado((indice) =>
        Math.min(indice + 1, resultadosBusca.length - 1),
      );
    }

    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndiceSelecionado((indice) => Math.max(indice - 1, 0));
    }

    if (evento.key === "Enter" && indiceSelecionado >= 0) {
      evento.preventDefault();
      navegarPara(resultadosBusca[indiceSelecionado].caminho);
    }

    if (evento.key === "Escape") {
      evento.preventDefault();
      setBuscaAberta(false);
    }
  }

  function sairDaConta() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  }

  const totalFuncionarios = funcionarios.length;

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

          <div className="home__search-wrapper" ref={buscaRef}>
            <div className="home__search" role="search">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputBuscaRef}
                type="search"
                value={busca}
                role="combobox"
                aria-label="Buscar funcionários, departamentos e cargos"
                aria-autocomplete="list"
                aria-controls="home-search-results"
                aria-expanded={buscaAberta && busca.trim().length > 0}
                aria-activedescendant={
                  indiceSelecionado >= 0
                    ? resultadosBusca[indiceSelecionado]?.id
                    : undefined
                }
                onChange={(evento) => {
                  setBusca(evento.target.value);
                  setBuscaAberta(true);
                  setIndiceSelecionado(evento.target.value.trim() ? 0 : -1);
                }}
                onFocus={() => setBuscaAberta(true)}
                onKeyDown={tratarTecladoBusca}
                placeholder="Buscar funcionários, departamentos e cargos..."
              />
              <small>Ctrl + K</small>
            </div>

            {buscaAberta && busca.trim().length > 0 && (
              <div
                className="home__search-results"
                id="home-search-results"
                role="listbox"
              >
                {resultadosBusca.length > 0 ? (
                  resultadosBusca.map((resultado, indice) => (
                    <button
                      type="button"
                      role="option"
                      id={resultado.id}
                      key={resultado.id}
                      aria-selected={indiceSelecionado === indice}
                      className={
                        indiceSelecionado === indice
                          ? "home__search-result--selected"
                          : ""
                      }
                      onMouseEnter={() => setIndiceSelecionado(indice)}
                      onClick={() => navegarPara(resultado.caminho)}
                    >
                      <span className="home__search-result-header">
                        <strong>{resultado.nome}</strong>
                        <small>{resultado.tipo}</small>
                      </span>
                      <span>{resultado.descricao}</span>
                    </button>
                  ))
                ) : (
                  <p>Nenhum resultado encontrado.</p>
                )}
              </div>
            )}
          </div>

          <div className="home__top-actions" aria-label="Ações rápidas">
            <div className="home__notification-area" ref={notificacaoRef}>
              <button
                className="home__notification"
                type="button"
                aria-label={`${notificacoes.length} notificações`}
                aria-expanded={notificacoesAbertas}
                aria-controls="home-notifications"
                onClick={() => setNotificacoesAbertas((abertas) => !abertas)}
              >
                <span className="home__bell" aria-hidden="true" />
                {notificacoes.length > 0 && <small>{notificacoes.length}</small>}
              </button>

              {notificacoesAbertas && (
                <div
                  className="home__notification-popover"
                  id="home-notifications"
                  role="dialog"
                  aria-label="Notificações"
                >
                  <div className="home__popover-header">
                    <strong>Notificações</strong>
                    <button
                      type="button"
                      onClick={() => setNotificacoesAbertas(false)}
                    >
                      Fechar
                    </button>
                  </div>

                  {notificacoes.length > 0 ? (
                    <ul>
                      {notificacoes.map((notificacao) => (
                        <li key={notificacao.id}>
                          <button
                            type="button"
                            onClick={() => navegarPara(notificacao.caminho)}
                          >
                            <div>
                              <strong>{notificacao.titulo}</strong>
                              <p>{notificacao.descricao}</p>
                            </div>
                            <span>{notificacao.tempo}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="home__empty-message">
                      Nenhuma notificação disponível.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              className="home__shortcut"
              type="button"
              aria-label="Sair da conta"
              title="Sair da conta"
              onClick={sairDaConta}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        {erro && <p className="home__data-status home__data-status--error">{erro}</p>}
        {carregando && <p className="home__data-status">Carregando dados da Home...</p>}

        <section className="home__metrics" aria-label="Resumo da gestão">
          <article className="home__metric-card">
            <span className="home__metric-icon">Equipe</span>
            <div>
              <p>Total de Funcionários</p>
              <strong>{carregando ? "..." : totalFuncionarios}</strong>
              <span>Dados atuais do cadastro</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon">Setores</span>
            <div>
              <p>Departamentos</p>
              <strong>{carregando ? "..." : departamentos.length}</strong>
              <span>Unidades cadastradas</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon home__metric-icon--warning">Cargos</span>
            <div>
              <p>Cargos/equipes</p>
              <strong>{carregando ? "..." : cargos.length}</strong>
              <span>Cargos únicos dos funcionários</span>
            </div>
          </article>

          <article className="home__metric-card">
            <span className="home__metric-icon home__metric-icon--warning">Folha</span>
            <div>
              <p>Folha estimada</p>
              <strong className="home__metric-value--currency">
                {carregando ? "..." : formatarMoeda(folhaEstimada)}
              </strong>
              <span>Soma das remunerações cadastradas</span>
            </div>
          </article>
        </section>

        <section className="home__content-grid">
          <article className="home__panel home__panel--chart">
            <div className="home__panel-header">
              <h2>Funcionários por Departamento</h2>
              <button type="button" onClick={() => navegarPara("/departamentos")}>
                Ver departamentos
              </button>
            </div>

            <div className="home__allocation">
              <div className="home__allocation-summary">
                <span>Alocação atual</span>
                <strong>{totalFuncionarios}</strong>
                <small>funcionários distribuídos por setor</small>
              </div>

              {funcionariosPorDepartamento.length > 0 ? (
                <ul className="home__department-list">
                  {funcionariosPorDepartamento.map((item, indice) => {
                    const percentual = Math.round(
                      (item.total / totalFuncionarios) * 100,
                    );

                    return (
                      <li key={item.nome}>
                        <div className="home__department-row">
                          <span className="home__department-name">
                            <i
                              style={{ background: CORES_DEPARTAMENTOS[indice] }}
                            />
                            {item.nome}
                          </span>
                          <strong>{item.total} · {percentual}%</strong>
                        </div>
                        <div
                          className="home__department-progress"
                          role="progressbar"
                          aria-label={`${item.nome}: ${percentual}%`}
                          aria-valuenow={percentual}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <span
                            style={{
                              width: `${percentual}%`,
                              background: CORES_DEPARTAMENTOS[indice],
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="home__empty-message">
                  Nenhum funcionário vinculado a departamentos.
                </p>
              )}
            </div>
          </article>

          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Panorama Financeiro</h2>
              <button type="button" onClick={() => navegarPara("/funcionarios")}>
                Ver funcionários
              </button>
            </div>

            <div className="home__financial-overview">
              <div className="home__financial-highlight">
                <span>Média por funcionário</span>
                <strong>{formatarMoeda(mediaSalarial)}</strong>
                <small>Com base nos valores cadastrados</small>
              </div>

              <dl className="home__financial-list">
                <div>
                  <dt>Folha estimada</dt>
                  <dd>{formatarMoeda(folhaEstimada)}</dd>
                </div>
                <div>
                  <dt>Maior remuneração</dt>
                  <dd>{formatarMoeda(maiorRemuneracao.valor)}</dd>
                </div>
                <div>
                  <dt>Referência</dt>
                  <dd>{maiorRemuneracao.funcionario?.nome ?? "Sem registros"}</dd>
                </div>
              </dl>
            </div>
          </article>
        </section>

        <section className="home__bottom-grid">
          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Últimos Cadastros</h2>
            </div>
            <ul className="home__activity-list">
              {movimentacoesRecentes.map((movimentacao) => (
                <li key={movimentacao.id}>
                  <span>{movimentacao.tipo}</span>
                  <div>
                    <p>{movimentacao.titulo}</p>
                    <small>{movimentacao.descricao}</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => navegarPara(movimentacao.caminho)}
                  >
                    Abrir
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="home__panel">
            <div className="home__panel-header">
              <h2>Resumo Operacional</h2>
            </div>
            <ul className="home__request-list">
              <li>Funcionários com departamento <strong>{funcionarios.filter((item) => item.categoria?.id).length}</strong></li>
              <li>Funcionários sem departamento <strong>{funcionarios.filter((item) => !item.categoria?.id).length}</strong></li>
              <li>Cargos/equipes identificados <strong>{cargos.length}</strong></li>
              <li>Média por departamento <strong>{departamentos.length > 0 ? (totalFuncionarios / departamentos.length).toFixed(1) : "0"}</strong></li>
            </ul>
          </article>
        </section>

        <section className="home__news" aria-labelledby="news-title">
          <div className="home__panel-header">
            <div>
              <span className="home__label">News PeopleCore</span>
              <h2 id="news-title">Você sabia?</h2>
            </div>
          </div>

          <div className="home__news-viewport">
            <div className="home__news-track">
              {[
                {
                  imagem: "/funcionalidade-funcionario.jpg",
                  alt: "Tela de funcionários do PeopleCore",
                  categoria: "Funcionários",
                  titulo: "Cadastros centralizados",
                  texto: "Dados importantes reunidos em uma tela organizada.",
                },
                {
                  imagem: "/sistema-rh-impacto.png",
                  alt: "Indicadores visuais do sistema de RH",
                  categoria: "Indicadores",
                  titulo: "Resumo visual da gestão",
                  texto: "Informações rápidas para apoiar decisões do RH.",
                },
                {
                  imagem: "/pipoca-organizada.png",
                  alt: "Mascote representando rotina de RH organizada",
                  categoria: "Organização",
                  titulo: "Rotina mais simples",
                  texto: "Menos controles espalhados e mais clareza no processo.",
                },
              ].flatMap((noticia, repeticao) =>
                [noticia, { ...noticia }].map((item, indice) => (
                  <article
                    className="home__news-card"
                    key={`${item.titulo}-${repeticao}-${indice}`}
                    aria-hidden={indice === 1}
                  >
                    <img src={item.imagem} alt={indice === 1 ? "" : item.alt} />
                    <div>
                      <span>{item.categoria}</span>
                      <h3>{item.titulo}</h3>
                      <p>{item.texto}</p>
                    </div>
                  </article>
                )),
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;
