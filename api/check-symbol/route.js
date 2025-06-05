import { NextResponse } from "next/server"
import { checkSymbol } from "../../lib/checkStock"

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol parameter" }, { status: 400 })
  }

  try {
    const result = await checkSymbol(symbol)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking symbol:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
