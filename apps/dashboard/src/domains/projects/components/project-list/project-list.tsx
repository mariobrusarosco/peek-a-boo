"use client";

import type { Project } from "@peek-a-boo/shared";
import { formatDistanceToNow } from "date-fns";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="hover:shadow-md transition-shadow">
          <div className="pb-2">
            <h2 className="text-lg">{project.name}</h2>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created {formatDistanceToNow(new Date(project.createdAt))} ago
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={`/projects/${project.id}`}
                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View Details →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
