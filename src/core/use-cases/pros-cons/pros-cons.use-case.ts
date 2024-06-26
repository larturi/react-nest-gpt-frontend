import { ProsConsResponse } from '../../../interfaces'
import { isTokenValid } from '../auth/is-token-valid'

export const prosConsUseCase = async (prompt: string) => {
  try {
    const userToken = localStorage.getItem('userToken')
    if (!isTokenValid()) {
      return {
        ok: false,
        content: 'Invalid token',
        needAuth: true
      }
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ prompt })
    })

    if (!resp.ok) throw new Error('No se pudo realizar el analisis de pros y contras')

    const data = (await resp.json()) as ProsConsResponse

    return {
      ok: true,
      ...data
    }
  } catch (error) {
    return {
      ok: false,
      content: 'No se pudo realizar el analisis de pros y contras'
    }
  }
}
