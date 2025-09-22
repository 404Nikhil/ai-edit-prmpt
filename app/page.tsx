'use client';

import { useState } from 'react';
import { Prompt } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import PromptList from '@/components/PromptList';

export default function HomePage() {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('opale-prompts', []);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState<Prompt | null>(null);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-1/3 max-w-sm border-r border-gray-200 p-4">
         <header className="mb-4">
          <h1 className="text-xl font-semibold">Opale Prompts</h1>
          <p className="text-sm text-gray-500">
            Manage and select your AI prompts.
          </p>
        </header>
         <div className="flex justify-between">
             <button
                onClick={() => setIsEditing({ id: '', icon: '💡', title: '', version: '1.0', prompt: '', mode: 'replace_all' })}
                className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
             >
                Add New Prompt
            </button>
        </div>
        <PromptList
          prompts={prompts}
          onSelectPrompt={setSelectedPrompt}
          onEdit={setIsEditing}
        />
      </aside>

      <main className="flex-1 p-6">
        <div className="mx-auto h-full max-w-4xl">
          <div className="flex h-full flex-col">
            <h2 className="text-lg font-medium">Text Generation</h2>
            <div className="mt-2 flex items-center space-x-2">
                <input
                type="text"
                placeholder="Search for a prompt or start typing..."
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <textarea
              className="mt-4 flex-1 rounded-md border border-gray-300 p-4 text-base"
              placeholder="Enter text here to transform with a prompt, or use the search bar above to generate new text..."
            />
            <div className="mt-4 flex justify-end">
                <button className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
                    Generate
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}