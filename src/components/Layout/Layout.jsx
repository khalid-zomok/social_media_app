import React, { useState } from 'react';
import Navbar from './../Navbar/Navbar';
import Footer from './../Footer/Footer';
import { Outlet } from 'react-router-dom';
import Sidebar from './../SideBar/SideBar';
import AIChatBot from '../AIChatBot/AIChatBot';

export default function Layout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <Navbar/>
      <div className="flex flex-1 relative w-full max-w-[1440px] mx-auto">
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 transition-all duration-500 ease-in-out pr-20 lg:pr-24 lg:group-hover:pr-64">
          <div className="bg-[linear-gradient(180deg,#ec4899_0%,#09c_100%)] min-h-full p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
        
        {/* Sidebar */}
        <Sidebar />

        {/* AI Chat Bot Component */}
        <div className="fixed bottom-6 left-6 z-50"> 
          {/* وضعناه في اليسار لأن الـ Sidebar في اليمين pr-20 */}
          <AIChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </div>
      </div>

      <Footer />
    </div>
  );
}