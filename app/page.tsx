'use client';
import { useState, useRef, useEffect } from 'react';
import { Prompt } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import PromptList from '@/components/PromptList';
import PromptForm from '@/components/PromptForm';
import CommandPalette from '@/components/CommandPalette';

export default function HomePage() {
    const [prompts, setPrompts] = useLocalStorage<Prompt[]>('prompts', []);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [mainText, setMainText] = useState('');
    const [isPaletteOpen, setPaletteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const selectionRef = useRef({ start: 0, end: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                setPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handlePromptSelect = async (prompt: Prompt) => {
      // (content.js)
      setPaletteOpen(false);
      setIsLoading(true);
    
      const textToSend = mainText; // The app now only works on its own text area
    
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: prompt.prompt, user: textToSend }),
        });
        if (!response.ok) throw new Error('API Error');
    
        const data = await response.json();
    
        //  the generated text to the content script
        window.parent.postMessage({ type: 'INSERT_TEXT', text: data.text }, '*');
    
      } catch (error) {
        alert('Failed to generate text.');
      } finally {
        setIsLoading(false);
      }
    };
    

    const handleSelectionChange = () => {
        if (textAreaRef.current) {
            selectionRef.current = {
                start: textAreaRef.current.selectionStart,
                end: textAreaRef.current.selectionEnd,
            };
        }
    };

    const handleSavePrompt = (promptToSave: Prompt) => {
      if (promptToSave.id) {
        setPrompts(prompts.map(p => (p.id === promptToSave.id ? promptToSave : p)));
      } else {
        setPrompts([...prompts, { ...promptToSave, id: crypto.randomUUID() }]);
      }
      setEditingPrompt(null);
    };
    
    const handleDeletePrompt = (id: string) => {
      if (window.confirm('Are you sure you want to delete this prompt?')) {
        setPrompts(prompts.filter(p => p.id !== id));
        setEditingPrompt(null); 
      }
    };
    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            <aside className="w-1/3 max-w-sm border-r border-gray-200 p-4 flex flex-col">
                <header className="mb-4">
                    <h1 className="text-xl font-semibold">AI Prompts</h1>
                    <p className="text-sm text-gray-500">
                        Create and manage your custom commands.
                    </p>
                </header>
                <div className="flex justify-between">
                    <button
                        onClick={() => setEditingPrompt({ id: '', icon: '💡', title: '', version: '1.0', prompt: '', mode: 'replace_all' })}
                        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Add New Prompt
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto mt-4">
                  <PromptList
                      prompts={prompts}
                      onSelectPrompt={(p) => { /* Selection is now handled by the palette */ }}
                      onEdit={setEditingPrompt}
                  />
                </div>
            </aside>

            <main className="flex-1 p-6 flex flex-col relative">
               <div className="text-center mb-4">
                   <h2 className="text-lg font-medium">AI Editor</h2>
                   <p className="text-sm text-gray-500">Type your text below. Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+Shift+L</kbd> to open the command palette.</p>
               </div>
                <textarea
                    ref={textAreaRef}
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    onSelect={handleSelectionChange} // Track selection
                    className="w-full flex-1 rounded-md border border-gray-300 p-4 text-base focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Start writing..."
                />
                {isLoading && <div className="absolute bottom-8 right-8 text-gray-500 animate-pulse">Generating...</div>}
            </main>

            {editingPrompt && ( <PromptForm prompt={editingPrompt} onSave={handleSavePrompt} onCancel={() => setEditingPrompt(null)} onDelete={handleDeletePrompt} /> )}

            {isPaletteOpen && (
                <CommandPalette
                    prompts={prompts}
                    onSelect={handlePromptSelect}
                    onClose={() => setPaletteOpen(false)}
                />
            )}
        </div>
    );
}