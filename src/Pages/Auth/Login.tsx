import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Login.css';

import { login } from '../../Service/Service';
import type { ApiErrorResponse, UsuarioLogin } from '../../Service/Types';
import type { AxiosError } from 'axios';

interface LoginForm {
  email: string;
  senha: string;
}

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    senha?: string;
  }>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const newErrors: {
      email?: string;
      senha?: string;
    } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }

    if (!form.senha.trim()) {
      newErrors.senha = 'Informe sua senha.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload: UsuarioLogin = {
        usuario: form.email,
        senha: form.senha,
      };

      await login(payload); // Service.ts já salva token e usuário no localStorage[cite:83]

      alert('Login realizado com sucesso!');
      navigate('/'); // hoje "/" renderiza <Testes />[cite:85]
    } catch (err) {
  let message = 'Erro ao fazer login';

  const axiosError = err as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.status === 401) {
    // credenciais erradas
    message = 'Usuário ou senha inválidos.';
  } else if (axiosError.response?.data?.message) {
    // mensagem de erro vinda da API (string ou array de strings)
    const apiMessage = axiosError.response.data.message;
    message = Array.isArray(apiMessage)
      ? apiMessage.join(' ')
      : apiMessage;
  } else if (err instanceof Error) {
    message = err.message;
  }

  setError(message);
} finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Coluna de marca */}
        <div className="login-brand">
          <img
            src="/peoplecore.png"
            alt="PeopleCore"
            className="login-brand__logo"
          />
          <p className="login-brand__subtitle">
            Gestão de pessoas que gera resultados.
          </p>
          <p className="login-brand__description">
            Acesse sua conta e continue acompanhando o crescimento da sua equipe.
          </p>
        </div>

        {/* Coluna do formulário */}
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Sua senha"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={errors.senha ? 'input-error' : ''}
              />
              {errors.senha && (
                <span className="field-error">{errors.senha}</span>
              )}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="login-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Fazer login'}
              </button>

              <div className="login-divider">
                <span>Não tem uma conta?</span>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/cadastro')}
                disabled={loading}
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;