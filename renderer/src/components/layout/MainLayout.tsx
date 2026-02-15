import { type ReactNode, useState, useEffect } from 'react';
import { SidebarOne } from '@/features/sidebar/SidebarOne';
import { SidebarTwo } from '@/features/sidebar/SidebarTwo';
import { useAppContext } from '@/context/AppContext';
import { useDebounce } from '@/hooks/useDebounce';

// Helper to extract text from TipTap JSON content
const getPreviewText = (content: any): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;

  if (content.type === 'text') {
    return content.text;
  }

  if (Array.isArray(content.content)) {
    return content.content.map((node: any) => getPreviewText(node)).join(' ');
  }

  return '';
};

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const [expandSidebarOne, setExpandSidebarOne] = useState(true);
  const [expandSidebarTwo, setExpandSidebarTwo] = useState(true);
  const { performSearch, setSearchQuery, searchResults, setSelectedNoteId } = useAppContext();
  const [localSearch, setLocalSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);

    if (debouncedSearch.trim()) {
      performSearch(debouncedSearch);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearch, performSearch, setSearchQuery]);

  const handleSelectResult = (noteId: string) => {
    setSelectedNoteId(noteId);
    setShowResults(false);
    // Optional: clear search on select?
    // setLocalSearch(''); 
  };

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden font-sans">
      {/* Sidebar 1: Notebooks */}
      <aside
        className={`${expandSidebarOne ? 'w-64 min-w-64' : 'w-16 min-w-16'} bg-[#252526] border-r border-[#3e3e3e] flex flex-col transition-all duration-300 ease-in-out z-20 overflow-hidden relative shrink-0`}
      >
        <SidebarOne isExpanded={expandSidebarOne} onToggle={() => setExpandSidebarOne(!expandSidebarOne)} />
      </aside>

      {/* Right Column: Sidebar 2 + Editor + Header */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] overflow-hidden">
        {/* Top Bar / Search - Spanning Sidebar 2 and Editor */}
        <header className="h-12 border-b border-[#3e3e3e] flex items-center px-4 justify-between bg-[#1e1e1e] flex-none z-20">
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search ..."
                className="w-full bg-[#2d2d2d] text-[#d4d4d4] text-sm rounded-md border border-[#3e3e3e] px-3 py-1.5 focus:outline-none focus:border-[#007acc] placeholder-[#858585]"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onFocus={() => {
                  if (localSearch.trim()) setShowResults(true);
                }}
                onBlur={() => {
                  // Delay hiding to allow click event to register
                  setTimeout(() => setShowResults(false), 200);
                }}
              />

              {/* Search Results Dropdown */}
              {showResults && searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#252526] border border-[#3e3e3e] rounded-md shadow-xl max-h-96 overflow-y-auto z-50">
                  {searchResults.map((note) => (
                    <div
                      key={note.id}
                      className="px-3 py-2 hover:bg-[#2a2d2e] cursor-pointer border-b border-[#3e3e3e] last:border-0"
                      onClick={() => handleSelectResult(note.id)}
                    >
                      <div className="text-sm font-medium text-[#e0e0e0]">{note.title}</div>
                      <div className="text-xs text-[#858585] truncate mt-0.5">
                        {getPreviewText(note.content) ? getPreviewText(note.content).slice(0, 100) : 'Sin contenido adicional'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showResults && searchResults && searchResults.length === 0 && localSearch.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#252526] border border-[#3e3e3e] rounded-md shadow-xl p-3 z-50 text-sm text-[#858585] text-center">
                  No results found
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area: Sidebar 2 + Editor */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar 2: Notes List */}
          <aside
            className={`${expandSidebarTwo ? 'w-80 min-w-80' : 'w-16 min-w-16'} bg-[#1e1e1e] border-r border-[#3e3e3e] flex flex-col transition-all duration-300 ease-in-out z-10 overflow-hidden relative shrink-0`}
          >
            <SidebarTwo isExpanded={expandSidebarTwo} onToggle={() => setExpandSidebarTwo(!expandSidebarTwo)} />
          </aside>

          {/* Main Content Area (Editor) */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            {/* Editor Content */}
            <div className="flex-1 overflow-auto p-4 relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
