import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, X, ChevronDown, Loader2 } from "lucide-react";
import "../../Style/Css/Pages/Departamentos.css"
import {  listarDepartamentos, atualizarDepartamento, deletarDepartamento, deletarFuncionario, cadastrarFuncionario, atualizarFuncionario, cadastrarDepartamento,} from "../../service/Service";
import { listarFuncionarios } from "../../service/Service";
import type { Departamento, Funcionario } from "../../service/Types";

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidadeFuncionarios, setQuantidadeFuncionarios] = useState<Record<number, number>>({})
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);

  // Modal de funcionários
  const [modalFuncionarios, setModalFuncionarios] = useState<{
    aberto: boolean;
    departamentoId?: number;
    departamentoNome?: string;
  }>({ aberto: false });
  const [funcionariosDept, setFuncionariosDept] = useState<Funcionario[]>([]);
  const [loadingFuncs, setLoadingFuncs] = useState(false);

  // Modal de criar/editar departamento
  const [modalForm, setModalForm] = useState<{
    aberto: boolean;
    modo: "criar" | "editar";
    departamento?: Departamento;
  }>({ aberto: false, modo: "criar" });


  // ── Carregamento inicial ──────────────────────────────────
  useEffect(() => {
    refreshData();
  }, []);

const atualizarContagemFuncionarios = async () => {
  const todosFuncionarios = await listarFuncionarios();

  const contagem: Record<number, number> = {};

  todosFuncionarios.forEach((func) => {
    const deptId = func.categoria?.id;
    if (deptId) {
      contagem[deptId] = (contagem[deptId] || 0) + 1;
    }
  });

  setQuantidadeFuncionarios(contagem);
};

  async function refreshData() {
  setLoading(true);
  try {
    const [dadosDept, todosFuncionarios] = await Promise.all([
      listarDepartamentos(),
      listarFuncionarios()
    ]);

    setDepartamentos(dadosDept);

    const contagem: Record<number, number> = {};

    todosFuncionarios.forEach((func) => {
      const deptId = func.categoria?.id;

      if (deptId) {
        contagem[deptId] = (contagem[deptId] || 0) + 1;
      }
    });

    setQuantidadeFuncionarios(contagem);
  } finally {
    setLoading(false);
  }
}

  function handleToggleExpand(id: number) {
  setExpandedDeptId((prev) => (prev === id ? null : id));
}

  async function carregarDepartamentos() {
    setLoading(true);
    setErro(null);
    try {
      const [dadosDept, todosFuncionarios] = await Promise.all ([listarDepartamentos(), listarFuncionarios()]);

      setDepartamentos(dadosDept);

      const contagem: Record<number, number> = {};

    todosFuncionarios.forEach((func) => {
      const deptId = func.categoria?.id;

      if (deptId) {
        contagem[deptId] = (contagem[deptId] || 0) + 1;
      }
    });

    setQuantidadeFuncionarios(contagem);

    } catch {
      setErro("Não foi possível carregar os departamentos.");
    } finally {
      setLoading(false);
    }
  }

  // ── Ver funcionários de um departamento ──────────────────
  async function abrirFuncionarios(dept: Departamento) {
    setModalFuncionarios({
      aberto: true,
      departamentoId: dept.id,
      departamentoNome: dept.departamento,
    });
    setLoadingFuncs(true);
    try {
      // Filtra funcionários pelo departamento via campo categoria
      const todos = await listarFuncionarios();
      const filtrados = todos.filter((f) => f.categoria?.id === dept.id);
      setFuncionariosDept(filtrados);
    } catch {
      setFuncionariosDept([]);
    } finally {
      setLoadingFuncs(false);
    }
  }

  // ── Deletar departamento ─────────────────────────────────
  async function handleDeletar(id: number) {
    try {
      await deletarDepartamento(id);
      setDepartamentos((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Erro ao deletar departamento.");
    }
  }

  // ── Salvar (criar ou editar) ─────────────────────────────
  async function handleSalvar(dados: Departamento) {
    try {
      if (modalForm.modo === "criar") {
        const novo = await cadastrarDepartamento(dados);
        setDepartamentos((prev) => [...prev, novo]);
      } else {
        const atualizado = await atualizarDepartamento(dados);
        setDepartamentos((prev) =>
          prev.map((d) => (d.id === atualizado.id ? atualizado : d))
        );
      }
      setModalForm({ aberto: false, modo: "criar" });
    } catch {
      alert("Erro ao salvar departamento.");
    }
  }

  

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="page-container">

      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Departamentos</h1>
          <p>Gerencie as unidades e divisões da PeopleCore</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModalForm({ aberto: true, modo: "criar" })}
        >
          + Novo Departamento
        </button>
      </header>

      {/* ESTADOS DE CARREGAMENTO / ERRO */}
      {loading && (
        <div className="feedback-state">
          <Loader2 size={24} className="spin" />
          <span>Carregando departamentos...</span>
        </div>
      )}

      {erro && (
        <div className="feedback-state error">
          <span>{erro}</span>
          <button className="btn-primary" onClick={carregarDepartamentos}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* LISTA DE CARDS */}
{!loading && !erro && (
  <>
    {departamentos.length === 0 ? (
      <div className="feedback-state">
        <span>Nenhum departamento cadastrado.</span>
      </div>
    ) : (
      <div className="departments-list">
        {departamentos.map((dept, index) => (
          <DepartamentoCard
            key={dept.id}
            departamento={dept}
            index={index}
            totalFuncionarios={quantidadeFuncionarios[dept.id!] || 0}
            isExpanded={expandedDeptId === dept.id}
            onToggleExpand={() => handleToggleExpand(dept.id!)}
            onVerFuncionarios={() => abrirFuncionarios(dept)}
            onEditar={() =>
              setModalForm({
                aberto: true,
                modo: "editar",
                departamento: dept,
              })
            }
            onDeletar={() => dept.id && handleDeletar(dept.id)}
          />
        ))}
      </div>
    )}
  </>
)}

      {/* MODAL: FUNCIONÁRIOS */}
      <AnimatePresence>
        {modalFuncionarios.aberto && (
          <ModalFuncionarios
            
            nome={modalFuncionarios.departamentoNome ?? ""}
            departamentoId={modalFuncionarios.departamentoId!}
            funcionarios={funcionariosDept}
            loading={loadingFuncs}
            onClose={() => setModalFuncionarios({ aberto: false })}
            onUpdateContagem={atualizarContagemFuncionarios}
            onRefresh={async () => {
            const todos = await listarFuncionarios();
              setFuncionariosDept(
                todos.filter((f) => f.categoria?.id === modalFuncionarios.departamentoId)
              );
            }}
          />
        )}

        
      </AnimatePresence>

      {/* MODAL: FORM DEPARTAMENTO */}
      <AnimatePresence>
        {modalForm.aberto && (
          <ModalFormDepartamento
            modo={modalForm.modo}
            departamento={modalForm.departamento}
            onSalvar={handleSalvar}
            onClose={() => setModalForm({ aberto: false, modo: "criar" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// CARD DE DEPARTAMENTO
// ============================================================

interface CardProps {
  departamento: Departamento;
  index: number;
  totalFuncionarios: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onVerFuncionarios: () => void;
  onEditar: () => void;
  onDeletar: () => void;
}

function DepartamentoCard({departamento, index, totalFuncionarios, isExpanded, onToggleExpand, onVerFuncionarios, onEditar, onDeletar,}: CardProps) {

  return (
    <div className={`dept-card ${isExpanded ? "expanded" : ""}`}>

      <div
        className="dept-card-header"
        onClick={onToggleExpand}
      >
        <div className="header-main">
          <span className="dept-badge">#{String(index + 1).padStart(2, "0")}</span>
          <h3 className="dept-title">{departamento.departamento}</h3>
        </div>

        <button
          className="btn-expand"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="dept-card-expandable">
        <div className="expand-content-inner">

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-value">{totalFuncionarios}</span>
              <span className="stat-label">Funcionários</span>

              <button
                className="funcionarios-dept"
                onClick={(e) => {
                  e.stopPropagation();
                  onVerFuncionarios();
                }}
              >
                Ver funcionários
              </button>
            </div>
          </div>

          <div className="crud-actions">
            <button
              className="btn-action edit"
              onClick={(e) => {
                e.stopPropagation();
                onEditar();
              }}
            >
              <Pencil size={15} /> Editar
            </button>
            <button
              className="btn-action delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeletar();
              }}
            >
              <Trash2 size={15} /> Deletar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: LISTA DE FUNCIONÁRIOS
// ============================================================

function ModalFuncionarios({
  nome,
  departamentoId,
  funcionarios,
  loading,
  onClose,
  onRefresh,
  onUpdateContagem,
}: {
  nome: string;
  departamentoId: number;
  funcionarios: Funcionario[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  onUpdateContagem: () => Promise<void>;
}) {

  const [modalFuncionario, setModalFuncionario] = useState<{
    aberto: boolean;
    modo: "criar" | "editar";
    funcionario?: Funcionario;
  }>({
    aberto: false,
    modo: "criar",
  });

  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h2>Funcionários — {nome}</h2>
          <div className="modal-header-actions">
            <button className="close-modal" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="feedback-state">
              <Loader2 size={20} className="spin" />
              <span>Carregando...</span>
            </div>
          ) : funcionarios.length === 0 ? (
            <div className="feedback-state">
              <span>Nenhum funcionário neste departamento.</span>
            </div>
          ) : (
            funcionarios.map((f) => (
              <div key={f.id} className="employee-item">
                <div className="employee-info">
                  <strong>{f.nome}</strong>
                  <span>{f.cargo}</span>
                </div>
                <div className="employee-actions">
                  <TooltipButton
                    label="Editar"
                    icon={<Pencil size={16} />}
                    onClick={() =>
                        setModalFuncionario({
                          aberto: true,
                          modo: "editar",
                          funcionario: f,
                        })}
                  />
                  <TooltipButton
                    label="Excluir"
                    icon={<Trash2 size={16} />}
                    onClick={async () => {
                      if (!f.id) return;
                      await deletarFuncionario(f.id);
                      await onUpdateContagem();
                      await onRefresh();
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
      {modalFuncionario.aberto && (
        <ModalFormFuncionario
          modo={modalFuncionario.modo}
          funcionario={modalFuncionario.funcionario}
          departamentoId={departamentoId}
          onSalvar={async (dados) => {
            if (modalFuncionario.modo === "criar") {
              await cadastrarFuncionario(dados);
            } else {
              if (!modalFuncionario.funcionario?.id) return;
              await atualizarFuncionario(modalFuncionario.funcionario.id, dados);
            }
            await onRefresh();
            await onUpdateContagem();
            setModalFuncionario({ aberto: false, modo: "criar", funcionario: undefined });
          }}
          onClose={() => setModalFuncionario({ aberto: false, modo: "criar" })}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: FORMULÁRIO CRIAR / EDITAR DEPARTAMENTO
// ============================================================

function ModalFormDepartamento({
  modo,
  departamento,
  onSalvar,
  onClose,
}: {
  modo: "criar" | "editar";
  departamento?: Departamento;
  onSalvar: (dados: Departamento) => Promise<void>;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(departamento?.departamento ?? "");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) {
      alert("O nome do departamento é obrigatório.");
      return;
    }
    setSalvando(true);
    await onSalvar({ ...departamento, departamento: nome.trim() });
    setSalvando(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h2>{modo === "criar" ? "Novo Departamento" : "Editar Departamento"}</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="nome-dept">Nome do Departamento</label>
            <input
              id="nome-dept"
              type="text"
              className="form-input"
              placeholder="Ex: Desenvolvimento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action edit" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={salvando}>
            {salvando ? (
              <>
                <Loader2 size={15} className="spin" />
                Salvando...
              </>
            ) : modo === "criar" ? (
              "Criar"
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL: FORMULÁRIO CRIAR / EDITAR FUNCIONÁRIO
// ============================================================

function ModalFormFuncionario({
  modo,
  funcionario,
  departamentoId,
  onSalvar,
  onClose,
}: {
  modo: "criar" | "editar";
  funcionario?: Funcionario;
  departamentoId: number;
  onSalvar: (dados: Funcionario) => Promise<void>;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
const [cargo, setCargo] = useState("");
const [horasTrabalhadas, setHorasTrabalhadas] = useState("");
const [salarioBase, setSalarioBase] = useState("");

useEffect(() => {
  setNome(funcionario?.nome ?? "");
  setCargo(funcionario?.cargo ?? "");
  setHorasTrabalhadas(funcionario?.horasTrabalhadas?.toString() ?? "");
  setSalarioBase(funcionario?.salarioBase?.toString() ?? "");
}, [funcionario]);


  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) {
      alert("O nome do funcionário é obrigatório.");
      return;
    }
    setSalvando(true);
    await onSalvar({
      ...funcionario,
      nome: nome.trim(),
      cargo: cargo.trim(),
      horasTrabalhadas: Number(horasTrabalhadas),
      salarioBase: Number(salarioBase),
      categoria: { id: departamentoId },
    } as Funcionario);
    setSalvando(false);
  }


  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h2>{modo === "criar" ? "Novo Funcionário" : "Editar Funcionário"}</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="nome-func">Nome</label>
            <input
              id="nome-func"
              type="text"
              className="form-input"
              placeholder="Ex: João Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="cargo-func">Cargo</label>
            <input
              id="cargo-func"
              type="text"
              className="form-input"
              placeholder="Ex: Desenvolvedor"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="horas-func">Horas Trabalhadas</label>
            <input
              id="horas-func"
              type="number"
              className="form-input"
              placeholder="Ex: 160"
              value={horasTrabalhadas}
              onChange={(e) => setHorasTrabalhadas(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="salario-base-func">Salário Base</label>
            <input
              id="salario-base-func"
              type="number"
              step="0.01"
              className="form-input"
              placeholder="Ex: 3500"
              value={salarioBase}
              onChange={(e) => setSalarioBase(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action edit" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={salvando}>
            {salvando ? (
              <>
                <Loader2 size={15} className="spin" />
                Salvando...
              </>
            ) : modo === "criar" ? (
              "Criar"
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// TOOLTIP BUTTON (mantido do original)
// ============================================================

function TooltipButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="icon-wrapper"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button className="btn-icon" onClick={onClick}>
        {icon}
      </button>

      <AnimatePresence>
        {hover && (
          <motion.div
            className="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Departamentos;
