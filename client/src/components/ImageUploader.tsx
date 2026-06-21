import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '../services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      onChange(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      {/* Preview / Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 transition-all cursor-pointer min-h-[120px] ${
          dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : value
            ? 'border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50'
            : 'border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 size={24} className="text-primary-500 animate-spin" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Subiendo...</span>
          </div>
        ) : value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="Vista previa"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <div className="p-2 rounded-full bg-surface-100 dark:bg-surface-600">
              <Upload size={18} className="text-surface-400" />
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400 text-center">
              Toca para seleccionar imagen
            </span>
            <span className="text-[0.6rem] text-surface-400 dark:text-surface-500">
              JPG, PNG, WebP — máx. 5MB
            </span>
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <ImageIcon size={12} /> {error}
        </p>
      )}
    </div>
  );
};
