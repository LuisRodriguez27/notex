import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Menu, Book, Trash2, Plus } from 'lucide-react';
import { NotebooksApiService } from '@/api/NotebokApiService';
import { ManageItemDialog } from './components/ManageItemDialog';
import { ItemActionsMenu } from './components/ItemActionsMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TrashModal } from '@/features/trash/TrashModal';
import type { Notebook } from '@/shared/types';

interface SidebarOneProps {
	isExpanded: boolean;
	onToggle: () => void;
}

export const SidebarOne = ({ isExpanded, onToggle }: SidebarOneProps) => {
	const { notebooks, selectedNotebookId, setSelectedNotebookId, refreshNotebooks } = useAppContext();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isTrashOpen, setIsTrashOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);

	useEffect(() => {
		refreshNotebooks();
	}, []);

	const handleSave = async (title: string, color?: string) => {
		if (editingNotebook) {
			await NotebooksApiService.updateNotebook(editingNotebook.id, { name: title, color: color ?? null });
		} else {
			await NotebooksApiService.createNotebook({ name: title, color });
		}
		await refreshNotebooks();
		setEditingNotebook(null);
	};
	
	const confirmDelete = (id: string) => {
		setItemToDelete(id);
		setIsDeleteConfirmOpen(true);
	};

	const handleDelete = async () => {
		if (itemToDelete) {
			try {
				await NotebooksApiService.deleteNotebook(itemToDelete);
				if (selectedNotebookId === itemToDelete) {
					setSelectedNotebookId(null);
				}
				await refreshNotebooks();
			} catch (error) {
				console.error("Failed to delete notebook:", error);
			}
		}
		setItemToDelete(null);
	};

	const openCreateDialog = () => {
		setEditingNotebook(null);
		setIsDialogOpen(true);
	};

	const openEditDialog = (notebook: Notebook) => {
		setEditingNotebook(notebook);
		setIsDialogOpen(true);
	};

	return (
		<div className="w-full h-full flex flex-col relative">
			{/* Manage Item Dialog */}
			<ManageItemDialog
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false);
					setEditingNotebook(null);
				}}
				onSubmit={handleSave}
				title={editingNotebook ? "Edit Notebook" : "Create New Notebook"}
				placeholder="My Notebook"
				confirmText={editingNotebook ? "Save Options" : "Create"}
				initialValue={editingNotebook?.name}
				initialColor={editingNotebook?.color}
			/>

			<ConfirmDialog
				isOpen={isDeleteConfirmOpen}
				onClose={() => setIsDeleteConfirmOpen(false)}
				onConfirm={handleDelete}
				title="Delete Notebook"
				message="Are you sure you want to delete this notebook? All notes within it will be moved to trash."
				confirmText="Delete"
				isDangerous={true}
			/>
			
			<TrashModal 
				isOpen={isTrashOpen} 
				onClose={() => setIsTrashOpen(false)} 
			/>

			{/* Header / Toggle */}
			<div className={`flex items-center h-12 ${isExpanded ? 'justify-between px-3' : 'justify-center'}`}>
				{isExpanded && (
					<span className="font-semibold text-sm text-[#858585] uppercase tracking-wider pl-1">Notebooks</span>
				)}
				
				<div className={`flex items-center ${isExpanded ? 'gap-1' : ''}`}>
					{isExpanded && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								openCreateDialog();
							}}
							className="p-1.5 hover:bg-[#3e3e3e] rounded text-[#858585] hover:text-white transition-colors"
							title="Create Notebook"
						>
							<Plus size={16} />
						</button>
					)}
					<button
						onClick={onToggle}
						className="p-1.5 hover:bg-[#3e3e3e] rounded text-[#d4d4d4] transition-colors"
					>
						<Menu size={18} strokeWidth={2} />
					</button>
				</div>
			</div>


			{/* List */}
			<div className={`flex-1 overflow-y-auto ${!isExpanded && 'px-2'}`}>
				{notebooks.map(nb => (
					<div
						key={nb.id}
						onClick={() => setSelectedNotebookId(nb.id)}
						className={`group relative flex items-center gap-2 py-3 border-b border-[#2d2d2d] text-sm cursor-pointer transition-colors ${selectedNotebookId === nb.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2d2d2e]'} ${isExpanded ? 'px-4 justify-start' : 'justify-center'}`}
						style={{ backgroundColor: nb.color ? nb.color : undefined }}
						title={!isExpanded ? nb.name : ''}
					>
						<Book size={16} className="shrink-0 opacity-70" />
						{isExpanded && (
							<>
								<span className="truncate flex-1">{nb.name}</span>
								<ItemActionsMenu
									onEdit={() => openEditDialog(nb)}
									onDelete={() => confirmDelete(nb.id)}
								/>
							</>
						)}
					</div>
				))}
				{notebooks.length === 0 && (
					<div className={`text-[#666] text-center ${isExpanded ? 'p-8 text-xs' : 'pt-4'}`}>
						{isExpanded ? 'No notebooks' : ''}
					</div>
				)}
			</div>

			{/* Bottom Actions */}
			<div className={`mt-auto p-2 border-t border-[#3e3e3e] ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
				<button 
					onClick={() => setIsTrashOpen(true)}
					className={`flex items-center gap-2 px-2 py-2 rounded text-sm text-[#858585] hover:text-[#d4d4d4] hover:bg-[#37373d] transition-colors w-full ${!isExpanded ? 'justify-center' : ''}`} 
					title="Trash"
				>
					<Trash2 size={18} className="shrink-0" />
					{isExpanded && <span className="truncate">Trash</span>}
				</button>
			</div>
		</div>
	);
};
