import { BubbleMenu, type Editor } from '@tiptap/react'
import {
	BetweenHorizontalEnd,
	BetweenHorizontalStart,
	BetweenVerticalEnd,
	BetweenVerticalStart,
	Columns,
	Rows,
	Trash2,
	Split,
	Merge,
	Table as TableIcon
} from 'lucide-react'

interface TableBubbleMenuProps {
	editor: Editor | null
}

export const TableBubbleMenu = ({ editor }: TableBubbleMenuProps) => {
	if (!editor) {
		return null
	}

	return (
		<BubbleMenu
			editor={editor}
			tippyOptions={{ duration: 100 }}
			shouldShow={({ editor }: { editor: Editor }) => editor.isActive('table')}
			className="flex flex-wrap items-center gap-1 bg-[#252526] border border-[#3e3e3e] rounded-lg shadow-xl p-1 z-50 max-w-100"
		>
			<div className="flex items-center gap-1 pr-1 border-r border-[#3e3e3e]">
				<div className="text-xs text-gray-400 px-1 font-semibold flex items-center gap-1">
					<TableIcon size={12} /> Tabla
				</div>
			</div>

			{/* Column Controls */}
			<button
				onClick={() => editor.chain().focus().addColumnBefore().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Insertar columna antes"
			>
				<BetweenVerticalStart size={16} />
			</button>
			<button
				onClick={() => editor.chain().focus().addColumnAfter().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Insertar columna después"
			>
				<BetweenVerticalEnd size={16} />
			</button>
			<button
				onClick={() => editor.chain().focus().deleteColumn().run()}
				className="p-1.5 hover:bg-red-900/50 hover:text-red-300 rounded text-gray-300 transition-colors"
				title="Eliminar columna"
			>
				<Columns size={16} className="text-red-400" />
			</button>

			<div className="w-px h-4 bg-[#3e3e3e] mx-1" />

			{/* Row Controls */}
			<button
				onClick={() => editor.chain().focus().addRowBefore().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Insertar fila antes"
			>
				<BetweenHorizontalStart size={16} />
			</button>
			<button
				onClick={() => editor.chain().focus().addRowAfter().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Insertar fila después"
			>
				<BetweenHorizontalEnd size={16} />
			</button>
			<button
				onClick={() => editor.chain().focus().deleteRow().run()}
				className="p-1.5 hover:bg-red-900/50 hover:text-red-300 rounded text-gray-300 transition-colors"
				title="Eliminar fila"
			>
				<Rows size={16} className="text-red-400" />
			</button>

			<div className="w-px h-4 bg-[#3e3e3e] mx-1" />

			{/* Cell Merge/Split */}
			<button
				onClick={() => editor.chain().focus().mergeCells().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Combinar celdas"
				disabled={!editor.can().mergeCells()}
			>
				<Merge size={16} />
			</button>
			<button
				onClick={() => editor.chain().focus().splitCell().run()}
				className="p-1.5 hover:bg-[#3e3e3e] rounded text-gray-300 hover:text-white transition-colors"
				title="Dividir celda"
				disabled={!editor.can().splitCell()}
			>
				<Split size={16} />
			</button>

			<div className="w-px h-4 bg-[#3e3e3e] mx-1" />

			{/* Delete Table */}
			<button
				onClick={() => editor.chain().focus().deleteTable().run()}
				className="p-1.5 hover:bg-red-900/50 hover:text-red-300 rounded text-red-400 transition-colors"
				title="Eliminar tabla"
			>
				<Trash2 size={16} />
			</button>
		</BubbleMenu>
	)
}
