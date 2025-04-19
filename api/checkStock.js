// api/check-symbol.js
import {getBibleSubstring} from './../api/bibleReader.js'

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
      console.log("Full AlphaVantage response:", JSON.stringify(data, null, 2));
  
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

  async function newHandler(symbol) {
    const url = `https://ticker-2e1ica8b9.now.sh//keyword/${symbol}`
    const response = await fetch(url, {
      method: "GET",
    })
    .then(response => {
    })
    .catch(error => {
      console.error('Error:', error);
    })
    const data = await response.json()
  }

  async function isValidSymbol(symbol) {
    return new Promise(async (resolve) => {
      const data = await newHandler(symbol)
      if (data.results[0]) { //if we have a result
        resolve(data.results[0].name)
      } else {
        resolve(false)
      }
    });
  }

  async function getStockToday() {
    const bibleSubstring = getBibleSubstring();
    console.log("symbols: " + bibleSubstring);
  
    for (let startInd = 0; startInd < bibleSubstring.length - 5; startInd++) {
      for (let i = 5; i > 1; i--) {
        const currentSymbol = bibleSubstring.substring(startInd, startInd + i).toUpperCase();
        console.log("current symbol: " + currentSymbol);
        const result = await isValidSymbol(currentSymbol);
        if (result !== false) {
          console.log("VALID! " + result);
          return result;
        }
      }
    }
  
    return "No stock found";
  }

  export {getStockToday}
  