import type { Note, Notebook } from '@/shared/types'
import { NoteList } from './components/NoteList'
import { NoteBookList } from './components/NoteBookList'

interface SidebarProps {
	notebooks: Notebook[]
	activeNotebookId: string
	onSelectNotebook: (id: string) => void
	onCreateNotebook: () => void

	notes: Note[]
	activeNoteId: string | null
	onSelectNote: (id: string) => void
	onCreateNote: () => void
}

export function Sidebar({
	notebooks,
	activeNotebookId,
	onSelectNotebook,
	onCreateNotebook,
	notes,
	activeNoteId,
	onSelectNote,
	onCreateNote
}: SidebarProps) {
	return (
		<aside className="w-64 border-r border-gray-700 bg-[#252526] flex flex-col h-full">
			<NoteBookList
				notebooks={notebooks}
				activeNotebookId={activeNotebookId}
				onSelectNotebook={onSelectNotebook}
				onCreateNotebook={onCreateNotebook}
			/>

			<NoteList 
				notes={notes}
				activeNoteId={activeNoteId}
				onSelectNote={onSelectNote}
				onCreateNote={onCreateNote}
			/>
		</aside>
	)
}
