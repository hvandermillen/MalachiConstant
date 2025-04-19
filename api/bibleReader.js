import bibleText from './../bible/bible.txt?raw'

function filterBible () {
    const bibleLines = bibleText.split("\n")
    const bibleLinesText = bibleLines.map(line => {
        const afterColon = line.split(":")
        .slice(1)
        .join(":") //only take text after the colon on each line
        let afterSpace = ""
        if (afterColon.includes("\t")) { //if tab
            afterSpace = afterColon
            .split("\t") //take only text after the first tab
            .slice(1)
            .join("\t")
        } else { //if space
            afterSpace = afterColon
            .split(" ") //take only text after the first space
            .slice(1)
            .join(" ")
        }
        return afterSpace
    })
    let newBibleText = bibleLinesText.join("\n") //make one string
    .split("") //array of characters
    .filter(ch => ((ch.charCodeAt(0)>=65 && ch.charCodeAt(0)<=90) || (ch.charCodeAt(0)>=97 && ch.charCodeAt(0)<=122))) //test if it is a letter
    .join("") //one string again
    .toUpperCase()
    return newBibleText
}

function getDailySymbol() {
    const bibleString = filterBible() 
    const currentDay = new Date()
    const risenDate = new Date("0040-04-09")
    const daysSinceEaster = (currentDay - risenDate) / (1000 * 60 * 60 * 24)
    const symbol2char = `${bibleString.charAt(daysSinceEaster*2)}${bibleString.charAt(daysSinceEaster*2+1)}`
    const symbol3char = `${bibleString.charAt(daysSinceEaster*3)}${bibleString.charAt(daysSinceEaster*3+1)}${bibleString.charAt(daysSinceEaster*3+1)}`  
    return [symbol2char, symbol3char]
}

export {
    filterBible,
    getDailySymbol
}