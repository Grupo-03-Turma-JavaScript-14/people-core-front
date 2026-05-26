import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#012b2c] border-t border-white/5 px-6 py-3 relative select-none">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">

        {/* Redes + links */}
        <div className="flex items-center gap-5 text-[#b7c7c8]">
          <div className="flex items-center gap-3 text-sm">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn" className="hover:text-[#00bac7] transition-colors">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              aria-label="Instagram" className="hover:text-[#00bac7] transition-colors">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              aria-label="YouTube" className="hover:text-[#00bac7] transition-colors">
              <FaYoutube />
            </a>
            <a href="https://wa.me/5511938472210" target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp" className="hover:text-[#00bac7] transition-colors">
              <FaWhatsapp />
            </a>
          </div>

          <div className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wide font-medium">
            <button
              onClick={() => navigate("/sobre")}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[#b7c7c8] text-[11px] uppercase tracking-wide font-medium p-0"
            >
              Sobre Nós
            </button>
            <button
              onClick={() => navigate("/sobre")}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[#b7c7c8] text-[11px] uppercase tracking-wide font-medium p-0"
            >
              Central de Ajuda
            </button>
            <button
              onClick={() => navigate("/sobre")}
              className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[#b7c7c8] text-[11px] uppercase tracking-wide font-medium p-0"
            >
              Contato
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#7f9495]">
          <span>© 2026 PeopleCore</span>
          <span>•</span>
          <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[10px] text-[#7f9495] p-0">
            Termos
          </button>
          <span>•</span>
          <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-[10px] text-[#7f9495] p-0">
            Privacidade
          </button>
        </div>
      </div>

      {/* Logo canto direito */}
      <div className="absolute right-6 bottom-3 hidden md:flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <img src="/logo.png" alt="PeopleCore Logo" className="w-5 h-5 object-contain" />
        <span className="text-[11px] font-bold tracking-tight text-white">
          People<span className="text-[#00bac7]">Core</span>
        </span>
      </div>
    </footer>
  );
};