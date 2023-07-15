import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db.server.ts'
import { hash } from 'bcryptjs'
import { getEnvVariable, getErrorResponse } from '@/lib/helpers.ts'


export async function POST(req: NextRequest) {

  try{

    const body = await req.json()
    const hashedPassword = await hash(body.password, Number(getEnvVariable('JWT_PASSWORD_SALT')))
    const dateNow = new Date()
    const newUser = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        isAdmin: false,
        createdAt: dateNow,
        lastLoginAt: dateNow,
        updatedAt: dateNow,
        yandexToken: '',
       yandexTokenLife: ''
      }
    })

    return NextResponse.json({
      status: 'success',
      data: {
        user: {
          ...newUser,
          password: undefined
        }
      }
    })

  }catch (error: any){
    if (error.code === "P2002") {
      return getErrorResponse(409, "Пользователь с таким логином уже существует");
    }

    return getErrorResponse(500, error.message);
  }
}
