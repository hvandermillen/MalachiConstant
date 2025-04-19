import bibleText from './../bible/bible.txt?raw'

function parseBible () {
    const bibleLines = bibleText.split("\n")
    const bibleLinesText = bibleLines.map(line => {
        const afterColon = line.split(":")
        .slice(1)
        .join(":")
        console.log(afterColon)
        let afterSpace = ""
        if (afterColon.includes("\t")) {
            afterSpace = afterColon
            .split("\t")
            .slice(1)
            .join("\t")
        } else {
            afterSpace = afterColon
            .split(" ")
            .slice(1)
            .join(" ")
        }
        return afterSpace
    })
    const newBibleText = bibleLinesText.join("\n")
    return newBibleText
}

export {
    parseBible
}