import { NextResponse } from "next/server"
import { getStockToday } from "../../lib/checkStock"
import { getStockRecommendation } from "../../lib/jesusSays"

// Bible verses for different market conditions (fallback)
const marketConditionVerses = {
  strongBuy: {
    verse: "The plans of the diligent lead to profit as surely as haste leads to poverty.",
    reference: "Proverbs 21:5",
  },
  buy: {
    verse: "The wise store up choice food and olive oil, but fools gulp theirs down.",
    reference: "Proverbs 21:20",
  },
  hold: {
    verse: "Steady plodding brings prosperity; hasty speculation brings poverty.",
    reference: "Proverbs 21:5 (TLB)",
  },
  sell: {
    verse: "The prudent see danger and take refuge, but the simple keep going and pay the penalty.",
    reference: "Proverbs 22:3",
  },
  strongSell: {
    verse:
      "Cast but a glance at riches, and they are gone, for they will surely sprout wings and fly off to the sky like an eagle.",
    reference: "Proverbs 23:5",
  },
}

export async function GET(request) {
  try {
    console.log("API route /api/stocks called")
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    // Validate action parameter
    if (action !== "buy") {
      return NextResponse.json({ error: "Invalid action. Please specify 'buy'." }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.ALPHAVANTAGE_API_KEY) {
      console.warn("ALPHAVANTAGE_API_KEY environment variable is not set. Using fallback data.")
    } else {
      console.log("ALPHAVANTAGE_API_KEY is set and available")
    }

    // Get today's divinely inspired stock using bibleReader and checkStock functions
    console.log("Fetching today's divinely inspired stock...")
    const stockData = await getStockToday()

    // Validate stock data
    if (!stockData || typeof stockData !== "object") {
      throw new Error("Invalid stock data received from API")
    }

    console.log(`Retrieved stock: ${stockData.symbol} at ${stockData.price} (${stockData.change}%)`)

    // Ensure price and change are numbers
    const price = typeof stockData.price === "number" ? stockData.price : Number.parseFloat(stockData.price || 0)
    const change =
      typeof stockData.changePercent === "number"
        ? stockData.changePercent
        : typeof stockData.change === "number"
          ? stockData.change
          : Number.parseFloat(stockData.change || 0)

    // Determine recommendation based on stock performance
    let recommendation
    let verseData

    if (change >= 3) {
      recommendation = "Buy with divine confidence"
      verseData = marketConditionVerses.strongBuy
    } else if (change >= 0) {
      recommendation = "Buy with wisdom and prayer"
      verseData = marketConditionVerses.buy
    } else if (change >= -2) {
      recommendation = "Buy with caution, seeking the Lord's guidance"
      verseData = marketConditionVerses.hold
    } else {
      recommendation = "Buy only after much prayer and consideration"
      verseData = marketConditionVerses.sell
    }

    // Get AI-generated wisdom from Jesus about this specific stock
    console.log(`Getting divine wisdom for ${stockData.symbol}...`)
    const wisdom = await getStockRecommendation(stockData.symbol, "buy")

    // Use the AI wisdom if available, otherwise use the market condition verse
    const verse = wisdom?.verse || verseData.verse
    const reference = wisdom?.reference || verseData.reference

    console.log(`Divine recommendation: ${recommendation}`)
    console.log(`Biblical wisdom: ${verse} - ${reference}`)

    // Return the response with guaranteed numeric values
    return NextResponse.json({
      symbol: stockData.symbol,
      name: stockData.name || stockData.symbol,
      price: price,
      change: change,
      recommendation: recommendation,
      verse: verse,
      reference: reference,
    })
  } catch (error) {
    console.error("Error in stocks route:", error)

    // Return a fallback response with error details and guaranteed numeric values
    return NextResponse.json({
      error: "Failed to get stock recommendation",
      details: error.message,
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.72,
      change: 2.45,
      recommendation: "Buy with wisdom",
      verse: "The wise store up choice food and olive oil, but fools gulp theirs down.",
      reference: "Proverbs 21:20",
    })
  }
}
