import "../../Style/Css/Pages/Perfil.css";

function Perfil() {

  const usuario = {
    nome: "Letícia Fonseca",
    cargo: "Analista de Recursos Humanos",
    email: "leticia@email.com",
    departamento: "Recursos Humanos",
    telefone: "(11) 99999-9999",
    localizacao: "São Paulo - SP",
    foto: "https://i.pravatar.cc/150?img=32"
  };

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        <div className="perfil-header">

          <img
            src={usuario.foto}
            alt="Foto do usuário"
            className="perfil-foto"
          />

          <h1>{usuario.nome}</h1>

          <span className="cargo">
            {usuario.cargo}
          </span>

        </div>

        <div className="perfil-infos">

          <div className="info-item">
            <span>Email</span>
            <p>{usuario.email}</p>
          </div>

          <div className="info-item">
            <span>Departamento</span>
            <p>{usuario.departamento}</p>
          </div>

          <div className="info-item">
            <span>Telefone</span>
            <p>{usuario.telefone}</p>
          </div>

          <div className="info-item">
            <span>Localização</span>
            <p>{usuario.localizacao}</p>
          </div>

        </div>

        <button className="btn-editar">
          Editar Perfil
        </button>

      </div>

    </div>
  );
}

export default Perfil;