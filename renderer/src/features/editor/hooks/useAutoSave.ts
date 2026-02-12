import { useEffect, useCallback, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { type Note } from "@/shared/types";
import { NotesApiService } from "@/api/NotesApiService";

export const useAutoSave = (editor: Editor | null, note: Note) => {
	const [isSaving, setIsSaving] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const lastContentRef = useRef<any>(note.content);
	const isDirtyRef = useRef(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Function to save the note
	const saveNote = useCallback(
		async (content: any) => {
			if (!content) return;

			setIsSaving(true);
			try {
				console.log("Auto-saving note:", note.id);
				// We don't send updatedAt, the backend handles it in UTC
				await NotesApiService.updateNote(note.id, {
					content: content,
				});
				// Reset dirty state after successful save
				isDirtyRef.current = false;
				setIsDirty(false);
			} catch (error) {
				console.error("Failed to auto-save:", error);
			} finally {
				setIsSaving(false);
			}
		},
		[note.id]
	);

	// Setup listeners for changes and auto-save
	useEffect(() => {
		if (!editor) return;

		const handleUpdate = () => {
			const content = editor.getJSON();
			isDirtyRef.current = true;
			setIsDirty(true);
			lastContentRef.current = content;

			// Clear existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Set new timeout (debounce 800ms)
			timeoutRef.current = setTimeout(() => {
				saveNote(content);
			}, 800);
		};

		// Force save on blur (lost focus)
		const handleBlur = () => {
			if (isDirtyRef.current && lastContentRef.current) {
				console.log("Blur detected, saving...");
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				saveNote(lastContentRef.current);
			}
		};

		editor.on("update", handleUpdate);
		editor.on("blur", handleBlur);

		// Handle window events (close, minimize/hide)
		const handleVisibilityChange = () => {
			if (document.hidden && isDirtyRef.current && lastContentRef.current) {
				console.log("App hidden, saving...");
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				saveNote(lastContentRef.current);
			}
		};

		const handleBeforeUnload = () => {
			if (isDirtyRef.current && lastContentRef.current) {
				console.log("App closing, saving...");
				// Try to save before unload (best effort)
				NotesApiService.updateNote(note.id, {
					content: lastContentRef.current,
					updatedAt: new Date().toISOString(),
				});
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			editor.off("update", handleUpdate);
			editor.off("blur", handleBlur);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [editor, saveNote, note.id]);

	// Save on unmount or note change
	useEffect(() => {
		return () => {
			// This cleanup runs when the component unmounts OR when dependencies (saveNote) change
			// saveNote changes when note.id changes.
			// So this handles "switching notes" perfectly.
			if (isDirtyRef.current && lastContentRef.current) {
				console.log("Unmount/Change detected, saving note:", note.id);

				if (timeoutRef.current) clearTimeout(timeoutRef.current);

				// We call the API directly here to ensure we use the captured 'saveNote' or implementation
				// Note: accessing 'note.id' from closure here refers to the note that is existing.
				NotesApiService.updateNote(note.id, {
					content: lastContentRef.current,
					updatedAt: new Date().toISOString(),
				}).catch(err => console.error("Error saving on unmount:", err));
			}
		};
	}, [saveNote, note.id]);

	return { isSaving, isDirty };
};
