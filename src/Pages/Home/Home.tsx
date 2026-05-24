import "../../Style/Css/Pages/Home.css"

function Home() {
  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__content">
          <span className="home__tag">Sistema de Gestão de RH</span>

          <h1>Gestão de pessoas estratégica, simples e eficiente.</h1>

          <p>
            O PeopleCore centraliza informações, automatiza processos e
            transforma dados em decisões mais inteligentes para o RH.
          </p>

          <div className="home__actions">
            <button className="home__button">Conheça o sistema</button>
            <button className="home__button home__button--outline">
              Ver funcionalidades
            </button>
          </div>
        </div>

        <div className="home__visual">
          <div className="home__panel">
            <h2>RH Estratégico</h2>
            <p>Dados organizados, processos claros e menos retrabalho.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home