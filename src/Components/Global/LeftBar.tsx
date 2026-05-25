import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft,FaChevronRight,FaHome,FaUsers,FaBuilding,FaSignOutAlt
} from 'react-icons/fa';

interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}
export const LeftBar: React.FC = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<UserProfile | null>({
    name: "Tais Duarte",
    role: "Admin",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  });

  const toggleLeftbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className={`h-screen bg-[#012b2c] flex flex-col p-5 relative transition-all duration-300 box-border ${
      isCollapsed ? 'w-20' : 'w-[260px]'
    }`}>
      
      <button 
        className="absolute top-[25px] right-[-15px] w-7 h-7 bg-[#008b94] border-none rounded-full text-white flex items-center justify-center cursor-pointer shadow-md z-10"
        onClick={toggleLeftbar}
      >
        {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>

      <div className={`bg-white rounded-xl p-3 flex items-center gap-3 mb-6 overflow-hidden ${
        isCollapsed ? 'justify-center py-3 px-0' : ''
      }`}>
        <div className="flex items-center justify-center w-11 h-11 shrink-0">
          <img 
            src="/logo.png" 
            alt="Logo PeopleCore" 
            className="w-full h-full object-contain" 
          />
        </div>
        {!isCollapsed && (
          <div className="leading-tight">
            <h3 className="m-0 text-[#012b2c] font-bold text-base">PeopleCore</h3>
            <p className="m-0 text-[#7f8c8d] text-xs">Gestão de Pessoas</p>
          </div>
        )}
      </div>

      <div className="mb-7">
        <button 
          className="w-full bg-[#008b94] border-none rounded-xl p-3.5 text-white flex items-center gap-4 text-base font-bold cursor-pointer shadow-lg transition-transform active:scale-[0.98]"
          onClick={() => navigate('/dashboard')}
        >
          <FaHome className="text-lg" />
          {!isCollapsed && <span>Home</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isCollapsed ? (
          <p className="text-[#00bac7] text-xs font-bold ml-1 mb-4 tracking-wider">GESTÃO DE PESSOAS</p>
        ) : (
          <hr className="border-0 border-t border-white/10 my-4" />
        )}

        <div className="flex flex-col gap-2">
          
          <div 
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm group ${
              isActive('/funcionarios') ? 'bg-white/10 text-white' : 'text-[#9cb1b2] hover:bg-white/5 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
            onClick={() => navigate('/funcionarios')}
          >
            <FaUsers className={`text-lg transition-colors group-hover:text-white ${
              isActive('/funcionarios') ? 'text-white' : 'text-[#9cb1b2]'
            }`} />
            {!isCollapsed && <span className="font-medium">Funcionários</span>}
          </div>

          <div 
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm group ${
              isActive('/departamentos') ? 'bg-white/10 text-white' : 'text-[#9cb1b2] hover:bg-white/5 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
            onClick={() => navigate('/departamentos')}
          >
            <FaBuilding className={`text-lg transition-colors group-hover:text-white ${
              isActive('/departamentos') ? 'text-white' : 'text-[#9cb1b2]'
            }`} />
            {!isCollapsed && <span className="font-medium">Departamentos</span>}
          </div>

        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        {user ? (
          <div className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2.5 mb-1 ${
            isCollapsed ? 'justify-center p-0 bg-transparent border-none' : ''
          }`}>
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#00bac7]" 
            />
            {!isCollapsed && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-white text-sm font-bold truncate">{user.name}</span>
                <span className="text-[#9cb1b2] text-[11px]">{user.role}</span>
              </div>
            )}
            {!isCollapsed && (
              <button 
                className="bg-none border-none text-[#9cb1b2] hover:text-red-400 cursor-pointer p-1 flex items-center justify-center transition-colors" 
                onClick={handleLogout} 
                title="Sair"
              >
                <FaSignOutAlt />
              </button>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-white/[0.02]">
            <span className="text-[#9cb1b2] text-sm">
              {isCollapsed ? "🔒" : "Aguardando login..."}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};