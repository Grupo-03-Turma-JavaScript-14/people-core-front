import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X, ChevronDown, Loader2, Users, Building2 } from "lucide-react";

import {
  listarDepartamentos,
  cadastrarDepartamento,
  atualizarDepartamento,
  deletarDepartamento,
  listarFuncionarios,
  deletarFuncionario,
  cadastrarFuncionario,
  atualizarFuncionario,
} from "../../Service/Service";

import type { Departamento, Funcionario } from "../../Service/Types";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidadeFuncionarios, setQuantidadeFuncionarios] = useState<Record<number, number>>({});
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);

  const [modalFuncionarios, setModalFuncionarios] = useState<{
    aberto: boolean; departamentoId?: number; departamentoNome?: string;
  }>({ aberto: false });
  const [funcionariosDept, setFuncionariosDept] = useState<Funcionario[]>([]);
  const [loadingFuncs, setLoadingFuncs] = useState(false);

  const [modalForm, setModalForm] = useState<{
    aberto: boolean; modo: "criar" | "editar"; departamento?: Departamento;
  }>({ aberto: false, modo: "criar" });

  useEffect(() => { refreshData(); }, []);

  async function refreshData() {
    setLoading(true);
    setErro(null);
    try {
      const [dadosDept, todosFuncionarios] = await Promise.all([
        listarDepartamentos(), listarFuncionarios()
      ]);
      setDepartamentos(dadosDept);
      const contagem: Record<number, number> = {};
      todosFuncionarios.forEach((f) => {
        const id = f.categoria?.id;
        if (id) contagem[id] = (contagem[id] || 0) + 1;
      });
      setQuantidadeFuncionarios(contagem);
    } catch {
      setErro("Não foi possível carregar os departamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function atualizarContagem() {
    const todos = await listarFuncionarios();
    const contagem: Record<number, number> = {};
    todos.forEach((f) => {
      const id = f.categoria?.id;
      if (id) contagem[id] = (contagem[id] || 0) + 1;
    });
    setQuantidadeFuncionarios(contagem);
  }

  async function abrirFuncionarios(dept: Departamento) {
    setModalFuncionarios({ aberto: true, departamentoId: dept.id, departamentoNome: dept.departamento });
    setLoadingFuncs(true);
    try {
      const todos = await listarFuncionarios();
      setFuncionariosDept(todos.filter((f) => f.categoria?.id === dept.id));
    } catch { setFuncionariosDept([]); }
    finally { setLoadingFuncs(false); }
  }

  async function handleDeletar(id: number) {
    if (!window.confirm("Excluir este departamento? Essa ação não pode ser desfeita.")) return;
    try {
      await deletarDepartamento(id);
      setDepartamentos((prev) => prev.filter((d) => d.id !== id));
    } catch { alert("Erro ao deletar departamento."); }
  }

  async function handleSalvar(dados: Departamento) {
    try {
      if (modalForm.modo === "criar") {
        const novo = await cadastrarDepartamento(dados);
        setDepartamentos((prev) => [...prev, novo]);
      } else {
        const atualizado = await atualizarDepartamento(dados);
        setDepartamentos((prev) => prev.map((d) => (d.id === atualizado.id ? atualizado : d)));
      }
      setModalForm({ aberto: false, modo: "criar" });
    } catch { alert("Erro ao salvar departamento."); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER — responsivo: empilha em mobile, lado a lado em sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departamentos</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {departamentos.length} unidade{departamentos.length !== 1 ? "s" : ""} cadastrada{departamentos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalForm({ aberto: true, modo: "criar" })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-95 w-full sm:w-auto justify-center"
          style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}
        >
          <span className="text-lg leading-none">+</span> Novo Departamento
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
          <Loader2 size={20} className="animate-spin text-[#14B8A6]" />
          Carregando departamentos...
        </div>
      )}

      {/* ERRO */}
      {erro && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <p>{erro}</p>
          <button onClick={refreshData} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#14B8A6" }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* GRID DE CARDS */}
      {!loading && !erro && (
        <>
          {departamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
              <Building2 size={40} className="opacity-30" />
              <p className="text-sm">Nenhum departamento cadastrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departamentos.map((dept, index) => (
                <DepartamentoCard
                  key={dept.id}
                  departamento={dept}
                  index={index}
                  totalFuncionarios={quantidadeFuncionarios[dept.id!] || 0}
                  isExpanded={expandedDeptId === dept.id}
                  onToggleExpand={() => setExpandedDeptId(prev => prev === dept.id ? null : dept.id!)}
                  onVerFuncionarios={() => abrirFuncionarios(dept)}
                  onEditar={() => setModalForm({ aberto: true, modo: "editar", departamento: dept })}
                  onDeletar={() => dept.id && handleDeletar(dept.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL: FUNCIONÁRIOS DO DEPT */}
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
              setFuncionariosDept(todos.filter((f) => f.categoria?.id === modalFuncionarios.departamentoId));
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

function DepartamentoCard({ departamento, index, totalFuncionarios, isExpanded, onToggleExpand, onVerFuncionarios, onEditar, onDeletar }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
      isExpanded ? "border-[#14B8A6] shadow-md" : "border-slate-100 hover:border-slate-200 hover:shadow-md"
    }`}>

      {/* Topo colorido */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #14B8A6, #5EEAD4)" }} />

      {/* Header do card */}
      <div className="p-5 cursor-pointer select-none" onClick={onToggleExpand}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
              #{String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{departamento.departamento}</h3>
              <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
                <Users size={11} />
                <span>{totalFuncionarios} funcionário{totalFuncionarios !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 shrink-0 mt-1 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Conteúdo expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-slate-50 pt-4 flex flex-col gap-3">
              <button
                onClick={onVerFuncionarios}
                className="w-full py-2 rounded-lg text-sm font-semibold border transition-all"
                style={{ borderColor: "#14B8A6", color: "#14B8A6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0fdfa"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <Users size={14} className="inline mr-1.5 -mt-0.5" />
                Ver funcionários
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onEditar}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all"
                >
                  <Pencil size={13} /> Editar
                </button>
                <button
                  onClick={onDeletar}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 transition-all"
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

function ModalFuncionarios({
  nome, departamentoId, funcionarios, loading, onClose, onRefresh, onUpdateContagem,
}: {
  nome: string; departamentoId: number; funcionarios: Funcionario[];
  loading: boolean; onClose: () => void;
  onRefresh: () => Promise<void>; onUpdateContagem: () => Promise<void>;
}) {
  const [modalFunc, setModalFunc] = useState<{
    aberto: boolean; modo: "criar" | "editar"; funcionario?: Funcionario;
  }>({ aberto: false, modo: "criar" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        /* max-h-[90vh] garante que o modal não vaze a tela em mobile */
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header — fixo no topo do modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Funcionários</h2>
            <p className="text-slate-400 text-xs mt-0.5">{nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalFunc({ aberto: true, modo: "criar" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background: "#14B8A6" }}
            >
              + Adicionar
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
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
                <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#14B8A6]/30 hover:bg-teal-50/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}>
                      {f.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{f.nome}</p>
                      <p className="text-slate-400 text-xs">{f.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setModalFunc({ aberto: true, modo: "editar", funcionario: f })}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all bg-transparent cursor-pointer"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={async () => {
                        if (!f.id || !window.confirm(`Excluir "${f.nome}"?`)) return;
                        await deletarFuncionario(f.id);
                        await onUpdateContagem();
                        await onRefresh();
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500 transition-all bg-transparent cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de form de funcionário aninhado */}
      <AnimatePresence>
        {modalFunc.aberto && (
          <ModalFormFuncionario
            modo={modalFunc.modo}
            funcionario={modalFunc.funcionario}
            departamentoId={departamentoId}
            onSalvar={async (dados) => {
              if (modalFunc.modo === "criar") await cadastrarFuncionario(dados);
              else if (modalFunc.funcionario?.id) await atualizarFuncionario(modalFunc.funcionario.id, dados);
              await onRefresh();
              await onUpdateContagem();
              setModalFunc({ aberto: false, modo: "criar" });
            }}
            onClose={() => setModalFunc({ aberto: false, modo: "criar" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalFormDepartamento({
  modo, departamento, onSalvar, onClose,
}: {
  modo: "criar" | "editar"; departamento?: Departamento;
  onSalvar: (dados: Departamento) => Promise<void>; onClose: () => void;
}) {
  const [nome, setNome] = useState(departamento?.departamento ?? "");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) { alert("O nome do departamento é obrigatório."); return; }
    setSalvando(true);
    await onSalvar({ ...departamento, departamento: nome.trim() });
    setSalvando(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{modo === "criar" ? "Novo Departamento" : "Editar Departamento"}</h2>
            <p className="text-slate-400 text-xs mt-0.5">Informe o nome da unidade</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Nome do Departamento</label>
          <input
            type="text"
            placeholder="Ex: Desenvolvimento"
            value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="flex items-center gap-2 px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}
          >
            {salvando ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : modo === "criar" ? "Criar" : "Salvar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}


function ModalFormFuncionario({
  modo, funcionario, departamentoId, onSalvar, onClose,
}: {
  modo: "criar" | "editar"; funcionario?: Funcionario; departamentoId: number;
  onSalvar: (dados: Funcionario) => Promise<void>; onClose: () => void;
}) {
  const [nome, setNome] = useState(funcionario?.nome ?? "");
  const [cargo, setCargo] = useState(funcionario?.cargo ?? "");
  const [horas, setHoras] = useState(funcionario?.horasTrabalhadas?.toString() ?? "");
  const [salario, setSalario] = useState(funcionario?.salarioBase?.toString() ?? "");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) { alert("O nome é obrigatório."); return; }
    setSalvando(true);
    await onSalvar({
      ...funcionario,
      nome: nome.trim(), cargo: cargo.trim(),
      horasTrabalhadas: Number(horas), salarioBase: Number(salario),
      categoria: { id: departamentoId, departamento: "" },
    } as Funcionario);
    setSalvando(false);
  }

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{modo === "criar" ? "Novo Funcionário" : "Editar Funcionário"}</h2>
            <p className="text-slate-400 text-xs mt-0.5">Preencha os dados abaixo</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Nome", value: nome, set: setNome, placeholder: "Ex: João Silva", type: "text" },
            { label: "Cargo", value: cargo, set: setCargo, placeholder: "Ex: Desenvolvedor", type: "text" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className={inputCls} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Horas Trab.</label>
              <input type="number" value={horas} onChange={e => setHoras(e.target.value)} placeholder="160" min={0} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Salário Base</label>
              <input type="number" value={salario} onChange={e => setSalario(e.target.value)} placeholder="3500" min={0} step="0.01" className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="flex items-center gap-2 px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)" }}
          >
            {salvando ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : modo === "criar" ? "Criar" : "Salvar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Departamentos;