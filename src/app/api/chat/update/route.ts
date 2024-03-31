import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, ...data } = body
  await prisma.chat.update({
    data,
    where: {
      id,
    },
  })
  return NextResponse.json({
    code: 200,
  })
}
