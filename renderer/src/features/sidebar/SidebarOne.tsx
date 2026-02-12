import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Menu, Book, Trash2, Plus } from 'lucide-react';
import { NotebooksApiService } from '@/api/NotebokApiService';
import { CreateDialog } from './components/CreateDialog';

interface SidebarOneProps {
	isExpanded: boolean;
	onToggle: () => void;
}

export const SidebarOne = ({ isExpanded, onToggle }: SidebarOneProps) => {
	const { notebooks, selectedNotebookId, setSelectedNotebookId, refreshNotebooks } = useAppContext();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	useEffect(() => {
		refreshNotebooks();
	}, []);

	const handleCreateNotebook = async (title: string) => {
		await NotebooksApiService.createNotebook({ name: title });
		await refreshNotebooks();
	};

	return (
		<div className="w-full h-full flex flex-col relative">
			{/* Create Dialog */}
			<CreateDialog
				isOpen={isCreateDialogOpen}
				onClose={() => setIsCreateDialogOpen(false)}
				onCreate={handleCreateNotebook}
				title="Create New Notebook"
				placeholder="My Notebook"
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
								setIsCreateDialogOpen(true);
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
						className={`flex items-center gap-2 py-3 border-b border-[#2d2d2d] text-sm cursor-pointer transition-colors ${selectedNotebookId === nb.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2d2d2e]'} ${isExpanded ? 'px-4 justify-start' : 'justify-center'}`}
						title={!isExpanded ? nb.name : ''}
					>
						<Book size={16} className="shrink-0 opacity-70" />
						{isExpanded && <span className="truncate">{nb.name}</span>}
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
				<button className={`flex items-center gap-2 px-2 py-2 rounded text-sm text-[#858585] hover:text-[#d4d4d4] hover:bg-[#37373d] transition-colors w-full ${!isExpanded ? 'justify-center' : ''}`} title="Trash">
					<Trash2 size={18} className="shrink-0" />
					{isExpanded && <span className="truncate">Trash</span>}
				</button>
			</div>
		</div>
	);
};
