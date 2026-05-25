import { useState, useEffect } from "react";
import {
  listarFuncionarios,
  listarDepartamentos,
  cadastrarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
} from "../../Service/Service";
import type { Funcionario, Departamento } from "../../Service/Types";
import Modal from "../../Components/Modal/Modal";
import "../../Style/Css/Pages/Funcionarios.css";

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(0);
  const [salarioBase, setSalarioBase] = useState(0);

  // Erros de validação (visual)
  const [errors, setErrors] = useState({
    nome: "",
    cargo: "",
    categoriaId: "",
    horasTrabalhadas: "",
    salarioBase: "",
  });

  // Carregar dados
  useEffect(() => {
    listarFuncionarios().then(setFuncionarios);
    listarDepartamentos().then(setDepartamentos);
  }, []);

  // Resetar formulário e erros
  const resetForm = () => {
    setNome("");
    setCargo("");
    setCategoriaId("");
    setHorasTrabalhadas(0);
    setSalarioBase(0);
    setEditandoId(null);
    setErrors({
      nome: "",
      cargo: "",
      categoriaId: "",
      horasTrabalhadas: "",
      salarioBase: "",
    });
  };

  // Abrir modal para criar
  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (funcionario: Funcionario) => {
    setNome(funcionario.nome);
    setCargo(funcionario.cargo);
    setCategoriaId(String(funcionario.categoria?.id || ""));
    setHorasTrabalhadas(funcionario.horasTrabalhadas);
    setSalarioBase(funcionario.salarioBase);
    setEditandoId(funcionario.id || null);
    setModalOpen(true);
  };

  // Exclusão com confirmação nativa
  const handleDelete = (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      deletarFuncionario(id).then(() => {
        setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      });
    }
  };

  // Validação visual (sem alert)
  const validateForm = (): boolean => {
    const newErrors = {
      nome: "",
      cargo: "",
      categoriaId: "",
      horasTrabalhadas: "",
      salarioBase: "",
    };
    let isValid = true;

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
      isValid = false;
    }
    if (!cargo.trim()) {
      newErrors.cargo = "Cargo é obrigatório";
      isValid = false;
    }
    if (!categoriaId) {
      newErrors.categoriaId = "Selecione uma categoria";
      isValid = false;
    }
    if (horasTrabalhadas <= 0) {
      newErrors.horasTrabalhadas = "Horas trabalhadas deve ser maior que zero";
      isValid = false;
    }
    if (salarioBase <= 0) {
      newErrors.salarioBase = "Salário base deve ser maior que zero";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Salvar (criar ou editar)
  const handleSave = () => {
    if (!validateForm()) return;

    const dados = {
      nome,
      cargo,
      horasTrabalhadas,
      salarioBase,
      categoria: { id: Number(categoriaId), departamento: "" },
    };

    if (editandoId !== null) {
      atualizarFuncionario(editandoId, dados).then((response) => {
        setFuncionarios((prev) =>
          prev.map((f) => (f.id === editandoId ? response : f))
        );
        setModalOpen(false);
        resetForm();
      });
    } else {
      cadastrarFuncionario(dados).then((response) => {
        setFuncionarios((prev) => [...prev, response]);
        setModalOpen(false);
        resetForm();
      });
    }
  };

  // Filtro
  const funcionariosFiltrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="funcionarios-container">
      {/* HEADER */}
      <div className="funcionarios-header">
        <h1>Funcionários</h1>
        <button className="btn-novo" onClick={handleOpenCreate}>
          + Novo Funcionário
        </button>
      </div>

      {/* SEARCH */}
      <div className="funcionarios-search">
        <input
          type="text"
          placeholder="Buscar funcionário..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* TABELA */}
      <div className="funcionarios-table-wrapper">
        <table className="funcionarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Categoria</th>
              <th>Horas Trab.</th>
              <th>Salário Base</th>
              <th>Salário Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.map((func) => (
              <tr key={func.id}>
                <td>{func.nome}</td>
                <td>{func.cargo}</td>
                <td>{func.categoria?.departamento}</td>
                <td>{func.horasTrabalhadas}</td>
                <td>R$ {func.salarioBase}</td>
                <td>R$ {func.salarioTotal}</td>
                <td className="acoes">
                  <button onClick={() => handleEdit(func)}>✏️</button>
                  <button
                    onClick={() => func.id && handleDelete(func.id, func.nome)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {funcionariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-row">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (seu componente) */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editandoId ? "Editar Funcionário" : "Novo Funcionário"}</h2>
        <div className="form-funcionario">
          <div className="form-field">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={errors.nome ? "error-input" : ""}
            />
            {errors.nome && <span className="error-msg">{errors.nome}</span>}
          </div>

          <div className="form-field">
            <input
              type="text"
              placeholder="Cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className={errors.cargo ? "error-input" : ""}
            />
            {errors.cargo && <span className="error-msg">{errors.cargo}</span>}
          </div>

          <div className="form-field">
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={errors.categoriaId ? "error-input" : ""}
            >
              <option value="">Selecione uma categoria</option>
              {departamentos.map((depto) => (
                <option key={depto.id} value={depto.id}>
                  {depto.departamento}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <span className="error-msg">{errors.categoriaId}</span>
            )}
          </div>

          <div className="form-field">
            <input
              type="number"
              placeholder="Horas Trabalhadas"
              value={horasTrabalhadas}
              onChange={(e) => setHorasTrabalhadas(Number(e.target.value))}
              className={errors.horasTrabalhadas ? "error-input" : ""}
            />
            {errors.horasTrabalhadas && (
              <span className="error-msg">{errors.horasTrabalhadas}</span>
            )}
          </div>

          <div className="form-field">
            <input
              type="number"
              placeholder="Salário Base"
              value={salarioBase}
              onChange={(e) => setSalarioBase(Number(e.target.value))}
              className={errors.salarioBase ? "error-input" : ""}
            />
            {errors.salarioBase && (
              <span className="error-msg">{errors.salarioBase}</span>
            )}
          </div>

          <button className="btn-salvar" onClick={handleSave}>
            {editandoId ? "Salvar Edição" : "Criar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
// import { useState, useEffect } from "react"
// import {
//   listarFuncionarios,
//   listarDepartamentos,
//   cadastrarFuncionario,
//   atualizarFuncionario,
//   deletarFuncionario
// } from "../../Service/Service"

// import type { Funcionario, Departamento } from "../../Service/Types"
// import Modal from "../../Components/Modal/Modal"

// export default function Funcionarios() {

//   const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
//   const [nome, setNome] = useState("")
//   const [cargo, setCargo] = useState("")
//   const [categoria, setCategoria] = useState("")
//   const [horasTrabalhadas, setHorasTrabalhadas] = useState(0)
//   const [salarioBase, setSalarioBase] = useState(0)
//   const [editandoId, setEditandoId] = useState<number | null>(null)
//   const [categorias, setCategorias] = useState<Departamento[]>([])
//   const [busca, setBusca] = useState("")
//   const [modalOpen, setModalOpen] = useState(false)

//   useEffect(() => {
//     listarFuncionarios().then(setFuncionarios)
//   }, [])

//   useEffect(() => {
//     listarDepartamentos().then(setCategorias)
//   }, [])

//   function resetForm() {
//     setNome("")
//     setCargo("")
//     setCategoria("")
//     setHorasTrabalhadas(0)
//     setSalarioBase(0)
//     setEditandoId(null)
//   }

//   function handleDelete(id: number) {
//     deletarFuncionario(id).then(() => {
//       setFuncionarios((prev) =>
//         prev.filter((f) => f.id !== id)
//       )
//     })
//   }

//   function handleEdit(funcionario: Funcionario) {
//     setNome(funcionario.nome)
//     setCargo(funcionario.cargo)
//     setCategoria(String(funcionario.categoria?.id || ""))
//     setHorasTrabalhadas(funcionario.horasTrabalhadas)
//     setSalarioBase(funcionario.salarioBase)
//     setEditandoId(funcionario.id || null)
//     setModalOpen(true)
//   }

//   function handleSave() {
//     if (!nome || !cargo || !categoria) {
//       alert("Preencha todos os campos")
//       return
//     }

//     const dados = {
//       nome,
//       cargo,
//       horasTrabalhadas,
//       salarioBase,
//       categoria: {
//         id: Number(categoria),
//         departamento: ""
//       }
//     }

//     if (editandoId !== null) {
//       atualizarFuncionario(editandoId, dados).then((response) => {
//         setFuncionarios((prev) =>
//           prev.map((f) =>
//             f.id === editandoId ? response : f
//           )
//         )
//       })
//     } else {
//       cadastrarFuncionario(dados).then((response) => {
//         setFuncionarios((prev) => [...prev, response])
//       })
//     }

//     resetForm()
//     setModalOpen(false)
//   }

//   const funcionariosFiltrados = funcionarios.filter((funcionario) =>
//     funcionario.nome.toLowerCase().includes(busca.toLowerCase())
//   )

//   return (
//     <div className="funcionarios-container">

//       {/* HEADER */}
//       <div className="funcionarios-header">
//         <h1>Funcionários</h1>

//         <button
//           className="btn-novo"
//           onClick={() => {
//             resetForm()
//             setModalOpen(true)
//           }}
//         >
//           + Novo Funcionário
//         </button>
//       </div>

//       {/* SEARCH */}
//       <div className="funcionarios-search">
//         <input
//           type="text"
//           placeholder="Buscar funcionário..."
//           value={busca}
//           onChange={(e) => setBusca(e.target.value)}
//         />
//       </div>

//       {/* TABLE */}
//       <div className="funcionarios-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Nome</th>
//               <th>Cargo</th>
//               <th>Categoria</th>
//               <th>Horas Trabalhadas</th>
//               <th>Salário Base</th>
//               <th>Salário Total</th>
//               <th>Ações</th>
//             </tr>
//           </thead>

//           <tbody>
//             {funcionariosFiltrados.map((funcionario) => (
//               <tr key={funcionario.id}>
//                 <td>{funcionario.nome}</td>
//                 <td>{funcionario.cargo}</td>
//                 <td>{funcionario.categoria?.departamento}</td>
//                 <td>{funcionario.horasTrabalhadas}</td>
//                 <td>R$ {funcionario.salarioBase}</td>
//                 <td>R$ {funcionario.salarioTotal}</td>
//                 <td className="acoes">
//                   <button onClick={() => handleEdit(funcionario)}>✏️</button>
//                   <button onClick={() => funcionario.id && handleDelete(funcionario.id)}>🗑️</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}
//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>

//         <h2>{editandoId ? "Editar Funcionário" : "Novo Funcionário"}</h2>

//         <div className="form-funcionario">

//           <input
//             type="text"
//             placeholder="Nome"
//             value={nome}
//             onChange={(e) => setNome(e.target.value)}
//           />

//           <input
//             type="text"
//             placeholder="Cargo"
//             value={cargo}
//             onChange={(e) => setCargo(e.target.value)}
//           />

//           <select
//             value={categoria}
//             onChange={(e) => setCategoria(e.target.value)}
//           >
//             <option value="">Selecione uma categoria</option>
//             {categorias.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.departamento}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Horas Trabalhadas"
//             value={horasTrabalhadas}
//             onChange={(e) => setHorasTrabalhadas(Number(e.target.value))}
//           />

//           <input
//             type="number"
//             placeholder="Salário Base"
//             value={salarioBase}
//             onChange={(e) => setSalarioBase(Number(e.target.value))}
//           />

//           <button className="btn-novo" onClick={handleSave}>
//             {editandoId ? "Salvar Edição" : "Criar"}
//           </button>

//         </div>

//       </Modal>

//     </div>
//   )
// }