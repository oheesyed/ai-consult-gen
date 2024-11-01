'use client'

import { useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-4 py-1 rounded-md border ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'}`}
      >
        Bold
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        Underline
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        Bullet List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        Ordered List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        Left
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        Center
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        Right
      </Button>
    </div>
  )
}

const sampleReports = [
  `<h2>Market Expansion Strategy</h2>
   <p>Our analysis indicates a significant opportunity for market expansion in the Asia-Pacific region. Key findings include:</p>
   <ul>
     <li>Potential for 30% revenue growth within 2 years</li>
     <li>Untapped customer segments in emerging markets</li>
     <li>Need for localized product offerings</li>
   </ul>
   <p>We recommend a phased approach, starting with pilot programs in Singapore and South Korea.</p>`,
  
  `<h2>Digital Transformation Roadmap</h2>
   <p>To stay competitive in the rapidly evolving digital landscape, we propose the following initiatives:</p>
   <ol>
     <li>Implement cloud-based ERP system</li>
     <li>Develop a mobile-first customer engagement platform</li>
     <li>Establish a data analytics center of excellence</li>
   </ol>
   <p>Expected outcomes include improved operational efficiency and enhanced customer experiences.</p>`,
  
  `<h2>Supply Chain Optimization</h2>
   <p>Our assessment of your supply chain reveals several areas for improvement:</p>
   <ul>
     <li>Streamline supplier onboarding process</li>
     <li>Implement real-time inventory tracking</li>
     <li>Optimize distribution network</li>
   </ul>
   <p>By addressing these areas, we project a 15% reduction in overall supply chain costs within 12 months.</p>`,
  
  `<h2>Employee Engagement Strategy</h2>
   <p>To address the recent decline in employee satisfaction, we recommend the following actions:</p>
   <ol>
     <li>Launch a comprehensive feedback and recognition program</li>
     <li>Implement flexible work arrangements</li>
     <li>Enhance professional development opportunities</li>
   </ol>
   <p>These initiatives are expected to improve retention rates and boost productivity across the organization.</p>`,
  
  `<h2>Sustainability Action Plan</h2>
   <p>In line with global sustainability trends, we propose the following strategies:</p>
   <ul>
     <li>Transition to 100% renewable energy sources by 2025</li>
     <li>Implement a circular economy model for product design</li>
     <li>Establish partnerships with eco-friendly suppliers</li>
   </ul>
   <p>This plan will not only reduce environmental impact but also appeal to environmentally conscious consumers, potentially increasing market share.</p>`
]

export function ConsultantReportGenerator() {
  const [randomReport, setRandomReport] = useState('')
  const [url, setUrl] = useState('')
  const [instructions, setInstructions] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>Start writing your consultant report here...</p>',
  })

  const generateRandomReport = () => {
    const randomIndex = Math.floor(Math.random() * sampleReports.length)
    setRandomReport(sampleReports[randomIndex])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, instructions }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }
      
      if (editor) {
        editor.commands.setContent(data.html)
      }
    } catch (error: any) {
      console.error('Error generating report:', error.message || error)
      // Add UI error handling here if needed
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <h1 className="text-2xl">Consultant Report Generator</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card className="p-6 bg-white rounded-lg">
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            suppressHydrationWarning
          >
            <div>
              <Label htmlFor="url" className="block text-sm font-medium mb-2">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="Enter URL to analyze"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                suppressHydrationWarning
              />
            </div>
            <div>
              <Label htmlFor="instructions" className="block text-sm font-medium mb-2">Instructions</Label>
              <Input
                id="instructions"
                type="text"
                placeholder="Enter instructions for the report"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                suppressHydrationWarning
              />
            </div>
            <Button 
              type="submit" 
              className="bg-black text-white px-4 py-2 rounded-md"
              suppressHydrationWarning
            >
              Submit
            </Button>
          </form>
        </Card>

        <Card className="p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Report Editor</h2>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="border p-2 min-h-[200px]" />
        </Card>

        <Card className="p-6 bg-white rounded-lg">
          <h2 className="text-xl font-normal mb-4">Random Report Generator</h2>
          <Button 
            onClick={generateRandomReport} 
            className="bg-black text-white px-6 py-2 rounded-md"
          >
            Generate Random Report
          </Button>
          {randomReport && (
            <div className="mt-4 p-4 border rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: randomReport }} />
            </div>
          )}
        </Card>
      </main>

      <footer className="bg-muted text-muted-foreground p-4 text-center">
        <p>&copy; 2023 Consultant Report Generator. All rights reserved.</p>
      </footer>
    </div>
  )
}