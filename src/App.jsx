import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import bibleText from './../bible/bible.txt?raw'
import {filterBible, getDailySymbol} from './../api/bibleReader.js'
import {getStockToday} from './../api/checkStock.js'
import {handler, getJesusAdvice} from './../api/jesusSays.js'
import {getAudioBlob} from './../api/jesusVoice.js'

function App() {
  const [count, setCount] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)

  // fs.readFile('/src/assets/bible.txt', (err,data) => {
  //   console.log(data.toString);
  // })

  // const newBibleText = filterBible()
  // console.log(newBibleText)
  
  const [stockName, setStockName] = useState("default stock")

  useEffect (() => {
    async function fetchStock() {
      const result = await getStockToday();
      setStockName(result)
      console.log("result: " + result)
    }
    async function fetchJesusResponse() {
      const jesusResponse = await getJesusAdvice("buy","as")
      // console.log(jesusResponse.choices[0].message.content)
      console.log(JSON.stringify(jesusResponse))
      const blob = await getAudioBlob()
      setAudioUrl(URL.createObjectURL(blob))
      playAudio()
    }
    fetchStock()
    fetchJesusResponse()
  }, [])

  function TodayStock() {
    return <p>{stockName}</p>
  }


  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <TodayStock></TodayStock>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
