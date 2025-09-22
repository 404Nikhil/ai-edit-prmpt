import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/types';

interface CommandPaletteProps {
  prompts: Prompt[];
  onSelect: (prompt: Prompt) => void;
  onClose: () => void;
}

export default function CommandPalette({ prompts, onSelect, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPrompts = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredPrompts.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredPrompts.length || 1)) % (filteredPrompts.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPrompts[selectedIndex]) {
          onSelect(filteredPrompts[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    // Use document instead of window to avoid conflicts
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredPrompts, selectedIndex, onSelect, onClose]);

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-start pt-20 bg-black bg-opacity-50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
          }}
          placeholder="Search for a prompt..."
          className="w-full p-4 border-b border-gray-200 text-base outline-none rounded-t-lg"
          autoFocus
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt, index) => (
              <li
                key={prompt.id}
                onClick={() => onSelect(prompt)}
                className={`flex items-center p-3 rounded-md cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xl mr-3">{prompt.icon}</span>
                <span>{prompt.title}</span>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No prompts found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}