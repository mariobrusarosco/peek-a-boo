"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/domains/ui-system/components/ui/button"
import { useSidebar } from "@/domains/ui-system/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/domains/ui-system/components/ui/dropdown-menu"

// Mock projects data
const projects = [
  { value: "default", label: "Default Project" },
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "api-service", label: "API Service" },
  { value: "backend", label: "Backend Service" },
]

export function ProjectSearch() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [value, setValue] = React.useState("backend")
  const [open, setOpen] = React.useState(true)
  
  // Handle project selection
  const handleSelect = (projectValue: string) => {
    setValue(projectValue)
    console.log('Selected project:', projectValue)
    setOpen(false)
  }
  
  // Log state changes for debugging
  React.useEffect(() => {
    console.log('Dropdown state:', open)
  }, [open])
  
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
    )
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
            {projects.find(project => project.value === value)?.label || "Select project..."}
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
              key={project.value} 
              onClick={() => handleSelect(project.value)}
            >
              <span>{project.label}</span>
              {project.value === value && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
