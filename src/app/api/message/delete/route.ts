import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({
      code: -1,
      data: null,
      msg: '消息Id不可为空',
    })
  }
  try {
    await prisma.message.delete({
      where: {
        id,
      },
    })
  } catch (err) {
    console.log(err, 800)
    return NextResponse.json({
      code: -1,
      data: null,
      msg: '删除失败',
    })
  }
  return NextResponse.json({
    code: 200,
    data: null,
    msg: '删除成功',
  })
}
