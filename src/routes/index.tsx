import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProjectCard from "@/components/project-card";
import CreateProjectDialog from "@/components/create-project-dialog";

export const Route = createFileRoute("/")({
  component: ProjectListPage,
});

function ProjectListPage() {
  const projects = useQuery(api.projects.list);

  if (projects === undefined) {
    return <p className="text-muted-foreground">Loading projects...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <CreateProjectDialog />
      </div>
      {projects.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No projects yet. Create one to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
