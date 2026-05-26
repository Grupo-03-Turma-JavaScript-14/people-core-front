import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Heart,
  Lightbulb,
  Award,
  Users,
  Building2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import {
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const equipe = [
  {
    nome: "Bianca Nascimento",
    cargo: "Desenvolvedora Front-End",
    inicial: "B",
    foto: "/bianca.jpg",
  },
  {
    nome: "Jhonatan Alves",
    cargo: "Desenvolvedor Back-End",
    inicial: "J",
    foto: "/Jhonatan_4.jpg",
  },
  {
    nome: "Kauã Moraes",
    cargo: "Desenvolvedor Full Stack",
    inicial: "K",
    foto: "/kaua.jpg",
  },
  {
    nome: "Kefilwe Lourenço",
    cargo: "Desenvolvedor Full Stack",
    inicial: "K",
    foto: "/kf.jpg",
  },
  {
    nome: "Letícia Fonseca",
    cargo: "Desenvolvedora QA",
    inicial: "L",
    foto: "/leticia.png",
  },
  {
    nome: "Taís Bernardi",
    cargo: "Desenvolvedora QA",
    inicial: "T",
    foto: "/tais.png",
  },
  {
    nome: "Victor Silva",
    cargo: "Desenvolvedor Full Stack",
    inicial: "V",
    foto: "/victor.jpg",
  },
].sort((a, b) => a.nome.localeCompare(b.nome));

const valores = [
  {
    icon: <Shield size={20} />,
    titulo: "Segurança",
    desc: "Proteção de dados com os mais altos padrões digitais.",
  },
  {
    icon: <Heart size={20} />,
    titulo: "Pessoas",
    desc: "Gestão humanizada como base do sucesso.",
  },
  {
    icon: <Lightbulb size={20} />,
    titulo: "Inovação",
    desc: "Plataforma em evolução constante para o seu RH.",
  },
  {
    icon: <Award size={20} />,
    titulo: "Transparência",
    desc: "Relações claras do contrato ao suporte diário.",
  },
];

const stats = [
  {
    valor: "+500",
    label: "Colaboradores",
    icon: <Users size={16} />,
  },
  {
    valor: "+30",
    label: "Empresas",
    icon: <Building2 size={16} />,
  },
  {
    valor: "98%",
    label: "Satisfação",
    icon: <Heart size={16} />,
  },
  {
    valor: "3 anos",
    label: "Experiência",
    icon: <Award size={16} />,
  },
];

const redes = [
  {
    icon: <FaLinkedin size={15} />,
    nome: "LinkedIn",
    href: "https://linkedin.com",
    cor: "#0A66C2",
  },
  {
    icon: <FaInstagram size={15} />,
    nome: "Instagram",
    href: "https://instagram.com",
    cor: "#E1306C",
  },
  {
    icon: <FaYoutube size={15} />,
    nome: "YouTube",
    href: "https://youtube.com",
    cor: "#FF0000",
  },
  {
    icon: <FaWhatsapp size={15} />,
    nome: "WhatsApp",
    href: "https://wa.me/5511938472210",
    cor: "#25D366",
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.55,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

export default function SobreNos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f0f4f5]">

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4"
        style={{
          background: "rgba(1,43,44,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,186,199,0.12)",
        }}
      >
        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Voltar</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PeopleCore"
              className="w-8 h-8 object-contain"
            />

            <span className="text-white font-black text-lg tracking-tight">
              People<span className="text-[#00bac7]">Core</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border-none text-white/70 hover:text-white bg-transparent"
          >
            Entrar
          </button>

          <button
            onClick={() => navigate("/cadastro")}
            className="text-sm font-bold px-5 py-2 rounded-xl text-white cursor-pointer border-none transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#00bac7,#0a7a80)",
            }}
          >
            Cadastrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Imag.png')" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(1,43,44,0.93) 0%, rgba(0,100,110,0.78) 55%, rgba(1,43,44,0.88) 100%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,186,199,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,186,199,1) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-24 flex flex-col lg:flex-row items-center gap-16">

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-7"
              style={{
                background: "rgba(0,186,199,0.15)",
                border: "1px solid rgba(0,186,199,0.35)",
                color: "#00bac7",
              }}
            >
              Sobre nós
            </span>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              Gestão de pessoas
              <br />
              <span className="text-[#00bac7]">
                mais simples,
              </span>
              <br />
              organizada e inteligente.
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-md mb-8">
              O PeopleCore centraliza colaboradores, departamentos,
              salários e indicadores para reduzir burocracias e
              apoiar decisões melhores no RH.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                "Menos planilhas e retrabalho manual",
                "Dados de RH reunidos em um só lugar",
                "Mais clareza para gestores e colaboradores",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-200 text-sm"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg,#00bac7,#0a7a80)",
                    }}
                  >
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={() => navigate("/cadastro")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm cursor-pointer border-none hover:scale-105 transition-transform"
                style={{
                  background:
                    "linear-gradient(135deg,#00bac7,#0a7a80)",
                  boxShadow:
                    "0 0 32px rgba(0,186,199,0.35)",
                }}
              >
                Começar agora
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-2xl font-semibold text-white text-sm cursor-pointer hover:bg-white/10 transition-all border-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border:
                    "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Já tenho conta
              </button>
            </div>
          </motion.div>

          {/* LOGO */}
          <motion.div
            className="shrink-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative w-64 h-64 flex items-center justify-center">

              <div
                className="absolute inset-0 rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, #00bac7, transparent 70%)",
                  animation:
                    "ping 3s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />

              <div
                className="absolute inset-6 rounded-full opacity-25 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, #00bac7, transparent)",
                }}
              />

              <div
                className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(0,186,199,0.28)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <img
                  src="/logo.png"
                  alt="PeopleCore"
                  className="w-28 h-28 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade(i * 0.07)}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white mb-3"
                style={{
                  background:
                    "linear-gradient(135deg,#00bac7,#0a7a80)",
                }}
              >
                {s.icon}
              </div>

              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {s.valor}
              </p>

              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">

        <motion.div className="mb-12" {...fade(0)}>
          <span
            className="text-[11px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: "#e0f7f8",
              color: "#0a7a80",
            }}
          >
            Nossos valores
          </span>

          <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
            O que nos guia
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {valores.map((v, i) => (
            <motion.div
              key={v.titulo}
              {...fade(i * 0.08)}
              className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform"
                style={{
                  background:
                    "linear-gradient(135deg,#00bac7,#0a7a80)",
                }}
              >
                {v.icon}
              </div>

              <h3 className="font-black text-slate-900 text-base mb-2">
                {v.titulo}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="py-20 px-6 bg-[#012b2c]">

        <div className="max-w-6xl mx-auto">

          <motion.div className="mb-12" {...fade(0)}>
            <span
              className="text-[11px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,186,199,0.15)",
                color: "#00bac7",
                border:
                  "1px solid rgba(0,186,199,0.2)",
              }}
            >
              Nossa equipe
            </span>

            <h2 className="text-4xl font-black text-white mt-4 tracking-tight">
              As pessoas por trás
              <br />
              do PeopleCore
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">

            {equipe.map((m, i) => (
              <motion.div
                key={m.nome}
                {...fade(i * 0.07)}
                className="w-[220px] group rounded-2xl p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
                style={{
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="relative mb-4 w-16 h-16">

                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl"
                    style={{
                      background:
                        "linear-gradient(135deg,#00bac7,#0a7a80)",
                    }}
                  >
                    {m.inicial}
                  </div>

                  <img
                    src={m.foto}
                    alt={m.nome}
                    className="w-16 h-16 rounded-full object-cover absolute inset-0"
                    style={{
                      border: "2px solid #00bac7",
                    }}
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).style.display = "none";
                    }}
                  />

                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400"
                    style={{
                      border: "2px solid #012b2c",
                    }}
                  />
                </div>

                <p className="font-bold text-white text-sm leading-tight">
                  {m.nome}
                </p>

                <p className="text-[11px] mt-1 font-semibold text-[#00bac7]">
                  {m.cargo}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section className="py-20 px-6 max-w-6xl mx-auto">

        <motion.div className="mb-12" {...fade(0)}>
          <span
            className="text-[11px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: "#e0f7f8",
              color: "#0a7a80",
            }}
          >
            Contato
          </span>

          <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Entre em contato
          </h2>

          <p className="text-slate-500 text-base mt-2">
            Estamos disponíveis para te ajudar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* INFORMAÇÕES */}
          <motion.div
            {...fade(0.1)}
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between"
          >
            <div>

              <h3 className="text-2xl font-black text-slate-900">
                PeopleCore Ltda.
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Plataforma inteligente para gestão de pessoas,
                departamentos, salários e indicadores de RH.
              </p>

              <div className="mt-10 space-y-6">

                <div className="flex items-start gap-4">
                  <Mail className="text-[#00bac7]" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      E-mail
                    </p>
                    <p className="text-slate-800 font-semibold">
                      contato@peoplecore.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-[#00bac7]" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Telefone
                    </p>
                    <p className="text-slate-800 font-semibold">
                      (11) 93847-2210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-[#00bac7]" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Endereço
                    </p>
                    <p className="text-slate-800 font-semibold">
                      Av. Paulista, 1000 — São Paulo, SP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REDES */}
            <div className="flex items-center gap-3 mt-10">

              {redes.map((r) => (
                <a
                  key={r.nome}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-transform hover:scale-105"
                  style={{
                    background: r.cor,
                  }}
                >
                  {r.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* MAPA */}
          <motion.div
            {...fade(0.15)}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm min-h-[420px]"
          >
            <iframe
              title="Localização PeopleCore"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6565!3d-23.5614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1716000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">

        <motion.div
          {...fade(0)}
          className="max-w-5xl mx-auto rounded-3xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background:
              "linear-gradient(135deg,#012b2c 0%,#014a4d 100%)",
            border:
              "1px solid rgba(0,186,199,0.15)",
          }}
        >
          <div>
            <h3 className="text-2xl font-black text-white">
              Pronto para transformar seu RH?
            </h3>

            <p className="text-slate-400 text-sm mt-1.5">
              Crie sua conta e comece hoje mesmo, é gratuito.
            </p>
          </div>

          <button
            onClick={() => navigate("/cadastro")}
            className="flex items-center gap-2 font-bold px-7 py-3.5 rounded-2xl text-white text-sm cursor-pointer border-none hover:scale-105 transition-transform whitespace-nowrap"
            style={{
              background:
                "linear-gradient(135deg,#00bac7,#0a7a80)",
              boxShadow:
                "0 0 30px rgba(0,186,199,0.3)",
            }}
          >
            Criar conta
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-5"
        style={{
          background: "#012b2c",
          borderTop:
            "1px solid rgba(0,186,199,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="PeopleCore"
              className="w-5 h-5 object-contain"
            />

            <span className="text-white font-black text-sm">
              People
              <span className="text-[#00bac7]">
                Core
              </span>
            </span>
          </div>

          <p className="text-slate-500 text-xs">
            © 2026 PeopleCore Tecnologia Ltda.
          </p>

          <div className="flex items-center gap-4">

            {redes.map((r) => (
              <a
                key={r.nome}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#00bac7] transition-colors"
              >
                {r.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}