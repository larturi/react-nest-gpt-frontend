/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from '../../components'
import { imageGenerationUseCase } from '../../../core/use-cases'

interface Message {
  text: string
  isGpt: boolean
  info?: {
    imageUrl: string
    alt: string
  }
}

export const ImageGenerationPage = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { text: text, isGpt: false }])

    const imageInfo = await imageGenerationUseCase(text)

    if (typeof imageInfo == 'string') {
      if (imageInfo === 'needAuth') navigate('/login')
    } else {
      setIsLoading(false)

      if (!imageInfo?.url) {
        return setMessages((prev) => [
          ...prev,
          { text: 'No se pudo generar la imagen', isGpt: true }
        ])
      }

      return setMessages((prev) => [
        ...prev,
        {
          text: text,
          isGpt: true,
          info: {
            imageUrl: imageInfo.url,
            alt: imageInfo.alt
          }
        }
      ])
    }
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola! Qué imagen quieres generar hoy?' />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessageImage
                key={index}
                text={message.text}
                imageUrl={message.info?.imageUrl!}
                alt={message.info?.alt!}
              />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader className='fade-in' />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Escribe aqui lo que deseas...'
        disableCorrections
      />
    </div>
  )
}
