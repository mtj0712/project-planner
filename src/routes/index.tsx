import { createFileRoute } from "@tanstack/react-router";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProjectCard from "@/components/project-card";
import CreateProjectDialog from "@/components/create-project-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: ProjectListPage,
});

function ProjectListPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.projects.list,
    {},
    { initialNumItems: 6 },
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <CreateProjectDialog />
      </div>
      {status === "LoadingFirstPage" ? (
        <p className="text-muted-foreground">Loading projects...</p>
      ) : results.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No projects yet. Create one to get started!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
          {status === "CanLoadMore" && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => loadMore(6)}>
                Load More
              </Button>
            </div>
          )}
          {status === "LoadingMore" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Loading more...
            </p>
          )}
        </>
      )}
    </div>
  );
}
