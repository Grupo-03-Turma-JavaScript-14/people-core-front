
import "../../Style/Css/Components/Modal.css"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ float: "right" }}>
          ✖
        </button>

        {children}
      </div>
    </div>
  )
}