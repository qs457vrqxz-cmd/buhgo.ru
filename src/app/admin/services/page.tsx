"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  getServices,
  saveServices,
  addService,
  updateService,
  deleteService,
  resetToDefaults,
  iconOptions,
  type Service,
} from "@/lib/content";
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Save,
  X,
  ArrowLeft,
  GripVertical,
  RotateCcw,
  FileText,
  FileCheck,
  Building2,
  Calculator,
  Users,
  Code,
  Briefcase,
  MessageSquare,
  RefreshCw,
  Shield,
  Clock,
  Award,
  HeadphonesIcon,
  Phone,
  Mail,
  CreditCard,
  PieChart,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  FileCheck,
  Building2,
  Calculator,
  Users,
  Code,
  Briefcase,
  MessageSquare,
  RefreshCw,
  Shield,
  Clock,
  Award,
  HeadphonesIcon,
  Phone,
  Mail,
  CreditCard,
  PieChart,
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    icon: "FileText",
    title: "",
    description: "",
    price: "",
    priceNote: "",
    href: "",
    bonus: "",
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

    setServices(getServices());
    setIsLoading(false);
  }, [router]);

  const resetForm = () => {
    setFormData({
      icon: "FileText",
      title: "",
      description: "",
      price: "",
      priceNote: "",
      href: "",
      bonus: "",
      order: services.length + 1,
    });
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon,
      title: service.title,
      description: service.description,
      price: service.price,
      priceNote: service.priceNote || "",
      href: service.href,
      bonus: service.bonus || "",
      order: service.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту услугу?")) {
      deleteService(id);
      setServices(getServices());
      toast.success("Услуга удалена");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingService) {
      updateService(editingService.id, formData);
      toast.success("Услуга обновлена");
    } else {
      addService(formData);
      toast.success("Услуга добавлена");
    }

    setServices(getServices());
    setIsDialogOpen(false);
    resetForm();
  };

  const handleReset = () => {
    if (confirm("Вы уверены? Все изменения будут потеряны.")) {
      resetToDefaults("services");
      setServices(getServices());
      toast.success("Услуги восстановлены");
    }
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName] || FileText;
    return <Icon className="h-5 w-5" />;
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
                <h1 className="text-2xl font-bold">Управление услугами</h1>
                <p className="text-muted-foreground text-sm">
                  Редактирование списка услуг на главной странице
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
                    Добавить услугу
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingService ? "Редактирование услуги" : "Новая услуга"}
                    </DialogTitle>
                    <DialogDescription>
                      Заполните поля для создания или редактирования услуги
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Иконка</Label>
                        <select
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
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
                      <Label>Название *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ведение бухгалтерского учёта"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Описание *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Краткое описание услуги"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Цена *</Label>
                        <Input
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="от 1 500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Примечание к цене</Label>
                        <Input
                          value={formData.priceNote}
                          onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                          placeholder="руб/мес"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ссылка на страницу</Label>
                        <Input
                          value={formData.href}
                          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                          placeholder="/uslugi/vedenie-buhucheta"
                        />
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

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingService ? "Сохранить" : "Добавить"}
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

          {/* Services List */}
          <div className="space-y-4">
            {services.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Услуги не найдены. Добавьте первую услугу!
                  </p>
                </CardContent>
              </Card>
            ) : (
              services.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="cursor-grab text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent iconName={service.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{service.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            #{service.order}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary font-semibold">{service.price}</span>
                          {service.priceNote && (
                            <span className="text-xs text-muted-foreground">{service.priceNote}</span>
                          )}
                          {service.bonus && (
                            <Badge variant="outline" className="text-xs">
                              {service.bonus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
