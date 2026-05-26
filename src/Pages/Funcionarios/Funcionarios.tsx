import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Users, UserPlus, Search, Pencil, Trash2, X, Loader2 } from "lucide-react";
import {
  listarFuncionarios, listarDepartamentos,
  cadastrarFuncionario, atualizarFuncionario, deletarFuncionario,
} from "../../Service/Service";
import type { Funcionario, Departamento } from "../../Service/Types";

// ── Estado vazio ──────────────────────────────────────────
function EmptyState({ busca, onNovo }: { busca: string; onNovo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}>
        <Users size={36} className="text-white" />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-slate-700 text-lg">
          {busca ? `Nenhum resultado para "${busca}"` : "Nenhum funcionário cadastrado"}
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          {busca ? "Tente buscar por outro nome." : "Comece adicionando o primeiro colaborador."}
        </p>
      </div>
      {!busca && (
        <button
          onClick={onNovo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}
        >
          <UserPlus size={16} /> Adicionar primeiro funcionário
        </button>
      )}
    </div>
  );
}

// ── Modal de confirmação de exclusão ─────────────────────
function ConfirmModal({ nome, onConfirm, onCancel }: { nome: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Excluir funcionário?</h3>
        <p className="text-slate-400 text-sm mt-2 mb-6">
          Tem certeza que deseja excluir <strong className="text-slate-700">{nome}</strong>?
          <br />Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all bg-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all active:scale-95 border-none cursor-pointer"
            style={{ background: "#EF4444" }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────
export default function Funcionarios() {
  const [funcionarios, setFuncionarios]   = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [busca, setBusca]                 = useState("");
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [editandoId, setEditandoId]       = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; nome: string } | null>(null);

  const [nome, setNome]                       = useState("");
  const [cargo, setCargo]                     = useState("");
  const [categoriaId, setCategoriaId]         = useState("");
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(0);
  const [salarioBase, setSalarioBase]         = useState(0);
  const [errors, setErrors]                   = useState({ nome: "", cargo: "", categoriaId: "", horasTrabalhadas: "", salarioBase: "" });

  useEffect(() => {
    Promise.all([listarFuncionarios(), listarDepartamentos()])
      .then(([funcs, depts]) => { setFuncionarios(funcs); setDepartamentos(depts); })
      .catch(() => toast.error("Erro ao carregar dados."))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setNome(""); setCargo(""); setCategoriaId("");
    setHorasTrabalhadas(0); setSalarioBase(0); setEditandoId(null);
    setErrors({ nome: "", cargo: "", categoriaId: "", horasTrabalhadas: "", salarioBase: "" });
  };

  const handleEdit = (f: Funcionario) => {
    setNome(f.nome); setCargo(f.cargo);
    setCategoriaId(String(f.categoria?.id || ""));
    setHorasTrabalhadas(f.horasTrabalhadas);
    setSalarioBase(f.salarioBase);
    setEditandoId(f.id || null);
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const e = { nome: "", cargo: "", categoriaId: "", horasTrabalhadas: "", salarioBase: "" };
    let ok = true;
    if (!nome.trim())      { e.nome = "Nome é obrigatório"; ok = false; }
    if (!cargo.trim())     { e.cargo = "Cargo é obrigatório"; ok = false; }
    if (!categoriaId)      { e.categoriaId = "Selecione um departamento"; ok = false; }
    if (horasTrabalhadas <= 0) { e.horasTrabalhadas = "Deve ser maior que zero"; ok = false; }
    if (salarioBase <= 0)  { e.salarioBase = "Deve ser maior que zero"; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const dados = { nome, cargo, horasTrabalhadas, salarioBase, categoria: { id: Number(categoriaId), departamento: "" } };
    try {
      if (editandoId !== null) {
        await atualizarFuncionario(editandoId, dados);
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        await cadastrarFuncionario(dados);
        toast.success("Funcionário cadastrado com sucesso!");
      }
      const atualizados = await listarFuncionarios();
      setFuncionarios(atualizados);
      setModalOpen(false);
      resetForm();
    } catch {
      toast.error("Erro ao salvar funcionário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await deletarFuncionario(confirmDelete.id);
      setFuncionarios(prev => prev.filter(f => f.id !== confirmDelete.id));
      toast.success(`${confirmDelete.nome} foi removido.`);
    } catch {
      toast.error("Erro ao excluir funcionário.");
    } finally {
      setConfirmDelete(null);
    }
  };

  const filtrados = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cargo.toLowerCase().includes(busca.toLowerCase())
  );

  const inp = (err: string) =>
    `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all bg-slate-50 ${
      err ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20"
    }`;

  return (
    <div className="p-4 sm:p-6 h-full w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Funcionários</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? "Carregando..." : `${funcionarios.length} colaborador${funcionarios.length !== 1 ? "es" : ""} cadastrado${funcionarios.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-95 border-none cursor-pointer"
          style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}
        >
          <UserPlus size={16} /> Novo Funcionário
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" placeholder="Buscar por nome ou cargo..."
          value={busca} onChange={e => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all shadow-sm"
        />
        {busca && (
          <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
            <X size={14} />
          </button>
        )}
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
            <Loader2 size={20} className="animate-spin text-[#14B8A6]" /> Carregando funcionários...
          </div>
        ) : filtrados.length === 0 ? (
          <EmptyState busca={busca} onNovo={() => { resetForm(); setModalOpen(true); }} />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100" style={{ background: "linear-gradient(135deg,#f0fdfa,#f8fafc)" }}>
                {["Nome", "Cargo", "Departamento", "Horas Trab.", "Salário Base", "Salário Total", "Ações"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((func, i) => (
                <tr key={func.id} className={`border-b border-slate-50 hover:bg-teal-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}>
                        {func.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{func.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{func.cargo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#ccfbf1", color: "#0F766E" }}>
                      {func.categoria?.departamento ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{func.horasTrabalhadas}h</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    R$ {Number(func.salarioBase).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#0F766E" }}>
                    R$ {Number(func.salarioTotal ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(func)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all bg-white cursor-pointer">
                        <Pencil size={12} /> Editar
                      </button>
                      <button onClick={() => func.id && setConfirmDelete({ id: func.id, nome: func.nome })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 transition-all bg-white cursor-pointer">
                        <Trash2 size={12} /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtrados.length > 0 && !loading && (
        <p className="text-xs text-slate-400 mt-3 text-right">
          Exibindo {filtrados.length} de {funcionarios.length} funcionário{funcionarios.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{editandoId ? "Editar Funcionário" : "Novo Funcionário"}</h2>
                <p className="text-slate-400 text-xs mt-0.5">Preencha os dados abaixo</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Nome completo *</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" className={inp(errors.nome)} />
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Cargo *</label>
                <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Desenvolvedor" className={inp(errors.cargo)} />
                {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Departamento *</label>
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className={inp(errors.categoriaId)}>
                  <option value="">Selecione um departamento</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.departamento}</option>)}
                </select>
                {errors.categoriaId && <p className="text-xs text-red-500 mt-1">{errors.categoriaId}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Horas Trab. *</label>
                  <input type="number" value={horasTrabalhadas} onChange={e => setHorasTrabalhadas(Number(e.target.value))} min={0} className={inp(errors.horasTrabalhadas)} />
                  {errors.horasTrabalhadas && <p className="text-xs text-red-500 mt-1">{errors.horasTrabalhadas}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Salário Base *</label>
                  <input type="number" value={salarioBase} onChange={e => setSalarioBase(Number(e.target.value))} min={0} className={inp(errors.salarioBase)} />
                  {errors.salarioBase && <p className="text-xs text-red-500 mt-1">{errors.salarioBase}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setModalOpen(false)} className="text-sm text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">Cancelar</button>
              <button onClick={handleSave} disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60 border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}>
                {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : editandoId ? "Salvar Edição" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUSÃO */}
      {confirmDelete && (
        <ConfirmModal
          nome={confirmDelete.nome}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}