import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, ...data } = body
  if (!data.chatId) {
    // 新的对话
    const chat = await prisma.chat.create({
      data: {
        title: '新对话',
      },
    })
    data.chatId = chat.id
  } else {
    await prisma.chat.update({
      data: {
        updateTime: new Date(),
      },
      where: {
        id: data.chatId,
      },
    })
  }
  const message = await prisma.message.upsert({
    create: data,
    update: data,
    where: {
      id,
    },
  })
  return NextResponse.json({
    code: 200,
    data: { message },
  })
}
