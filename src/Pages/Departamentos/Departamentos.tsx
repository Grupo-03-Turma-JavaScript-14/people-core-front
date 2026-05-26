import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X, ChevronDown, Loader2, Users, Building2 } from "lucide-react";

import {
  listarDepartamentos, cadastrarDepartamento, atualizarDepartamento, deletarDepartamento,
  listarFuncionarios, deletarFuncionario, cadastrarFuncionario, atualizarFuncionario,
} from "../../Service/Service";
import type { Departamento, Funcionario } from "../../Service/Types";

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================
function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidadeFuncionarios, setQuantidadeFuncionarios] = useState<Record<number, number>>({});
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);
  const [modalFuncionarios, setModalFuncionarios] = useState<{ aberto: boolean; departamentoId?: number; departamentoNome?: string }>({ aberto: false });
  const [funcionariosDept, setFuncionariosDept] = useState<Funcionario[]>([]);
  const [loadingFuncs, setLoadingFuncs] = useState(false);
  const [modalForm, setModalForm] = useState<{ aberto: boolean; modo: "criar" | "editar"; departamento?: Departamento }>({ aberto: false, modo: "criar" });
  const [confirmDelete, setConfirmDelete] = useState<{ id: number } | null>(null);

  useEffect(() => { refreshData(); }, []);

  async function refreshData() {
    setLoading(true); setErro(null);
    try {
      const [dadosDept, todos] = await Promise.all([listarDepartamentos(), listarFuncionarios()]);
      setDepartamentos(dadosDept);
      const c: Record<number, number> = {};
      todos.forEach(f => { const id = f.categoria?.id; if (id) c[id] = (c[id] || 0) + 1; });
      setQuantidadeFuncionarios(c);
    } catch { setErro("Não foi possível carregar os departamentos."); }
    finally { setLoading(false); }
  }

  async function atualizarContagem() {
    const todos = await listarFuncionarios();
    const c: Record<number, number> = {};
    todos.forEach(f => { const id = f.categoria?.id; if (id) c[id] = (c[id] || 0) + 1; });
    setQuantidadeFuncionarios(c);
  }

  async function abrirFuncionarios(dept: Departamento) {
    setModalFuncionarios({ aberto: true, departamentoId: dept.id, departamentoNome: dept.departamento });
    setLoadingFuncs(true);
    try {
      const todos = await listarFuncionarios();
      setFuncionariosDept(todos.filter(f => f.categoria?.id === dept.id));
    } catch { setFuncionariosDept([]); }
    finally { setLoadingFuncs(false); }
  }

  async function handleDeletar(id: number) {
    try {
      await deletarDepartamento(id);
      setDepartamentos(p => p.filter(d => d.id !== id));
      toast.success("Departamento excluído com sucesso!");
    } catch { toast.error("Erro ao deletar departamento."); }
  }

  async function handleSalvar(dados: Departamento) {
    try {
      if (modalForm.modo === "criar") {
        const novo = await cadastrarDepartamento(dados);
        setDepartamentos(p => [...p, novo]);
      } else {
        const at = await atualizarDepartamento(dados);
        setDepartamentos(p => p.map(d => d.id === at.id ? at : d));
      }
      setModalForm({ aberto: false, modo: "criar" });
      toast.success("Departamento salvo com sucesso!");
    } catch { toast.error("Erro ao salvar departamento."); }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departamentos</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {departamentos.length} unidade{departamentos.length !== 1 ? "s" : ""} cadastrada{departamentos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalForm({ aberto: true, modo: "criar" })}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-95 w-full sm:w-auto"
          style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}
        >
          <span className="text-lg leading-none">+</span> Novo Departamento
        </button>
      </div>

      {/* LOADING / ERRO / VAZIO */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
          <Loader2 size={20} className="animate-spin text-[#14B8A6]" /> Carregando...
        </div>
      )}
      {erro && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500 text-sm">
          <p>{erro}</p>
          <button onClick={refreshData} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#14B8A6" }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* GRID */}
      {!loading && !erro && (
        departamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Building2 size={40} className="opacity-30" />
            <p className="text-sm">Nenhum departamento cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {departamentos.map((dept, index) => (
              <DepartamentoCard
                key={dept.id}
                departamento={dept}
                index={index}
                totalFuncionarios={quantidadeFuncionarios[dept.id!] || 0}
                isExpanded={expandedDeptId === dept.id}
                onToggleExpand={() => setExpandedDeptId(p => p === dept.id ? null : dept.id!)}
                onVerFuncionarios={() => abrirFuncionarios(dept)}
                onEditar={() => setModalForm({ aberto: true, modo: "editar", departamento: dept })}
                onDeletar={() => dept.id && setConfirmDelete({ id: dept.id })}
              />
            ))}
          </div>
        )
      )}

      <AnimatePresence>
        {modalFuncionarios.aberto && (
          <ModalFuncionarios
            nome={modalFuncionarios.departamentoNome ?? ""}
            departamentoId={modalFuncionarios.departamentoId!}
            funcionarios={funcionariosDept}
            loading={loadingFuncs}
            onClose={() => setModalFuncionarios({ aberto: false })}
            onUpdateContagem={atualizarContagem}
            onRefresh={async () => {
              const todos = await listarFuncionarios();
              setFuncionariosDept(todos.filter(f => f.categoria?.id === modalFuncionarios.departamentoId));
            }}
          />
        )}
      </AnimatePresence>

      {confirmDelete && (
        <ConfirmDeleteDept
          onConfirm={() => {
            handleDeletar(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

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
// CARD
// ============================================================
interface CardProps {
  departamento: Departamento; index: number; totalFuncionarios: number;
  isExpanded: boolean; onToggleExpand: () => void;
  onVerFuncionarios: () => void; onEditar: () => void; onDeletar: () => void;
}

function DepartamentoCard({ departamento, index, totalFuncionarios, isExpanded, onToggleExpand, onVerFuncionarios, onEditar, onDeletar }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${isExpanded ? "border-[#14B8A6] shadow-md" : "border-slate-100 hover:border-slate-200 hover:shadow-md"}`}>
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #14B8A6, #5EEAD4)" }} />

      <div className="p-4 sm:p-5 cursor-pointer select-none" onClick={onToggleExpand}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
              #{String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">{departamento.departamento}</h3>
              <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
                <Users size={11} />
                <span>{totalFuncionarios} funcionário{totalFuncionarios !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-50 pt-3 flex flex-col gap-2">
              <button
                onClick={e => { e.stopPropagation(); onVerFuncionarios(); }}
                className="w-full py-2 rounded-lg text-sm font-semibold border transition-all bg-transparent"
                style={{ borderColor: "#14B8A6", color: "#14B8A6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0fdfa"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <Users size={14} className="inline mr-1.5 -mt-0.5" />
                Ver funcionários
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onEditar(); }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all bg-transparent cursor-pointer"
                >
                  <Pencil size={13} /> Editar
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDeletar(); }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 transition-all bg-transparent cursor-pointer"
                >
                  <Trash2 size={13} /> Deletar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MODAL: FUNCIONÁRIOS DO DEPARTAMENTO
// ============================================================
function ModalFuncionarios({ nome, departamentoId, funcionarios, loading, onClose, onRefresh, onUpdateContagem }: {
  nome: string; departamentoId: number; funcionarios: Funcionario[];
  loading: boolean; onClose: () => void;
  onRefresh: () => Promise<void>; onUpdateContagem: () => Promise<void>;
}) {
  const [modalFunc, setModalFunc] = useState<{ aberto: boolean; modo: "criar" | "editar"; funcionario?: Funcionario }>({ aberto: false, modo: "criar" });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <motion.div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.2 }}
      >
        {/* Handle para mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800">Funcionários</h2>
            <p className="text-slate-400 text-xs mt-0.5">{nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalFunc({ aberto: true, modo: "criar" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white border-none cursor-pointer"
              style={{ background: "#14B8A6" }}
            >
              + Adicionar
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] sm:max-h-100 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
              <Loader2 size={18} className="animate-spin text-[#14B8A6]" /> Carregando...
            </div>
          ) : funcionarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Users size={32} className="opacity-30" />
              <p className="text-sm">Nenhum funcionário neste departamento.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {funcionarios.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-teal-50/30 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
                      {f.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{f.nome}</p>
                      <p className="text-slate-400 text-xs truncate">{f.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => setModalFunc({ aberto: true, modo: "editar", funcionario: f })}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all bg-transparent cursor-pointer">
                      <Pencil size={14} />
                    </button>
                    <button onClick={async () => {
                        if (!f.id) return;
                        await deletarFuncionario(f.id);
                        toast.success("Funcionário excluído!");
                        await onUpdateContagem();
                        await onRefresh();
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500 transition-all bg-transparent cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {modalFunc.aberto && (
          <ModalFormFuncionario
            modo={modalFunc.modo}
            funcionario={modalFunc.funcionario}
            departamentoId={departamentoId}
            onSalvar={async (dados) => {
              if (modalFunc.modo === "criar") await cadastrarFuncionario(dados);
              else if (modalFunc.funcionario?.id) await atualizarFuncionario(modalFunc.funcionario.id, dados);
              await onRefresh(); await onUpdateContagem();
              setModalFunc({ aberto: false, modo: "criar" });
            }}
            onClose={() => setModalFunc({ aberto: false, modo: "criar" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MODAL: FORM DEPARTAMENTO
// ============================================================
function ModalFormDepartamento({ modo, departamento, onSalvar, onClose }: {
  modo: "criar" | "editar"; departamento?: Departamento;
  onSalvar: (dados: Departamento) => Promise<void>; onClose: () => void;
}) {
  const [nome, setNome] = useState(departamento?.departamento ?? "");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) { toast.warn("O nome é obrigatório."); return; }
    setSalvando(true);
    await onSalvar({ ...departamento, departamento: nome.trim() });
    setSalvando(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <motion.div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{modo === "criar" ? "Novo Departamento" : "Editar Departamento"}</h2>
            <p className="text-slate-400 text-xs mt-0.5">Informe o nome da unidade</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"><X size={18} /></button>
        </div>
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Nome do Departamento</label>
          <input
            type="text" placeholder="Ex: Desenvolvimento" value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all"
          />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} disabled={salvando}
            className="flex items-center gap-2 px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
            {salvando ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : modo === "criar" ? "Criar" : "Salvar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL: FORM FUNCIONÁRIO
// ============================================================
function ModalFormFuncionario({ modo, funcionario, departamentoId, onSalvar, onClose }: {
  modo: "criar" | "editar"; funcionario?: Funcionario; departamentoId: number;
  onSalvar: (dados: Funcionario) => Promise<void>; onClose: () => void;
}) {
  const [nome, setNome] = useState(funcionario?.nome ?? "");
  const [cargo, setCargo] = useState(funcionario?.cargo ?? "");
  const [horas, setHoras] = useState(funcionario?.horasTrabalhadas?.toString() ?? "");
  const [salario, setSalario] = useState(funcionario?.salarioBase?.toString() ?? "");
  const [salvando, setSalvando] = useState(false);

  const inp = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all";

  async function handleSubmit() {
    if (!nome.trim()) { toast.warn("O nome é obrigatório."); return; }
    setSalvando(true);
    await onSalvar({ ...funcionario, nome: nome.trim(), cargo: cargo.trim(), horasTrabalhadas: Number(horas), salarioBase: Number(salario), categoria: { id: departamentoId, departamento: "" } } as Funcionario);
    setSalvando(false);
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <motion.div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{modo === "criar" ? "Novo Funcionário" : "Editar Funcionário"}</h2>
            <p className="text-slate-400 text-xs mt-0.5">Preencha os dados abaixo</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Nome</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" className={inp} autoFocus />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Cargo</label>
            <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Desenvolvedor" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Horas Trab.</label>
              <input type="number" value={horas} onChange={e => setHoras(e.target.value)} placeholder="160" min={0} className={inp} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Salário Base</label>
              <input type="number" value={salario} onChange={e => setSalario(e.target.value)} placeholder="3500" min={0} step="0.01" className={inp} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">Cancelar</button>
          <button onClick={handleSubmit} disabled={salvando}
            className="flex items-center gap-2 px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
            {salvando ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : modo === "criar" ? "Criar" : "Salvar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MODAL: CONFIRMAÇÃO DE EXCLUSÃO
// ============================================================
function ConfirmDeleteDept({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Excluir departamento?</h3>
        <p className="text-slate-400 text-sm mt-2 mb-6">
          Esta ação não pode ser desfeita.<br />Os funcionários do departamento não serão excluídos.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all bg-white cursor-pointer">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all border-none cursor-pointer"
            style={{ background: "#EF4444" }}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Departamentos;