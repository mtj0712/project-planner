import KanbanBoard from "@/components/kanban-board";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Project Planner</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
