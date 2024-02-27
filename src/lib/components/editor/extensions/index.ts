import { InputRule } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import UploadImagesPlugin from '../plugins/upload-images';
import SlashCommand from './slash-command.js';
import UpdatedImage from './updated-image.js';
import Document from '@tiptap/extension-document';
import { FontSize } from './font-size';
import { Heading, Title, Summary } from "./title"

const CustomDocument = Document.extend({
  content: `title summary block+`,
});

export const defaultExtensions = [
  CustomDocument,
  StarterKit.configure({
    document: false,
    heading: false,
    paragraph: {
      HTMLAttributes: {
        class: 'sm:text-xl/8'
      }
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3 -mt-2'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3 -mt-2'
      }
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal -mb-2'
      }
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-layer-8'
      }
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'rounded-sm bg-layer-2 p-4 font-mono font-medium text-layer-11'
      }
    },
    code: {
      HTMLAttributes: {
        class: 'rounded-md bg-layer-3 px-1.5 py-1 font-mono font-medium text-layer-13',
        spellcheck: 'false'
      }
    },
    horizontalRule: false,
    dropcursor: {
      color: '#DBEAFE',
      width: 4
    },
    gapcursor: false
  }),
  Title,
  Summary,
  Heading,
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          }
        })
      ];
    }
  }).configure({
    HTMLAttributes: {
      class: 'mt-4 mb-6 border-t border-layer-5'
    }
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        'text-layer-9 underline underline-offset-[3px] hover:text-layer-8 transition-colors cursor-pointer'
    }
  }),
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [UploadImagesPlugin()];
    }
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: 'rounded-lg border border-layer-3'
    }
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: 'rounded-lg border border-layer-3'
    }
  }),
  Placeholder.configure({
    showOnlyCurrent: false,
    placeholder: ({ node }: any) => {
      if (node.type.name === "title") {
        return "What's the title?";
      }
      if (node.type.name === "summary") {
        return "What's the summary?";
      }
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands";
    },
    includeChildren: true
  }),
  SlashCommand,
  TiptapUnderline,
  TextStyle,
  FontSize,
  Color,
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'bg-layer-12 text-layer-0'
    }
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: 'not-prose pl-2'
    }
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'flex items-start my-4'
    },
    nested: true
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true
  })
];
