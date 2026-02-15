import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { NotebooksApiService } from '@/api/NotebokApiService';
import { NotesApiService } from '@/api/NotesApiService';
import type { Notebook, Note } from '@/shared/types';
import { X, Trash2, RotateCcw, FileText, Book } from 'lucide-react';

interface TrashModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const TrashModal = ({ isOpen, onClose }: TrashModalProps) => {
	const { refreshNotebooks } = useAppContext();
	const [deletedNotebooks, setDeletedNotebooks] = useState<Notebook[]>([]);
	const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
	const [activeTab, setActiveTab] = useState<'notes' | 'notebooks'>('notes');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			fetchDeletedItems();
		}
	}, [isOpen]);

	const fetchDeletedItems = async () => {
		setIsLoading(true);
		try {
			const [nb, n] = await Promise.all([
				NotebooksApiService.getDeletedNotebooks(),
				NotesApiService.getDeletedNotes()
			]);
			setDeletedNotebooks(nb);
			setDeletedNotes(n);
		} catch (error) {
			console.error("Error fetching deleted items:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRestore = async (id: string, type: 'note' | 'notebook') => {
		try {
			if (type === 'note') {
				await NotesApiService.restoreNote(id);
			} else {
				await NotebooksApiService.restoreNotebook(id);
			}
			await fetchDeletedItems(); // Refresh trash list
			await refreshNotebooks(); // Refresh sidebar/main list
		} catch (error) {
			console.error(`Failed to restore ${type}:`, error);
		}
	};

	if (!isOpen) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit', 
			minute: '2-digit'
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-[#1e1e1e] border border-[#3e3e3e] rounded-lg shadow-xl w-175 h-150 flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="h-14 border-b border-[#3e3e3e] flex items-center justify-between px-4 bg-[#252526] rounded-t-lg">
					<div className="flex items-center gap-2 text-[#d4d4d4]">
						<Trash2 size={20} />
						<h2 className="font-semibold text-lg">Trash</h2>
					</div>
					<button 
						onClick={onClose}
						className="p-1.5 hover:bg-[#3e3e3e] text-[#858585] hover:text-white rounded transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-[#3e3e3e] bg-[#252526]">
					<button
						className={`flex-1 py-3 text-sm font-medium transition-colors ${
							activeTab === 'notebooks' 
								? 'bg-[#1e1e1e] text-[#d4d4d4] border-t-2 border-t-[#007acc]' 
								: 'text-[#858585] hover:bg-[#2a2a2b] hover:text-[#cccccc]'
						}`}
						onClick={() => setActiveTab('notebooks')}
					>
						Deleted Notebooks ({deletedNotebooks.length})
					</button>
					<button
						className={`flex-1 py-3 text-sm font-medium transition-colors ${
							activeTab === 'notes' 
								? 'bg-[#1e1e1e] text-[#d4d4d4] border-t-2 border-t-[#007acc]' 
								: 'text-[#858585] hover:bg-[#2a2a2b] hover:text-[#cccccc]'
						}`}
						onClick={() => setActiveTab('notes')}
					>
						Deleted Notes ({deletedNotes.length})
					</button>					
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#1e1e1e]">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center h-full text-[#858585] gap-2">
							<div className="w-6 h-6 border-2 border-[#3e3e3e] border-t-[#007acc] rounded-full animate-spin"></div>
							<span>Loading deleted items...</span>
						</div>
					) : (
						<div className="space-y-2">
							{activeTab === 'notes' ? (
								deletedNotes.length === 0 ? (
									<div className="text-center text-[#5e5e5e] py-12">No deleted notes found</div>
								) : (
									deletedNotes.map(note => (
										<div key={note.id} className="group flex items-center justify-between bg-[#252526] p-3 rounded border border-[#3e3e3e] hover:border-[#525252] transition-colors">
											<div className="flex items-start gap-3 overflow-hidden">
												<div className="mt-1 p-1.5 rounded bg-[#2d2d2d] text-[#858585]">
													<FileText size={16} />
												</div>
												<div className="flex flex-col min-w-0">
													<div className="font-medium text-[#d4d4d4] truncate">{note.title || "Untitled Note"}</div>
													<div className="text-xs text-[#858585] mt-0.5">Deleted: {note.updatedAt ? formatDate(note.updatedAt) : 'Unknown'}</div>
												</div>
											</div>
											<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<button 
													onClick={() => handleRestore(note.id, 'note')}
													className="p-1.5 text-[#858585] hover:text-[#4ec9b0] hover:bg-[#3e3e3e] rounded" 
													title="Restore"
												>
													<RotateCcw size={16} />
												</button>
												<button className="p-1.5 text-[#858585] hover:text-[#f14c4c] hover:bg-[#3e3e3e] rounded" title="Permanently Delete">
													<X size={16} />
												</button>
											</div>
										</div>
									))
								)
							) : (
								deletedNotebooks.length === 0 ? (
									<div className="text-center text-[#5e5e5e] py-12">No deleted notebooks found</div>
								) : (
									deletedNotebooks.map(notebook => (
										<div key={notebook.id} className="group flex items-center justify-between bg-[#252526] p-3 rounded border border-[#3e3e3e] hover:border-[#525252] transition-colors">
											<div className="flex items-start gap-3 overflow-hidden">
												<div className="mt-1 p-1.5 rounded bg-[#2d2d2d]" style={{ color: notebook.color || '#858585' }}>
													<Book size={16} />
												</div>
												<div className="flex flex-col min-w-0">
													<div className="font-medium text-[#d4d4d4] truncate">{notebook.name}</div>
													<div className="text-xs text-[#858585] mt-0.5">Deleted: {notebook.updatedAt ? formatDate(notebook.updatedAt) : 'Unknown'}</div>
												</div>
											</div>
											<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<button 
													onClick={() => handleRestore(notebook.id, 'notebook')}
													className="p-1.5 text-[#858585] hover:text-[#4ec9b0] hover:bg-[#3e3e3e] rounded" 
													title="Restore"
												>
													<RotateCcw size={16} />
												</button>
												<button className="p-1.5 text-[#858585] hover:text-[#f14c4c] hover:bg-[#3e3e3e] rounded" title="Permanently Delete">
													<X size={16} />
												</button>
											</div>
										</div>
									))
								)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
