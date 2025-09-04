"use client";

import { useDropzone } from "react-dropzone";
import { User } from "lucide-react";

export default function ImageUploadCard({
  image,
  setImage,
  setFile, // 👈 on passe le File brut au parent
}: {
  image: string | null;
  setImage: (url: string | null) => void;
  setFile: (file: File | null) => void;
}) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Preview locale seulement
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition ${
        isDragActive ? "border-cyan-400 bg-cyan-400/10" : "border-white/20 bg-white/5"
      }`}
    >
      <input {...getInputProps()} />

      {image ? (
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
          <img src={image} alt="Avatar" className="object-cover w-full h-full" />
        </div>
      ) : (
        <div className="text-gray-400">
          <User className="w-12 h-12 mx-auto mb-2 opacity-60" />
          <p className="text-sm">Glissez-déposez une image<br />ou cliquez pour choisir</p>
        </div>
      )}
    </div>
  );
}