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
	Heading6,
	List,
	ListOrdered,
	Code2,
	Quote,
	Image as ImageIcon,
	Type,
	ALargeSmall
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface EditorToolbarProps {
	editor: Editor | null;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
	const [showHeadingSelector, setShowHeadingSelector] = useState(false);
	const [_, forceUpdate] = useState(0); // Force re-render state
	const headingSelectorRef = useRef<HTMLDivElement>(null);

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
		};

		if (showHeadingSelector) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showHeadingSelector]);

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
		<div className="flex items-center gap-1 border-t border-[#2d2d2d] p-2 bg-[#1e1e1e] relative">
			<Button onClick={toggleBold} isActive={editor.isActive('bold')} icon={Bold} title="Negrita" />
			<Button onClick={toggleItalic} isActive={editor.isActive('italic')} icon={Italic} title="Cursiva" />
			<Button onClick={toggleUnderline} isActive={editor.isActive('underline')} icon={Underline} title="Subrayado" />

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
						<Button onClick={setParagraph} isActive={editor.isActive('paragraph')} icon={Type} title="Texto Normal" />
						<div className="w-px h-4 bg-[#3e3e3e] mx-1" />
						<Button onClick={() => toggleHeading(1)} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Título 1" />
						<Button onClick={() => toggleHeading(2)} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Título 2" />
						<Button onClick={() => toggleHeading(3)} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Título 3" />
						<Button onClick={() => toggleHeading(4)} isActive={editor.isActive('heading', { level: 4 })} icon={Heading4} title="Título 4" />
						<Button onClick={() => toggleHeading(5)} isActive={editor.isActive('heading', { level: 5 })} icon={Heading5} title="Título 5" />
						<Button onClick={() => toggleHeading(6)} isActive={editor.isActive('heading', { level: 6 })} icon={Heading6} title="Título 6" />
					</div>
				)}
			</div>

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={toggleBulletList} isActive={editor.isActive('bulletList')} icon={List} title="Lista con viñetas" />
			<Button onClick={toggleOrderedList} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Lista numerada" />

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={toggleCodeBlock} isActive={editor.isActive('codeBlock')} icon={Code2} title="Bloque de código" />
			<Button onClick={toggleBlockquote} isActive={editor.isActive('blockquote')} icon={Quote} title="Cita" />

			<div className="w-px h-4 bg-[#2d2d2d] mx-1" />

			<Button onClick={addImage} isActive={false} icon={ImageIcon} title="Imagen" />

		</div>
	);
};
