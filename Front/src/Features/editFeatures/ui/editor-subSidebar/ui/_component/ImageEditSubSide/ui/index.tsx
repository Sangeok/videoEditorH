"use client";

import { Upload, X } from "lucide-react";
import { useImageEdit } from "../model/hooks/useImageEdit";
import Button from "@/shared/ui/atoms/Button/ui/Button";

export default function ImageEditSubSide() {
  const { state, actions, fileInputRef } = useImageEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Image</h3>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
          state.dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-600 bg-zinc-800/50"
        }`}
        onDragEnter={actions.handleDrag}
        onDragLeave={actions.handleDrag}
        onDragOver={actions.handleDrag}
        onDrop={actions.handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => actions.handleFileSelect(e.target.files)}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-300 mb-2">Drag & drop your image file here</p>
        <p className="text-gray-500 text-sm mb-4">or</p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="light"
          size="sm"
        >
          Choose Image
        </Button>
      </div>

      {/* Uploaded Images Preview */}
      {state.uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-300">Uploaded Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {state.uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-zinc-600"
                />
                <button
                  onClick={() => actions.removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
