import { MainLayout } from './components/layout/MainLayout';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <div className="flex items-center justify-center h-full text-[#5e5e5e]">
           Selecciona una nota para comenzar a editar
        </div>
      </MainLayout>
    </AppProvider>
  );
}

export default App;
