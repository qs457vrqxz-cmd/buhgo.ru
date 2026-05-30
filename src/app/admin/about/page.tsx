"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  getAbout,
  saveAbout,
  resetToDefaults,
  type AboutInfo,
} from "@/lib/content";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Save,
  ArrowLeft,
  RotateCcw,
  User,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdminAboutPage() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutInfo | null>(null);
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

    setAbout(getAbout());
    setIsLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    saveAbout(about);
    toast.success("Информация сохранена");
    setIsSaving(false);
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("about");
      setAbout(getAbout());
      toast.success("Информация восстановлена");
    }
  };

  const updateBioParagraph = (index: number, value: string) => {
    if (!about) return;
    const newBio = [...about.bio];
    newBio[index] = value;
    setAbout({ ...about, bio: newBio });
  };

  const addBioParagraph = () => {
    if (!about) return;
    setAbout({ ...about, bio: [...about.bio, ""] });
  };

  const removeBioParagraph = (index: number) => {
    if (!about || about.bio.length <= 1) return;
    const newBio = about.bio.filter((_, i) => i !== index);
    setAbout({ ...about, bio: newBio });
  };

  if (isLoading || !about) {
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
                <h1 className="text-2xl font-bold">Страница "Обо мне"</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование информации о себе
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
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Личная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ФИО</Label>
                  <Input
                    value={about.name}
                    onChange={(e) => setAbout({ ...about, name: e.target.value })}
                    placeholder="Кулумбегов Михаил Михайлович"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Фотография</CardTitle>
                <CardDescription>
                  Загрузите фотографию или укажите URL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={about.photo}
                  onChange={(url) => setAbout({ ...about, photo: url })}
                  label=""
                  placeholder="https://example.com/photo.jpg"
                  previewClassName="max-w-xs"
                  aspectRatio="portrait"
                />
              </CardContent>
            </Card>

            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle>Биография</CardTitle>
                <CardDescription>
                  Каждый абзац будет отображаться отдельным параграфом на странице
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {about.bio.map((paragraph, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Абзац {index + 1}</Label>
                      {about.bio.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBioParagraph(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={paragraph}
                      onChange={(e) => updateBioParagraph(index, e.target.value)}
                      placeholder="Текст абзаца..."
                      rows={4}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBioParagraph}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить абзац
                </Button>
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
