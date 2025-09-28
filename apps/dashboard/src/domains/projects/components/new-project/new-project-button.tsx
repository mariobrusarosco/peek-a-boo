"use client";

import { useState } from "react";
import { Button } from "@/domains/ui-system/components/ui/button";
import CreateProjectModal from "@/domains/projects/components/new-project/new-project-modal";

export default function CreateProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>New Project</Button>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
