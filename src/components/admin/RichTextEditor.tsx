"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, RemoveFormatting, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    dir?: "ltr" | "rtl";
}

export function RichTextEditor({ value, onChange, placeholder, dir = "ltr" }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: {},
                orderedList: {},
                blockquote: {},
                code: {},
                codeBlock: {},
                horizontalRule: {},
                bold: {},
                italic: {},
                strike: {},
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: { class: "editor-image" },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "tiptap-editor",
                dir,
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. loading article for edit)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "", { emitUpdate: false });
        }
    }, [value, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter URL:", prev);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="tiptap-wrapper">
            {/* ── Toolbar ── */}
            <div className="tiptap-toolbar">
                {/* History */}
                <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Headings */}
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
                    <Heading1 size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                    <Heading2 size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
                    <Heading3 size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Marks */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
                    <Bold size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
                    <Italic size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
                    <Strikethrough size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
                    <Code size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Lists */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
                    <List size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
                    <ListOrdered size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Block */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
                    <Quote size={15} />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
                    <span className="text-xs font-mono font-bold">{"</>"}</span>
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
                    <Minus size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Link & Image */}
                <ToolBtn onClick={setLink} active={editor.isActive("link")} title="Insert link">
                    <LinkIcon size={15} />
                </ToolBtn>
                <ToolBtn onClick={addImage} title="Insert image">
                    <ImageIcon size={15} />
                </ToolBtn>

                <div className="tiptap-divider" />

                {/* Clear formatting */}
                <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
                    <RemoveFormatting size={15} />
                </ToolBtn>
            </div>

            {/* ── Editor Body ── */}
            <EditorContent editor={editor} />

            {!editor.getText() && placeholder && (
                <div className="tiptap-placeholder">{placeholder}</div>
            )}
        </div>
    );
}

function ToolBtn({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`tiptap-btn ${active ? "active" : ""}`}
        >
            {children}
        </button>
    );
}
