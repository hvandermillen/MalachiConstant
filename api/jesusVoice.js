// import dotenv from 'dotenv';
// dotenv.config();

export default async function getJesusVoice(text) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text for voice generation' });
  }

  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename=jesus.mp3');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS Error:', err);
    res.status(500).json({ error: 'Failed to generate Jesus voice' });
  }
};

async function getAudioBlob(adviceString) {
  let req = {
    body: JSON.stringify(text)
  }
  let res = {}

  const result = await handler(req,res)
  const audioBlob = await res.blob();

  return audioBlob
}

export {getAudioBlob}