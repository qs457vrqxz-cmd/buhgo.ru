"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  resetToDefaults,
  type Testimonial,
} from "@/lib/content";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Save,
  X,
  ArrowLeft,
  RotateCcw,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    avatar: "",
    rating: 5,
    text: "",
    date: "",
    published: true,
  });

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

    setTestimonials(getTestimonials());
    setIsLoading(false);
  }, [router]);

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      role: "",
      avatar: "",
      rating: 5,
      text: "",
      date: new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
      published: true,
    });
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      role: testimonial.role,
      avatar: testimonial.avatar,
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.date,
      published: testimonial.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      deleteTestimonial(id);
      setTestimonials(getTestimonials());
      toast.success("Отзыв удалён");
    }
  };

  const handleTogglePublish = (testimonial: Testimonial) => {
    updateTestimonial(testimonial.id, { published: !testimonial.published });
    setTestimonials(getTestimonials());
    toast.success(testimonial.published ? "Отзыв скрыт" : "Отзыв опубликован");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.text || !formData.company) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, formData);
      toast.success("Отзыв обновлён");
    } else {
      addTestimonial(formData);
      toast.success("Отзыв добавлен");
    }

    setTestimonials(getTestimonials());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("testimonials");
      setTestimonials(getTestimonials());
      toast.success("Отзывы восстановлены");
    }
  };

  if (isLoading) {
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Управление отзывами</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование отзывов клиентов
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Сбросить
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить отзыв
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTestimonial ? "Редактирование отзыва" : "Новый отзыв"}
                    </DialogTitle>
                    <DialogDescription>
                      Заполните поля для создания или редактирования отзыва
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Имя клиента *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Алексей Петров"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Компания *</Label>
                        <Input
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="ООО «ТехноСервис»"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Должность</Label>
                        <Input
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          placeholder="Генеральный директор"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Дата</Label>
                        <Input
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          placeholder="Март 2026"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      value={formData.avatar}
                      onChange={(url) => setFormData({ ...formData, avatar: url })}
                      label="Фотография клиента"
                      placeholder="https://images.unsplash.com/..."
                      previewClassName="w-20 h-20 rounded-full"
                      aspectRatio="square"
                    />

                    <div className="space-y-2">
                      <Label>Рейтинг</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= formData.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Текст отзыва *</Label>
                      <Textarea
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Текст отзыва клиента..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="published" className="font-normal">
                        Опубликовать на сайте
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingTestimonial ? "Сохранить" : "Добавить"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Отмена
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Testimonials List */}
          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Отзывы не найдены. Добавьте первый отзыв!
                  </p>
                </CardContent>
              </Card>
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={`hover:shadow-md transition-shadow ${!testimonial.published ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={testimonial.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{testimonial.name}</h3>
                              {testimonial.published ? (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  Опубликован
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Скрыт
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role} — {testimonial.company}
                            </p>
                            <div className="flex gap-0.5 my-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm line-clamp-2">"{testimonial.text}"</p>
                            <p className="text-xs text-muted-foreground mt-2">{testimonial.date}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublish(testimonial)}>
                                {testimonial.published ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Скрыть
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Опубликовать
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(testimonial.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
