import { isTokenValid } from '../auth/is-token-valid'

export const textToVoiceUseCase = async (prompt: string, voice: string) => {
  try {
    const userToken = localStorage.getItem('userToken')
    if (!isTokenValid()) {
      return {
        ok: false,
        needAuth: true,
        message: 'Invalid token'
      }
    }
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ prompt, voice })
    })

    if (!resp.ok) throw new Error('No se pudo generar el audio')

    const audioFile = await resp.blob()
    const audioUrl = URL.createObjectURL(audioFile)

    return { ok: true, audioUrl: audioUrl, message: prompt }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo generar el audio'
    }
  }
}
