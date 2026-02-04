'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function ControlsPanelContainer() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 dark:bg-black/70 dark:border-gray-700 rounded-lg p-6 w-80 max-h-[60dvh] overflow-y-auto flex flex-col items-center gap-4 pointer-events-auto shadow-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="self-end p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
            >
              <ChevronUp size={20} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <p>ControlsPanelContainer</p>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3 bg-white/70 backdrop-blur-md border border-gray-200 dark:bg-black/70 dark:border-gray-700 rounded-lg hover:bg-white/90 dark:hover:bg-black/90 transition shadow-lg"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </>
  );
}

export default ControlsPanelContainer;
