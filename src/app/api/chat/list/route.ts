import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams.get('page')
  const page = params ? parseInt(params) : 1
  const list = await prisma.chat.findMany({
    /**跳过指定记录 */
    skip: (page - 1) * 20,
    take: 20,
    orderBy: {
      updateTime: 'desc',
    },
  })
  const count = await prisma.chat.count()
  const hasMore = count > (page - 1) * 20
  return NextResponse.json({
    code: 200,
    data: {
      list,
      hasMore,
    },
    msg: '获取成功',
  })
}
