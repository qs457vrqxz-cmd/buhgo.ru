"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Trash2,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  getLeads,
  getLeadStats,
  deleteLead,
  updateLeadStatus,
  downloadLeadsCSV,
  getCRMConfig,
  saveCRMConfig,
  leadStatusLabels,
  type Lead,
  type LeadStatus,
  type CRMConfig,
  type CRMProvider,
} from "@/lib/crm";
import {
  getAllResults,
  clearTestData,
  abTests,
  type VariantId,
} from "@/lib/ab-testing";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  proposal: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

export default function CRMAdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getLeadStats> | null>(null);
  const [abResults, setABResults] = useState<ReturnType<typeof getAllResults>>({});
  const [crmConfig, setCrmConfig] = useState<CRMConfig>({ provider: "local" });
  const [isLoading, setIsLoading] = useState(true);

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
  }, [router]);

  const loadData = () => {
    setLeads(getLeads());
    setStats(getLeadStats());
    setABResults(getAllResults());
    setCrmConfig(getCRMConfig());
    setIsLoading(false);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Удалить эту заявку?")) {
      deleteLead(id);
      loadData();
      toast.success("Заявка удалена");
    }
  };

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status);
    loadData();
    toast.success("Статус обновлён");
  };

  const handleExportCSV = () => {
    downloadLeadsCSV();
    toast.success("Файл загружен");
  };

  const handleSaveCRMConfig = () => {
    saveCRMConfig(crmConfig);
    toast.success("Настройки сохранены");
  };

  const handleClearABData = (testId?: string) => {
    if (confirm(testId ? `Сбросить данные теста "${abTests[testId]?.name}"?` : "Сбросить все данные A/B тестов?")) {
      clearTestData(testId);
      loadData();
      toast.success("Данные сброшены");
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
                <h1 className="text-2xl font-bold">CRM и Аналитика</h1>
                <p className="text-muted-foreground text-sm">
                  Управление заявками и A/B тесты
                </p>
              </div>
            </div>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Экспорт CSV
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Всего заявок</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Конверсия</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.todayCount}</p>
                      <p className="text-sm text-muted-foreground">Сегодня</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.weekCount}</p>
                      <p className="text-sm text-muted-foreground">За неделю</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList>
              <TabsTrigger value="leads">Заявки</TabsTrigger>
              <TabsTrigger value="ab-tests">A/B Тесты</TabsTrigger>
              <TabsTrigger value="settings">Настройки CRM</TabsTrigger>
            </TabsList>

            {/* Leads Tab */}
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Заявки с сайта</CardTitle>
                  <CardDescription>
                    Всего {leads.length} заявок
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leads.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      Нет заявок
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Дата</TableHead>
                            <TableHead>Имя</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Услуга</TableHead>
                            <TableHead>Источник</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leads.slice(0, 50).map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="text-sm">
                                {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                              </TableCell>
                              <TableCell className="font-medium">{lead.name}</TableCell>
                              <TableCell>
                                <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                                  {lead.phone}
                                </a>
                              </TableCell>
                              <TableCell className="text-sm">{lead.service || "—"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{lead.source}</TableCell>
                              <TableCell>
                                <Select
                                  value={lead.status}
                                  onValueChange={(value) => handleStatusChange(lead.id!, value as LeadStatus)}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <Badge className={statusColors[lead.status]}>
                                      {leadStatusLabels[lead.status]}
                                    </Badge>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(leadStatusLabels).map(([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteLead(lead.id!)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* A/B Tests Tab */}
            <TabsContent value="ab-tests">
              <div className="space-y-6">
                {Object.entries(abTests).map(([testId, test]) => {
                  const results = abResults[testId];

                  return (
                    <Card key={testId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{test.name}</CardTitle>
                            <CardDescription>ID: {testId}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={test.isActive ? "default" : "secondary"}>
                              {test.isActive ? "Активен" : "Неактивен"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClearABData(testId)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Сбросить
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          {test.variants.map((variant) => {
                            const result = results?.[variant.id];
                            const impressions = result?.impressions || 0;
                            const conversions = result?.conversions || 0;
                            const rate = result?.conversionRate || 0;

                            return (
                              <div
                                key={variant.id}
                                className="p-4 border rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-medium">
                                    Вариант {variant.id}
                                  </span>
                                  <Badge variant="outline">{variant.weight}%</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {variant.name}
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div>
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                                      <Eye className="h-3 w-3" />
                                      Показы
                                    </div>
                                    <p className="font-semibold">{impressions}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                                      <MousePointer className="h-3 w-3" />
                                      Конверсии
                                    </div>
                                    <p className="font-semibold">{conversions}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                                      <TrendingUp className="h-3 w-3" />
                                      CR
                                    </div>
                                    <p className="font-semibold text-primary">
                                      {rate.toFixed(1)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки CRM интеграции</CardTitle>
                  <CardDescription>
                    Подключите внешнюю CRM для автоматической передачи заявок
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>CRM Провайдер</Label>
                    <Select
                      value={crmConfig.provider}
                      onValueChange={(value) =>
                        setCrmConfig({ ...crmConfig, provider: value as CRMProvider })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Только локально</SelectItem>
                        <SelectItem value="amocrm">AmoCRM</SelectItem>
                        <SelectItem value="bitrix24">Bitrix24</SelectItem>
                        <SelectItem value="webhook">Webhook (любая CRM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {crmConfig.provider === "amocrm" && (
                    <>
                      <div className="space-y-2">
                        <Label>API URL</Label>
                        <Input
                          placeholder="https://your-domain.amocrm.ru"
                          value={crmConfig.apiUrl || ""}
                          onChange={(e) =>
                            setCrmConfig({ ...crmConfig, apiUrl: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>API Key (Access Token)</Label>
                        <Input
                          type="password"
                          placeholder="Ваш API ключ"
                          value={crmConfig.apiKey || ""}
                          onChange={(e) =>
                            setCrmConfig({ ...crmConfig, apiKey: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Pipeline ID</Label>
                          <Input
                            placeholder="ID воронки"
                            value={crmConfig.pipelineId || ""}
                            onChange={(e) =>
                              setCrmConfig({ ...crmConfig, pipelineId: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ответственный (User ID)</Label>
                          <Input
                            placeholder="ID пользователя"
                            value={crmConfig.responsibleUserId || ""}
                            onChange={(e) =>
                              setCrmConfig({
                                ...crmConfig,
                                responsibleUserId: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {crmConfig.provider === "bitrix24" && (
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input
                        placeholder="https://your-domain.bitrix24.ru/rest/1/xxxxx"
                        value={crmConfig.webhookUrl || ""}
                        onChange={(e) =>
                          setCrmConfig({ ...crmConfig, webhookUrl: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Создайте входящий вебхук в настройках Bitrix24
                      </p>
                    </div>
                  )}

                  {crmConfig.provider === "webhook" && (
                    <>
                      <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input
                          placeholder="https://your-api.com/webhook"
                          value={crmConfig.webhookUrl || ""}
                          onChange={(e) =>
                            setCrmConfig({ ...crmConfig, webhookUrl: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>API Key (необязательно)</Label>
                        <Input
                          type="password"
                          placeholder="Bearer токен для авторизации"
                          value={crmConfig.apiKey || ""}
                          onChange={(e) =>
                            setCrmConfig({ ...crmConfig, apiKey: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  <Button onClick={handleSaveCRMConfig}>
                    <Settings className="mr-2 h-4 w-4" />
                    Сохранить настройки
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
