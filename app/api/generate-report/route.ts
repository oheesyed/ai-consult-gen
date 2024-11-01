import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import FirecrawlApp from '@mendable/firecrawl-js'

const client = new OpenAI()
const firecrawlApp = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY || '' 
})

export async function POST(request: Request) {
  try {
    const { url, instructions } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const crawlResponse = await firecrawlApp.crawlUrl(url, {
      limit: 5,
      scrapeOptions: {
        formats: ['html']
      }
    }) as { success: boolean; error?: string; data: Array<{ content: string }> }

    if (!crawlResponse.success || !crawlResponse.data?.length) {
      throw new Error(`Failed to crawl: ${crawlResponse.error || 'No content found'}`)
    }

    const websiteContent = crawlResponse.data
      .map(item => item.content)
      .join('\n\n')
      .slice(0, 8000)

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional consultant who writes detailed reports based on website content. Write your response as clean HTML without any code block markers or annotations. Include all analyzed content in your report."
        },
        {
          role: "user", 
          content: `Generate a consultant report based on this website content:

            URL Analyzed: ${url}
            Instructions: ${instructions}

            Website Content:
            ${websiteContent}`
        }
      ]
    })

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response content')
    }

    const html = response.choices[0].message.content
    return NextResponse.json({ html })
    
  } catch (error: any) {
    console.error('API Error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
} 