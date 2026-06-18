import { KanbanBoard } from "./components/board/KanbanBoard";
import { AddClientDrawer } from "./components/modals/AddClientDrawer";
import { ClientDetailDrawer } from "./components/modals/ClientDetailDrawer";
import { DashboardMetrics } from "./components/layout/DashboardMetrics";
import { FilterBar } from "./components/layout/FilterBar";
import { Header } from "./components/layout/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-guhr-background text-guhr-text">
      <Header />
      <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <DashboardMetrics />
        <FilterBar />
        <KanbanBoard />
      </main>
      <ClientDetailDrawer />
      <AddClientDrawer />
    </div>
  );
}
