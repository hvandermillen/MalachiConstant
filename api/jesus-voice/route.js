import { NextResponse } from "next/server"
import { Buffer } from "buffer"

export async function POST(request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Missing text for voice generation" }, { status: 400 })
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!voiceId || !apiKey) {
      return NextResponse.json(
        { error: "Missing ElevenLabs configuration. Please set ELEVENLABS_VOICE_ID and ELEVENLABS_API_KEY" },
        { status: 500 },
      )
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("ElevenLabs API error:", errorData)
      return NextResponse.json({ error: "Failed to generate voice" }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(Buffer.from(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=jesus.mp3",
      },
    })
  } catch (error) {
    console.error("TTS Error:", error)
    return NextResponse.json({ error: "Failed to generate Jesus voice" }, { status: 500 })
  }
}
