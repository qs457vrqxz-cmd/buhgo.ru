"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  getSiteImages,
  saveSiteImages,
  resetToDefaults,
  type SiteImages,
} from "@/lib/content";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Save,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

export default function AdminImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState<SiteImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "admin") {
      router.push("/login");
      return;
    }

    setImages(getSiteImages());
    setIsLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images) return;

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    saveSiteImages(images);
    toast.success("Изображения сохранены");
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("images");
      setImages(getSiteImages());
      toast.success("Изображения восстановлены");
    }
  };

  if (isLoading || !images) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Управление изображениями</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование изображений на сайте
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Image */}
            <Card>
              <CardHeader>
                <CardTitle>Главное изображение (Hero)</CardTitle>
                <CardDescription>
                  Изображение отображается на главной странице сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  value={images.heroImage}
                  onChange={(url) => setImages({ ...images, heroImage: url })}
                  label=""
                  placeholder="https://example.com/hero.jpg"
                  previewClassName="max-h-64 w-full"
                  aspectRatio="video"
                />
                <div className="space-y-2">
                  <Label>Alt текст (описание для SEO)</Label>
                  <Input
                    value={images.heroImageAlt}
                    onChange={(e) => setImages({ ...images, heroImageAlt: e.target.value })}
                    placeholder="Бухгалтерские услуги"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Логотип (опционально)</CardTitle>
                <CardDescription>
                  Логотип компании (если нужно заменить текстовый)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={images.logo || ""}
                  onChange={(url) => setImages({ ...images, logo: url })}
                  label=""
                  placeholder="https://example.com/logo.png"
                  previewClassName="max-h-20"
                  aspectRatio="auto"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
