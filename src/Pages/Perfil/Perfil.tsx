import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";

import "../../Style/Css/Pages/Perfil.css";

import type { Usuario, UsuarioLogin } from "../../Service/Types";

import {
  atualizarUsuario,
  getToken,
  getUsuarioLogado,
} from "../../Service/Service";

interface PerfilForm {
  nome: string;
  usuario: string;
  foto: string;
  senha: string;
  confirmarSenha: string;
}

function normalizarUsuarioLogado(usuarioLogado: UsuarioLogin): Usuario {
  return {
    id: usuarioLogado.id,
    nome: usuarioLogado.nome ?? "",
    usuario: usuarioLogado.usuario,
    foto: usuarioLogado.foto ?? "",
  };
}

function Perfil() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [usuarioOriginal, setUsuarioOriginal] = useState<Usuario | null>(null);

  const [form, setForm] = useState<PerfilForm>({
    nome: "",
    usuario: "",
    foto: "",
    senha: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    const usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado) {
      toast.error("Usuário não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    const usuario = normalizarUsuarioLogado(usuarioLogado);

    setUsuarioOriginal(usuario);

    setForm({
      nome: usuario.nome,
      usuario: usuario.usuario,
      foto: usuario.foto ?? "",
      senha: "",
      confirmarSenha: "",
    });

    setLoading(false);
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }));
  }

  function validarFormulario() {
    if (!usuarioOriginal?.id) {
      toast.error("Não foi possível identificar o usuário logado.");
      return false;
    }

    if (!getToken()) {
      toast.error("Sessão expirada. Faça login novamente.");
      return false;
    }

    if (!form.nome.trim()) {
      toast.error("Informe seu nome.");
      return false;
    }

    if (!form.usuario.trim()) {
      toast.error("Informe seu e-mail/usuário.");
      return false;
    }

    if (form.senha || form.confirmarSenha) {
      if (form.senha.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        return false;
      }

      if (form.senha !== form.confirmarSenha) {
        toast.error("A confirmação da senha não confere.");
        return false;
      }
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validarFormulario() || !usuarioOriginal?.id) return;

    setSalvando(true);

    try {
      const usuarioParaAtualizar: Usuario = {
        id: usuarioOriginal.id,
        nome: form.nome.trim(),
        usuario: form.usuario.trim(),
        foto: form.foto.trim() || undefined,
      };

      if (form.senha.trim()) {
        usuarioParaAtualizar.senha = form.senha.trim();
      }

      const usuarioAtualizado = await atualizarUsuario(usuarioParaAtualizar);

      const usuarioLogadoAtual = getUsuarioLogado();

      const usuarioParaLocalStorage: UsuarioLogin = {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        usuario: usuarioAtualizado.usuario,
        foto: usuarioAtualizado.foto,
        token: usuarioLogadoAtual?.token ?? getToken() ?? undefined,
      };

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioParaLocalStorage)
      );

      setUsuarioOriginal(usuarioAtualizado);

      setForm({
        nome: usuarioAtualizado.nome,
        usuario: usuarioAtualizado.usuario,
        foto: usuarioAtualizado.foto ?? "",
        senha: "",
        confirmarSenha: "",
      });

      toast.success("Perfil atualizado com sucesso!");

      setTimeout(() => {
        window.location.reload();
      }, 700);

    } catch (error) {
      console.error(error);

      toast.error("Não foi possível salvar as alterações do perfil.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <main className="perfil">
        <section className="perfil__loading">
          <div className="perfil__loader"></div>
          <p>Carregando seu perfil...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="perfil">
      <section className="perfil__header">
        <div>
          <span className="perfil__tag">Minha conta</span>

          <h1>Perfil</h1>

          <p>
            Edite seus dados pessoais e sua senha de acesso.
          </p>
        </div>

        <div className="perfil__notice">
          Por segurança, esta tela permite alterar apenas o próprio usuário logado.
        </div>
      </section>

      <section className="perfil__content">

        <aside className="perfil__card perfil__summary">

          <div className="perfil__avatar">
            {form.foto ? (
              <img
                src={form.foto}
                alt={form.nome || "Usuário"}
              />
            ) : (
              <span>
                {(form.nome || form.usuario || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <h2>{form.nome || "Usuário"}</h2>

          <p>{form.usuario || "usuário logado"}</p>

          <div className="perfil__status">
            <span></span>
            Conta ativa
          </div>

        </aside>

        <form
          className="perfil__card perfil__form"
          onSubmit={handleSubmit}
        >

          <div className="perfil__section-title">
            <h2>Dados pessoais</h2>

            <p>
              Essas informações serão atualizadas na sua própria conta.
            </p>
          </div>

          <div className="perfil__grid">

            <label className="perfil__field">
              <span>Nome completo</span>

              <input
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
              />
            </label>

            <label className="perfil__field">
              <span>E-mail / usuário</span>

              <input
                name="usuario"
                type="email"
                value={form.usuario}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
              />
            </label>

            <label className="perfil__field perfil__field--full">
              <span>URL da foto</span>

              <input
                name="foto"
                type="url"
                value={form.foto}
                onChange={handleChange}
                placeholder="Cole a URL da sua foto"
              />
            </label>

          </div>

          <div className="perfil__divider"></div>

          <div className="perfil__section-title">

            <h2>Alterar senha</h2>

            <p>
              Preencha apenas se quiser definir uma nova senha.
            </p>

          </div>

          <div className="perfil__grid">

            <label className="perfil__field">
              <span>Nova senha</span>

              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </label>

            <label className="perfil__field">
              <span>Confirmar nova senha</span>

              <input
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
              />
            </label>

          </div>

          <div className="perfil__actions">

            <button
              type="submit"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>

          </div>

        </form>

      </section>
    </main>
  );
}

export default Perfil;