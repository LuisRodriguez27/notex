import { useState } from 'react'
import type { Notebook } from '../shared/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface NoteBookListProps {
  notebooks: Notebook[]
  activeNotebookId: string
  onSelectNotebook: (id: string) => void
  onCreateNotebook: () => void
}

export function NoteBookList({
  notebooks,
  activeNotebookId,
  onSelectNotebook,
  onCreateNotebook
}: NoteBookListProps) {
  const [isNotebooksOpen, setIsNotebooksOpen] = useState(true)

  return (
    <div className="p-2 border-b border-gray-700">
      <div className="text-xs font-bold text-gray-500 uppercase px-2 mb-2 flex justify-between items-center">
        <button
          onClick={() => setIsNotebooksOpen(!isNotebooksOpen)}
          className="cursor-pointer bg-transparent p-0 border-none outline-none hover:text-white transition-colors"
        >
          {isNotebooksOpen ? (
            <ChevronUp className="w-3 h-3 text-gray-200" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-200" />
          )}
        </button>
        <span>Cuadernos</span>
        <button onClick={onCreateNotebook} className="hover:text-white cursor-pointer">+</button>
      </div>
      {isNotebooksOpen && (
        <div className="space-y-1">
          {notebooks.map(nb => (
            <div
              key={nb.id}
              onClick={() => onSelectNotebook(nb.id)}
              className={`
                px-3 py-1.5 text-sm rounded cursor-pointer transition-colors
                ${activeNotebookId === nb.id ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2d2e]'}
              `}
            >
              {nb.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
