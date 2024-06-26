import { isTokenValid } from '../auth/is-token-valid'

type GeneratedImage = Image | null

interface Image {
  url: string
  alt: string
}

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GeneratedImage | string> => {
  try {
    const userToken = localStorage.getItem('userToken')
    if (!isTokenValid()) {
      return 'needAuth'
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        prompt,
        originalImage,
        maskImage
      })
    })

    const { url, revised_prompt: alt } = await resp.json()

    return { url, alt }
  } catch (error) {
    console.log(error)
    return null
  }
}
