'use client'

import React, { useState, ChangeEvent } from 'react'
import imageCompression from 'browser-image-compression'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

export function ImageCompressorComponent() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<File | null>(null)
  const [compressedImageUrl, setCompressedImageUrl] = useState<string>('')
  const [compressionLevel, setCompressionLevel] = useState<number>(50)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setOriginalImage(file)
      setCompressedImage(null)
      setCompressedImageUrl('')
    }
  }

  const handleCompress = async () => {
    if (!originalImage) return

    setIsCompressing(true)
    setProgress(0)

    const options = {
      maxSizeMB: 10,
      initialQuality: compressionLevel / 100,
      onProgress: (progress: number) => {
        setProgress(Math.round(progress))
      },
    }

    try {
      const compressedFile = await imageCompression(originalImage, options)
      setCompressedImage(compressedFile)
      setCompressedImageUrl(URL.createObjectURL(compressedFile))
    } catch (error) {
      console.error('Error compressing image:', error)
    } finally {
      setIsCompressing(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Image Compressor</h1>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {originalImage && (
        <div className="mb-4">
          <p className="mb-2">Compression Level: {compressionLevel}%</p>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[compressionLevel]}
            onValueChange={(value) => setCompressionLevel(value[0])}
            className="mb-4"
          />
          <Button onClick={handleCompress} disabled={isCompressing}>
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </Button>
        </div>
      )}
      {isCompressing && (
        <Progress value={progress} className="w-full mt-4" />
      )}
      {compressedImage && (
        <div className="mt-4">
          <p>Original Size: {(originalImage!.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Compressed Size: {(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          <img src={compressedImageUrl} alt="Compressed" className="mt-4 max-w-full h-auto" />
          <Button
            onClick={() => {
              const link = document.createElement('a')
              link.href = compressedImageUrl
              link.download = 'compressed_image.jpg'
              link.click()
            }}
            className="mt-4"
          >
            Download Compressed Image
          </Button>
        </div>
      )}
    </div>
  )
}