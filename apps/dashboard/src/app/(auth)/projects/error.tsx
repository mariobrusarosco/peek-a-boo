'use client';

import { Button } from '@/domains/ui-system/components/ui/button';

interface ErrorComponentProps {
  error: Error;
  reset: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
