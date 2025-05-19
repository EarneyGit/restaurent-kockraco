"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [text, setText] = useState(content)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    onChange(e.target.value)
  }

  const wrapText = (before: string, after: string = before) => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + 
                   `${before}${selectedText}${after}` + 
                   text.substring(end)
    
    setText(newText)
    onChange(newText)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-1 border-b bg-muted">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('**')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('_')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('\n- ')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapText('\n1. ')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <Textarea 
        value={text}
        onChange={handleChange}
        className="min-h-[200px] border-0 focus-visible:ring-0"
        placeholder="Write your content here..."
      />
    </div>
  )
} 