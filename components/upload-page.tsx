'use client';
import React, { useState } from 'react';
import { Upload } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['.pdf', '.doc', '.docx'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  const validateFile = (file: File): string | null => {
    const ext = getFileExtension(file.name);
    if (!ALLOWED_TYPES.includes(ext)) {
      return `Invalid file type. Please upload ${ALLOWED_TYPES.join(', ')} files only.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    setStatus('idle');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileInfo(null);
    setError(null);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (!fileInfo) return;

    setStatus('uploading');

    await new Promise(resolve => setTimeout(resolve, 1500));

    setStatus('success');

    setTimeout(() => {
      setFileInfo(null);
      setStatus('idle');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10 opacity-0 animate-fade-up">
          <h1 className="font-display text-4xl text-[var(--text-primary)] mb-3 tracking-tight">
            Upload Resume
          </h1>
          <p className="text-[var(--text-tertiary)] text-lg">
            Add candidates to your talent pool
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl text-[var(--text-secondary)] text-sm opacity-0 animate-scale-in">
            {error}
          </div>
        )}

        {status === 'success' && (
          <div className="mb-6 p-4 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl text-[var(--text-secondary)] text-sm opacity-0 animate-scale-in">
            Resume uploaded successfully
          </div>
        )}

        <div className="opacity-0 animate-fade-up stagger-2">
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative block rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
              ${isDragging
                ? 'bg-[var(--bg-tertiary)] border-2 border-neutral-400 dark:border-neutral-500'
                : fileInfo
                  ? 'bg-[var(--bg-secondary)] border-2 border-[var(--border-secondary)]'
                  : 'bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-secondary)] hover:border-neutral-400 dark:hover:border-neutral-500'
              }
            `}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {fileInfo ? (
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[var(--text-primary)] font-medium truncate">{fileInfo.name}</p>
                    <p className="text-[var(--text-muted)] text-sm mt-0.5">{formatFileSize(fileInfo.size)}</p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="ml-4 px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-tertiary)]'}`}>
                  <Upload className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-[var(--text-primary)] text-lg font-medium mb-2">
                  {isDragging ? 'Drop your file here' : 'Drop your resume here'}
                </p>
                <p className="text-[var(--text-muted)] text-sm mb-4">
                  or click to browse
                </p>
                <p className="text-[var(--text-muted)] text-xs">
                  PDF, DOC, DOCX up to {formatFileSize(MAX_FILE_SIZE)}
                </p>
              </div>
            )}
          </label>

          {fileInfo && status !== 'success' && (
            <button
              className={`
                mt-6 w-full py-4 font-medium rounded-xl transition-all duration-300
                ${status === 'uploading'
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                }
              `}
              onClick={handleSubmit}
              disabled={status === 'uploading'}
            >
              {status === 'uploading' ? 'Uploading...' : 'Upload Resume'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
