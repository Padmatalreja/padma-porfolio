"use client";
/**
 * RichTextEditor — TipTap-based WYSIWYG for admin textarea fields.
 * Outputs HTML into a hidden <input> so it submits via the existing
 * server-action form without any client-side routing changes.
 */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Heading2, Heading3, Quote, Undo, Redo, Code, Minus,
} from "lucide-react";

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

function ToolbarBtn({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
      style={{
        background: active ? "rgba(201,168,118,0.18)" : "transparent",
        border: active ? "1px solid rgba(201,168,118,0.4)" : "1px solid transparent",
        color: active ? "var(--tan-dark)" : "var(--text-muted)",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.background = "rgba(201,168,118,0.1)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span
      className="mx-1 h-5 w-px shrink-0 self-center"
      style={{ background: "var(--border)" }}
    />
  );
}

export function RichTextEditor({ name, defaultValue = "", placeholder, required }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  // Track previous defaultValue to detect external changes (e.g. form remount with new data)
  const prevDefaultRef = useRef(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      // Renamed import to avoid duplicate extension name warning
      TipTapLink.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder || "Write here…" }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-editor focus:outline-none min-h-[160px] max-w-none",
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  // Sync editor when defaultValue changes from outside (parent re-renders with new data).
  // Uses a ref to compare instead of putting editor in the dependency array,
  // which would cause the "dependency array size changed" React error.
  useEffect(() => {
    if (defaultValue !== prevDefaultRef.current) {
      prevDefaultRef.current = defaultValue;
      if (editor) {
        editor.commands.setContent(defaultValue || "");
        setHtml(defaultValue || "");
      }
    }
  }, [defaultValue, editor]);

  useEffect(() => {
    if (showLinkInput) linkInputRef.current?.focus();
  }, [showLinkInput]);

  if (!editor) return null;

  const handleSetLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
    >
      {/* Hidden input carries HTML for form submission */}
      <input type="hidden" name={name} value={html} />
      {required && (
        <input type="text" className="sr-only" required value={html || ""} readOnly tabIndex={-1} />
      )}

      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}
      >
        <ToolbarBtn title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={14} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={14} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal rule" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={14} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          title="Link"
          active={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setLinkUrl(editor.getAttributes("link").href ?? "");
              setShowLinkInput((v) => !v);
            }
          }}
        >
          <LinkIcon size={14} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Undo" active={false} onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={14} />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" active={false} onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={14} />
        </ToolbarBtn>
      </div>

      {/* ── Link URL input ── */}
      {showLinkInput && (
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}
        >
          <input
            ref={linkInputRef}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleSetLink(); }
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            placeholder="https://..."
            className="flex-1 rounded-lg px-3 py-1.5 text-sm outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <button type="button" onClick={handleSetLink}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            Apply
          </button>
          <button type="button" onClick={() => setShowLinkInput(false)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        className="px-4 py-3 text-sm"
        style={{ color: "var(--text-primary)", minHeight: "160px" }}
      />

      <style>{`
        .prose-editor h2 { font-size:1.25rem; font-weight:700; color:var(--text-primary); margin:1em 0 0.4em; }
        .prose-editor h3 { font-size:1.05rem; font-weight:700; color:var(--text-primary); margin:0.9em 0 0.3em; }
        .prose-editor p  { margin:0.4em 0; color:var(--text-secondary); line-height:1.65; }
        .prose-editor ul { list-style:disc; padding-left:1.4em; color:var(--text-secondary); }
        .prose-editor ol { list-style:decimal; padding-left:1.4em; color:var(--text-secondary); }
        .prose-editor li { margin:0.2em 0; }
        .prose-editor blockquote { border-left:3px solid var(--tan); padding-left:0.8em; color:var(--text-muted); font-style:italic; margin:0.6em 0; }
        .prose-editor code { background:rgba(201,168,118,0.15); border-radius:4px; padding:0.1em 0.3em; font-size:0.85em; color:var(--tan-dark); }
        .prose-editor a { color:var(--cyan); text-decoration:underline; }
        .prose-editor hr { border:none; border-top:1px solid var(--border); margin:1em 0; }
        .prose-editor .tiptap.ProseMirror p.is-editor-empty:first-child::before { content:attr(data-placeholder); float:left; color:var(--text-muted); pointer-events:none; height:0; }
      `}</style>
    </div>
  );
}
