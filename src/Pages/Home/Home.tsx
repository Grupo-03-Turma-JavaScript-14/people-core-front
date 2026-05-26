import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Building2, Bell, Search, ChevronRight,
  Briefcase, TrendingUp, TrendingDown, Minus,
  Award, Zap, X, BarChart3, ArrowUpRight,
} from "lucide-react";
import { getUsuarioLogado, listarFuncionarios, listarDepartamentos } from "../../Service/Service";
import type { Funcionario, Departamento } from "../../Service/Types";

const atividades = [
  { tag: "Novo",   tagColor: "#14B8A6", bg: "#f0fdfa", texto: "João Santos adicionado em Tecnologia",     tempo: "2h atrás" },
  { tag: "Férias", tagColor: "#F59E0B", bg: "#fffbeb", texto: "Férias de Ana Paula aprovadas para Junho", tempo: "5h atrás" },
  { tag: "Folha",  tagColor: "#3B82F6", bg: "#eff6ff", texto: "Folha de pagamento processada com sucesso", tempo: "1 dia" },
  { tag: "Dados",  tagColor: "#8B5CF6", bg: "#f5f3ff", texto: "Cadastro de Maria Oliveira atualizado",    tempo: "2 dias" },
];

const notificacoes = [
  { titulo: "Férias aguardando análise", descricao: "7 solicitações precisam de acompanhamento.", tempo: "Hoje" },
  { titulo: "Cadastro atualizado",       descricao: "Maria Oliveira teve dados revisados pelo RH.", tempo: "2h" },
  { titulo: "Folha processada",          descricao: "Processamento mensal concluído com sucesso.", tempo: "1d" },
];

const DEPT_COLORS = ["#14B8A6", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#10B981"];

type Trend = "up" | "down" | "neutral";

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up")   return <TrendingUp size={10} />;
  if (trend === "down") return <TrendingDown size={10} />;
  return <Minus size={10} />;
}

