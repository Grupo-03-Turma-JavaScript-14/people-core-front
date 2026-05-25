import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Register.css';

import { cadastrarUsuario } from '../../Service/Service';
import type { Usuario } from '../../Service/Types';

interface RegisterForm {
  nome: string;
  email: string;
  foto: string;
  senha: string;
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    nome: '',
    email: '',
    foto: '',
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
      const payload: Usuario = {
        nome: form.nome,
        usuario: form.email,   // backend espera "usuario"[cite:84]
        senha: form.senha,
        foto: form.foto,
      };

      await cadastrarUsuario(payload); // usa api axios com baseURL "/api"[cite:82][cite:83]

      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao cadastrar usuário';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate('/login');
  }

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Coluna de marca */}
        <div className="register-brand">
          <img
            src="/peoplecore.png"
            alt="PeopleCore"
            className="register-brand__logo-image"
          />
          <p className="register-brand__subtitle">
            Gestão de pessoas que gera resultados.
          </p>
          <p className="register-brand__description">
            Crie sua conta e faça parte da plataforma que une energia, leveza e crescimento.
          </p>
        </div>

        {/* Coluna do formulário */}
        <div className="register-form-wrapper">
          <div className="register-form-header">
            <h2>Criar conta</h2>
            <p>Preencha os campos abaixo para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

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
              <label htmlFor="foto">URL da foto de perfil</label>
              <input
                id="foto"
                name="foto"
                type="text"
                placeholder="https://..."
                value={form.foto}
                onChange={handleChange}
              />
              {form.foto && (
                <div className="foto-preview">
                  <img
                    src={form.foto}
                    alt="Prévia da foto de perfil"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="register-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;