"use client"

import { useState } from "react"
import { Copy, CheckCircle2 } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, title, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    // toast({
    //   title: "Copied to clipboard",
    //   duration: 2000,
    // })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 rounded-lg border">
      {title && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2 text-sm font-medium">
          <div>{title}</div>
          <div className="text-xs text-muted-foreground">{language.toUpperCase()}</div>
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
        >
          {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre className={`overflow-x-auto rounded-b-lg bg-muted p-4 text-sm ${showLineNumbers ? "line-numbers" : ""}`}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
