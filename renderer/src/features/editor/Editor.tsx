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
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Youtube from '@tiptap/extension-youtube'
import CharacterCount from '@tiptap/extension-character-count'
import { common, createLowlight } from "lowlight"
import { useEffect } from "react"
import { EditorToolbar } from "./components/EditorToolbar"
import { TableBubbleMenu } from "./components/TableBubbleMenu"
import { type Note } from "@/shared/types"
import { useAutoSave } from "./hooks/useAutoSave"
import { AttachmentsApiService } from "@/api/AttachmentsApiService"
import { useAppContext } from "@/context/AppContext"

// Importar overrides de tipos para tiptap para corregir 'focus' falta en SingleCommands
import '../../tiptap-overrides.d.ts'

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
	// Debug incoming content
	console.log("Editor loading note:", note.id, "Content:", note.content);

	const { updateNoteInContext } = useAppContext();

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
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
			}),
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
			Youtube.configure({
				controls: false,
			}),
			CharacterCount,
		],
		content: note.content || "", // Fallback to empty string if content is undefined
		editorProps: {
			attributes: {
				class:
					"prose prose-invert focus:outline-none max-w-none h-full p-4",
			},
			handlePaste: (view, event) => {
				const items = Array.from(event.clipboardData?.items || []);
				const item = items.find(item => item.type.indexOf("image") === 0);

				if (item) {
					event.preventDefault(); // Prevent default paste behavior

					const file = item.getAsFile();
					if (file) {
						// Using FileReader to get buffer (works for both file scenarios usually)
						const reader = new FileReader();
						reader.onload = (e) => {
							if (e.target?.result) {
								const buffer = e.target.result as ArrayBuffer;
								// Generate a default name for screenshots or use file name
								// Even for file-system files, we can just upload the buffer to simplify logic 
								// unless we really want the original path. 
								// But for "paste", treating it as a new attachment is safer.
								const fileName = file.name || "pasted_image.png";

								AttachmentsApiService.saveAttachmentFromBuffer(note.id, buffer, fileName).then(attachment => {
									if (attachment && attachment.path) {
										// Normalize path for Windows compatibility
										const normalizedPath = attachment.path.replace(/\\/g, '/');
										const pathWithSlash = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
										const encodedPath = encodeURI(pathWithSlash);
										const imageUrl = `local-resource://${encodedPath}`;

										// Use view to access commands if possible, but Tiptap commands are easier.
										// Since 'editor' variable is not available here (circular dependency), 
										// we should use the 'view' to dispatch or find a way to reference the editor.
										// Actually, we can use a ref for the editor or just update the content via view transaction?
										// Easier: use editor.commands if we can get the editor instance. 
										// But we can't. 
										// Workaround: We can't use 'editor' here.
										// We can use 'view.dispatch' to insert a node.
										// But constructing the image node manually is tedious (schema dependent).

										// Better approach:
										// Define the handler OUTSIDE useEditor but access a ref that holds the editor? 
										// No, simply move this logic to a useEffect that uses editor.setOptions?

										// Or, strictly use ProseMirror transaction:
										const { schema } = view.state;
										const node = schema.nodes.image.create({ src: imageUrl });
										const transaction = view.state.tr.replaceSelectionWith(node);
										view.dispatch(transaction);
									}
								}).catch(err => console.error("Error pasting image", err));
							}
						};
						reader.readAsArrayBuffer(file);
					}
					return true; // We handled the paste
				}

				return false; // Let default handler handle text etc.
			}
		},
		onUpdate: () => {
			// Logic handled by useAutoSave
		}
	}, [note.id]); // Re-create editor when note ID changes to ensure content is swapped

	// Initialize auto-save hook
	const { isSaving, isDirty } = useAutoSave(editor, note, (content) => {
		updateNoteInContext(note.id, content);
	});

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
				<TableBubbleMenu editor={editor} />
			</div>
			{/* Status is now inside EditorToolbar */}
			<EditorToolbar editor={editor} isSaving={isSaving} isDirty={isDirty} />
		</div>
	)
}