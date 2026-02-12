import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { type Note } from '@/shared/types';
import { ChevronLeft, ChevronRight, Plus, FileText } from 'lucide-react';
import { CreateDialog } from './components/CreateDialog';
import { NotesApiService } from '@/api/NotesApiService';
// Note: We need api to fetch notes specifically if not already in context.
// Assuming Context 'notebooks' might not have up-to-date notes if managed separately, 
// but currently getAllNotebooks returns everything. 
// For better scalability, let's filter from the already loaded context for now, functionality "use the methods"

interface SidebarTwoProps {
	isExpanded: boolean;
	onToggle: () => void;
}

export const SidebarTwo = ({ isExpanded, onToggle }: SidebarTwoProps) => {
	const { selectedNotebookId, notebooks, selectedNoteId, setSelectedNoteId, refreshNotebooks } = useAppContext();
	const [notes, setNotes] = useState<Note[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	useEffect(() => {
		if (selectedNotebookId) {
			// Find notebook in local state
			const nb = notebooks.find(n => n.id === selectedNotebookId);
			if (nb && nb.notebookNotes) {
				setNotes(nb.notebookNotes);
			} else {
				setNotes([]);
			}
		} else {
			setNotes([]);
		}
	}, [selectedNotebookId, notebooks]);
	const handleCreateNote = async (title: string) => {
		if (!selectedNotebookId) return;
		await NotesApiService.createNote({ 
			title, 
			content: {}, 
			notebookId: selectedNotebookId 
		});
		await refreshNotebooks(); // This should update the notes list via the effect
	};

	return (
		<div className="flex flex-col h-full bg-[#1e1e1e] relative">
			<CreateDialog
				isOpen={isCreateDialogOpen}
				onClose={() => setIsCreateDialogOpen(false)}
				onCreate={handleCreateNote}
				title="Create New Note"
				placeholder="My New Note"
			/>

			{/* Header */}
			<div className={`flex items-center h-12 border-b border-[#2d2d2d] ${isExpanded ? 'justify-between px-4' : 'justify-center'}`}>
				{isExpanded ? (
					<>
						<span className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
							{notes.length} Notes
						</span>
						<div className="flex items-center gap-1">
							{/* Create Note Action */}
							<button 
								onClick={() => setIsCreateDialogOpen(true)}
								className="p-1 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-[#d4d4d4]"
								disabled={!selectedNotebookId}
								title={selectedNotebookId ? "Create Note" : "Select a notebook first"}
							>
								<Plus size={14} />
							</button>
							{/* Collapse Button */}
							<button
								onClick={onToggle}
								className="p-1 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-[#d4d4d4]"
								title="Collapse"
							>
								<ChevronLeft size={14} />
							</button>
						</div>
					</>
				) : (
					<button
						onClick={onToggle}
						className="p-1.5 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-[#d4d4d4] transition-colors"
						title="Expand Notes"
					>
						<ChevronRight size={16} />
					</button>
				)}
			</div>

			{/* List */}
			<div className={`flex-1 overflow-y-auto ${!isExpanded && 'px-2'}`}>
				{notes.map(note => (
					<div
						key={note.id}
						className={`border-b border-[#2d2d2d] cursor-pointer transition-colors group ${isExpanded ? 'px-4 py-3' : 'py-3 flex justify-center'} ${selectedNoteId === note.id ? 'bg-[#37373d]' : 'hover:bg-[#2d2d2d]'}`}
						onClick={() => setSelectedNoteId(note.id)}
						title={!isExpanded ? note.title : ''}
					>
						{isExpanded ? (
							<>
								<h3 className={`text-sm font-medium truncate mb-1 group-hover:text-white ${selectedNoteId === note.id ? 'text-white' : 'text-[#e1e1e1]'}`}>
									{note.title}
								</h3>
								<div className="flex justify-between items-center text-xs">
									<span className={`${selectedNoteId === note.id ? 'text-[#a1a1a1]' : 'text-[#666]'} shrink-0`}>
										{new Date(note.createdAt).toLocaleDateString()}
									</span>
								</div>
							</>
						) : (
							<FileText size={18} className={`group-hover:text-white ${selectedNoteId === note.id ? 'text-white' : 'text-[#858585]'}`} />
						)}
					</div>
				))}
				{notes.length === 0 && (
					<div className={`text-[#555] text-center ${isExpanded ? 'p-8 text-xs' : 'pt-4'}`}>
						{isExpanded ? 'Empty' : ''}
					</div>
				)}
			</div>
		</div>
	);
};
