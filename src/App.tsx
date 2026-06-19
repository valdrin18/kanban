import { KanbanBoard } from "./components/board/KanbanBoard";
import { AddClientDrawer } from "./components/modals/AddClientDrawer";
import { ClientDetailDrawer } from "./components/modals/ClientDetailDrawer";
import { DashboardMetrics } from "./components/layout/DashboardMetrics";
import { FilterBar } from "./components/layout/FilterBar";
import { Header } from "./components/layout/Header";
import { useEffect } from "react";
import { t } from "./lib/i18n";
import { useLanguageStore } from "./store/useLanguageStore";
import { useBoardStore } from "./store/useBoardStore";

function localizeErrorMessage(error: string | null, language: "en" | "de") {
  if (!error) return "";

  if (error.startsWith("Supabase is not configured.")) {
    return t(language, "app.supabaseConfigError");
  }

  if (error === "Something went wrong while saving the board.") {
    return t(language, "app.genericBoardError");
  }

  return error;
}

export default function App() {
  const language = useLanguageStore((state) => state.language);
  const loadBoard = useBoardStore((state) => state.loadBoard);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const boardColumns = useBoardStore((state) => state.boardColumns);
  const visibleError = localizeErrorMessage(error, language);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  return (
    <div className="min-h-screen bg-guhr-background text-guhr-text">
      <Header />
      <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {isLoading ? (
          <section className="rounded-[2rem] border border-guhr-border bg-white/82 p-8 text-center shadow-card">
            <p className="text-sm font-medium text-guhr-muted">{t(language, "app.loading")}</p>
          </section>
        ) : error && boardColumns.length === 0 ? (
          <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6 shadow-card">
            <p className="text-sm font-semibold text-red-800">{t(language, "app.databaseIssue")}</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-red-700">{visibleError}</p>
            <button
              type="button"
              className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm"
              onClick={() => void loadBoard()}
            >
              {t(language, "app.retry")}
            </button>
          </section>
        ) : (
          <>
            {error && (
              <section className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {visibleError}
              </section>
            )}
            <DashboardMetrics />
            <FilterBar />
            <KanbanBoard />
          </>
        )}
      </main>
      <ClientDetailDrawer />
      <AddClientDrawer />
    </div>
  );
}
