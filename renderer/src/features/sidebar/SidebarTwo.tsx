import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { type Note } from '@/shared/types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
// Note: We need api to fetch notes specifically if not already in context.
// Assuming Context 'notebooks' might not have up-to-date notes if managed separately, 
// but currently getAllNotebooks returns everything. 
// For better scalability, let's filter from the already loaded context for now, functionality "use the methods"

interface SidebarTwoProps {
	isExpanded: boolean;
	onToggle: () => void;
}

export const SidebarTwo = ({ isExpanded, onToggle }: SidebarTwoProps) => {
	const { selectedNotebookId, notebooks, setSelectedNoteId } = useAppContext();
	const [notes, setNotes] = useState<Note[]>([]);

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

	if (!isExpanded) {
		return (
			<div className="w-full h-full flex flex-col items-center py-2 bg-[#1e1e1e]">
				<button
					onClick={onToggle}
					className="p-1.5 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-[#d4d4d4] transition-colors"
					title="Expand Notes"
				>
					<ChevronRight size={16} />
				</button>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full bg-[#1e1e1e] relative">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d2d] h-12">
				<span className="text-xs font-semibold text-[#858585] uppercase tracking-wider">
					{notes.length} Notes
				</span>
				<div className="flex items-center gap-1">
					{/* Create Note Action (Placeholder) */}
					<button className="p-1 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-[#d4d4d4]">
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
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto">
				{notes.map(note => (
					<div
						key={note.id}
						className="px-4 py-3 border-b border-[#2d2d2d] hover:bg-[#2d2d2d] cursor-pointer transition-colors group"
						onClick={() => setSelectedNoteId(note.id)}
					>
						<h3 className="text-sm font-medium text-[#e1e1e1] truncate mb-1 group-hover:text-white">
							{note.title}
						</h3>
						<div className="flex justify-between items-center text-xs">
							<span className="text-[#666] shrink-0">
								{new Date(note.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				))}
				{notes.length === 0 && (
					<div className="p-8 text-center text-xs text-[#555]">
						Empty
					</div>
				)}
			</div>
		</div>
	);
};
