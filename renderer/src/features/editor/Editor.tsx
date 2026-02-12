import { Extension } from "@tiptap/core"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { common, createLowlight } from "lowlight"
import { useEffect } from "react"
import { EditorToolbar } from "./components/EditorToolbar"
import { type Note } from "@/shared/types"
import { useAutoSave } from "./hooks/useAutoSave"

// Configuración de resaltado de sintaxis
const lowlight = createLowlight(common)

// Custom extension to handle Tab key
const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		return {
			Tab: () => {
				if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
					// Try to sink the list item
					if (this.editor.commands.sinkListItem('listItem')) {
						return true; // Command succeeded
					}
					// If sinking fails (e.g. max depth or other reason), 
					// we still want to consume the event to prevent focus change.
					// Optionally we could insert a tab here if desired, but blocking focus change is the priority.
					return true; 
				}
				
				// For non-list content, insert tab
				this.editor.commands.insertContent('\t');
				return true; // Always return true to prevent default browser behavior (focus change)
			},
			'Shift-Tab': () => {
				if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
					if (this.editor.commands.liftListItem('listItem')) {
						return true;
					}
					return true; // Consume event even if lift fails
				}
				return true; // Consume event even if not in list (or implement unindent for text)
			},
		}
	}
})

interface EditorProps {
	note: Note;
}

export default function Editor({ note }: EditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
			}),
			TabHandler,
			Highlight.configure({
				multicolor: true,
			}),
			Underline,
			Image,
			TextStyle,
			Color,
			Placeholder.configure({
				placeholder: "Empieza a escribir...",
			}),
			CodeBlockLowlight.configure({
				lowlight,
				HTMLAttributes: {
					spellcheck: "false",
					class: "code-block",
				},
			}),
		],
		content: note.content || "", // Fallback to empty string if content is undefined
		editorProps: {
			attributes: {
				class:
					"prose prose-invert focus:outline-none max-w-none h-full p-4",
			},
		},
		onUpdate: () => {
			// Logic handled by useAutoSave
		}
	}, [note.id]); // Re-create editor when note ID changes to ensure content is swapped

	// Initialize auto-save hook
	const { isSaving, isDirty } = useAutoSave(editor, note);

	// If note changes, update content if key didn't force re-mount
	useEffect(() => {
		if (editor && note) {
			// Only update if content is different to avoid cursor jumps or generic re-renders
			// But since we use note.id in dependency array above, useEditor might handle it. 
			// However, useEditor dependency array re-creates the instance.
			// Let's rely on re-creation for now as it's safer for switching notes.
		}
	}, [note, editor]);

	if (!editor) return null

	return (
		<div className="flex flex-col h-full bg-[#1e1e1e]">
			<div className="flex-1 overflow-auto">
				<EditorContent editor={editor} className="h-full" />
			</div>
			{/* Optional: Display saving status in toolbar or here */}
			<div className="px-4 py-1 text-xs text-gray-500 absolute bottom-14 right-4 z-10">
				{isSaving ? "Guardando..." : isDirty ? "Cambios sin guardar" : "Guardado"}
			</div>
			<EditorToolbar editor={editor} />
		</div>
	)
}