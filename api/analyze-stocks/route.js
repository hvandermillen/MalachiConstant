import { NextResponse } from "next/server"
import { analyzeStocksToSell } from "../../lib/jesusSays"

export async function POST(request) {
  try {
    const { stocks } = await request.json()

    if (!stocks || typeof stocks !== "string") {
      return NextResponse.json({ error: "Please provide a list of stocks" }, { status: 400 })
    }

    console.log(`Received request to analyze stocks: ${stocks}`)

    // Use the new function to analyze which stock to sell
    const analysis = await analyzeStocksToSell(stocks)

    // Format the response with numeric values
    const price = Number.parseFloat((Math.random() * 200 + 50).toFixed(2))
    const change = Number.parseFloat((-1 * (Math.random() * 5 + 1)).toFixed(2))

    const response = {
      symbol: analysis.symbol,
      name: analysis.symbol, // We don't have the company name, so use the symbol
      price: price, // Ensure this is a number
      change: change, // Ensure this is a number
      recommendation: analysis.reason,
      verse: analysis.verse,
      reference: analysis.reference,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in analyze-stocks route:", error)
    return NextResponse.json({ error: "Failed to analyze stocks" }, { status: 500 })
  }
}
