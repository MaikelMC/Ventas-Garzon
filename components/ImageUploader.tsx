'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes (jpg, png, gif, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer canaria2026' },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir');
      const data = await res.json();
      onChange(data.url || URL.createObjectURL(file));
    } catch {
      onChange(URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all ${
        dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <Loader2 size={24} className="text-primary-500 animate-spin" />
          <span className="text-xs text-surface-500">Subiendo...</span>
        </div>
      ) : value ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="max-h-24 rounded-lg object-contain" />
          <button
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="absolute -top-2 -right-2 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-2">
          <ImageIcon size={24} className="text-surface-400" />
          <span className="text-xs text-surface-500">Click o arrastra imagen</span>
          <span className="text-[0.55rem] text-surface-400">JPG, PNG, GIF, WebP &bull; Máx 5MB</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
