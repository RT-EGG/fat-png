
export const GenerateMode = {
    CreateNew: 'createNew',
    AddExtra: 'addExtra'
} as const;
  
export type GenerateMode = typeof GenerateMode[keyof typeof GenerateMode];

export type FileUrl = {
    file: File;
    url: string;
};
