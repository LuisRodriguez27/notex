import { MainLayout } from './components/layout/MainLayout';
import { AppProvider, useAppContext } from './context/AppContext'; // Ensure useAppContext is exported and used here
import Editor from './features/editor/Editor';
import { useMemo } from 'react';

const MainContent = () => {
  const { selectedNoteId, selectedNotebookId, notebooks } = useAppContext();

  const selectedNote = useMemo(() => {
    if (!selectedNoteId || !selectedNotebookId) return null;
    const notebook = notebooks.find(n => n.id === selectedNotebookId);
    return notebook?.notebookNotes?.find(n => n.id === selectedNoteId);
  }, [selectedNoteId, selectedNotebookId, notebooks]);

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
