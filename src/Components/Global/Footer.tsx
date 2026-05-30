import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa'

export const Footer: React.FC = () => {

  function emBreve() {
    toast.info('Esta funcionalidade estará disponível em breve 🚀')
  }

  return (
    <footer className="w-full bg-[#012b2c] border-t border-white/5 px-6 py-3 relative select-none">

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">

        <div className="flex items-center gap-5 text-[#b7c7c8]">

          <div className="flex items-center gap-3 text-sm">

            <button
              type="button"
              onClick={emBreve}
              aria-label="LinkedIn"
              className="hover:text-[#00bac7] transition-colors bg-transparent border-none cursor-pointer"
            >
              <FaLinkedin />
            </button>

            <button
              type="button"
              onClick={emBreve}
              aria-label="Instagram"
              className="hover:text-[#00bac7] transition-colors bg-transparent border-none cursor-pointer"
            >
              <FaInstagram />
            </button>

            <button
              type="button"
              onClick={emBreve}
              aria-label="YouTube"
              className="hover:text-[#00bac7] transition-colors bg-transparent border-none cursor-pointer"
            >
              <FaYoutube />
            </button>

          </div>

          <div className="w-px h-3 bg-white/10"></div>

          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wide font-medium">

            <Link
              to="/sobre"
              className="hover:text-white transition-colors"
            >
              Sobre Nós
            </Link>

            <button
              type="button"
              onClick={emBreve}
              className="hover:text-white transition-colors bg-transparent border-none text-[11px] uppercase tracking-wide font-medium text-[#b7c7c8] cursor-pointer"
            >
              Central de Ajuda
            </button>

            <button
              type="button"
              onClick={emBreve}
              className="hover:text-white transition-colors bg-transparent border-none text-[11px] uppercase tracking-wide font-medium text-[#b7c7c8] cursor-pointer"
            >
              Contato
            </button>

          </div>

        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#7f9495]">

          <span>
            © 2026 PeopleCore
          </span>

          <span>•</span>

          <button
            type="button"
            onClick={emBreve}
            className="hover:text-white transition-colors bg-transparent border-none text-[10px] text-[#7f9495] cursor-pointer"
          >
            Termos
          </button>

          <span>•</span>

          <button
            type="button"
            onClick={emBreve}
            className="hover:text-white transition-colors bg-transparent border-none text-[10px] text-[#7f9495] cursor-pointer"
          >
            Privacidade
          </button>

        </div>

      </div>

      <div className="absolute right-6 bottom-3 hidden md:flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">

        <img
          src="/logo.png"
          alt="PeopleCore Logo"
          className="w-5 h-5 object-contain"
        />

        <span className="text-[11px] font-bold tracking-tight text-white">
          People<span className="text-[#00bac7]">Core</span>
        </span>

      </div>

    </footer>
  )
}