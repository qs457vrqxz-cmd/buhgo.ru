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
  getPartners,
  addPartner,
  updatePartner,
  deletePartner,
  resetToDefaults,
  type Partner,
} from "@/lib/content";
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Save,
  X,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

export default function AdminPartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: "",
    services: "",
    color: "#3FB449",
    url: "",
    bonus: "",
    logo: "",
    order: 1,
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

    setPartners(getPartners());
    setIsLoading(false);
  }, [router]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      features: "",
      services: "",
      color: "#3FB449",
      url: "",
      bonus: "",
      logo: "",
      order: partners.length + 1,
    });
    setEditingPartner(null);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description,
      features: partner.features.join("\n"),
      services: partner.services.join("\n"),
      color: partner.color,
      url: partner.url || "",
      bonus: partner.bonus || "",
      logo: partner.logo || "",
      order: partner.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этого партнёра?")) {
      deletePartner(id);
      setPartners(getPartners());
      toast.success("Партнёр удалён");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const partnerData = {
      name: formData.name,
      description: formData.description,
      features: formData.features.split("\n").filter(Boolean),
      services: formData.services.split("\n").filter(Boolean),
      color: formData.color,
      url: formData.url || null,
      bonus: formData.bonus || undefined,
      logo: formData.logo || undefined,
      order: formData.order,
    };

    if (editingPartner) {
      updatePartner(editingPartner.id, partnerData);
      toast.success("Партнёр обновлён");
    } else {
      addPartner(partnerData);
      toast.success("Партнёр добавлен");
    }

    setPartners(getPartners());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("partners");
      setPartners(getPartners());
      toast.success("Партнёры восстановлены");
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
                <h1 className="text-2xl font-bold">Управление партнёрами</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование партнёрских программ
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
                    Добавить партнёра
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPartner ? "Редактирование партнёра" : "Новый партнёр"}
                    </DialogTitle>
                    <DialogDescription>
                      Заполните поля для создания или редактирования партнёра
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Название *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="СБИС"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Порядок отображения</Label>
                        <Input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Описание *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Краткое описание партнёра"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Возможности (каждая с новой строки)</Label>
                      <Textarea
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        placeholder="Электронная отчётность&#10;Электронный документооборот&#10;Проверка контрагентов"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Наши услуги (каждая с новой строки)</Label>
                      <Textarea
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        placeholder="Подключение и настройка&#10;Интеграция с 1С&#10;Обучение персонала"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Цвет бренда</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-14 h-10 p-1 cursor-pointer"
                          />
                          <Input
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="#3FB449"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Бонус (опционально)</Label>
                        <Input
                          value={formData.bonus}
                          onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                          placeholder="+ 500 руб бонус"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ссылка на сайт</Label>
                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://sbis.ru"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Логотип (URL изображения)</Label>
                      <Input
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                      {formData.logo && (
                        <div className="mt-2">
                          <img
                            src={formData.logo}
                            alt="Превью логотипа"
                            className="h-12 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingPartner ? "Сохранить" : "Добавить"}
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

          {/* Partners List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Партнёры не найдены. Добавьте первого партнёра!
                  </p>
                </CardContent>
              </Card>
            ) : (
              partners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: partner.color }}
                        >
                          {partner.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{partner.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            #{partner.order}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(partner)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          {partner.url && (
                            <DropdownMenuItem asChild>
                              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Открыть сайт
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(partner.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {partner.description}
                    </p>
                    {partner.bonus && (
                      <Badge className="bg-secondary/10 text-secondary">
                        {partner.bonus}
                      </Badge>
                    )}
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
