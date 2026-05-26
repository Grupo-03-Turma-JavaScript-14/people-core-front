import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [form, setForm] = useState<RegisterForm>({ nome: '', email: '', foto: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpa o erro do campo ao digitar
    if (errors[e.target.name as keyof RegisterForm]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  function validateForm(): boolean {
    const newErrors: Partial<RegisterForm> = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = 'Informe um e-mail válido.';
    if (form.foto && !/^https?:\/\//.test(form.foto)) newErrors.foto = 'URL deve começar com http ou https.';
    if (form.senha.length < 6) newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload: Usuario = {
        nome: form.nome,
        usuario: form.email,   
        senha: form.senha,
        foto: form.foto || undefined,
      };
      await cadastrarUsuario(payload);
      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (err: unknown) {
      // Exibe mensagem específica da API se disponível
      const msg =
        err instanceof Error
          ? err.message
          : 'Erro ao cadastrar. Verifique os dados e tente novamente.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { label: 'Nome completo',       name: 'nome'  as const, type: 'text',     placeholder: 'Seu nome',           required: true },
    { label: 'E-mail',              name: 'email' as const, type: 'email',    placeholder: 'seu@email.com',      required: true },
    { label: 'URL da foto de perfil', name: 'foto' as const, type: 'text',   placeholder: 'https://...',        required: false },
    { label: 'Senha',               name: 'senha' as const, type: 'password', placeholder: 'Mínimo 6 caracteres', required: true },
  ];

  return (

    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden"
        style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.5)' }}
      >

        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-12"
          style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #5EEAD4 100%)' }}
        >
          <div className="w-full max-w-[280px]">
            <img
              src="/logoa.png"
              alt="PeopleCore Logo"
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Criar conta</h2>
            <p className="text-slate-400 text-sm mt-1">Preencha os campos abaixo para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder-slate-400 ${
                    errors[field.name]
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-slate-200 focus:border-[#14B8A6] focus:ring-[#14B8A6]/20'
                  }`}
                />
                {errors[field.name] && (
                  <span className="text-xs text-red-500">{errors[field.name]}</span>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
            
              <p className="text-sm text-slate-400">
                Já tem conta?{' '}
                <Link to="/login" className="font-bold transition-colors" style={{ color: '#14B8A6' }}>
                  Entrar
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
                style={{ background: '#14B8A6' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0F766E')}
                onMouseLeave={e => (e.currentTarget.style.background = '#14B8A6')}
              >
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