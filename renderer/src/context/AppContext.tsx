import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Notebook } from '@/shared/types';

interface AppContextType {
	selectedNotebookId: string | null;
	setSelectedNotebookId: (id: string | null) => void;
	selectedNoteId: string | null;
	setSelectedNoteId: (id: string | null) => void;
	notebooks: Notebook[];
	setNotebooks: (notebooks: Notebook[]) => void;
	refreshNotebooks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [notebooks, setNotebooks] = useState<Notebook[]>([]);

	const refreshNotebooks = async () => {
		try {
			const data = await window.api.getAllNotebooks();
			setNotebooks(data);
		} catch (error) {
			console.error('Failed to refresh notebooks', error);
		}
	};

	return (
		<AppContext.Provider value={{
			selectedNotebookId,
			setSelectedNotebookId,
			selectedNoteId,
			setSelectedNoteId,
			notebooks,
			setNotebooks,
			refreshNotebooks
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
