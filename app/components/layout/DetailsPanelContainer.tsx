'use client';

import { XIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface DetailsPanelContainerProps {
  isOpen: boolean;
  onClose: () => void;
  detailsHeading?: string;
  detailsText?: string;
}

const loremText = `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio reprehenderit rerum aliquid numquam fuga in nostrum, nemo repudiandae, alias temporibus cupiditate eligendi? Cumque ullam ea mollitia voluptatibus quibusdam voluptatem hic.`;

function DetailsPanelContainer({
  isOpen,
  onClose,
  detailsHeading,
  detailsText,
}: DetailsPanelContainerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Mobile - comes from top */}
      <motion.div
        initial={{ y: 600 }}
        animate={{ y: isOpen ? 0 : 500 }}
        transition={{ type: 'spring', stiffness: 300, damping: 50 }}
        className="fixed bottom-0 right-0 z-50 md:hidden bg-white/10 backdrop-blur-md border-b border-gray-200 dark:bg-black/20 dark:border-gray-700 rounded-b-2xl max-h-[50dvh] overflow-y-auto h-80 w-full md:w-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <h3>{detailsHeading}</h3>
            <p>{detailsText || loremText}</p>
          </div>
        </div>
      </motion.div>

      {/* Desktop - slides from right */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: isOpen ? 0 : 500 }}
        transition={{ type: 'spring', stiffness: 300, damping: 50 }}
        className="hidden md:flex fixed right-0 bottom-0 h-[91dvh] w-1/4 bg-white/70 backdrop-blur-md border-l border-gray-200 dark:bg-black/70 dark:border-gray-700 z-40 flex-col"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="flex-1 text-gray-600 dark:text-gray-400 overflow-y-auto">
            <h3>{detailsHeading}</h3>
            <p>{detailsText || loremText}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default DetailsPanelContainer;
