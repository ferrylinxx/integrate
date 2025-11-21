'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/editor/store';

interface EditableTextProps {
  value: string;
  path: string; // Ruta en el config, ej: 'components.mapaDeSituacion.title.content'
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  path,
  className = '',
  style = {},
  as: Component = 'p',
  placeholder = 'Escribe aquí...',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { updateConfig, isEditorMode } = useEditorStore();

  // Sincronizar con el valor externo
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Focus automático al entrar en modo edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isEditorMode) return;
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (editValue.trim() !== value) {
      updateConfig(path, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleConfirm();
  };

  // Si no está en modo editor, renderizar texto normal
  if (!isEditorMode) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  // Modo edición activo
  if (isEditing) {
    const isMultiline = Component === 'p' || value.length > 50;
    
    const inputClassName = `
      w-full
      bg-white
      border-2
      border-blue-500
      rounded
      px-2
      py-1
      text-inherit
      font-inherit
      resize-none
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-opacity-50
    `;

    if (isMultiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={inputClassName}
          style={style}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={inputClassName}
        style={style}
      />
    );
  }

  // Modo vista con hover
  return (
    <Component
      className={`
        ${className}
        cursor-text
        transition-all
        duration-150
        ${isHovering ? 'bg-blue-50 ring-1 ring-blue-200' : ''}
        rounded
        px-1
        -mx-1
      `}
      style={style}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title="Doble click para editar"
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </Component>
  );
};

