import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHome, FaUsers, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { logout, getUsuarioLogado } from '../../Service/Service';

export const LeftBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioLogado = getUsuarioLogado();
  const user = usuarioLogado
    ? { name: usuarioLogado.nome ?? usuarioLogado.usuario, role: 'Admin', avatarUrl: usuarioLogado.foto ?? '' }
    : null;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();           // limpa token e usuario do localStorage
    navigate('/login'); // redireciona para o login
  };

  return (
    <div className={`h-screen bg-[#012b2c] flex flex-col p-5 relative transition-all duration-300 box-border shrink-0 ${
      isCollapsed ? 'w-20' : 'w-[260px]'
    }`}>

      {/* Botão colapsar */}
      <button
        className="absolute top-[25px] right-[-15px] w-7 h-7 bg-[#008b94] border-none rounded-full text-white flex items-center justify-center cursor-pointer shadow-md z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`bg-white rounded-xl p-3 flex items-center gap-3 mb-6 overflow-hidden ${isCollapsed ? 'justify-center py-3 px-0' : ''}`}>
        <div className="flex items-center justify-center w-11 h-11 shrink-0">
          <img src="/logoa.png" alt="Logo PeopleCore" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <div className="leading-tight">
            <h3 className="m-0 text-[#012b2c] font-bold text-base">PeopleCore</h3>
            <p className="m-0 text-[#7f8c8d] text-xs">Gestão de Pessoas</p>
          </div>
        )}
      </div>

      {/* Home */}
      <div className="mb-7">
        <button
          className={`w-full bg-[#008b94] border-none rounded-xl p-3.5 text-white flex items-center gap-4 text-base font-bold cursor-pointer shadow-lg transition-transform active:scale-[0.98] ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => navigate('/funcionarios')}
        >
          <FaHome className="text-lg shrink-0" />
          {!isCollapsed && <span>Home</span>}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed
          ? <p className="text-[#00bac7] text-xs font-bold ml-1 mb-4 tracking-wider">GESTÃO DE PESSOAS</p>
          : <hr className="border-0 border-t border-white/10 my-4" />
        }

        <div className="flex flex-col gap-2">
          {[
            { path: '/funcionarios', icon: <FaUsers className="text-lg shrink-0" />, label: 'Funcionários' },
            { path: '/departamentos', icon: <FaBuilding className="text-lg shrink-0" />, label: 'Departamentos' },
          ].map(({ path, icon, label }) => (
            <div
              key={path}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                isActive(path) ? 'bg-white/10 text-white' : 'text-[#9cb1b2] hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => navigate(path)}
            >
              {icon}
              {!isCollapsed && <span className="font-medium">{label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Usuário + Logout */}
      <div className="mt-auto">
        {user ? (
          <div className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2.5 ${
            isCollapsed ? 'justify-center p-2 bg-transparent border-none' : ''
          }`}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#00bac7] shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#008b94] flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-[#00bac7]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-white text-sm font-bold truncate">{user.name}</span>
                  <span className="text-[#9cb1b2] text-[11px]">{user.role}</span>
                </div>
                <button
                  className="text-[#9cb1b2] hover:text-red-400 cursor-pointer p-1 flex items-center justify-center transition-colors bg-transparent border-none"
                  onClick={handleLogout}
                  title="Sair"
                >
                  <FaSignOutAlt />
                </button>
              </>
            )}
            {isCollapsed && (
              <button
                className="text-[#9cb1b2] hover:text-red-400 cursor-pointer flex items-center justify-center transition-colors bg-transparent border-none mt-2"
                onClick={handleLogout}
                title="Sair"
              >
                <FaSignOutAlt />
              </button>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-white/[0.02]">
            <span className="text-[#9cb1b2] text-sm">{isCollapsed ? '🔒' : 'Aguardando login...'}</span>
          </div>
        )}
      </div>

    </div>
  );
};