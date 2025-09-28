"use client";

import Link from "next/link";
import { Button } from "@/domains/ui-system/components/ui/button";

interface CreateFeatureFlagButtonProps {
  projectId: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  children?: React.ReactNode;
}

export default function CreateFeatureFlagButton({ 
  projectId, 
  size = "default",
  variant = "default",
  children = "New Feature Flag"
}: CreateFeatureFlagButtonProps) {
  return (
    <Link href={`/projects/${projectId}/flags/new`}>
      <Button size={size} variant={variant}>
        {children}
      </Button>
    </Link>
  );
}
