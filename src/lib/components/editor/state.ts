import {
  BoldIcon,
  Code2Icon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ImagePlusIcon,
  ItalicIcon,
  ListOrderedIcon,
  ListTreeIcon,
  PilcrowIcon,
  PlusIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SeparatorHorizontalIcon,
  StrikethroughIcon,
  Undo2Icon,
  WrapTextIcon
} from 'lucide-svelte';
import type { Editor } from '@tiptap/core';

export const menuItems = [
  {
    Icon: BoldIcon,
    title: 'Bold',
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor.isActive('bold')
  },
  {
    Icon: ItalicIcon,
    title: 'Italic',
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor.isActive('italic')
  },
  {
    Icon: StrikethroughIcon,
    title: 'Strike',
    action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor: Editor) => editor.isActive('strike')
  },
  {
    Icon: Code2Icon,
    title: 'Code',
    action: (editor: Editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor: Editor) => editor.isActive('code')
  },
  {
    Icon: HighlighterIcon,
    title: 'Highlight Text',
    action: (editor: Editor) => {
      editor.chain().focus().toggleHighlight().run()
    },
  },
  {
    type: 'divider'
  },
  {
    Icon: Heading1Icon,
    title: 'Heading 1',
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor: Editor) => editor.isActive('heading', { level: 1 })
  },
  {
    Icon: Heading2Icon,
    title: 'Heading 2',
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor: Editor) => editor.isActive('heading', { level: 2 })
  },
  {
    Icon: Heading3Icon,
    title: 'Heading 3',
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor: Editor) => editor.isActive('heading', { level: 3 })
  },
  {
    Icon: PilcrowIcon,
    title: 'Paragraph',
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor: Editor) => editor.isActive('paragraph')
  },
  {
    Icon: ListTreeIcon,
    title: 'Bullet List',
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: Editor) => editor.isActive('bulletList')
  },
  {
    Icon: ListOrderedIcon,
    title: 'Ordered List',
    action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: Editor) => editor.isActive('orderedList')
  },
  {
    Icon: CodeIcon,
    title: 'Code Block',
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor: Editor) => editor.isActive('codeBlock')
  },
  {
    type: 'divider'
  },
  {
    Icon: QuoteIcon,
    title: 'Blockquote',
    action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor: Editor) => editor.isActive('blockquote')
  },
  {
    Icon: SeparatorHorizontalIcon,
    title: 'Horizontal Rule',
    action: (editor: Editor) => editor.chain().focus().setHorizontalRule().run()
  },
  {
    Icon: ImagePlusIcon,
    title: 'Insert Image',
    action: (editor: Editor) => {
      const url = window.prompt('URL');
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      }
    }
  },
  {
    type: 'divider'
  },
  {
    Icon: WrapTextIcon,
    title: 'Hard Break',
    action: (editor: Editor) => editor.chain().focus().setHardBreak().run()
  },
  {
    Icon: RemoveFormattingIcon,
    title: 'Clear Format',
    action: (editor: Editor) => editor.chain().focus().clearNodes().unsetAllMarks().run()
  },
  {
    type: 'divider'
  },
  {
    Icon: Undo2Icon,
    title: 'Undo',
    action: (editor: Editor) => editor.chain().focus().undo().run()
  },
  {
    Icon: Redo2Icon,
    title: 'Redo',
    action: (editor: Editor) => editor.chain().focus().redo().run()
  }
];
