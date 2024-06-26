interface Props {
  text: string
  imageUrl: string
  alt: string
  onImageSelected?: (imageUrl: string) => void
}

export const GptMessageImage = ({ imageUrl, alt, onImageSelected }: Props) => {
  return (
    <div className='col-start-1 col-end-12 md:col-end-9 md:p-3 rounded-lg'>
      <div className='flex flex-row items-start'>
        <div className='flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0'>
          G
        </div>
        <div className='relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <img
            src={imageUrl}
            alt={alt}
            className='rounded-xl w-96 h-96 object-cover'
            onClick={() => onImageSelected && onImageSelected(imageUrl)}
          />
          <p className='max-w-[380px] mt-2'>{alt}</p>
        </div>
      </div>
    </div>
  )
}
