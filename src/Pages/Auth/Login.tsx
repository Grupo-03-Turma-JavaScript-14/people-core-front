import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../Service/Service';

interface LoginForm {
  usuario: string;
  senha: string;
}

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    usuario: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    usuario?: string;
    senha?: string;
  }>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function validateForm(): boolean {
    const newErrors: {
      usuario?: string;
      senha?: string;
    } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.usuario)) {
      newErrors.usuario = 'Informe um e-mail válido.';
    }

    if (form.senha.length < 6) {
      newErrors.senha =
        'A senha deve ter pelo menos 6 caracteres.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login({
        usuario: form.usuario,
        senha: form.senha,
      });

      toast.success('Login realizado com sucesso!');

      // REDIRECIONA PARA HOME
      navigate('/home');

    } catch {
      toast.error('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      }}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        style={{
          boxShadow:
            '0 16px 40px rgba(15, 23, 42, 0.5)',
        }}
      >

        {/* LADO ESQUERDO */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-12"
          style={{
            background:
              'linear-gradient(135deg, #14B8A6 0%, #5EEAD4 100%)',
          }}
        >
          <div className="w-full max-w-[280px]">
            <img
              src="/logoa.png"
              alt="PeopleCore Logo"
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Bem-vindo de volta
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Faça login para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >

            {/* EMAIL */}
            <div className="flex flex-col space-y-1">

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                E-mail
              </label>

              <input
                name="usuario"
                type="email"
                placeholder="seu@email.com"
                value={form.usuario}
                onChange={handleChange}
                required
                autoComplete="email"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder-slate-400 ${
                  errors.usuario
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-slate-200 focus:border-[#14B8A6] focus:ring-[#14B8A6]/20'
                }`}
              />

              {errors.usuario && (
                <span className="text-xs text-red-500">
                  {errors.usuario}
                </span>
              )}
            </div>

            {/* SENHA */}
            <div className="flex flex-col space-y-1">

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Senha
              </label>

              <input
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder-slate-400 ${
                  errors.senha
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-slate-200 focus:border-[#14B8A6] focus:ring-[#14B8A6]/20'
                }`}
              />

              {errors.senha && (
                <span className="text-xs text-red-500">
                  {errors.senha}
                </span>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-4">

              <p className="text-sm text-slate-400">
                Não tem conta?{' '}

                <Link
                  to="/cadastro"
                  className="font-bold transition-colors"
                  style={{ color: '#14B8A6' }}
                >
                  Cadastre-se
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
                style={{ background: '#14B8A6' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    '#0F766E')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    '#14B8A6')
                }
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;