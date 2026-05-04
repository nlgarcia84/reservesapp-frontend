import { Upload } from 'lucide-react';
import Image from 'next/image';

type InputFileFormProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  accept?: string;
  preview?: string;
};

export const InputFileForm = ({
  onChange,
  disabled = false,
  accept = 'image/*',
  preview,
}: InputFileFormProps) => {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => document.getElementById('file-input')?.click()}
        disabled={disabled}
        className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/15 bg-black px-3 py-3 hover:border-white/25 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Upload className="w-5 h-5 text-zinc-400" />
        <span className="text-zinc-100">Seleccionar imatge</span>
      </button>
      <input
        id="file-input"
        type="file"
        onChange={onChange}
        disabled={disabled}
        accept={accept}
        className="hidden"
      />
      {preview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/15">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
};
