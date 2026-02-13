import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface ItemActionsMenuProps {
	onEdit: (e: React.MouseEvent) => void;
	onDelete: (e: React.MouseEvent) => void;
}

export const ItemActionsMenu = ({ onEdit, onDelete }: ItemActionsMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Close if click is outside both the button and the menu
			if (
				isOpen &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node) &&
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('scroll', handleScroll, true); // Capture scroll events from any container
			window.addEventListener('resize', handleScroll);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleScroll);
		};
	}, [isOpen]);

	const handleButtonClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			// Position menu to the right of the button, aligning top
			setMenuPos({
				top: rect.top,
				left: rect.right + 4
			});
		}
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative ml-auto">
			<button
				ref={buttonRef}
				onClick={handleButtonClick}
				className={`p-1 text-[#858585] hover:text-white hover:bg-[#3e3e3e] transition-colors ${isOpen ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100'}`}
				title="Options"
			>
				<MoreVertical size={16} />
			</button>

			{isOpen && createPortal(
				<div
					ref={menuRef}
					style={{
						top: menuPos.top,
						left: menuPos.left,
					}}
					className="fixed w-32 bg-[#2d2d2d] border border-[#3e3e3e]  shadow-xl z-9999 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-100"
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsOpen(false);
							onEdit(e);
						}}
						className="rounded-none flex items-center gap-2 px-3 py-2 text-xs text-[#cccccc] hover:text-white hover:bg-[#3e3e3e] transition-colors w-full text-left"
					>
						<Edit2 size={12} />
						Edit
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsOpen(false);
							onDelete(e);
						}}
						className="rounded-none flex items-center gap-2 px-3 py-2 text-xs text-[#ff6b6b] hover:text-white hover:bg-[#3e3e3e] transition-colors w-full text-left"
					>
						<Trash2 size={12} />
						Delete
					</button>
				</div>,
				document.body
			)}
		</div>
	);
};
