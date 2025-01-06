import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void
}

export function ImageUpload({ onImagesSelected }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate file sizes
      const validFiles = acceptedFiles.filter(file => file.size <= 5 * 1024 * 1024) // 5MB limit
      if (validFiles.length < acceptedFiles.length) {
        console.warn("Some files were skipped because they exceed the 5MB size limit")
      }
      onImagesSelected(validFiles)
    },
    [onImagesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the images here..."
          : "Drag & drop images here, or click to select files"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports: JPG, JPEG, PNG (max 5MB each)
      </p>
    </div>
  )
}