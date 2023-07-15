import { NextResponse } from 'next/server'

export function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

export function getErrorResponse(
  status = 500,
  message: string
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
