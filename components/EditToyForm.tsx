"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Pen, FileText, Baby, Camera, UploadCloud, X, Save, Loader2 } from "lucide-react";

export default function EditToyForm({ toy, onClose }: { toy: any; onClose: () => void }) {
    const [title, setTitle] = useState(toy.title);
    const [description, setDescription] = useState(toy.description);
    const [ageMin, setAgeMin] = useState(toy.ageMin);
    const [ageMax, setAgeMax] = useState(toy.ageMax);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleImages, setVisibleImages] = useState(toy.images);
    const [dragActive, setDragActive] = useState(false);

    async function uploadImages(files: File[]) {
        const fileNames: string[] = [];
        for (const file of files) {
            const res = await fetch(`/api/upload-url?type=${encodeURIComponent(file.type)}`);
            const { url, fileName } = await res.json();

            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            fileNames.push(fileName);
        }
        return fileNames;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let newImageNames: string[] = [];
        if (newFiles.length > 0) {
            newImageNames = await uploadImages(newFiles);
        }

        const res = await fetch(`/api/toys/${toy.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                ageMin,
                ageMax,
                removeImages,
                newImages: newImageNames,
            }),
        });

        if (res.ok) {
            mutate("/api/toys/mine");
            onClose();
        } else {
            alert("Erreur lors de la mise à jour");
        }

        setLoading(false);
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const already = toy.images.length - removeImages.length;
            if (droppedFiles.length + already > 5) {
                alert(`Vous ne pouvez pas dépasser 5 images par jouet (il reste ${5 - already} slot(s))`);
                return;
            }
            setNewFiles(droppedFiles);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setNewFiles(files => files.filter((_, index) => index !== indexToRemove));
    };

    const remainingSlots = 5 - (toy.images.length - removeImages.length);

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="text-3xl text-yellow-400">
                        <Pen size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Modifier le jouet</h2>
                        <p className="text-gray-400">Mettez à jour les informations</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Basic info section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Informations de base
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Titre
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                                placeholder="Nom du jouet"
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none"
                                placeholder="Décrivez le jouet..."
                            />
                        </div>
                    </div>
                </div>

                {/* Age range section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Baby className="w-5 h-5" />
                        Tranche d'âge
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Âge minimum
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="18"
                                value={ageMin}
                                onChange={(e) => setAgeMin(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Âge maximum
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="18"
                                value={ageMax}
                                onChange={(e) => setAgeMax(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
                        <span className="text-cyan-300 font-medium">
                            Convient aux {ageMin}-{ageMax} ans
                        </span>
                    </div>
                </div>

                {/* Images management */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Gestion des images
                        <span className="text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                            {remainingSlots} slots libres
                        </span>
                    </h3>

                    {/* Existing images */}
                    {visibleImages.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Images actuelles</h4>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {visibleImages.map((img: any) => (
                                    <div key={img.id} className="relative group">
                                        <img 
                                            src={img.signedUrl} 
                                            alt="" 
                                            className="w-full h-20 object-cover rounded-xl border border-white/20" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRemoveImages((prev) =>
                                                    prev.includes(img.url) ? prev : [...prev, img.url]
                                                );
                                                setVisibleImages((prev) => prev.filter((i: any) => i.id !== img.id));
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New images upload */}
                    {remainingSlots > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-300">Ajouter de nouvelles images</h4>
                            
                            {/* Drag & drop zone */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                    dragActive
                                        ? "border-emerald-400 bg-emerald-500/10"
                                        : "border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10"
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.files || []);
                                        const already = toy.images.length - removeImages.length;
                                        if (selected.length + already > 5) {
                                            alert(`Vous ne pouvez pas dépasser 5 images par jouet (il reste ${5 - already} slot(s))`);
                                            return;
                                        }
                                        setNewFiles(selected);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                
                                <div className="space-y-2">
                                    <div className="text-3xl text-cyan-400">
                                        <UploadCloud size={32} className="mx-auto" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            Glissez vos photos ici
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            ou cliquez pour sélectionner ({remainingSlots} max)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* New files preview */}
                            {newFiles.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-300 mb-3">Nouvelles images à ajouter</h5>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {newFiles.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Nouveau ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-xl border-2 border-emerald-500/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-xs px-1 py-0.5 rounded-b-xl">
                                                    NOUVEAU
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {remainingSlots === 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                            <div className="text-yellow-300">
                                Limite d'images atteinte (5/5)
                            </div>
                            <div className="text-yellow-200/70 text-sm">
                                Supprimez des images existantes pour en ajouter de nouvelles
                            </div>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                        Annuler
                    </button>
                    
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-2 group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Sauvegarder les modifications
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>

            {/* Custom styles */}
            <style jsx>{`
                .flex-2 {
                    flex: 2;
                }
            `}</style>
        </div>
    );
}