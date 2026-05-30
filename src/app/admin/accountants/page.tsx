"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  getAccountants,
  addAccountant,
  updateAccountant,
  deleteAccountant,
  toggleAccountantStatus,
  getClients,
  defaultAccountantPermissions,
  isEmailTaken,
  type Accountant,
  type AccountantPermissions,
  type Client,
} from "@/lib/users";
import {
  generatePassword,
  savePassword,
  createWelcomeEmail,
  sendEmail,
} from "@/lib/email";
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Save,
  X,
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Copy,
  Key,
} from "lucide-react";

export default function AdminAccountantsPage() {
  const router = useRouter();
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [editingAccountant, setEditingAccountant] = useState<Accountant | null>(null);
  const [selectedAccountant, setSelectedAccountant] = useState<Accountant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    isActive: true,
  });

  const [permissions, setPermissions] = useState<AccountantPermissions>(defaultAccountantPermissions);

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

    loadData();
    setIsLoading(false);
  }, [router]);

  const loadData = async () => {
    try {
      // Load accountants from Supabase
      const accResponse = await fetch('/api/users/list?role=accountant');
      if (accResponse.ok) {
        const accData = await accResponse.json();
        if (accData.users && accData.users.length > 0) {
          setAccountants(accData.users);
        } else {
          // Fallback to localStorage
          setAccountants(getAccountants());
        }
      } else {
        setAccountants(getAccountants());
      }

      // Load clients from Supabase
      const clientResponse = await fetch('/api/users/list?role=client');
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        if (clientData.users && clientData.users.length > 0) {
          setClients(clientData.users);
        } else {
          setClients(getClients());
        }
      } else {
        setClients(getClients());
      }
    } catch (error) {
      console.error('Load data error:', error);
      // Fallback to localStorage
      setAccountants(getAccountants());
      setClients(getClients());
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      isActive: true,
    });
    setPermissions(defaultAccountantPermissions);
    setEditingAccountant(null);
    setGeneratedPassword("");
  };

  const handleEdit = (accountant: Accountant) => {
    setEditingAccountant(accountant);
    setFormData({
      name: accountant.name,
      email: accountant.email,
      phone: accountant.phone || "",
      position: accountant.position || "",
      isActive: accountant.isActive,
    });
    setPermissions(accountant.permissions);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const accountant = accountants.find((a) => a.id === id);
    if (accountant && accountant.assignedClients && accountant.assignedClients.length > 0) {
      if (!confirm(`У этого бухгалтера есть ${accountant.assignedClients.length} назначенных клиентов. Клиенты будут откреплены. Продолжить?`)) {
        return;
      }
    } else if (!confirm("Вы уверены, что хотите удалить этого бухгалтера?")) {
      return;
    }

    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || 'Ошибка удаления');
        return;
      }

      // Also delete from localStorage for backward compatibility
      deleteAccountant(id);
      await loadData();
      toast.success("Бухгалтер удалён");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Ошибка удаления бухгалтера');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const acc = accountants.find((a) => a.id === id);
    if (!acc) return;

    const newStatus = !acc.isActive;

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          role: 'accountant',
          updates: { isActive: newStatus }
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || 'Ошибка обновления статуса');
        return;
      }

      // Also update localStorage for backward compatibility
      toggleAccountantStatus(id);
      await loadData();
      toast.success(newStatus ? "Аккаунт активирован" : "Аккаунт деактивирован");
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingAccountant) {
      // Update existing accountant via API
      try {
        const response = await fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editingAccountant.id,
            role: 'accountant',
            updates: {
              name: formData.name,
              phone: formData.phone,
              position: formData.position,
              isActive: formData.isActive,
              permissions: permissions,
            }
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || 'Ошибка обновления бухгалтера');
          return;
        }

        // Also update localStorage for backward compatibility
        updateAccountant(editingAccountant.id, {
          ...formData,
          permissions,
        });

        toast.success("Бухгалтер обновлён");
        await loadData();
        setIsDialogOpen(false);
        resetForm();
      } catch (error) {
        console.error('Update accountant error:', error);
        toast.error('Ошибка обновления бухгалтера');
      }
    } else {
      // Generate password for new accountant
      const password = generatePassword(12);
      setGeneratedPassword(password);

      // Create user in Supabase
      try {
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: password,
            name: formData.name,
            role: 'accountant',
            phone: formData.phone,
            position: formData.position,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || 'Ошибка создания пользователя');
          return;
        }

        const newUserId = result.userId;

        // Update permissions via API
        await fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: newUserId,
            role: 'accountant',
            updates: {
              permissions: permissions,
            }
          }),
        });

        // Also save to localStorage for backward compatibility
        savePassword(formData.email, password);
        addAccountant({
          ...formData,
          permissions,
          assignedClients: [],
        });

        // Send welcome email
        const emailTemplate = createWelcomeEmail(formData.name, formData.email, password, "accountant");
        await sendEmail(emailTemplate);

        toast.success(
          <div className="space-y-1">
            <p>Бухгалтер добавлен!</p>
            <p className="text-xs text-muted-foreground">
              Письмо с паролем отправлено на {formData.email}
            </p>
          </div>
        );

        await loadData();
      } catch (error) {
        console.error('Create accountant error:', error);
        toast.error('Ошибка создания бухгалтера');
        return;
      }
    }

    if (!generatedPassword && editingAccountant) {
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleOpenPermissions = (accountant: Accountant) => {
    setSelectedAccountant(accountant);
    setPermissions(accountant.permissions);
    setIsPermissionsOpen(true);
  };

  const handleSavePermissions = async () => {
    if (selectedAccountant) {
      try {
        const response = await fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedAccountant.id,
            role: 'accountant',
            updates: {
              permissions: permissions,
            }
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          toast.error(result.error || 'Ошибка обновления прав');
          return;
        }

        // Also update localStorage for backward compatibility
        updateAccountant(selectedAccountant.id, { permissions });
        await loadData();
        toast.success("Права доступа обновлены");
        setIsPermissionsOpen(false);
      } catch (error) {
        console.error('Update permissions error:', error);
        toast.error('Ошибка обновления прав доступа');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Скопировано в буфер обмена");
  };

  const getClientCount = (accountantId: string) => {
    return clients.filter((c) => c.assignedAccountant === accountantId).length;
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
                <h1 className="text-2xl font-bold">Управление бухгалтерами</h1>
                <p className="text-muted-foreground text-sm">
                  Создание аккаунтов и настройка доступов
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить бухгалтера
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAccountant ? "Редактирование бухгалтера" : "Новый бухгалтер"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAccountant
                      ? "Обновите информацию о бухгалтере"
                      : "Создайте аккаунт для бухгалтера компании"}
                  </DialogDescription>
                </DialogHeader>

                {generatedPassword ? (
                  <div className="space-y-4 py-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Бухгалтер успешно создан!
                      </h3>
                      <p className="text-sm text-green-700 mb-4">
                        Отправьте эти данные бухгалтеру для входа в систему:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-sm"><strong>Email:</strong> {formData.email}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(formData.email)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-sm"><strong>Пароль:</strong> {generatedPassword}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedPassword)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}>
                      Закрыть
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ФИО *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Иванова Мария Петровна"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Должность</Label>
                        <Input
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="Главный бухгалтер"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="maria@buhgalter.tech"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Права доступа</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Просмотр клиентов</Label>
                          <Switch
                            checked={permissions.canViewClients}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canViewClients: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Редактирование клиентов</Label>
                          <Switch
                            checked={permissions.canEditClients}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canEditClients: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Просмотр документов</Label>
                          <Switch
                            checked={permissions.canViewDocuments}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canViewDocuments: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Загрузка документов</Label>
                          <Switch
                            checked={permissions.canUploadDocuments}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canUploadDocuments: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Отправка сообщений</Label>
                          <Switch
                            checked={permissions.canSendMessages}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canSendMessages: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Просмотр отчётов</Label>
                          <Switch
                            checked={permissions.canViewReports}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canViewReports: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Создание отчётов</Label>
                          <Switch
                            checked={permissions.canCreateReports}
                            onCheckedChange={(checked) => setPermissions({ ...permissions, canCreateReports: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <Label>Аккаунт активен</Label>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingAccountant ? "Сохранить" : "Создать аккаунт"}
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
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{accountants.length}</p>
                    <p className="text-xs text-muted-foreground">Всего бухгалтеров</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{accountants.filter((a) => a.isActive).length}</p>
                    <p className="text-xs text-muted-foreground">Активных</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <UserX className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{accountants.filter((a) => !a.isActive).length}</p>
                    <p className="text-xs text-muted-foreground">Неактивных</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clients.length}</p>
                    <p className="text-xs text-muted-foreground">Всего клиентов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accountants List */}
          <div className="space-y-4">
            {accountants.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Бухгалтеры не найдены. Добавьте первого бухгалтера!
                  </p>
                </CardContent>
              </Card>
            ) : (
              accountants.map((accountant) => (
                <Card key={accountant.id} className={`hover:shadow-md transition-shadow ${!accountant.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {accountant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{accountant.name}</h3>
                          {accountant.isActive ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Активен</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Неактивен</Badge>
                          )}
                        </div>
                        {accountant.position && (
                          <p className="text-sm text-muted-foreground">{accountant.position}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {accountant.email}
                          </span>
                          {accountant.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {accountant.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {getClientCount(accountant.id)} клиентов
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(accountant)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenPermissions(accountant)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Права доступа
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async () => {
                            const password = generatePassword(12);
                            savePassword(accountant.email, password);

                            // Send email with new password
                            const emailTemplate = createWelcomeEmail(accountant.name, accountant.email, password, "accountant");
                            await sendEmail(emailTemplate);

                            copyToClipboard(password);
                            toast.success(
                              <div className="space-y-1">
                                <p>Новый пароль: {password}</p>
                                <p className="text-xs text-muted-foreground">
                                  Письмо отправлено на {accountant.email}
                                </p>
                              </div>,
                              { duration: 10000 }
                            );
                          }}>
                            <Key className="mr-2 h-4 w-4" />
                            Сбросить пароль
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(accountant.id)}>
                            {accountant.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Деактивировать
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Активировать
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(accountant.id)}
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

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Права доступа</DialogTitle>
            <DialogDescription>
              Настройка прав для {selectedAccountant?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-normal">Просмотр клиентов</Label>
                <Switch
                  checked={permissions.canViewClients}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canViewClients: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Редактирование клиентов</Label>
                <Switch
                  checked={permissions.canEditClients}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canEditClients: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Просмотр документов</Label>
                <Switch
                  checked={permissions.canViewDocuments}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canViewDocuments: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Загрузка документов</Label>
                <Switch
                  checked={permissions.canUploadDocuments}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canUploadDocuments: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Отправка сообщений</Label>
                <Switch
                  checked={permissions.canSendMessages}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canSendMessages: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Просмотр отчётов</Label>
                <Switch
                  checked={permissions.canViewReports}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canViewReports: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Создание отчётов</Label>
                <Switch
                  checked={permissions.canCreateReports}
                  onCheckedChange={(checked) => setPermissions({ ...permissions, canCreateReports: checked })}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSavePermissions}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
