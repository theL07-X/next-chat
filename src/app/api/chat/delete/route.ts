import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({
      code: -1,
      data: null,
      msg: '对话Id不可为空',
    })
  }
  try {
    const deleteMessages = prisma.message.deleteMany({
      where: {
        chatId: id,
      },
    })
    const deleteChat = prisma.chat.delete({
      where: {
        id,
      },
    })
    await prisma.$transaction([deleteMessages, deleteChat])
    return NextResponse.json({
      code: 200,
      data: null,
    })
  } catch (err) {
    return NextResponse.json({
      code: -1,
      data: null,
      msg: '删除失败',
    })
  }
}
