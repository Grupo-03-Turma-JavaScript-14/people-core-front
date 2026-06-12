export interface Usuario {
  id?: number;
  nome: string;
  usuario: string;
  foto?: string;
  senha?: string;
  funcionarios?: Funcionario[];
}

export interface UsuarioLogin {
  id?: number;
  nome?: string;
  usuario: string;
  senha?: string;
  foto?: string;
  token?: string;
}

export interface Departamento {
  id?: number;
  departamento: string;
  funcionarios?: Funcionario[];
}

/**
 * Alias opcional, porque no backend a entidade chama Categoria,
 * mas a rota e o campo de negócio usam Departamentos.
 */
export type Categoria = Departamento;

export interface Funcionario {
  id?: number;
  nome: string;
  cargo: string;
  horasTrabalhadas: number;
  salarioBase: number;
  salarioTotal?: number;
  usuario?: Usuario;
  categoria?: Departamento;
}

export interface FuncionarioPayload {
  nome: string;
  cargo: string;
  horasTrabalhadas: number;
  salarioBase: number;
  categoria: {
    id: number;
    departamento: string;
  };
}

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
