import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ManageItemDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (value: string, color?: string) => Promise<void>;
	title: string;
	inputLabel?: string;
	placeholder?: string;
	confirmText?: string;
	initialValue?: string;
	initialColor?: string | null;
}

const COLORS = [
	'#a13030', // Red
	'#227068', // Teal
	'#256270', // Cyan
	'#94523a', // Salmon
	'#4d6e66', // Seafoam
	'#8a7b3e', // Yellow
	'#5d5275', // Lavender
];

export const ManageItemDialog = ({ 
	isOpen, 
	onClose, 
	onSubmit,
	title,
	inputLabel = "Title",
	placeholder = "",
	confirmText = "Save",
	initialValue = "",
	initialColor = undefined,
}: ManageItemDialogProps) => {
	const [value, setValue] = useState(initialValue);
	const [selectedColor, setSelectedColor] = useState<string | undefined>(initialColor || undefined);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			setValue(initialValue || "");
			setSelectedColor(initialColor || undefined);
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen, initialValue, initialColor]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!value.trim()) return;

		setIsLoading(true);
		try {
			await onSubmit(value, selectedColor);
			onClose();
		} catch (error) {
			console.error('Error saving item:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-[#1e1e1e] border border-[#3e3e3e] rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
				<div className="flex items-center justify-between px-4 py-3 border-b border-[#3e3e3e]">
					<h2 className="text-sm font-semibold text-white">{title}</h2>
					<button 
						onClick={onClose}
						className="text-[#858585] hover:text-white transition-colors p-1 rounded-md hover:bg-[#3e3e3e]"
					>
						<X size={16} />
					</button>
				</div>
				
				<form onSubmit={handleSubmit} className="p-4">
					<div className="mb-4">
						<label htmlFor="item-value" className="block text-xs font-medium text-[#858585] mb-1.5">
							{inputLabel}
						</label>
						<input
							ref={inputRef}
							id="item-value"
							type="text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="w-full bg-[#2d2d2d] border border-[#3e3e3e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#007acc] transition-colors placeholder-[#666]"
							placeholder={placeholder}
							autoComplete="off"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-xs font-medium text-[#858585] mb-1.5">Color</label>
						<div className="flex gap-2 flex-wrap">
							<button
								type="button"
								onClick={() => setSelectedColor(undefined)}
								className={`w-6 h-6 rounded-full border border-[#3e3e3e] flex items-center justify-center transition-all overflow-hidden relative ${selectedColor === undefined ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]' : ''}`}
								title="No Color"
							>
								<div className="absolute inset-0 bg-linear-to-tr from-transparent from-45% via-[#858585] via-50% to-transparent to-55%" />
							</button>
							{COLORS.map((color) => (
								<button
									key={color}
									type="button"
									onClick={() => setSelectedColor(color)}
									className={`w-6 h-6 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]' : ''}`}
									style={{ backgroundColor: color }}
									title={color}
								/>
							))}
						</div>
					</div>
					
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1.5 text-xs font-medium text-[#cccccc] hover:text-white hover:bg-[#3e3e3e] rounded transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!value.trim() || isLoading}
							className="px-3 py-1.5 text-xs font-medium bg-[#007acc] text-white rounded hover:bg-[#0062a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? 'Saving...' : confirmText}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
