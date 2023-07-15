import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db.server.ts'


export async function GET(req: NextRequest) {
  const userToken = req.headers.get("X-USER-ID") || '';

  if (userToken.length){
    const user = await db.user.findUnique({
      where: {
        id: userToken
      }
    });
    return NextResponse.json({
      status: "success",
      data: {
        user: {
          ...user,
          password: undefined
        }
      },
    });
  }else{
    return NextResponse.json({
      status: "success",
      data: {
        user: {
        }
      },
    });
  }
}
