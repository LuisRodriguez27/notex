import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Notebook, Note } from '@/shared/types';
import { NotebooksApiService } from '@/api/NotebokApiService';

interface AppContextType {
	selectedNotebookId: string | null;
	setSelectedNotebookId: (id: string | null) => void;
	selectedNoteId: string | null;
	setSelectedNoteId: (id: string | null) => void;
	notebooks: Notebook[];
	setNotebooks: (notebooks: Notebook[]) => void;
	refreshNotebooks: () => Promise<void>;
	updateNoteInContext: (noteId: string, content: any) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	searchResults: Note[] | null;
	performSearch: (query: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [notebooks, setNotebooks] = useState<Notebook[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Note[] | null>(null);

	const refreshNotebooks = async () => {
		try {
			const data = await NotebooksApiService.getAllNotebooks();
			setNotebooks(data);
		} catch (error) {
			console.error('Failed to refresh notebooks', error);
		}
	};

	const performSearch = async (query: string) => {
		if (!query.trim()) {
			setSearchResults(null);
			return;
		}
		try {
			// Using the exposed API
			const results = await window.api.searchNotes(query);
			setSearchResults(results);
		} catch (error) {
			console.error('Failed to search notes', error);
			setSearchResults([]);
		}
	};

	const updateNoteInContext = (noteId: string, content: any) => {
		// Update in search results if they exist (to keep editor in sync if note is from search)
		if (searchResults) {
			setSearchResults(prev => prev ? prev.map(note =>
				note.id === noteId ? { ...note, content } : note
			) : null);
		}

		setNotebooks(prevNotebooks => {
			return prevNotebooks.map(notebook => {
				if (notebook.notebookNotes?.some(n => n.id === noteId)) {
					return {
						...notebook,
						notebookNotes: notebook.notebookNotes.map(note =>
							note.id === noteId ? { ...note, content } : note
						)
					};
				}
				return notebook;
			});
		});
	};

	return (
		<AppContext.Provider value={{
			selectedNotebookId,
			setSelectedNotebookId,
			selectedNoteId,
			setSelectedNoteId,
			notebooks,
			setNotebooks,
			refreshNotebooks,
			updateNoteInContext,
			searchQuery,
			setSearchQuery,
			searchResults,
			performSearch
		}}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
