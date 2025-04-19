// api/check-symbol.js
import {getDailySymbol} from './../api/bibleReader.js'

export default async function handler(req, res) {
    const { symbol } = req.query;
    const apiKey = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
  
    if (!symbol) {
      return res.status(400).json({ error: 'Missing symbol parameter' });
    }
  
    try {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
  
      const bestMatch = data.bestMatches?.[0];
  
      if (!bestMatch) {
        return res.status(200).json({ valid: false });
      }
  
      res.status(200).json({
        valid: true,
        symbol: bestMatch["1. symbol"],
        name: bestMatch["2. name"],
        region: bestMatch["4. region"],
        matchScore: bestMatch["9. matchScore"]
      });
    } catch (error) {
      console.error('Error fetching symbol info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

async function getStockToday() {
  const dailySymbols = getDailySymbol()
  let currentSymbolNum = 1
  const req = {
    query: {
      symbol: dailySymbols[1] // you can change this to any keyword
    }
  };
  const res = {
    status(code) {
      return {
        json(data) {
          if (code != 200) {
            console.log("NOT A STOCK!!");
            currentSymbolNum--;
          } else {
            return data.name;
          }
        }
      };
    }
  };

  //first try 3-letter stock
  await handler(req,res);

  if (currentSymbolNum == 0) {
    //try again with 2-letter stock
    await handler(req,res);
  }

  return "No stock available"

  }

  export {getStockToday}
  