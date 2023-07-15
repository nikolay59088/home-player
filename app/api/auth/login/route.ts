import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db.server.ts'
import { getEnvVariable, getErrorResponse } from '@/lib/helpers.ts'
import { compare } from 'bcryptjs'
import { signJWT } from '@/lib/token.ts'


export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const user = await db.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user || !(await compare(body.password, user.password))) {
      return getErrorResponse(401, "Invalid email or password");
    }

    const JWT_EXPIRES_IN = getEnvVariable("JWT_EXPIRES_IN");
    const token = await signJWT(
      { sub: user.id },
      { exp: `${JWT_EXPIRES_IN}m` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;

    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    };

    const response = NextResponse.json({
      status: "success",
      token,
    })

    await Promise.all([
      response.cookies.set(cookieOptions),
      response.cookies.set({
        name: "logged-in",
        value: "true",
        maxAge: tokenMaxAge,
      }),
    ])
    return response

  }catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
