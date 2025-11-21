"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  color?: string;
  borderColor?: string;
}

export function RichTextEditor({ content, onChange, color = '#2C248E', borderColor = '#2C248E' }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    immediatelyRender: false, // ✅ Fix para SSR
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    icon: any; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      type="button"
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200' : ''
      }`}
      title={title}
      style={isActive ? { backgroundColor: `${color}20`, color: color } : {}}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor }}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b-2 p-2 flex flex-wrap gap-1" style={{ borderBottomColor: borderColor }}>
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            title="Negrita (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            title="Cursiva (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={UnderlineIcon}
            title="Subrayado (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            icon={Code}
            title="Código"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={Heading1}
            title="Título 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={Heading2}
            title="Título 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={Heading3}
            title="Título 3"
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            title="Lista con viñetas"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            title="Lista numerada"
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={AlignLeft}
            title="Alinear izquierda"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={AlignCenter}
            title="Alinear centro"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={AlignRight}
            title="Alinear derecha"
          />
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            icon={Link2}
            title="Insertar enlace"
          />
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            title="Deshacer (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            title="Rehacer (Ctrl+Y)"
          />
        </div>

        {/* Preview Toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            type="button"
            className={`p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              showPreview ? 'bg-gray-200' : ''
            }`}
            style={showPreview ? { backgroundColor: `${color}20`, color: color } : {}}
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-semibold">Vista Previa</span>
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="bg-white">
        {showPreview ? (
          <div className="p-4 min-h-[200px] border-2 border-dashed border-gray-300 m-2 rounded">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Character Count */}
      <div className="bg-gray-50 border-t-2 px-4 py-2 text-xs text-gray-600 flex justify-between items-center"
           style={{ borderTopColor: borderColor }}>
        <span>
          {editor.storage.characterCount?.characters() || 0} caracteres · {editor.storage.characterCount?.words() || 0} palabras
        </span>
        <span className="text-xs italic">
          Usa <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl+B</kbd> para negrita, 
          <kbd className="px-1 py-0.5 bg-gray-200 rounded ml-1">Ctrl+I</kbd> para cursiva
        </span>
      </div>
    </div>
  );
}

