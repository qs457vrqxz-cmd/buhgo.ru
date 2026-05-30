"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  getClients,
  getAccountants,
  addClient,
  updateClient,
  deleteClient,
  toggleClientStatus,
  assignClientToAccountant,
  unassignClientFromAccountant,
  isEmailTaken,
  type Client,
  type Accountant,
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
  Building2,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Search,
  Filter,
  Copy,
  Key,
} from "lucide-react";

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccountant, setFilterAccountant] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    inn: "",
    ogrn: "",
    legalAddress: "",
    actualAddress: "",
    contactPerson: "",
    tariff: "",
    contractDate: "",
    assignedAccountant: "",
    notes: "",
    isActive: true,
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

    loadData();
    setIsLoading(false);
  }, [router]);

  const loadData = async () => {
    try {
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

      // Load accountants from Supabase
      const accResponse = await fetch('/api/users/list?role=accountant');
      if (accResponse.ok) {
        const accData = await accResponse.json();
        if (accData.users && accData.users.length > 0) {
          setAccountants(accData.users);
        } else {
          setAccountants(getAccountants());
        }
      } else {
        setAccountants(getAccountants());
      }
    } catch (error) {
      console.error('Load data error:', error);
      setClients(getClients());
      setAccountants(getAccountants());
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      inn: "",
      ogrn: "",
      legalAddress: "",
      actualAddress: "",
      contactPerson: "",
      tariff: "",
      contractDate: "",
      assignedAccountant: "",
      notes: "",
      isActive: true,
    });
    setEditingClient(null);
    setGeneratedPassword("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Скопировано в буфер обмена");
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      companyName: client.companyName,
      inn: client.inn || "",
      ogrn: client.ogrn || "",
      legalAddress: client.legalAddress || "",
      actualAddress: client.actualAddress || "",
      contactPerson: client.contactPerson || "",
      tariff: client.tariff || "",
      contractDate: client.contractDate || "",
      assignedAccountant: client.assignedAccountant || "",
      notes: client.notes || "",
      isActive: client.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого клиента?")) {
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
      deleteClient(id);
      await loadData();
      toast.success("Клиент удалён");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Ошибка удаления клиента');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    const newStatus = !client.isActive;

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          role: 'client',
          updates: { isActive: newStatus }
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || 'Ошибка обновления статуса');
        return;
      }

      // Also update localStorage for backward compatibility
      toggleClientStatus(id);
      await loadData();
      toast.success(newStatus ? "Аккаунт активирован" : "Аккаунт деактивирован");
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.companyName) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingClient) {
      // Update existing client via API
      try {
        const response = await fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editingClient.id,
            role: 'client',
            updates: {
              name: formData.name,
              phone: formData.phone,
              companyName: formData.companyName,
              inn: formData.inn,
              ogrn: formData.ogrn,
              legalAddress: formData.legalAddress,
              actualAddress: formData.actualAddress,
              contactPerson: formData.contactPerson,
              tariff: formData.tariff,
              contractDate: formData.contractDate,
              assignedAccountant: formData.assignedAccountant || 'none',
              notes: formData.notes,
              isActive: formData.isActive,
            }
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || 'Ошибка обновления клиента');
          return;
        }

        // Also update localStorage for backward compatibility
        if (formData.assignedAccountant !== editingClient.assignedAccountant) {
          if (editingClient.assignedAccountant) {
            unassignClientFromAccountant(editingClient.id);
          }
          if (formData.assignedAccountant && formData.assignedAccountant !== "none") {
            assignClientToAccountant(editingClient.id, formData.assignedAccountant);
          }
        }
        updateClient(editingClient.id, formData);

        toast.success("Клиент обновлён");
        await loadData();
        setIsDialogOpen(false);
        resetForm();
      } catch (error) {
        console.error('Update client error:', error);
        toast.error('Ошибка обновления клиента');
      }
    } else {
      // Generate password for new client
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
            role: 'client',
            phone: formData.phone,
            companyName: formData.companyName,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || 'Ошибка создания пользователя');
          return;
        }

        const newUserId = result.userId;

        // Update additional client fields if provided
        if (formData.inn || formData.tariff || formData.assignedAccountant) {
          await fetch('/api/users/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: newUserId,
              role: 'client',
              updates: {
                inn: formData.inn,
                ogrn: formData.ogrn,
                legalAddress: formData.legalAddress,
                actualAddress: formData.actualAddress,
                contactPerson: formData.contactPerson,
                tariff: formData.tariff,
                contractDate: formData.contractDate,
                assignedAccountant: formData.assignedAccountant || 'none',
                notes: formData.notes,
              }
            }),
          });
        }

        // Also save to localStorage for backward compatibility
        savePassword(formData.email, password);
        const newClient = addClient(formData);
        if (formData.assignedAccountant && formData.assignedAccountant !== "none") {
          assignClientToAccountant(newClient.id, formData.assignedAccountant);
        }

        // Send welcome email
        const emailTemplate = createWelcomeEmail(formData.name, formData.email, password, "client");
        await sendEmail(emailTemplate);

        toast.success(
          <div className="space-y-1">
            <p>Клиент добавлен!</p>
            <p className="text-xs text-muted-foreground">
              Письмо с паролем отправлено на {formData.email}
            </p>
          </div>
        );

        await loadData();
      } catch (error) {
        console.error('Create client error:', error);
        toast.error('Ошибка создания клиента');
        return;
      }
    }
  };

  const handleAssignAccountant = async (clientId: string, accountantId: string) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: clientId,
          role: 'client',
          updates: {
            assignedAccountant: accountantId || 'none'
          }
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || 'Ошибка назначения бухгалтера');
        return;
      }

      // Also update localStorage for backward compatibility
      const client = clients.find((c) => c.id === clientId);
      if (client?.assignedAccountant) {
        unassignClientFromAccountant(clientId);
      }
      if (accountantId && accountantId !== "none") {
        assignClientToAccountant(clientId, accountantId);
      }

      await loadData();
      toast.success("Бухгалтер назначен");
    } catch (error) {
      console.error('Assign accountant error:', error);
      toast.error('Ошибка назначения бухгалтера');
    }
  };

  const getAccountantName = (accountantId?: string) => {
    if (!accountantId) return "Не назначен";
    const accountant = accountants.find((a) => a.id === accountantId);
    return accountant?.name || "Не найден";
  };

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.inn && client.inn.includes(searchQuery));

    const matchesAccountant =
      filterAccountant === "all" ||
      (filterAccountant === "unassigned" && !client.assignedAccountant) ||
      client.assignedAccountant === filterAccountant;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && client.isActive) ||
      (filterStatus === "inactive" && !client.isActive);

    return matchesSearch && matchesAccountant && matchesStatus;
  });

  const tariffOptions = [
    "Базовый",
    "Расширенный",
    "Премиум",
    "Нулевая отчётность",
    "Кадровый учёт",
    "Индивидуальный",
  ];

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
                <h1 className="text-2xl font-bold">Клиенты компании</h1>
                <p className="text-muted-foreground text-sm">
                  Список компаний с личными кабинетами
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
                  Добавить клиента
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Редактирование клиента" : "Новый клиент"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingClient
                      ? "Обновите информацию о клиенте"
                      : "Создайте личный кабинет для клиента"}
                  </DialogDescription>
                </DialogHeader>

                {generatedPassword ? (
                  <div className="space-y-4 py-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Клиент успешно создан!
                      </h3>
                      <p className="text-sm text-green-700 mb-4">
                        Данные для входа отправлены на email клиента:
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
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3">Основная информация</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Название компании *</Label>
                        <Input
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="ООО «Компания»"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Контактное лицо *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Иванов Иван Иванович"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@company.ru"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+7 (495) 123-45-67"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3">Реквизиты</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ИНН</Label>
                        <Input
                          value={formData.inn}
                          onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ОГРН/ОГРНИП</Label>
                        <Input
                          value={formData.ogrn}
                          onChange={(e) => setFormData({ ...formData, ogrn: e.target.value })}
                          placeholder="1234567890123"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Юридический адрес</Label>
                      <Input
                        value={formData.legalAddress}
                        onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                        placeholder="г. Москва, ул. Примерная, д. 1"
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Фактический адрес</Label>
                      <Input
                        value={formData.actualAddress}
                        onChange={(e) => setFormData({ ...formData, actualAddress: e.target.value })}
                        placeholder="г. Москва, ул. Примерная, д. 1"
                      />
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3">Обслуживание</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Тариф</Label>
                        <Select
                          value={formData.tariff}
                          onValueChange={(value) => setFormData({ ...formData, tariff: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тариф" />
                          </SelectTrigger>
                          <SelectContent>
                            {tariffOptions.map((tariff) => (
                              <SelectItem key={tariff} value={tariff}>
                                {tariff}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Дата договора</Label>
                        <Input
                          type="date"
                          value={formData.contractDate}
                          onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Ответственный бухгалтер</Label>
                      <Select
                        value={formData.assignedAccountant}
                        onValueChange={(value) => setFormData({ ...formData, assignedAccountant: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите бухгалтера" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Не назначен</SelectItem>
                          {accountants.filter((a) => a.isActive).map((accountant) => (
                            <SelectItem key={accountant.id} value={accountant.id}>
                              {accountant.name} {accountant.position && `(${accountant.position})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Примечания</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Дополнительная информация о клиенте..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      {editingClient ? "Сохранить" : "Создать клиента"}
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
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clients.length}</p>
                    <p className="text-xs text-muted-foreground">Всего клиентов</p>
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
                    <p className="text-2xl font-bold">{clients.filter((c) => c.isActive).length}</p>
                    <p className="text-xs text-muted-foreground">Активных</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clients.filter((c) => c.assignedAccountant).length}</p>
                    <p className="text-xs text-muted-foreground">С бухгалтером</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clients.filter((c) => !c.assignedAccountant).length}</p>
                    <p className="text-xs text-muted-foreground">Без бухгалтера</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию, ИНН, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterAccountant} onValueChange={setFilterAccountant}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Бухгалтер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все бухгалтеры</SelectItem>
                    <SelectItem value="unassigned">Без бухгалтера</SelectItem>
                    {accountants.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="space-y-4">
            {filteredClients.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {clients.length === 0
                      ? "Клиенты не найдены. Добавьте первого клиента!"
                      : "Клиенты по заданным фильтрам не найдены"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredClients.map((client) => (
                <Card key={client.id} className={`hover:shadow-md transition-shadow ${!client.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{client.companyName}</h3>
                          {client.isActive ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Активен</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Неактивен</Badge>
                          )}
                          {client.tariff && (
                            <Badge variant="outline" className="text-xs">{client.tariff}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{client.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </span>
                          )}
                          {client.inn && (
                            <span>ИНН: {client.inn}</span>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">
                            Бухгалтер:{" "}
                            <span className={client.assignedAccountant ? "text-primary font-medium" : "text-yellow-600"}>
                              {getAccountantName(client.assignedAccountant)}
                            </span>
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
                          <DropdownMenuItem onClick={() => handleEdit(client)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async () => {
                            const password = generatePassword(12);
                            savePassword(client.email, password);

                            // Send email with new password
                            const emailTemplate = createWelcomeEmail(client.name, client.email, password, "client");
                            await sendEmail(emailTemplate);

                            copyToClipboard(password);
                            toast.success(
                              <div className="space-y-1">
                                <p>Новый пароль: {password}</p>
                                <p className="text-xs text-muted-foreground">
                                  Письмо отправлено на {client.email}
                                </p>
                              </div>,
                              { duration: 10000 }
                            );
                          }}>
                            <Key className="mr-2 h-4 w-4" />
                            Сбросить пароль
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(client.id)}>
                            {client.isActive ? (
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
                            onClick={() => handleDelete(client.id)}
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
