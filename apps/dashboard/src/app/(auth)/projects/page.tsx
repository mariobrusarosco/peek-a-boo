import { Suspense } from "react";
import ProjectListContainer from "../../../domains/projects/components/project-list/project-list-container";
import CreateProjectButton from "../../../domains/projects/components/project-button/create-project-button";
import Loading from "./loading";
import Link from "next/link";
import { Button } from "@/domains/ui-system/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-6" data-id="projects-page">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link href="/projects/optimistic">
            <Button variant="outline" size="sm">
              ⚡ Try React 19 Optimistic Demo
            </Button>
          </Link>
        </div>
        <CreateProjectButton />
      </div>

      <div>
        <div className="pt-6">
          <Suspense fallback={<Loading />}>
            <ProjectListContainer />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
