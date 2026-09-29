"use client";
import { Trash2 } from "lucide-react";
import { deleteMessage } from "@/app/admin/(protected)/actions";

export function DeleteMessageBtn({ id }: { id: string }) {
  return (
    <form
      action={deleteMessage.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this message permanently?")) e.preventDefault();
      }}
    >
      <button
        title="Delete message"
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
        style={{
          background: "var(--error-bg)",
          border: "1px solid var(--error-border)",
          color: "var(--error)",
        }}
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