function saudacaoAtual() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function getInitials(nome: string) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export default function Home() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const primeiroNome = usuario?.nome?.trim().split(" ")[0] ?? "usuário";

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifAberto, setNotifAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaResultados, setBuscaResultados] = useState<Funcionario[]>([]);

  useEffect(() => {
    Promise.all([listarFuncionarios(), listarDepartamentos()])
      .then(([funcs, depts]) => { setFuncionarios(funcs); setDepartamentos(depts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!busca.trim()) { setBuscaResultados([]); return; }
    const q = busca.toLowerCase();
    setBuscaResultados(
      funcionarios.filter(f =>
        f.nome.toLowerCase().includes(q) || f.cargo?.toLowerCase().includes(q)
      ).slice(0, 5)
    );
  }, [busca, funcionarios]);

  const cargosUnicos = new Set(funcionarios.map(f => f.cargo?.trim()).filter(Boolean)).size;

  const distDept: Record<string, number> = {};
  funcionarios.forEach(f => {
    const nome = f.categoria?.departamento ?? "Outros";
    distDept[nome] = (distDept[nome] || 0) + 1;
  });
  const totalFuncs = funcionarios.length || 1;
  const deptList = Object.entries(distDept).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topDepts = deptList.slice(0, 3);
  const recentes = funcionarios.slice(-4).reverse();

  const metricas: {
    label: string; valor: string | number; delta: string; trend: Trend;
    icon: JSX.Element; grad: string; lightBg: string; lightColor: string;
    onClick?: () => void; desc: string;
  }[] = [
    {
      label: "Funcionários",
      valor: loading ? "—" : funcionarios.length,
      delta: "+8%", trend: "up",
      icon: <Users size={18} />,
      grad: "linear-gradient(135deg,#14B8A6,#0D9488)",
      lightBg: "#f0fdfa", lightColor: "#0F766E",
      onClick: () => navigate("/funcionarios"),
      desc: "vs mês anterior",
    },
    {
      label: "Departamentos",
      valor: loading ? "—" : departamentos.length,
      delta: "—", trend: "neutral",
      icon: <Building2 size={18} />,
      grad: "linear-gradient(135deg,#6366F1,#4338CA)",
      lightBg: "#eef2ff", lightColor: "#4338CA",
      onClick: () => navigate("/departamentos"),
      desc: "sem alterações",
    },
    {
      label: "Cargos únicos",
      valor: loading ? "—" : cargosUnicos,
      delta: "+2", trend: "up",
      icon: <Briefcase size={18} />,
      grad: "linear-gradient(135deg,#F59E0B,#D97706)",
      lightBg: "#fffbeb", lightColor: "#B45309",
      desc: "diferentes funções",
    },
    {
      label: "Média salarial",
      valor: loading ? "—" : funcionarios.length
        ? `R$${Math.round(funcionarios.reduce((s, f) => s + (f.salarioBase || 0), 0) / funcionarios.length).toLocaleString("pt-BR")}`
        : "—",
      delta: "+3%", trend: "up",
      icon: <BarChart3 size={18} />,
      grad: "linear-gradient(135deg,#EC4899,#BE185D)",
      lightBg: "#fdf2f8", lightColor: "#9D174D",
      desc: "vs mês anterior",
    },
  ];

  return (
    <div className="min-h-full w-full" style={{ background: "#F8FAFC" }}>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 pb-10">

        {/* ── TOPBAR ── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}>
              {primeiroNome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                {saudacaoAtual()}, {primeiroNome}! 👋
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Busca */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text" value={busca} onChange={e => setBusca(e.target.value)}
                placeholder="Buscar funcionário..."
                className="pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all w-44 sm:w-56"
              />
              <AnimatePresence>
                {buscaResultados.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute top-11 left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    {buscaResultados.map(f => (
                      <div key={f.id}
                        onClick={() => { navigate("/funcionarios"); setBusca(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg,#14B8A6,#0F766E)" }}>
                          {getInitials(f.nome)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{f.nome}</p>
                          <p className="text-xs text-slate-400 truncate">{f.cargo} · {f.categoria?.departamento}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-300 shrink-0" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotifAberto(v => !v)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all cursor-pointer relative"
              >
                <Bell size={17} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {notificacoes.length}
                </span>
              </button>
              <AnimatePresence>
                {notifAberto && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-sm">Notificações</span>
                      <button onClick={() => setNotifAberto(false)} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
                        <X size={15} />
                      </button>
                    </div>
                    {notificacoes.map(n => (
                      <div key={n.titulo} className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{n.titulo}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.descricao}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{n.tempo}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── MÉTRICAS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {metricas.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              onClick={m.onClick}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${m.onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""}`}
            >
              <div className="h-1" style={{ background: m.grad }} />
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: m.grad }}>
                    {m.icon}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: m.lightBg, color: m.lightColor }}>
                    <TrendIcon trend={m.trend} />
                    {m.delta}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-800 leading-none tracking-tight">{m.valor}</p>
                <p className="text-xs text-slate-400 mt-1.5 leading-tight">{m.label}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: m.lightColor }}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── LINHA CENTRAL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Atividades recentes */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-[#14B8A6]" />
                <h2 className="font-bold text-slate-800 text-sm">Atividades Recentes</h2>
              </div>
              <button className="text-xs font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer" style={{ color: "#14B8A6" }}>
                Ver todas <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {atividades.map((a, i) => (
                <motion.div
                  key={a.texto}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                >
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: a.bg, color: a.tagColor }}>
                    {a.tag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{a.texto}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{a.tempo}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Departamentos */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Award size={15} className="text-[#6366F1]" />
                <h2 className="font-bold text-slate-800 text-sm">Top Departamentos</h2>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {loading ? (
                <p className="text-sm text-slate-400 text-center py-6">Carregando...</p>
              ) : topDepts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Nenhum dado.</p>
              ) : (
                topDepts.map(([nome, qtd], i) => {
                  const pct = Math.round((qtd / totalFuncs) * 100);
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={nome}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base leading-none">{medals[i]}</span>
                        <span className="font-semibold text-slate-700 text-sm flex-1 truncate">{nome}</span>
                        <span className="text-xs font-bold" style={{ color: DEPT_COLORS[i] }}>{qtd} pessoas</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: DEPT_COLORS[i] }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: "easeOut" }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 text-right">{pct}%</p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* ── LINHA INFERIOR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Funcionários recentes */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-[#14B8A6]" />
                <h2 className="font-bold text-slate-800 text-sm">Funcionários Recentes</h2>
              </div>
              <button onClick={() => navigate("/funcionarios")}
                className="text-xs font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                style={{ color: "#14B8A6" }}>
                Ver todos <ChevronRight size={12} />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10 text-slate-400 text-sm">Carregando...</div>
            ) : recentes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <Users size={28} className="opacity-30" />
                <p className="text-sm">Nenhum funcionário cadastrado.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentes.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ background: `linear-gradient(135deg,${DEPT_COLORS[i % DEPT_COLORS.length]},${DEPT_COLORS[(i + 1) % DEPT_COLORS.length]})` }}>
                      {getInitials(f.nome)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{f.nome}</p>
                      <p className="text-xs text-slate-400 truncate">{f.cargo ?? "—"} · {f.categoria?.departamento ?? "—"}</p>
                    </div>
                    {f.salarioBase ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#f0fdfa", color: "#0F766E" }}>
                        R${f.salarioBase.toLocaleString("pt-BR")}
                      </span>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Por Departamento */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-[#6366F1]" />
                <h2 className="font-bold text-slate-800 text-sm">Por Departamento</h2>
              </div>
              <button onClick={() => navigate("/departamentos")}
                className="text-xs font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer"
                style={{ color: "#14B8A6" }}>
                Ver <ChevronRight size={12} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-400 text-center py-6">Carregando...</p>
              ) : deptList.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Nenhum dado.</p>
              ) : (
                deptList.map(([nome, qtd], i) => {
                  const pct = Math.round((qtd / totalFuncs) * 100);
                  return (
                    <div key={nome} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-600 truncate">{nome}</span>
                          <span className="text-xs text-slate-400 ml-2 shrink-0">{qtd}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full"
                            style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }}
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "easeOut" }} />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: DEPT_COLORS[i % DEPT_COLORS.length] }}>{pct}%</span>
                    </div>
                  );
                })
              )}
            </div>
            {!loading && funcionarios.length > 0 && (
              <div className="mx-5 mb-5 p-3 rounded-xl flex items-center justify-between" style={{ background: "#f0fdfa" }}>
                <div className="text-center flex-1">
                  <p className="text-lg font-black text-[#0F766E]">{funcionarios.length}</p>
                  <p className="text-[10px] text-[#14B8A6] font-medium">Total</p>
                </div>
                <div className="w-px h-8 bg-teal-200" />
                <div className="text-center flex-1">
                  <p className="text-lg font-black text-[#0F766E]">{departamentos.length}</p>
                  <p className="text-[10px] text-[#14B8A6] font-medium">Depts</p>
                </div>
                <div className="w-px h-8 bg-teal-200" />
                <div className="text-center flex-1">
                  <p className="text-lg font-black text-[#0F766E]">{cargosUnicos}</p>
                  <p className="text-[10px] text-[#14B8A6] font-medium">Cargos</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}