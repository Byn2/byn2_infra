"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="m-0 list-none p-0">
        {headings.map((heading) => {
          return (
            <li key={heading.id} className={heading.level === 2 ? "mt-2" : "ml-4"}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "inline-block text-sm no-underline transition-colors hover:text-foreground",
                  activeId === heading.id ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
