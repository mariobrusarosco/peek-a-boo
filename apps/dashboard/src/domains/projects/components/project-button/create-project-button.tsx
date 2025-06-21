"use client";

import { useState } from "react";
import { Button } from "@/domains/ui-system/components/ui/button";
import CreateProjectModal from "./create-project-modal";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/constants/api";

export default function CreateProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateProject = async (projectName: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (!response.ok) {
        throw new Error(`Error creating project: ${response.statusText}`);
      }

      setIsModalOpen(false);
      router.refresh();

      return true;
    } catch (err) {
      console.error("Error creating project:", err);
      return false;
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}
