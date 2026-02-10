import type { Note } from '@/shared/types'

interface NoteListProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: () => void
}

export function NoteList({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onCreateNote 
}: NoteListProps) {
  return (
    <>
      <div className="p-4 py-2 flex justify-between items-center border-b border-gray-700 bg-[#2d2d2d]">
        <span className="text-sm font-semibold text-gray-300">Notas</span>
        <button 
          onClick={onCreateNote}
          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Nueva
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-xs italic">
            Este cuaderno está vacío
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                p-3 cursor-pointer border-b border-gray-700 hover:bg-[#2a2d2e] transition-colors
                ${activeNoteId === note.id ? 'bg-[#37373d] border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}
              `}
            >
              <div className="font-medium truncate text-gray-200 text-sm">{note.title}</div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
