type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    // Fundo escuro fixo ocupando toda a tela (Overlay)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      {/* Container do Modal */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✖
        </button>
        
        {/* Conteúdo dinâmico */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  )
}