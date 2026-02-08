import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"

// Configuración de resaltado de sintaxis
const lowlight = createLowlight(common)

export default function Editor() {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false, 
			}),
			Highlight,
			Image,
			Placeholder.configure({
				placeholder: "Empieza a escribir...",
			}),
			CodeBlockLowlight.configure({
				lowlight,
			}),
		],
		content: "",
		editorProps: {
			attributes: {
				class:
					"prose prose-invert focus:outline-none max-w-none min-h-[400px] p-4",
			},
		},
	})

	if (!editor) return null

	return (
		<div className="flex-1 overflow-auto">
			<EditorContent editor={editor} className="h-full" />
		</div>
	)
}