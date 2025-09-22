export interface Prompt {
    id: string;
    icon: string;
    title: string;
    prompt: string;
    version: string;
    mode: 'replace_all' | 'replace_selection' | 'insert_at_end';
  }