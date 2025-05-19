import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image as ImageIcon, X } from 'lucide-react'
import { Button } from './button'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsLoading(true)
      const file = acceptedFiles[0]
      
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 hover:border-gray-400
          transition-colors cursor-pointer min-h-[160px] flex flex-col
          items-center justify-center relative
          ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}
        `}
      >
        <input {...getInputProps()} />
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              className="max-h-[140px] object-contain"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center space-y-2">
            <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
            <div className="text-gray-600">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <p>
                  Drag and drop an image here, or{' '}
                  <span className="text-emerald-500">browse</span>
                </p>
              )}
            </div>
            <p className="text-xs text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="text-sm text-gray-500 text-center">
          Uploading...
        </div>
      )}
    </div>
  )
} 