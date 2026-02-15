import { MainLayout } from './components/layout/MainLayout';
import { AppProvider, useAppContext } from './context/AppContext';
import Editor from './features/editor/Editor';
import { useMemo } from 'react';

const MainContent = () => {
  const { selectedNoteId, selectedNotebookId, notebooks, searchResults, searchQuery } = useAppContext();

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;

    // First try to find in search results if active
    if (searchQuery && searchResults) {
      const foundInSearch = searchResults.find(n => n.id === selectedNoteId);
      if (foundInSearch) return foundInSearch;
    }

    // Then try selected notebook
    if (selectedNotebookId) {
      const notebook = notebooks.find(n => n.id === selectedNotebookId);
      return notebook?.notebookNotes?.find(n => n.id === selectedNoteId);
    }

    // Fallback: search in all notebooks
    for (const notebook of notebooks) {
      const note = notebook.notebookNotes?.find(n => n.id === selectedNoteId);
      if (note) return note;
    }

    return null;
  }, [selectedNoteId, selectedNotebookId, notebooks, searchResults, searchQuery]);

  if (!selectedNote) {
    return (
      <div className="flex items-center justify-center h-full text-[#5e5e5e]">
        Selecciona una nota para comenzar a editar
      </div>
    );
  }

  return <Editor note={selectedNote} />;
};

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <MainContent />
      </MainLayout>
    </AppProvider>
  );
}

export default App;
