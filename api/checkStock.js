// api/check-symbol.js
import {getBibleSubstring} from './../api/bibleReader.js'
import Papa from 'papaparse';

const stockObj = await parseCSV()
console.log(stockObj)

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
    const polygonApiKey = import.meta.env.VITE_POLYGON_API_KEY;
    const url = `https://api.polygon.io/v3/reference/tickers?ticker=${symbol}&market=stocks&active=true&limit=1&apiKey=${polygonApiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Fetch failed:", response.status, response.statusText);
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching from Polygon:", error);
      return null;
    }
  }

  async function parseCSV() {
    return new Promise ((resolve) => {
      fetch('./../stocks/stock_info.csv')
        .then(response => response.text())
        .then(csvText => {
          const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
          });
          resolve(result.data); // array of objects!
        });
    })
    
  }

  function isValidSymbol(symbol) {
    stockObj.forEach(stock => {
      //console.log(symbol + " " +  stock.Ticker)
      if (stock.Ticker == symbol) {
        console.log("valid! " + stock.Name)
        return stock.Name
      }
    })
    return false;
  }

  function getStockToday() {
    const bibleSubstring = getBibleSubstring();
    console.log("symbols: " + bibleSubstring);
  
    for (let startInd = 0; startInd < bibleSubstring.length - 5; startInd++) {
      for (let i = 5; i > 1; i--) {
        const currentSymbol = bibleSubstring.substring(startInd, startInd + i).toUpperCase();
        console.log("current symbol: " + currentSymbol);
        const result = isValidSymbol(currentSymbol);
        if (result != false) {
          console.log("VALID! " + result);
          return result;
        }
      }
    }
  
    return "No stock found";
  }

  export {getStockToday}
  