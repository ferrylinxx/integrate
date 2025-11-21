"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyCodeProps {
  code: string;
}

export function CopyCode({ code }: CopyCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <code className="px-4 py-2 bg-gray-100 rounded-md font-mono text-lg">
        {code}
      </code>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        title="Copiar código"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

