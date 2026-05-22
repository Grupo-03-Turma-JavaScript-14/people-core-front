import { useState } from "react"

export default function Funcionarios() {

  const [funcionarios, setFuncionarios] = useState([
    {
      id: 1,
      nome: "Jhonatan",
      cargo: "Frontend",
      categoria: { nome: "Tecnologia" },
      horasTrabalhadas: 160,
      salarioBase: 25,
      salarioTotal: 4000
    },
    {
      id: 2,
      nome: "Maria",
      cargo: "Backend",
      categoria: { nome: "Engenharia" },
      horasTrabalhadas: 170,
      salarioBase: 30,
      salarioTotal: 5100
    }
  ])

  
  function handleDelete(id: number) {
    setFuncionarios((prev) =>
      prev.filter((funcionario) => funcionario.id !== id)
    )
  }

  return (
    <div className="funcionarios-container">

      <div className="funcionarios-header">
        <h1>Funcionários</h1>

        <button className="btn-novo">
          + Novo Funcionário
        </button>
      </div>

      <div className="funcionarios-search">
        <input
          type="text"
          placeholder="Buscar funcionário..."
        />
      </div>

      <div className="funcionarios-table">

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Categoria</th>
              <th>Horas</th>
              <th>Salário Base</th>
              <th>Salário Total</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.categoria?.nome}</td>
                <td>{funcionario.horasTrabalhadas}</td>
                <td>R$ {funcionario.salarioBase}</td>
                <td>R$ {funcionario.salarioTotal}</td>

                <td className="acoes">
                  <button>✏️</button>
                  <button onClick={() => handleDelete(funcionario.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}