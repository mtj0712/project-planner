import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: ProjectListPage,
});

function ProjectListPage() {
  return <div>Project List</div>;
}
