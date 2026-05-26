import { useState, useEffect } from "react";
import {
  listarFuncionarios,
  listarDepartamentos,
  cadastrarFuncionario,
  atualizarFuncionario,
  deletarFuncionario,
} from "../../Service/Service";
import type { Funcionario, Departamento } from "../../Service/Types";

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(0);
  const [salarioBase, setSalarioBase] = useState(0);

  const [errors, setErrors] = useState({ nome: "", cargo: "", categoriaId: "", horasTrabalhadas: "", salarioBase: "" });

  useEffect(() => {
    Promise.all([listarFuncionarios(), listarDepartamentos()]).then(([funcs, depts]) => {
      setFuncionarios(funcs);
      setDepartamentos(depts);
      setLoading(false);
    });
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

  const handleDelete = (id: number, nome: string) => {
    if (window.confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) {
      deletarFuncionario(id).then(() =>
        setFuncionarios(prev => prev.filter(f => f.id !== id))
      );
    }
  };

  const validateForm = (): boolean => {
    const e = { nome: "", cargo: "", categoriaId: "", horasTrabalhadas: "", salarioBase: "" };
    let ok = true;
    if (!nome.trim()) { e.nome = "Nome é obrigatório"; ok = false; }
    if (!cargo.trim()) { e.cargo = "Cargo é obrigatório"; ok = false; }
    if (!categoriaId) { e.categoriaId = "Selecione um departamento"; ok = false; }
    if (horasTrabalhadas <= 0) { e.horasTrabalhadas = "Deve ser maior que zero"; ok = false; }
    if (salarioBase <= 0) { e.salarioBase = "Deve ser maior que zero"; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const dados = { nome, cargo, horasTrabalhadas, salarioBase, categoria: { id: Number(categoriaId), departamento: "" } };
    try {
      if (editandoId !== null) await atualizarFuncionario(editandoId, dados);
      else await cadastrarFuncionario(dados);
      const atualizados = await listarFuncionarios();
      setFuncionarios(atualizados);
      setModalOpen(false);
      resetForm();
    } catch {
      alert("Erro ao salvar funcionário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtrados = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const inputCls = (err: string) =>
    `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all bg-slate-50 ${
      err ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20"
    }`;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Funcionários</h1>
          <p className="text-slate-400 text-sm mt-0.5">{funcionarios.length} colaboradores cadastrados</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #14B8A6, #0F766E)' }}
        >
          <span className="text-lg leading-none">+</span> Novo Funcionário
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all shadow-sm"
        />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
            <span className="animate-spin text-[#14B8A6]">⟳</span> Carregando...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100" style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)' }}>
                {["Nome", "Cargo", "Departamento", "Horas Trab.", "Salário Base", "Salário Total", "Ações"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((func, i) => (
                <tr
                  key={func.id}
                  className={`border-b border-slate-50 hover:bg-teal-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: 'linear-gradient(135deg, #14B8A6, #0F766E)' }}>
                        {func.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{func.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{func.cargo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: '#ccfbf1', color: '#0F766E' }}>
                      {func.categoria?.departamento ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{func.horasTrabalhadas}h</td>
                  <td className="px-5 py-3.5 text-slate-600">R$ {Number(func.salarioBase).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: '#0F766E' }}>
                    R$ {Number(func.salarioTotal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(func)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => func.id && handleDelete(func.id, func.nome)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 transition-all"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    {busca ? `Nenhum resultado para "${busca}"` : "Nenhum funcionário cadastrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* RODAPÉ DA TABELA */}
      {filtrados.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 text-right">
          Exibindo {filtrados.length} de {funcionarios.length} funcionários
        </p>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>

            {/* Header modal */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{editandoId ? "Editar Funcionário" : "Novo Funcionário"}</h2>
                <p className="text-slate-400 text-xs mt-0.5">Preencha os dados abaixo</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Nome completo *</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" className={inputCls(errors.nome)} />
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>

              {/* Cargo */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Cargo *</label>
                <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Desenvolvedor" className={inputCls(errors.cargo)} />
                {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
              </div>

              {/* Departamento */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Departamento *</label>
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className={inputCls(errors.categoriaId)}>
                  <option value="">Selecione um departamento</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.departamento}</option>)}
                </select>
                {errors.categoriaId && <p className="text-xs text-red-500 mt-1">{errors.categoriaId}</p>}
              </div>

              {/* Horas + Salário lado a lado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Horas Trab. *</label>
                  <input type="number" value={horasTrabalhadas} onChange={e => setHorasTrabalhadas(Number(e.target.value))} min={0} className={inputCls(errors.horasTrabalhadas)} />
                  {errors.horasTrabalhadas && <p className="text-xs text-red-500 mt-1">{errors.horasTrabalhadas}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Salário Base *</label>
                  <input type="number" value={salarioBase} onChange={e => setSalarioBase(Number(e.target.value))} min={0} className={inputCls(errors.salarioBase)} />
                  {errors.salarioBase && <p className="text-xs text-red-500 mt-1">{errors.salarioBase}</p>}
                </div>
              </div>
            </div>

            {/* Botões modal */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setModalOpen(false)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-7 py-2.5 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #14B8A6, #0F766E)' }}
              >
                {isSubmitting ? "Salvando..." : editandoId ? "Salvar Edição" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}