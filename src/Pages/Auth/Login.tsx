import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Login.css';

import { login } from '../../Service/Service';
import type { UsuarioLogin } from '../../Service/Types';

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: UsuarioLogin = {
        usuario: form.email,
        senha: form.senha,
      };

      await login(payload); // Service.ts já salva token + usuário no localStorage[cite:83]

      alert('Login realizado com sucesso!');
      navigate('/'); // hoje "/" já leva para <Testes />[cite:85]
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer login';
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
              />
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
              />
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