import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/types';

interface PromptFormProps {
  prompt: Prompt;
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export default function PromptForm({ prompt, onSave, onCancel, onDelete }: PromptFormProps) {
  const [formData, setFormData] = useState<Prompt>(prompt);

  useEffect(() => {
    setFormData(prompt);
  }, [prompt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isNewPrompt = !prompt.id;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">{isNewPrompt ? 'Add New Prompt' : 'Edit Prompt'}</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Icon</label>
                <input type="text" name="icon" id="icon" value={formData.icon} onChange={handleChange} className="mt-1 block w-16 rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="flex-grow">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
               <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700">Version</label>
                <input type="text" name="version" id="version" value={formData.version} onChange={handleChange} className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
              <textarea name="prompt" id="prompt" value={formData.prompt} onChange={handleChange} required rows={8} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 'Summarize the following text into three concise bullet points...'"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              {!isNewPrompt && (
                 <button type="button" onClick={() => onDelete(prompt.id)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                   Delete
                 </button>
              )}
            </div>
            <div className="space-x-2">
               <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Save Prompt
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}