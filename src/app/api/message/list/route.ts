import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  const chatId = request.nextUrl.searchParams.get('chatId')
  if (!chatId) {
    return NextResponse.json({
      code: -1,
      msg: '参数错误',
    })
  }
  const list = await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createTime: 'asc',
    },
  })
  return NextResponse.json({
    code: 200,
    data: list,
    msg: '获取成功',
  })
}
