import { Plus, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { canonicalChecklistLabel, t, translateChecklistLabel } from "../../lib/i18n";
import { useLanguageStore } from "../../store/useLanguageStore";
import type { ChecklistItem } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ChecklistEditorProps {
  checklist: ChecklistItem[];
  onAdd: (label: string) => void;
  onRemove: (itemId: string) => void;
  onRename: (itemId: string, label: string) => void;
  onToggle?: (itemId: string) => void;
}

export function ChecklistEditor({
  checklist,
  onAdd,
  onRemove,
  onRename,
  onToggle,
}: ChecklistEditorProps) {
  const language = useLanguageStore((state) => state.language);
  const [newLabel, setNewLabel] = useState("");
  const completed = checklist.filter((item) => item.completed).length;
  const percent = checklist.length === 0 ? 0 : Math.round((completed / checklist.length) * 100);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd(newLabel);
    setNewLabel("");
  }

  return (
    <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-guhr-text">{t(language, "checklist.title")}</h3>
          <p className="mt-1 text-sm text-guhr-muted">
            {completed} / {checklist.length} {t(language, "checklist.completed")}
          </p>
        </div>
        <span className="rounded-full bg-guhr-background px-3 py-1 text-sm font-semibold text-guhr-muted">
          {percent}%
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-guhr-background">
        <div
          className="h-full rounded-full bg-guhr-gold transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {checklist.map((item) => (
          <div
            className="flex items-center gap-2 rounded-2xl border border-guhr-border/70 bg-white/68 px-3 py-2.5 text-sm text-guhr-text transition hover:border-guhr-gold/40 hover:bg-white"
            key={item.id}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggle?.(item.id)}
              disabled={!onToggle}
              className="h-4 w-4 shrink-0 rounded border-guhr-border accent-guhr-gold disabled:opacity-45"
            />
            <input
              key={`${item.id}-${language}`}
              defaultValue={translateChecklistLabel(item.label, language)}
              onBlur={(event) => {
                const nextLabel = event.target.value.trim();
                if (nextLabel) {
                  onRename(item.id, canonicalChecklistLabel(nextLabel));
                } else {
                  event.target.value = translateChecklistLabel(item.label, language);
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              className="rounded-full p-1.5 text-guhr-muted transition hover:bg-red-50 hover:text-guhr-red"
              onClick={() => onRemove(item.id)}
              aria-label={`${t(language, "checklist.remove")} ${translateChecklistLabel(item.label, language)}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={handleAdd}>
        <Input
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
          placeholder={t(language, "checklist.placeholder")}
        />
        <Button type="submit" variant="secondary" disabled={!newLabel.trim()}>
          <Plus className="h-4 w-4" />
          {t(language, "checklist.add")}
        </Button>
      </form>
    </section>
  );
}
