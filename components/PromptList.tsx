import { Prompt } from '@/lib/types';

interface PromptListProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
}

export default function PromptList({ prompts, onSelectPrompt, onEdit }: PromptListProps) {
  if (prompts.length === 0) {
    return <p className="mt-4 text-center text-sm text-gray-500">No prompts yet. Add one!</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="group flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-100"
          onClick={() => onSelectPrompt(prompt)}
        >
          <div className="flex items-center">
            <span className="mr-3 text-xl">{prompt.icon}</span>
            <div>
              <h3 className="font-medium">{prompt.title}</h3>
              <p className="text-xs text-gray-500">v{prompt.version}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            className="hidden rounded-md px-2 py-1 text-xs font-semibold text-gray-600 group-hover:block hover:bg-gray-200"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}