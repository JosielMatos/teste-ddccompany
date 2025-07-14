interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative text-black">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ×
        </button>
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
