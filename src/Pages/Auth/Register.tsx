import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Css/Pages/Register.css';

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: integrar com serviço de cadastro
    console.log('Dados do cadastro:', form);
    alert('Usuário cadastrado com sucesso!');
    navigate('/');
  }

  function handleCancel() {
    navigate('/');
  }

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Coluna de marca */}
        <div className="register-brand">
<img
  src="peoplecore.png"
  alt="PeopleCore"
  style={{ objectFit: 'contain' }}
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

            <div className="register-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;