import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Register.css';
import { toast } from 'react-toastify';
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
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    foto?: string;
  }>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const newErrors: {
      nome?: string;
      email?: string;
      senha?: string;
      foto?: string;
    } = {};

    if (!form.nome.trim()) {
      newErrors.nome = 'Informe seu nome.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }

    if (form.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (form.foto && !/^https?:\/\//.test(form.foto)) {
      newErrors.foto = 'Informe uma URL de foto que comece com http ou https.';
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
      const payload: Usuario = {
        nome: form.nome,
        usuario: form.email,
        senha: form.senha,
        foto: form.foto,
      };

      await cadastrarUsuario(payload);
      toast.success('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao cadastrar usuário';
      setError(message);
      toast.error(message);
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
            src="/peoplecore-logo.png"
            alt="PeopleCore"
            className="register-brand__logo-image"
          />
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
                className={errors.nome ? 'input-error' : ''}
              />
              {errors.nome && (
                <span className="field-error">{errors.nome}</span>
              )}
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
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
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
                className={errors.foto ? 'input-error' : ''}
              />
              {errors.foto && (
                <span className="field-error">{errors.foto}</span>
              )}
              {form.foto && !errors.foto && (
                <div className="foto-preview">
                  <img
                    src={form.foto}
                    alt="Prévia da foto de perfil"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
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
                className={errors.senha ? 'input-error' : ''}
              />
              {errors.senha && (
                <span className="field-error">{errors.senha}</span>
              )}
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