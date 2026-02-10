import { type ReactNode, useState } from 'react';
import { SidebarOne } from '@/features/sidebar/SidebarOne';
import { SidebarTwo } from '@/features/sidebar/SidebarTwo';

export const MainLayout = ({ children }: { children: ReactNode }) => {
	const [expandSidebarOne, setExpandSidebarOne] = useState(true);
	const [expandSidebarTwo, setExpandSidebarTwo] = useState(true);

	return (
		<div className="flex h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden font-sans">
			{/* Sidebar 1: Notebooks */}
			<aside
				className={`${expandSidebarOne ? 'w-[15vw] min-w-[15vw]' : 'w-[3vw] min-w-[3vw]'} bg-[#252526] border-r border-[#3e3e3e] flex flex-col transition-all duration-300 ease-in-out z-20 overflow-hidden relative`}
			>
				<SidebarOne isExpanded={expandSidebarOne} onToggle={() => setExpandSidebarOne(!expandSidebarOne)} />
			</aside>

			{/* Sidebar 2: Notes List */}
			<aside
				className={`${expandSidebarTwo ? 'w-[20vw] min-w-[20vw]' : 'w-[3vw] min-w-[3vw]'} bg-[#1e1e1e] border-r border-[#3e3e3e] flex flex-col transition-all duration-300 ease-in-out z-10 overflow-hidden relative`}
			>
				<SidebarTwo isExpanded={expandSidebarTwo} onToggle={() => setExpandSidebarTwo(!expandSidebarTwo)} />
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
				{/* Top Bar / Search */}
				<header className="h-12 border-b border-[#3e3e3e] flex items-center px-4 justify-between bg-[#1e1e1e]">
					{/* Search only - Toggles are now in sidebars */}
					<div className="flex-1 max-w-md mx-auto">
						<div className="relative">
							<input
								type="text"
								placeholder="Search notebooks and notes..."
								className="w-full bg-[#2d2d2d] text-[#d4d4d4] text-sm rounded-md border border-[#3e3e3e] px-3 py-1.5 focus:outline-none focus:border-[#007acc] placeholder-[#858585]"
							/>
						</div>
					</div>
				</header>

				{/* Editor Content */}
				<div className="flex-1 overflow-auto p-8 relative">
					{children}
				</div>
			</main>
		</div>
	);
};
