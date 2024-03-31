import axios from 'axios'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { messages, model } = (await request.json()) as MessageRequestBody
  const res = await axios.post(
    'https://api.chatanywhere.com.cn/v1/chat/completions',
    {
      model,
      messages,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
  )
  const { choices } = res.data
  const { content } = choices[0].message
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < content.length; i++) {
        controller.enqueue(encoder.encode(content[i]))
      }
      controller.close()
    },
  })
  return new Response(stream)
}
