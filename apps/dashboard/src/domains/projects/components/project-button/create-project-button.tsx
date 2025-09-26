"use client";

import { useState } from "react";
import { Button } from "@/domains/ui-system/components/ui/button";
import CreateProjectModal from "./create-project-modal";

export default function CreateProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
