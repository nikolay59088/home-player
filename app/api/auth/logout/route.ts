import { NextRequest, NextResponse } from 'next/server'


export async function GET() {
  const response = NextResponse.json({
    status: "success"
  })

  await Promise.all([
    response.cookies.set({
      name: "token",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "logged-in",
      value: "",
      maxAge: -1,
    }),
  ]);

  return response;
}
