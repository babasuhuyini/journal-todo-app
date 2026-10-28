import { XIcon } from './icons.jsx'

export default function Toast({ message, onUndo, onClose }) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {onUndo && (
        <button className="toast-action" onClick={onUndo}>
          Undo
        </button>
      )}
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <XIcon width={14} height={14} />
      </button>
    </div>
  )
}
