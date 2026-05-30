"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  previewClassName?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

export function ImageUpload({
  value,
  onChange,
  label = "Изображение",
  placeholder = "https://example.com/image.jpg",
  previewClassName = "max-h-48",
  aspectRatio = "auto",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5 МБ");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        toast.success("Изображение загружено");
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Ошибка при загрузке изображения");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Ошибка при загрузке изображения");
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const clearImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }[aspectRatio];

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="text-xs sm:text-sm">
            <Link className="h-4 w-4 mr-1.5" />
            URL ссылка
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs sm:text-sm">
            <Upload className="h-4 w-4 mr-1.5" />
            Загрузить
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-3">
          <Input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Вставьте прямую ссылку на изображение (Imgur, Google Drive, и др.)
          </p>
        </TabsContent>

        <TabsContent value="upload" className="mt-3">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors hover:border-primary hover:bg-primary/5
              ${isUploading ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Перетащите изображение сюда
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    или нажмите для выбора файла (до 5 МБ)
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {value && (
        <div className="relative mt-3">
          <p className="text-sm text-muted-foreground mb-2">Предпросмотр:</p>
          <div className={`relative inline-block ${aspectRatioClass}`}>
            <img
              src={value}
              alt="Предпросмотр"
              className={`rounded-lg shadow-md object-cover ${previewClassName}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect fill='%23f3f4f6' width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EОшибка загрузки%3C/text%3E%3C/svg%3E";
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
