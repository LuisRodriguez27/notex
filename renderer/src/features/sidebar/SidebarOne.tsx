import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Menu, Book, Trash2 } from 'lucide-react';

interface SidebarOneProps {
	isExpanded: boolean;
	onToggle: () => void;
}

export const SidebarOne = ({ isExpanded, onToggle }: SidebarOneProps) => {
	const { notebooks, selectedNotebookId, setSelectedNotebookId, refreshNotebooks } = useAppContext();

	useEffect(() => {
		refreshNotebooks();
	}, []);

	return (
		<div className="w-full h-full flex flex-col relative">
			{/* Header / Toggle */}
			<div className={`flex items-center px-3 py-3 h-12 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
				{isExpanded && (
					<span className="font-semibold text-xs text-[#858585] uppercase tracking-wider pl-1">Notebooks</span>
				)}
				<button
					onClick={onToggle}
					className="p-1.5 hover:bg-[#3e3e3e] rounded text-[#d4d4d4] transition-colors"
				>
					<Menu size={18} strokeWidth={2} />
				</button>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto px-2 py-2">
				{notebooks.map(nb => (
					<div
						key={nb.id}
						onClick={() => setSelectedNotebookId(nb.id)}
						className={`flex items-center gap-2 py-2 rounded-md text-sm cursor-pointer transition-colors mb-0.5 ${selectedNotebookId === nb.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2d2d2e]'} ${isExpanded ? 'px-3 justify-start' : 'px-0 justify-center'}`}
						title={!isExpanded ? nb.name : ''}
					>
						<Book size={16} className="shrink-0 opacity-70" />
						{isExpanded && <span className="truncate">{nb.name}</span>}
					</div>
				))}
				{notebooks.length === 0 && (
					<div className="text-xs text-[#666] text-center mt-4">{isExpanded ? 'No notebooks' : ''}</div>
				)}
			</div>

			{/* Bottom Actions */}
			<div className={`mt-auto p-2 border-t border-[#3e3e3e] ${!isExpanded && 'flex flex-col items-center'}`}>
				<button className={`flex items-center gap-2 px-2 py-2 rounded text-sm text-[#858585] hover:text-[#d4d4d4] hover:bg-[#37373d] transition-colors w-full ${!isExpanded && 'justify-center'}`} title="Trash">
					<Trash2 size={16} />
					{isExpanded && <span>Trash</span>}
				</button>
			</div>
		</div>
	);
};
