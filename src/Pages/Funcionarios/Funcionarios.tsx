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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (funcionario: Funcionario) => {
    setNome(funcionario.nome);
    setCargo(funcionario.cargo);
    setCategoriaId(String(funcionario.categoria?.id || ""));
    setHorasTrabalhadas(funcionario.horasTrabalhadas);
    setSalarioBase(funcionario.salarioBase);
    setEditandoId(funcionario.id || null);
    setModalOpen(true);
  };

  const handleDelete = (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"? Essa ação não pode ser desfeita.`)) {
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

  const handleSave = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);
  const dados = {
    nome,
    cargo,
    horasTrabalhadas,
    salarioBase,
    categoria: { id: Number(categoriaId), departamento: "" },
  };

  try {
    if (editandoId !== null) {
      await atualizarFuncionario(editandoId, dados);
    } else {
      await cadastrarFuncionario(dados);
    }
    // 🔁 Recarrega a lista completa para trazer o departamento
    const funcionariosAtualizados = await listarFuncionarios();
    setFuncionarios(funcionariosAtualizados);
    
    setModalOpen(false);
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar", error);
    alert("Erro ao salvar funcionário. Tente novamente.");
  } finally {
    setIsSubmitting(false);
  }
};

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

      {/* BUSCA */}
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
              <th>Departamento</th>
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
                  <button onClick={() => func.id && handleDelete(func.id, func.nome)}>
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

      {/* MODAL COM LABELS E VALIDAÇÃO VISUAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editandoId ? "Editar Funcionário" : "Novo Funcionário"}</h2>
        <div className="form-funcionario">
          <div className="form-group">
            <label>Nome completo *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={errors.nome ? "error-input" : ""}
            />
            {errors.nome && <span className="error-msg">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label>Cargo *</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className={errors.cargo ? "error-input" : ""}
            />
            {errors.cargo && <span className="error-msg">{errors.cargo}</span>}
          </div>

          <div className="form-group">
            <label>Departamento *</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={errors.categoriaId ? "error-input" : ""}
            >
              <option value="">Selecione um departamento</option>
              {departamentos.map((depto) => (
                <option key={depto.id} value={depto.id}>
                  {depto.departamento}
                </option>
              ))}
            </select>
            {errors.categoriaId && <span className="error-msg">{errors.categoriaId}</span>}
          </div>

          <div className="form-group">
            <label>Horas trabalhadas *</label>
            <input
              type="number"
              value={horasTrabalhadas}
              onChange={(e) => setHorasTrabalhadas(Number(e.target.value))}
              className={errors.horasTrabalhadas ? "error-input" : ""}
            />
            {errors.horasTrabalhadas && <span className="error-msg">{errors.horasTrabalhadas}</span>}
          </div>

          <div className="form-group">
            <label>Salário base (R$) *</label>
            <input
              type="number"
              value={salarioBase}
              onChange={(e) => setSalarioBase(Number(e.target.value))}
              className={errors.salarioBase ? "error-input" : ""}
            />
            {errors.salarioBase && <span className="error-msg">{errors.salarioBase}</span>}
          </div>

          <button className="btn-novo" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : editandoId ? "Salvar Edição" : "Criar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
