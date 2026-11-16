import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, Edit2 } from 'lucide-react';

interface InlineTextProps {
  textKey: string;
  defaultValue: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label' | 'strong';
  multiline?: boolean;
  label?: string;
}

export const InlineText: React.FC<InlineTextProps> = ({
  textKey,
  defaultValue,
  className = '',
  as = 'span',
  multiline = false,
  label
}) => {
  const { getText, updateText, isAdmin, isLiveEditMode } = useApp();
  const currentText = getText(textKey, defaultValue);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentText);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync tempValue when currentText changes from outside
  useEffect(() => {
    if (!isEditing) {
      setTempValue(currentText);
    }
  }, [currentText, isEditing]);

  // Focus and select input on entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle clicking outside to automatically save
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, tempValue]);

  const handleSave = () => {
    const trimmed = tempValue.trim();
    if (trimmed !== '') {
      updateText(textKey, trimmed);
    } else {
      setTempValue(currentText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(currentText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  // Normal view when not in Admin Live Edit Mode
  if (!isAdmin || !isLiveEditMode) {
    const Component = as;
    return <Component className={className}>{currentText}</Component>;
  }

  // When Admin is in Live Edit Mode and actively typing
  if (isEditing) {
    return (
      <div 
        ref={containerRef} 
        className="relative inline-block w-full max-w-full my-0.5 z-40"
        onClick={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.max(2, tempValue.split('\n').length)}
            className={`w-full p-2 text-slate-900 bg-white border-2 border-cyan-500 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans ${className}`}
            style={{ minHeight: '60px' }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-2 py-1 text-slate-900 bg-white border-2 border-cyan-500 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans ${className}`}
          />
        )}

        {/* Floating action bar for saving or canceling */}
        <div className="absolute -bottom-9 left-0 z-50 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md text-white px-2 py-1 rounded-lg shadow-2xl border border-slate-700 text-xs">
          <span className="text-[10px] text-cyan-300 font-semibold px-1">
            {label || 'Chỉnh sửa'}:
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] cursor-pointer shadow-xs"
            title="Lưu (Enter)"
          >
            <Check className="w-3 h-3" />
            <span>Lưu</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] cursor-pointer"
            title="Huỷ bỏ (Esc)"
          >
            <X className="w-3 h-3" />
            <span>Huỷ</span>
          </button>
        </div>
      </div>
    );
  }

  // When Admin is in Live Edit Mode but NOT actively editing (clickable with hover indicator)
  const Component = as;
  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
      }}
      className={`relative group/inline-edit cursor-pointer rounded transition-all duration-150 inline-block hover:outline-2 hover:outline-dashed hover:outline-cyan-400 hover:bg-cyan-400/15 ${className}`}
      title={`Bấm vào đây để sửa trực tiếp: "${label || currentText.slice(0, 30)}"`}
    >
      {currentText}
      
      {/* Floating hover badge */}
      <span className="absolute -top-3.5 -right-2 hidden group-hover/inline-edit:flex items-center gap-1 bg-cyan-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg pointer-events-none z-30 uppercase tracking-wider animate-in fade-in duration-100 border border-white/40">
        <Edit2 className="w-2.5 h-2.5" />
        <span>Sửa</span>
      </span>
    </Component>
  );
};
