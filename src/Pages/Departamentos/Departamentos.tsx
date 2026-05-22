import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../Style/Css/Pages/Departamentos.css";
import {Pencil, Trash2, Plus, X, ChevronDown} from "lucide-react";

function Departamento() {
  const [expanded, setExpanded] = useState(false);
  const [showFuncionarios, setShowFuncionarios] = useState(false);

  const funcionarios = [
    { id: 1, nome: "João Silva", cargo: "Dev" },
    { id: 2, nome: "Maria Souza", cargo: "QA" },
    { id: 3, nome: "Carlos Lima", cargo: "DevOps" }
  ];

  return (
    <div className="page-container">

      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Departamentos</h1>
          <p>Gerencie as unidades e divisões da PeopleCore</p>
        </div>

        <button className="btn-primary">
          + Novo Departamento
        </button>
      </header>

      {/* CARD */}
      <div className={`dept-card ${expanded ? "expanded" : ""}`}>

        <div
          className="dept-card-header"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="header-main">
            <span className="dept-badge">#01</span>
            <h3 className="dept-title">Desenvolvimento</h3>
          </div>

          <button
                className="btn-expand"
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => !prev);
                }}
                >
                <ChevronDown size={18} />
            </button>
        </div>

        <div className="dept-card-expandable">
          <div className="expand-content-inner">

            <div className="description-section">
              <label>Sobre o Departamento</label>
              <p>
                Responsável pela manutenção da plataforma PeopleCore e inovação tecnológica.
              </p>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Funcionários</span>

                <button
                  className="funcionarios-dept"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFuncionarios(true);
                  }}
                >
                  Ver funcionários
                </button>
              </div>
            </div>

            <div className="crud-actions">
              <button className="btn-action edit">Editar</button>
              <button className="btn-action delete">Deletar</button>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          MODAL FUNCIONÁRIOS
      ========================= */}

      {showFuncionarios && (
        <div
          className="modal-overlay"
          onClick={() => setShowFuncionarios(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Funcionários</h2>
              <div className="modal-header-actions">
                 <TooltipButton
                  icon={<Plus size={18} />}
                  label="Adicionar funcionário"
                  onClick={() => console.log("novo")}
                />
                        <button
                            className="close-modal"
                    onClick={() => setShowFuncionarios(false)}
                    ><X size={18} /></button>
            </div>
            </div>

            <div className="modal-body">
              {funcionarios.map((f) => (
                <div key={f.id} className="employee-item">

                  <div className="employee-info">
                    <strong>{f.nome}</strong>
                    <span>{f.cargo}</span>
                  </div>

                  <div className="employee-actions">

                    <TooltipButton
                      label="Editar"
                      icon={<Pencil size={16} />}
                      onClick={() => console.log("editar", f.id)}
                    />

                    <TooltipButton
                      label="Excluir"
                      icon={<Trash2 size={16} />}
                      onClick={() => console.log("excluir", f.id)}
                    />

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================
   BOTÃO COM TOOLTIP ANIMADO
========================= */

function TooltipButton({icon, label, onClick}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="icon-wrapper"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button className="btn-icon" onClick={onClick}>
        {icon}
      </button>

      <AnimatePresence>
        {hover && (
          <motion.div
            className="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Departamento;