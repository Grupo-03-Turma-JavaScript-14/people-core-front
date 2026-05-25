import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Login.css';

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: integrar com serviço de autenticação
    console.log('Dados de login:', form);
    navigate('/');
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

            <div className="login-actions">
              <button type="submit" className="btn btn-primary">
                Fazer login
              </button>
              <div className="login-divider">
                <span>Não tem uma conta?</span>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/cadastro')}
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