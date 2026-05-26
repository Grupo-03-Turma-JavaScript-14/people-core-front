import { api } from "./api";

import type {
  Departamento,
  Funcionario,
  Usuario,
  UsuarioLogin,
} from "./Types";

// =======================
// AUTENTICAÇÃO
// Rota: /auth
// =======================

export async function login(dadosLogin: UsuarioLogin): Promise<UsuarioLogin> {
  const response = await api.post<UsuarioLogin>("/auth/login", dadosLogin);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("usuario", JSON.stringify(response.data));
  }

  return response.data;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

export function getUsuarioLogado(): UsuarioLogin | null {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario);
  } catch {
    localStorage.removeItem("usuario");
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function estaLogado(): boolean {
  return Boolean(localStorage.getItem("token"));
}

// =======================
// USUÁRIOS
// Rota: /usuarios
// Observação: quase todas exigem token JWT.
// POST /usuarios é cadastro aberto.
// =======================

export async function cadastrarUsuario(usuario: Usuario): Promise<Usuario> {
  const response = await api.post<Usuario>("/usuarios", usuario);
  return response.data;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>("/usuarios");
  return response.data;
}

export async function buscarUsuarioPorId(id: number): Promise<Usuario> {
  const response = await api.get<Usuario>(`/usuarios/${id}`);
  return response.data;
}

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario> {
  const response = await api.get<Usuario>(`/usuarios/usuario/${email}`);
  return response.data;
}

export async function buscarUsuarioPorNome(nome: string): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>(`/usuarios/nome/${nome}`);
  return response.data;
}

export async function atualizarUsuario(usuario: Usuario): Promise<Usuario> {
  const token = getToken();

  const response = await api.put<Usuario>("/usuarios", usuario, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deletarUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

// =======================
// DEPARTAMENTOS / CATEGORIAS
// Rota: /departamentos
// =======================

export async function listarDepartamentos(): Promise<Departamento[]> {
  const response = await api.get<Departamento[]>("/departamentos");
  return response.data;
}

export async function buscarDepartamentoPorId(
  id: number
): Promise<Departamento> {
  const response = await api.get<Departamento>(`/departamentos/${id}`);
  return response.data;
}

export async function buscarDepartamentoPorDescricao(
  descricao: string
): Promise<Departamento[]> {
  const response = await api.get<Departamento[]>(
    `/departamentos/descricao/${descricao}`
  );

  return response.data;
}

export async function cadastrarDepartamento(
  departamento: Departamento
): Promise<Departamento> {
  const response = await api.post<Departamento>(
    "/departamentos",
    departamento
  );

  return response.data;
}

export async function atualizarDepartamento(
  departamento: Departamento
): Promise<Departamento> {
  const response = await api.put<Departamento>(
    "/departamentos",
    departamento
  );

  return response.data;
}

export async function deletarDepartamento(id: number): Promise<void> {
  await api.delete(`/departamentos/${id}`);
}

// Aliases opcionais caso alguma página ainda use "Categoria"
export const listarCategorias = listarDepartamentos;
export const buscarCategoriaPorId = buscarDepartamentoPorId;
export const buscarCategoriaPorDescricao = buscarDepartamentoPorDescricao;
export const cadastrarCategoria = cadastrarDepartamento;
export const atualizarCategoria = atualizarDepartamento;
export const deletarCategoria = deletarDepartamento;

// =======================
// FUNCIONÁRIOS
// Rota: /funcionarios
// =======================

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const response = await api.get<Funcionario[]>("/funcionarios");
  return response.data;
}

export async function buscarFuncionarioPorId(id: number): Promise<Funcionario> {
  const response = await api.get<Funcionario>(`/funcionarios/${id}`);
  return response.data;
}

export async function cadastrarFuncionario(
  funcionario: Funcionario
): Promise<Funcionario> {
  const response = await api.post<Funcionario>("/funcionarios", funcionario);
  return response.data;
}

export async function atualizarFuncionario(
  id: number,
  funcionario: Funcionario
): Promise<Funcionario> {
  const response = await api.put<Funcionario>(
    `/funcionarios/${id}`,
    funcionario
  );

  return response.data;
}

export async function deletarFuncionario(id: number): Promise<void> {
  await api.delete(`/funcionarios/${id}`);
}