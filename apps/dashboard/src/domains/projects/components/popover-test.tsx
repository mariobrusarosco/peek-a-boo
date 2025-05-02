"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverTest() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Testing Popover Component</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Click me</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Simple popover test</h4>
              <p className="text-sm text-muted-foreground">
                If you can see this text, the popover is working correctly.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
