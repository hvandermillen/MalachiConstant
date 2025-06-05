// import dotenv from 'dotenv';
// dotenv.config();


//i don't think this works
export default async function getJesusVoice(text) {
  const { bodyText } = req.body;

  if (!bodyText) {
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
        bodyText,
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

//this is supposed to input generated output from jesusSays and return an audio blob
async function getAudioBlob(adviceString) {
  let req = {
    body: JSON.stringify(adviceString)
  }
  let res = {}

  const result = await handler(req,res)
  const audioBlob = await res.blob();

  return audioBlob
}

export {getAudioBlob}