import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import type { Note, Notebook } from './shared/types'

function App() {
  // Estado para los cuadernos
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    { id: 'default', name: 'Mi Cuaderno', createdAt: new Date().toISOString() }
  ])
  const [activeNotebookId, setActiveNotebookId] = useState<string>('default')
  
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  const handleCreateNote = () => {
    // Implementación pendiente
    console.log("Crear nota")
  }

  // Filtramos las notas que pertenecen al cuaderno activo
  const activeNotes = notes.filter(note => note.notebookId === activeNotebookId)

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white overflow-hidden">
      <Sidebar 
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onSelectNotebook={setActiveNotebookId}
        onCreateNotebook={() => console.log('Crear cuaderno')}
        notes={activeNotes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
      />

      <main className="flex-1 flex flex-col relative h-full">
        <div className="flex-1 flex items-center justify-center text-gray-500">
          {/* Placeholder temporal */}
          Selecciona una nota
        </div>
      </main>
    </div>
  )
}

export default App
