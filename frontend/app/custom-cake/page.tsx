"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface CakeFile {
  id: number;
  file: File;
  preview: string;
  name: string;
}

export default function CustomCakePage() {
  const [files, setFiles] = useState<CakeFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [cakeType, setCakeType] = useState("");
  const [layers, setLayers] = useState("");
  const [flavor, setFlavor] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const valid: CakeFile[] = [];

    newFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      if (file.size > 10 * 1024 * 1024) {
        showToast(`Ảnh "${file.name}" vượt 10MB`);
        return;
      }

      valid.push({
        id: idRef.current++,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    });

    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (id: number) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles([...e.dataTransfer.files]);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      showToast("Vui lòng upload ít nhất 1 ảnh");
      return;
    }

    showToast("Đã gửi yêu cầu!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      

      <section className="relative w-full h-[300px]">
              <Image
                src="/cakebg.png"
                alt="Đặt bánh theo yêu cầu"
                fill
                className="object-cover"
                priority
              />
      
              {/* overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
      
              {/* text */}
               <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
                <p className="text-xs tracking-[0.3em] mb-3">Witchy Bakery</p>
                <h1 className="text-4xl font-bold">Đặt bánh theo yêu cầu</h1>
              </div>
            </section>

      {/* MAIN */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* UPLOAD */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
          ${dragOver ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              addFiles([...(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />

          <p className="text-lg font-semibold">📷 Upload ảnh bánh</p>
          <p className="text-sm text-gray-500 mt-2">
            Kéo thả hoặc click để chọn
          </p>
        </div>

        {/* PREVIEW */}
        {files.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm text-gray-600">
              {files.length} ảnh đã chọn
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="relative rounded-lg overflow-hidden border"
                >
                  <img
                    src={f.preview}
                    className="w-full h-40 object-cover"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white w-6 h-6 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        <div className="mt-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={cakeType}
              onChange={(e) => setCakeType(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Loại bánh</option>
              <option>Bánh kem </option>
              <option>Bánh mini cake</option>
              <option>Bánh sinh nhật</option>
            </select>

            <select
              value={layers}
              onChange={(e) => setLayers(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Size bánh</option>
              <option>16cm</option>
              <option>20cm</option>
              <option>24cm</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={flavor}
              onChange={(e) => setFlavor(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Hương vị</option>
              <option>Vani</option>
              <option>Socola</option>
              <option>Dâu</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Yêu cầu thêm..."
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
          >
            Gửi yêu cầu
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2 rounded-full text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}