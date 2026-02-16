'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function ControlsPanelContainer() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex items-start z-40 sm:items-center ">
      <div
        className={
          'fixed left-6 mt-[86] inset-0 flex items-start flex-col justify-start border dark:bg-[#b5c18e] border-gray-200 max-w-96 shadow-lg rounded-lg h-max sm:w-fit' +
          (isOpen ? 'w-full' : ' w-fit')
        }
      >
        <button
          onClick={() => setIsOpen((old) => !old)}
          className={
            'p-3 bg-[#b5c18e] backdrop-blur-md' +
            (isOpen ? ' w-full' : ' w-10') +
            ' hover:bg-lime-100 dark:hover:bg-lime-100 transition  sm:items-center sm:mt-[0] sm:left-6 sm:flex sm:top-auto text-amber-950 justify-between rounded-lg flex flex-row'
          }
        >
          {isOpen && <h3 className="text-xl font-bold mr-2">ControlsPanelContainer</h3>}
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && (
          <div className="flex-1 flex flex-col items-center justify-center text-amber-950 max-h-64 overflow-y-auto mx-auto pb-4">
            <p>Here&apos;s going to be some filters</p>
            <p>Filter #1 Name</p>
            <p>Filter #2 Bounty</p>
            <p>Filter #3 Crew</p>
            <p>Filter #4 Organization</p>
            <p>Filter #5 Relationships</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlsPanelContainer;
