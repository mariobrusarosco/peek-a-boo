"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/domains/ui-system/components/ui/button";
import { useSidebar } from "@/domains/ui-system/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/domains/ui-system/components/ui/dropdown-menu";
import type { Project } from "@prisma/client";

interface ProjectSearchProps {
  projects: Project[];
}

export function ProjectSearch({ projects }: ProjectSearchProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [selectedId, setSelectedId] = React.useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [open, setOpen] = React.useState(false);

  // Handle project selection
  const handleSelect = (projectId: string) => {
    setSelectedId(projectId);
    setOpen(false);
  };

  // No projects state
  if (projects.length === 0) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        No projects available
      </Button>
    );
  }

  // Simple version for collapsed sidebar
  if (isCollapsed) {
    return (
      <Button
        variant="outline"
        className="w-full justify-center"
        onClick={() => setOpen(true)}
      >
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          role="combobox"
          aria-label="Select project"
          aria-expanded={open}
        >
          <span>
            {projects.find((project) => project.id === selectedId)?.name ||
              "Select project..."}
          </span>
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleSelect(project.id)}
            >
              <span>{project.name}</span>
              {project.id === selectedId && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
