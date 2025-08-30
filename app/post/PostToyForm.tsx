"use client"

import Link from "next/link";
import { useState } from "react";
import { Sparkles, FileText, Baby, Settings, Camera, Check, X, ArrowLeft, ArrowRight, UploadCloud, Send, PartyPopper, Home, Gauge, Construction, Dices, Car, Book, Gem, Star, ThumbsUp, Wrench, Handshake, Gift, Bolt } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PostToyForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  const [condition, setCondition] = useState("GOOD");
  const [category, setCategory] = useState("OTHER");
  const [mode, setMode] = useState("DON");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [pointsCost, setPointsCost] = useState<number>(1);
  const router = useRouter()

  const totalSteps = 4;
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  async function uploadImages() {
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

    const uploadedFiles = await uploadImages();

    const res = await fetch("/api/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        ageMin,
        ageMax,
        condition,
        category,
        mode,
        pointsCost: mode === "POINTS" ? pointsCost : null,
        images: uploadedFiles.map((fileName) => ({ fileName })),
      }),
    });

    if (res.ok) {
      const newToy = await res.json();
      setCurrentStep(5); // Success step
      setTimeout(() => {
        toast.success("Jouet ajouté avec images !");
        setTitle("");
        setDescription("");
        setFiles([]);
        router.push(`/toys/${newToy.id}`);
      }, 2000);
    } else {
      toast.error("Erreur lors de l'ajout du jouet.");
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
      if (droppedFiles.length > 5) {
        toast.error("Maximum 5 images par jouet");
        return;
      }
      setFiles(droppedFiles);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return title.length > 0 && description.length > 10 && description.length <= 300;
      case 2: return ageMin >= 0 && ageMax > ageMin;
      case 3: return true; // Category and condition always valid
      case 4: return true; // Images optional
      default: return false;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "NEW": return <Sparkles size={24} />;
      case "VERY_GOOD": return <Star size={24} />;
      case "GOOD": return <ThumbsUp size={24} />;
      case "USED": return <Wrench size={24} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6 max-w-3xl mx-auto">
        {currentStep < 5 ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4 text-emerald-400 animate-bounce">
                <Sparkles size={64} className="mx-auto" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Partagez un trésor
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Donnez une nouvelle vie à un jouet
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-300">Étape {currentStep} sur {totalSteps}</span>
                <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-4 mb-12">
              {[
                { num: 1, label: "Description", icon: <FileText size={20} /> },
                { num: 2, label: "Âge", icon: <Baby size={20} /> },
                { num: 3, label: "Détails", icon: <Settings size={20} /> },
                { num: 4, label: "Photos", icon: <Camera size={20} /> }
              ].map((step) => (
                <div
                  key={step.num}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${currentStep >= step.num
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= step.num ? 'bg-emerald-500 text-white' : 'bg-white/20'
                    }`}>
                    {currentStep > step.num ? <Check size={20} /> : step.icon}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Form card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2 text-white">
                      <FileText size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Parlez-nous de ce jouet</h2>
                    <p className="text-gray-400">Donnez-lui un titre accrocheur et décrivez-le</p>
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titre du jouet
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Lego Creator 3-en-1, Barbie Dreamhouse..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description détaillée
                    </label>
                    <textarea
                      placeholder="Décrivez l'état, les pièces incluses, pourquoi vous l'échangez..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none"
                      required
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {description.length}/300 caractères
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Age Range */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2 text-white">
                      <Baby size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tranche d'âge</h2>
                    <p className="text-gray-400">Pour qui ce jouet est-il adapté ?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
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
                        className="w-full bg-white/5 border border-white/20 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
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
                        className="w-full bg-white/5 border border-white/20 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2 text-emerald-300">
                        <Baby size={32} className="mx-auto" />
                      </div>
                      <p className="text-emerald-300 font-medium">
                        Parfait pour les {ageMin}-{ageMax} ans
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2 text-white">
                      <Settings size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Détails du jouet</h2>
                    <p className="text-gray-400">Catégorie, état et mode d'échange</p>
                  </div>

                  <div className="grid gap-6">
                    {/* Category */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Catégorie
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "CONSTRUCTION", label: "Construction", icon: <Construction size={24} /> },
                          { value: "DOLLS", label: "Poupées", icon: <Gem size={24} /> },
                          { value: "VEHICLES", label: "Véhicules", icon: <Car size={24} /> },
                          { value: "BOARD_GAMES", label: "Jeux société", icon: <Dices size={24} /> },
                          { value: "BOOKS", label: "Livres", icon: <Book size={24} /> },
                          { value: "OTHER", label: "Autres", icon: <Gem size={24} /> }
                        ].map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${category === cat.value
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-lg"
                                : "bg-white/5 text-gray-400 border-white/20 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            <div className="text-2xl mb-1 flex justify-center">{cat.icon}</div>
                            <div className="text-sm font-medium">{cat.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        État du jouet
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "NEW", label: "Neuf", icon: <Sparkles size={24} />, color: "emerald" },
                          { value: "VERY_GOOD", label: "Très bon", icon: <Star size={24} />, color: "green" },
                          { value: "GOOD", label: "Bon état", icon: <ThumbsUp size={24} />, color: "blue" },
                          { value: "USED", label: "Usé", icon: <Wrench size={24} />, color: "orange" }
                        ].map((cond) => (
                          <button
                            key={cond.value}
                            type="button"
                            onClick={() => setCondition(cond.value)}
                            className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${condition === cond.value
                                ? `bg-${cond.color}-500/20 text-${cond.color}-300 border-${cond.color}-500/30 shadow-lg`
                                : "bg-white/5 text-gray-400 border-white/20 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            <div className="text-2xl mb-1 flex justify-center">{cond.icon}</div>
                            <div className="text-sm font-medium">{cond.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Type d'échange
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "DON", label: "Don", icon: <Gift size={24} />, color: "pink" },
                          { value: "EXCHANGE", label: "Échange", icon: <Handshake size={24} />, color: "blue" },
                          { value: "POINTS", label: "Points", icon: <Bolt size={24} />, color: "yellow" }
                        ].map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => setMode(m.value)}
                            className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${mode === m.value
                                ? `bg-${m.color}-500/20 text-${m.color}-300 border-${m.color}-500/30 shadow-lg`
                                : "bg-white/5 text-gray-400 border-white/20 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            <div className="text-2xl mb-1 flex justify-center">{m.icon}</div>
                            <div className="text-sm font-medium">{m.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Points cost (uniquement si mode = POINTS) */}
                    {mode === "POINTS" && (
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Valeur en points
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={pointsCost}
                          onChange={(e) => setPointsCost(Number(e.target.value))}
                          placeholder="Ex: 50"
                          className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Nombre de points requis pour obtenir ce jouet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Images */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2 text-white">
                      <Camera size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Ajoutez des photos</h2>
                    <p className="text-gray-400">Des images de qualité attirent plus d'échanges</p>
                  </div>

                  {/* Drag and drop area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${dragActive
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
                        if (selected.length > 5) {
                          toast.error("Maximum 5 images par jouet");
                          return;
                        }
                        setFiles(selected);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="text-6xl text-cyan-400 animate-bounce">
                        <UploadCloud size={64} className="mx-auto" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-2">
                          Glissez vos photos ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG jusqu'à 10MB • Maximum 5 images
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image previews */}
                  {files.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group bg-white/10 rounded-2xl p-2 border border-white/20">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs"
                          >
                            <X size={12} />
                          </button>
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Précédent
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="flex-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    Suivant
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-2 group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Publication...
                        </>
                      ) : (
                        <>
                          <Send size={20} /> Publier le jouet
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          // Success screen
          <div className="text-center py-16">
            <div className="text-8xl mb-6 text-emerald-400 animate-bounce">
              <PartyPopper size={96} className="mx-auto" />
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Trésor publié !
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Votre jouet est maintenant visible par la communauté
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/toys"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Voir tous les jouets
              </Link>
              <Link
                href="/dashboard"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Mon dashboard
              </Link>
            </div>
          </div>
        )}
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