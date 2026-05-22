import { FormEvent, useState } from "react";

import {
  atualizarDepartamento,
  atualizarFuncionario,
  atualizarUsuario,
  buscarDepartamentoPorDescricao,
  buscarDepartamentoPorId,
  buscarFuncionarioPorId,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  buscarUsuarioPorNome,
  cadastrarDepartamento,
  cadastrarFuncionario,
  cadastrarUsuario,
  deletarDepartamento,
  deletarFuncionario,
  deletarUsuario,
  estaLogado,
  getUsuarioLogado,
  listarDepartamentos,
  listarFuncionarios,
  listarUsuarios,
  login,
  logout,
} from "../../Service/Service";
import "../../Style/Css/Pages/Testes.css";
import type {
  Departamento,
  Funcionario,
  Usuario,
  UsuarioLogin,
} from "../../Service/Types";

type StatusTeste = "aguardando" | "sucesso" | "erro";

interface ResultadoTeste {
  nome: string;
  rota: string;
  metodo: string;
  status: StatusTeste;
  detalhe: string;
  resposta?: unknown;
}

function Testes() {
const [nomeCadastro, setNomeCadastro] = useState("");
const [emailCadastro, setEmailCadastro] = useState("");
const [senhaCadastro, setSenhaCadastro] = useState("");
const [fotoCadastro, setFotoCadastro] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogin | null>(
    getUsuarioLogado()
  );

  const [resultados, setResultados] = useState<ResultadoTeste[]>([]);
  const [loading, setLoading] = useState(false);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [nomeDepartamentoCadastro, setNomeDepartamentoCadastro] = useState("");

const [nomeFuncionarioCadastro, setNomeFuncionarioCadastro] = useState("");
const [cargoFuncionarioCadastro, setCargoFuncionarioCadastro] = useState("");
const [horasFuncionarioCadastro, setHorasFuncionarioCadastro] = useState("");
const [salarioFuncionarioCadastro, setSalarioFuncionarioCadastro] = useState("");
const [usuarioIdFuncionarioCadastro, setUsuarioIdFuncionarioCadastro] = useState("");
const [departamentoIdFuncionarioCadastro, setDepartamentoIdFuncionarioCadastro] = useState("");

  function adicionarResultado(resultado: ResultadoTeste) {
    setResultados((resultadosAtuais) => [...resultadosAtuais, resultado]);
  }

  function limparResultados() {
    setResultados([]);
  }

  function tratarErro(error: unknown): string {
    const erro = error as {
      response?: {
        status?: number;
        data?: unknown;
      };
      message?: string;
    };

    if (erro.response) {
      return `Status ${erro.response.status}: ${JSON.stringify(
        erro.response.data
      )}`;
    }

    if (erro.message) {
      return erro.message;
    }

    return "Erro desconhecido.";
  }

  async function cadastrarUsuarioManual(event: FormEvent) {
  event.preventDefault();

  if (!nomeCadastro.trim()) {
    adicionarResultado({
      nome: "Cadastro manual de usuário",
      metodo: "POST",
      rota: "/usuarios",
      status: "erro",
      detalhe: "Informe o nome do usuário.",
    });

    return;
  }

  if (!emailCadastro.trim()) {
    adicionarResultado({
      nome: "Cadastro manual de usuário",
      metodo: "POST",
      rota: "/usuarios",
      status: "erro",
      detalhe: "Informe o email do usuário.",
    });

    return;
  }

  if (senhaCadastro.length < 8) {
    adicionarResultado({
      nome: "Cadastro manual de usuário",
      metodo: "POST",
      rota: "/usuarios",
      status: "erro",
      detalhe: "A senha precisa ter pelo menos 8 caracteres.",
    });

    return;
  }

  setLoading(true);

  const usuarioCriado = await executarTeste(
    "Cadastro manual de usuário",
    "POST",
    "/usuarios",
    () =>
      cadastrarUsuario({
        nome: nomeCadastro,
        usuario: emailCadastro,
        senha: senhaCadastro,
        foto: fotoCadastro || "https://placehold.co/200x200",
      })
  );

  if (usuarioCriado) {
    setNomeCadastro("");
    setEmailCadastro("");
    setSenhaCadastro("");
    setFotoCadastro("");

    await executarTeste("Login automático após cadastro", "POST", "/auth/login", () =>
      login({
        usuario: usuarioCriado.usuario,
        senha: senhaCadastro,
      })
    );

    setUsuarioLogado(getUsuarioLogado());
  }

  setLoading(false);
}
async function cadastrarDepartamentoManual(event: FormEvent) {
  event.preventDefault();

  if (!nomeDepartamentoCadastro.trim()) {
    adicionarResultado({
      nome: "Cadastro manual de departamento",
      metodo: "POST",
      rota: "/departamentos",
      status: "erro",
      detalhe: "Informe o nome do departamento.",
    });

    return;
  }

  setLoading(true);

  const departamentoCriado = await executarTeste(
    "Cadastro manual de departamento",
    "POST",
    "/departamentos",
    () =>
      cadastrarDepartamento({
        departamento: nomeDepartamentoCadastro,
      })
  );

  if (departamentoCriado) {
    setNomeDepartamentoCadastro("");

    const departamentosApi = await executarTeste(
      "Listar departamentos após cadastro",
      "GET",
      "/departamentos",
      listarDepartamentos
    );

    if (departamentosApi) {
      setDepartamentos(departamentosApi);
    }
  }

  setLoading(false);
}
  async function executarTeste<T>(
    nome: string,
    metodo: string,
    rota: string,
    callback: () => Promise<T>
  ): Promise<T | null> {
    try {
      const resposta = await callback();

      adicionarResultado({
        nome,
        metodo,
        rota,
        status: "sucesso",
        detalhe: "Requisição executada com sucesso.",
        resposta,
      });

      return resposta;
    } catch (error) {
      adicionarResultado({
        nome,
        metodo,
        rota,
        status: "erro",
        detalhe: tratarErro(error),
      });

      return null;
    }
  }

  async function fazerLoginManual(event: FormEvent) {
    event.preventDefault();

    limparResultados();
    setLoading(true);

    const resposta = await executarTeste(
      "Login manual",
      "POST",
      "/auth/login",
      () =>
        login({
          usuario: emailLogin,
          senha: senhaLogin,
        })
    );

    if (resposta) {
      setUsuarioLogado(resposta);
    }

    setLoading(false);
  }

  function sair() {
    logout();
    setUsuarioLogado(null);

    adicionarResultado({
      nome: "Logout",
      metodo: "LOCAL",
      rota: "localStorage",
      status: "sucesso",
      detalhe: "Token e usuário removidos do localStorage.",
    });
  }

  async function carregarDadosPublicos() {
    limparResultados();
    setLoading(true);

    const departamentosApi = await executarTeste(
      "Listar departamentos",
      "GET",
      "/departamentos",
      listarDepartamentos
    );

    const funcionariosApi = await executarTeste(
      "Listar funcionários",
      "GET",
      "/funcionarios",
      listarFuncionarios
    );

    if (departamentosApi) {
      setDepartamentos(departamentosApi);
    }

    if (funcionariosApi) {
      setFuncionarios(funcionariosApi);
    }

    setLoading(false);
  }

  async function testarUsuariosProtegidos() {
    limparResultados();
    setLoading(true);

    const usuariosApi = await executarTeste(
      "Listar usuários",
      "GET",
      "/usuarios",
      listarUsuarios
    );

    if (usuariosApi) {
      setUsuarios(usuariosApi);
    }

    if (usuariosApi && usuariosApi.length > 0) {
      const primeiroUsuario = usuariosApi[0];

      if (primeiroUsuario.id) {
        await executarTeste(
          "Buscar usuário por ID",
          "GET",
          `/usuarios/${primeiroUsuario.id}`,
          () => buscarUsuarioPorId(primeiroUsuario.id!)
        );
      }

      await executarTeste(
        "Buscar usuário por email",
        "GET",
        `/usuarios/usuario/${primeiroUsuario.usuario}`,
        () => buscarUsuarioPorEmail(primeiroUsuario.usuario)
      );

      await executarTeste(
        "Buscar usuário por nome",
        "GET",
        `/usuarios/nome/${primeiroUsuario.nome}`,
        () => buscarUsuarioPorNome(primeiroUsuario.nome)
      );
    }

    setLoading(false);
  }

  async function rodarTesteCompletoGlobal() {
    limparResultados();
    setLoading(true);

    const usuarioAnterior = localStorage.getItem("usuario");
    const tokenAnterior = localStorage.getItem("token");

    const timestamp = Date.now();

    let usuarioTeste: Usuario | null = null;
    let usuarioTesteLogado: UsuarioLogin | null = null;
    let departamentoTeste: Departamento | null = null;
    let funcionarioTeste: Funcionario | null = null;

    try {
      // ============================
      // 1. CRIAR USUÁRIO TEMPORÁRIO
      // ============================

      usuarioTeste = await executarTeste(
        "Criar usuário temporário",
        "POST",
        "/usuarios",
        () =>
          cadastrarUsuario({
            nome: `Usuário Teste ${timestamp}`,
            usuario: `teste.${timestamp}@peoplecore.com`,
            senha: "12345678",
            foto: "https://placehold.co/200x200",
          })
      );

      if (!usuarioTeste) {
        throw new Error("Não foi possível criar usuário temporário.");
      }

      // ============================
      // 2. LOGIN COM USUÁRIO TEMPORÁRIO
      // ============================

      usuarioTesteLogado = await executarTeste(
        "Login com usuário temporário",
        "POST",
        "/auth/login",
        () =>
          login({
            usuario: usuarioTeste!.usuario,
            senha: "12345678",
          })
      );

      if (!usuarioTesteLogado) {
        throw new Error("Não foi possível logar com usuário temporário.");
      }

      setUsuarioLogado(usuarioTesteLogado);

      // ============================
      // 3. TESTES DE USUÁRIOS
      // ============================

      const usuariosApi = await executarTeste(
        "Listar usuários",
        "GET",
        "/usuarios",
        listarUsuarios
      );

      if (usuariosApi) {
        setUsuarios(usuariosApi);
      }

      if (usuarioTeste.id) {
        await executarTeste(
          "Buscar usuário temporário por ID",
          "GET",
          `/usuarios/${usuarioTeste.id}`,
          () => buscarUsuarioPorId(usuarioTeste!.id!)
        );
      }

      await executarTeste(
        "Buscar usuário temporário por email",
        "GET",
        `/usuarios/usuario/${usuarioTeste.usuario}`,
        () => buscarUsuarioPorEmail(usuarioTeste!.usuario)
      );

      await executarTeste(
        "Buscar usuário temporário por nome",
        "GET",
        `/usuarios/nome/${usuarioTeste.nome}`,
        () => buscarUsuarioPorNome(usuarioTeste!.nome)
      );

      const usuarioAtualizado = await executarTeste(
        "Atualizar usuário temporário",
        "PUT",
        "/usuarios",
        () =>
          atualizarUsuario({
            ...usuarioTeste!,
            nome: `Usuário Teste Atualizado ${timestamp}`,
            foto: "https://placehold.co/300x300",
          })
      );

      if (usuarioAtualizado) {
        usuarioTeste = usuarioAtualizado;
      }

      // ============================
      // 4. TESTES DE DEPARTAMENTOS
      // ============================

      departamentoTeste = await executarTeste(
        "Criar departamento temporário",
        "POST",
        "/departamentos",
        () =>
          cadastrarDepartamento({
            departamento: `Departamento Teste ${timestamp}`,
          })
      );

      if (!departamentoTeste) {
        throw new Error("Não foi possível criar departamento temporário.");
      }

      const departamentosApi = await executarTeste(
        "Listar departamentos",
        "GET",
        "/departamentos",
        listarDepartamentos
      );

      if (departamentosApi) {
        setDepartamentos(departamentosApi);
      }

      if (departamentoTeste.id) {
        await executarTeste(
          "Buscar departamento por ID",
          "GET",
          `/departamentos/${departamentoTeste.id}`,
          () => buscarDepartamentoPorId(departamentoTeste!.id!)
        );
      }

      await executarTeste(
        "Buscar departamento por descrição",
        "GET",
        `/departamentos/descricao/Teste`,
        () => buscarDepartamentoPorDescricao("Teste")
      );

      const departamentoAtualizado = await executarTeste(
        "Atualizar departamento temporário",
        "PUT",
        "/departamentos",
        () =>
          atualizarDepartamento({
            ...departamentoTeste!,
            departamento: `Departamento Teste Atualizado ${timestamp}`,
          })
      );

      if (departamentoAtualizado) {
        departamentoTeste = departamentoAtualizado;
      }

      // ============================
      // 5. TESTES DE FUNCIONÁRIOS
      // ============================
async function cadastrarFuncionarioManual(event: FormEvent) {
  event.preventDefault();

  if (!nomeFuncionarioCadastro.trim()) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe o nome do funcionário.",
    });

    return;
  }

  if (!cargoFuncionarioCadastro.trim()) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe o cargo do funcionário.",
    });

    return;
  }

  if (!horasFuncionarioCadastro || Number(horasFuncionarioCadastro) <= 0) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe as horas trabalhadas.",
    });

    return;
  }

  if (!salarioFuncionarioCadastro || Number(salarioFuncionarioCadastro) <= 0) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe o salário base.",
    });

    return;
  }

  if (!usuarioIdFuncionarioCadastro) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe o ID do usuário vinculado.",
    });

    return;
  }

  if (!departamentoIdFuncionarioCadastro) {
    adicionarResultado({
      nome: "Cadastro manual de funcionário",
      metodo: "POST",
      rota: "/funcionarios",
      status: "erro",
      detalhe: "Informe o ID do departamento vinculado.",
    });

    return;
  }

  setLoading(true);

  const funcionarioCriado = await executarTeste(
    "Cadastro manual de funcionário",
    "POST",
    "/funcionarios",
    () =>
      cadastrarFuncionario({
        nome: nomeFuncionarioCadastro,
        cargo: cargoFuncionarioCadastro,
        horasTrabalhadas: Number(horasFuncionarioCadastro),
        salarioBase: Number(salarioFuncionarioCadastro),
        usuario: {
          id: Number(usuarioIdFuncionarioCadastro),
        } as Usuario,
        categoria: {
          id: Number(departamentoIdFuncionarioCadastro),
        } as Departamento,
      })
  );

  if (funcionarioCriado) {
    setNomeFuncionarioCadastro("");
    setCargoFuncionarioCadastro("");
    setHorasFuncionarioCadastro("");
    setSalarioFuncionarioCadastro("");
    setUsuarioIdFuncionarioCadastro("");
    setDepartamentoIdFuncionarioCadastro("");

    const funcionariosApi = await executarTeste(
      "Listar funcionários após cadastro",
      "GET",
      "/funcionarios",
      listarFuncionarios
    );

    if (funcionariosApi) {
      setFuncionarios(funcionariosApi);
    }
  }

  setLoading(false);
}
      funcionarioTeste = await executarTeste(
        "Criar funcionário temporário",
        "POST",
        "/funcionarios",
        () =>
          cadastrarFuncionario({
            nome: `Funcionário Teste ${timestamp}`,
            cargo: "Analista de Testes",
            horasTrabalhadas: 160,
            salarioBase: 25,
            usuario: {
              id: usuarioTeste!.id,
            } as Usuario,
            categoria: {
              id: departamentoTeste!.id,
            } as Departamento,
          })
      );

      if (!funcionarioTeste) {
        throw new Error("Não foi possível criar funcionário temporário.");
      }

      const funcionariosApi = await executarTeste(
        "Listar funcionários",
        "GET",
        "/funcionarios",
        listarFuncionarios
      );

      if (funcionariosApi) {
        setFuncionarios(funcionariosApi);
      }

      if (funcionarioTeste.id) {
        await executarTeste(
          "Buscar funcionário por ID",
          "GET",
          `/funcionarios/${funcionarioTeste.id}`,
          () => buscarFuncionarioPorId(funcionarioTeste!.id!)
        );
      }

      const funcionarioAtualizado = await executarTeste(
        "Atualizar funcionário temporário",
        "PUT",
        `/funcionarios/${funcionarioTeste.id}`,
        () =>
          atualizarFuncionario(funcionarioTeste!.id!, {
            ...funcionarioTeste!,
            nome: `Funcionário Teste Atualizado ${timestamp}`,
            cargo: "Coordenador de Testes",
            horasTrabalhadas: 180,
            salarioBase: 30,
            usuario: {
              id: usuarioTeste!.id,
            } as Usuario,
            categoria: {
              id: departamentoTeste!.id,
            } as Departamento,
          })
      );

      if (funcionarioAtualizado) {
        funcionarioTeste = funcionarioAtualizado;
      }

      // ============================
      // 6. DELETE DOS DADOS TEMPORÁRIOS
      // ============================

      if (funcionarioTeste.id) {
        await executarTeste(
          "Excluir funcionário temporário",
          "DELETE",
          `/funcionarios/${funcionarioTeste.id}`,
          () => deletarFuncionario(funcionarioTeste!.id!)
        );
      }

      if (departamentoTeste.id) {
        await executarTeste(
          "Excluir departamento temporário",
          "DELETE",
          `/departamentos/${departamentoTeste.id}`,
          () => deletarDepartamento(departamentoTeste!.id!)
        );
      }

      if (usuarioTeste.id) {
        await executarTeste(
          "Excluir usuário temporário",
          "DELETE",
          `/usuarios/${usuarioTeste.id}`,
          () => deletarUsuario(usuarioTeste!.id!)
        );
      }

      adicionarResultado({
        nome: "Teste global finalizado",
        metodo: "GLOBAL",
        rota: "todas",
        status: "sucesso",
        detalhe: "Todos os testes possíveis foram executados.",
      });
    } catch (error) {
      adicionarResultado({
        nome: "Erro no teste global",
        metodo: "GLOBAL",
        rota: "todas",
        status: "erro",
        detalhe: tratarErro(error),
      });
    } finally {
      // Restaura o login anterior, caso existisse.
      if (usuarioAnterior) {
        localStorage.setItem("usuario", usuarioAnterior);
      } else {
        localStorage.removeItem("usuario");
      }

      if (tokenAnterior) {
        localStorage.setItem("token", tokenAnterior);
      } else {
        localStorage.removeItem("token");
      }

      setUsuarioLogado(getUsuarioLogado());

      const departamentosAtualizados = await executarTeste(
        "Listar departamentos após teste global",
        "GET",
        "/departamentos",
        listarDepartamentos
      );

      const funcionariosAtualizados = await executarTeste(
        "Listar funcionários após teste global",
        "GET",
        "/funcionarios",
        listarFuncionarios
      );

      if (departamentosAtualizados) {
        setDepartamentos(departamentosAtualizados);
      }

      if (funcionariosAtualizados) {
        setFuncionarios(funcionariosAtualizados);
      }

      setLoading(false);
    }
  }

  return (
    <main className="testes-page">
      <h1>Teste Global da API PeopleCore</h1>

      <p>
        Esta página testa todas as requisições configuradas no{" "}
        <strong>Service.ts</strong>.
      </p>

      <p>
        Status de login:{" "}
        <strong>{estaLogado() ? "Logado" : "Não logado"}</strong>
      </p>

      {usuarioLogado && (
        <div
          style={{
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <strong>Usuário logado:</strong>
          <pre>{JSON.stringify(usuarioLogado, null, 2)}</pre>
        </div>
      )}
<section
  style={{
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "24px",
  }}
>
  <h2>Cadastro manual de usuário</h2>

  <form onSubmit={cadastrarUsuarioManual}>
    <div style={{ marginBottom: "8px" }}>
      <label>
        Nome:
        <br />
        <input
          type="text"
          value={nomeCadastro}
          onChange={(event) => setNomeCadastro(event.target.value)}
          style={{ width: "320px", padding: "8px" }}
        />
      </label>
    </div>

    <div style={{ marginBottom: "8px" }}>
      <label>
        Email:
        <br />
        <input
          type="email"
          value={emailCadastro}
          onChange={(event) => setEmailCadastro(event.target.value)}
          style={{ width: "320px", padding: "8px" }}
        />
      </label>
    </div>

    <div style={{ marginBottom: "8px" }}>
      <label>
        Senha:
        <br />
        <input
          type="password"
          value={senhaCadastro}
          onChange={(event) => setSenhaCadastro(event.target.value)}
          style={{ width: "320px", padding: "8px" }}
        />
      </label>
    </div>

    <div style={{ marginBottom: "8px" }}>
      <label>
        Foto:
        <br />
        <input
          type="text"
          value={fotoCadastro}
          onChange={(event) => setFotoCadastro(event.target.value)}
          placeholder="URL da foto opcional"
          style={{ width: "320px", padding: "8px" }}
        />
      </label>
    </div>

    <button type="submit" disabled={loading}>
      Cadastrar usuário
    </button>
  </form>
</section>
      <section
        style={{
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <h2>Login manual</h2>

        <form onSubmit={fazerLoginManual}>
          <div style={{ marginBottom: "8px" }}>
            <label>
              Email:
              <br />
              <input
                type="email"
                value={emailLogin}
                onChange={(event) => setEmailLogin(event.target.value)}
                style={{ width: "320px", padding: "8px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label>
              Senha:
              <br />
              <input
                type="password"
                value={senhaLogin}
                onChange={(event) => setSenhaLogin(event.target.value)}
                style={{ width: "320px", padding: "8px" }}
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            Fazer login
          </button>

          <button
            type="button"
            onClick={sair}
            disabled={loading}
            style={{ marginLeft: "8px" }}
          >
            Logout
          </button>
        </form>
      </section>

      <section
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <button type="button" onClick={carregarDadosPublicos} disabled={loading}>
          Testar GET públicos
        </button>

        <button
          type="button"
          onClick={testarUsuariosProtegidos}
          disabled={loading}
        >
          Testar usuários protegidos
        </button>

        <button
          type="button"
          onClick={rodarTesteCompletoGlobal}
          disabled={loading}
        >
          Rodar teste completo global
        </button>

        <button type="button" onClick={limparResultados} disabled={loading}>
          Limpar resultados
        </button>
      </section>

      {loading && <p>Executando testes...</p>}

      <section
        style={{
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <h2>Resultados dos testes</h2>

        {resultados.length === 0 ? (
          <p>Nenhum teste executado ainda.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {resultados.map((resultado, index) => (
              <article
                key={`${resultado.nome}-${index}`}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border:
                    resultado.status === "sucesso"
                      ? "1px solid #16a34a"
                      : "1px solid #dc2626",
                  background:
                    resultado.status === "sucesso" ? "#f0fdf4" : "#fef2f2",
                }}
              >
                <h3 style={{ margin: "0 0 8px" }}>
                  {resultado.status === "sucesso" ? "✅" : "❌"}{" "}
                  {resultado.nome}
                </h3>

                <p style={{ margin: "4px 0" }}>
                  <strong>Método:</strong> {resultado.metodo}
                </p>

                <p style={{ margin: "4px 0" }}>
                  <strong>Rota:</strong> {resultado.rota}
                </p>

                <p style={{ margin: "4px 0" }}>
                  <strong>Detalhe:</strong> {resultado.detalhe}
                </p>

                {resultado.resposta !== undefined && (
                  <details>
                    <summary>Ver resposta</summary>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        background: "#fff",
                        padding: "8px",
                        borderRadius: "6px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(resultado.resposta, null, 2)}
                    </pre>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <article
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Usuários</h2>
          <p>Total: {usuarios.length}</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(usuarios, null, 2)}
          </pre>
        </article>

        <article
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Departamentos</h2>
          <p>Total: {departamentos.length}</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(departamentos, null, 2)}
          </pre>
        </article>

        <article
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Funcionários</h2>
          <p>Total: {funcionarios.length}</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(funcionarios, null, 2)}
          </pre>
        </article>
      </section>
      <section
  style={{
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "24px",
  }}
>
  <h2>Cadastro manual de departamento</h2>

  <form onSubmit={cadastrarDepartamentoManual}>
    <div style={{ marginBottom: "8px" }}>
      <label>
        Nome do departamento:
        <br />
        <input
          type="text"
          value={nomeDepartamentoCadastro}
          onChange={(event) =>
            setNomeDepartamentoCadastro(event.target.value)
          }
          placeholder="Ex: Financeiro"
          style={{ width: "320px", padding: "8px" }}
        />
      </label>
    </div>

    <button type="submit" disabled={loading}>
      Cadastrar departamento
    </button>
  </form>
</section>
    </main>
  );
}

export default Testes;