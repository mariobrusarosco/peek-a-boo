"use client"

import * as React from "react"
import { Button } from "@/domains/ui-system/components/ui/button"

/**
 * A simple input and button for creating a project.
 * Usage: Place in the project domain where project creation is needed.
 */
export function CreateProject({ onCreate }: { onCreate?: (name: string) => void }) {
  const [projectName, setProjectName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return
    setLoading(true)
    try {
      onCreate?.(projectName.trim())
      setProjectName("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreate} className="flex gap-2 items-center w-full">
      <input
        type="text"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        placeholder="Project name"
        className="flex-1 rounded-md px-3 py-2 bg-[#18192b] text-white placeholder:text-[#888] border border-[#23243b] focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Project name"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={!projectName.trim() || loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-semibold"
      >
        Create project
      </Button>
    </form>
  )
}
