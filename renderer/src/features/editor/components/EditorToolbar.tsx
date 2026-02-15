import { type Editor } from '@tiptap/react';
import {
	Bold,
	Italic,
	Underline,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	List,
	ListOrdered,
	Code2,
	Quote,
	Image as ImageIcon,
	Type,
	ALargeSmall,
	Baseline,
	Highlighter
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EditorToolbarProps {
	editor: Editor | null;
	isSaving: boolean;
	isDirty: boolean;
}

export const EditorToolbar = ({ editor, isSaving, isDirty }: EditorToolbarProps) => {
	const [showHeadingSelector, setShowHeadingSelector] = useState(false);
	const [showTextColorSelector, setShowTextColorSelector] = useState(false);
	const [showHighlightColorSelector, setShowHighlightColorSelector] = useState(false);
	const [_, forceUpdate] = useState(0); // Force re-render state
	const headingSelectorRef = useRef<HTMLDivElement>(null);
	const textColorSelectorRef = useRef<HTMLDivElement>(null);
	const highlightColorSelectorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!editor) return;

		// Force re-render on editor updates (selection change, content change)
		const handleUpdate = () => forceUpdate(prev => prev + 1);

		editor.on('transaction', handleUpdate);
		editor.on('selectionUpdate', handleUpdate);

		return () => {
			editor.off('transaction', handleUpdate);
			editor.off('selectionUpdate', handleUpdate);
		};
	}, [editor]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (headingSelectorRef.current && !headingSelectorRef.current.contains(event.target as Node)) {
				setShowHeadingSelector(false);
			}
			if (textColorSelectorRef.current && !textColorSelectorRef.current.contains(event.target as Node)) {
				setShowTextColorSelector(false);
			}
			if (highlightColorSelectorRef.current && !highlightColorSelectorRef.current.contains(event.target as Node)) {
				setShowHighlightColorSelector(false);
			}
		};

		if (showHeadingSelector || showTextColorSelector || showHighlightColorSelector) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showHeadingSelector, showTextColorSelector, showHighlightColorSelector]);

	if (!editor) {
		return null;
	}

	const toggleBold = () => editor.chain().focus().toggleBold().run();
	const toggleItalic = () => editor.chain().focus().toggleItalic().run();
	const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();

	const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
		editor.chain().focus().toggleHeading({ level }).run();
		setShowHeadingSelector(false);
	};

	const setParagraph = () => {
		editor.chain().focus().setParagraph().run();
		setShowHeadingSelector(false);
	}

	const setTextColor = (color: string) => {
		editor.chain().focus().setColor(color).run();
		setShowTextColorSelector(false);
	};

	const unsetTextColor = () => {
		editor.chain().focus().unsetColor().run();
		setShowTextColorSelector(false);
	}

	const setHighlightColor = (color: string) => {
		editor.chain().focus().setHighlight({ color: color }).run();
		setShowHighlightColorSelector(false);
	};
	
	const unsetHighlightColor = () => {
		editor.chain().focus().unsetHighlight().run();
		setShowHighlightColorSelector(false);
	}

	const TEXT_COLORS = [
		{ name: 'Rojo', color: '#ef4444' },
		{ name: 'Naranja', color: '#f97316' },
		{ name: 'Amarillo', color: '#eab308' },
		{ name: 'Verde', color: '#22c55e' },
		{ name: 'Azul', color: '#3b82f6' },
		{ name: 'Morado', color: '#a855f7' },
		{ name: 'Rosa', color: '#ec4899' },
	];

	const HIGHLIGHT_COLORS = [
		{ name: 'Rojo', color: '#ef4444' },
		{ name: 'Naranja', color: '#f97316' },
		{ name: 'Amarillo', color: '#eab308' },
		{ name: 'Verde', color: '#22c55e' },
		{ name: 'Azul', color: '#3b82f6' },
		{ name: 'Morado', color: '#a855f7' },
		{ name: 'Rosa', color: '#ec4899' },
	];

	const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
	const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
	const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
	const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

	// Placeholder for image upload interaction
	const addImage = () => {
		const url = window.prompt('URL de la imagen:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const Button = ({ onClick, isActive, icon: Icon, title, className = "" }: { onClick: () => void; isActive?: boolean; icon: any; title: string; className?: string }) => (
		<button
			onClick={onClick}
			onMouseDown={(e) => e.preventDefault()}
			className={`p-1.5 rounded hover:bg-[#3e3e3e] transition-colors ${isActive ? 'bg-[#3e3e3e] text-white' : 'text-[#858585]'} ${className}`}
			title={title}
		>
			<Icon size={16} />
		</button>
	);

	// Detect current text style for the main button
	const isHeadingActive = editor.isActive('heading');

	return (
		<div className="flex flex-wrap items-center gap-1 border-t border-[#2d2d2d] p-2 bg-[#1e1e1e] relative">
			<Button onClick={toggleBold} isActive={editor.isActive('bold')} icon={Bold} title="Negrita (Ctrl+B)" />
			<Button onClick={toggleItalic} isActive={editor.isActive('italic')} icon={Italic} title="Cursiva (Ctrl+I)" />
			<Button onClick={toggleUnderline} isActive={editor.isActive('underline')} icon={Underline} title="Subrayado (Ctrl+U)" />

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			{/* Heading Select Button */}
			<div className="relative" ref={headingSelectorRef}>
				<Button
					onClick={() => setShowHeadingSelector(!showHeadingSelector)}
					isActive={isHeadingActive}
					icon={ALargeSmall}
					title="Encabezados y Texto"
				/>
				{showHeadingSelector && (
					<div className="absolute bottom-full mb-2 left-0 flex items-center bg-[#252526] border border-[#3e3e3e] rounded shadow-lg p-1 gap-1 z-50 animate-in fade-in slide-in-from-bottom-1">
						<Button onClick={setParagraph} isActive={editor.isActive('paragraph')} icon={Type} title="Texto Normal (Ctrl+Alt+0)" />
						<div className="w-px h-4 bg-[#3e3e3e] mx-1" />
						<Button onClick={() => toggleHeading(1)} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Título 1 (Ctrl+Alt+1)" />
						<Button onClick={() => toggleHeading(2)} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Título 2 (Ctrl+Alt+2)" />
						<Button onClick={() => toggleHeading(3)} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Título 3 (Ctrl+Alt+3)" />
						<Button onClick={() => toggleHeading(4)} isActive={editor.isActive('heading', { level: 4 })} icon={Heading4} title="Título 4 (Ctrl+Alt+4)" />
						<Button onClick={() => toggleHeading(5)} isActive={editor.isActive('heading', { level: 5 })} icon={Heading5} title="Título 5 (Ctrl+Alt+5)" />
					</div>
				)}
			</div>

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			{/* Text Color Button */}
			<div className="relative" ref={textColorSelectorRef}>
				<Button
					onClick={() => setShowTextColorSelector(!showTextColorSelector)}
					isActive={!!editor.getAttributes('textStyle').color}
					icon={Baseline}
					title="Color de texto"
				/>
				{showTextColorSelector && (
					<div className="absolute bottom-full mb-2 left-0 flex flex-col bg-[#252526] border border-[#3e3e3e] rounded shadow-lg p-3 gap-2 z-50 animate-in fade-in slide-in-from-bottom-1 min-w-50">
						<div className="grid grid-cols-4 gap-2">
							<button 
								onClick={unsetTextColor}
								className="w-6 h-6 rounded border border-[#3e3e3e] flex items-center justify-center hover:bg-[#3e3e3e] transition-colors"
								title="Por defecto"
							>
								<span className="text-xs text-white">A</span>
							</button>
							{TEXT_COLORS.map(({ name, color }) => (
								<button
									key={name}
									onClick={() => setTextColor(color)}
									className="w-6 h-6 rounded border border-transparent hover:scale-110 transition-transform"
									style={{ backgroundColor: color }}
									title={name}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Highlight Button */}
			<div className="relative" ref={highlightColorSelectorRef}>
				<Button
					onClick={() => setShowHighlightColorSelector(!showHighlightColorSelector)}
					isActive={editor.isActive('highlight')}
					icon={Highlighter}
					title="Resaltar (Ctrl+Shift+H)"
				/>
				{showHighlightColorSelector && (
					<div className="absolute bottom-full mb-2 left-0 flex flex-col bg-[#252526] border border-[#3e3e3e] rounded shadow-lg p-3 gap-2 z-50 animate-in fade-in slide-in-from-bottom-1 min-w-50">
						<div className="grid grid-cols-4 gap-2">
							<button 
								onClick={unsetHighlightColor}
								className="w-6 h-6 rounded border border-[#3e3e3e] relative hover:bg-[#3e3e3e] transition-colors"
								title="Sin resaltar"
							>
								<div className="absolute inset-0 m-auto w-4 h-px bg-red-500 rotate-45" />
							</button>
							{HIGHLIGHT_COLORS.map(({ name, color }) => (
								<button
									key={name}
									onClick={() => setHighlightColor(color)}
									className="w-6 h-6 rounded border border-transparent hover:scale-110 transition-transform"
									style={{ backgroundColor: color }}
									title={name}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={toggleBulletList} isActive={editor.isActive('bulletList')} icon={List} title="Lista con viñetas (Ctrl+Shift+8)" />
			<Button onClick={toggleOrderedList} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Lista numerada (Ctrl+Shift+7)" />

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={toggleCodeBlock} isActive={editor.isActive('codeBlock')} icon={Code2} title="Bloque de código (Ctrl+Alt+C)" />
			<Button onClick={toggleBlockquote} isActive={editor.isActive('blockquote')} icon={Quote} title="Cita (Ctrl+Shift+B)" />

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={addImage} isActive={false} icon={ImageIcon} title="Imagen" />

			{/* Status Indicator */}
			<div className="ml-auto px-2 text-xs text-gray-500 whitespace-nowrap min-w-fit">
				{isSaving ? "Guardando..." : isDirty ? "Cambios sin guardar" : "Guardado"}
			</div>
		</div>
	);
};
