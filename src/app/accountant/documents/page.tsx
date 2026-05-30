"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getClientsByAccountant,
  getAccountantById,
  type Client,
  type Accountant,
} from "@/lib/users";
import {
  getDocuments,
  addDocument,
  updateDocumentStatus,
  deleteDocument,
  documentTypeLabels,
  documentStatusLabels,
  documentStatusColors,
  type Document,
  type DocumentType,
  type DocumentStatus,
} from "@/lib/documents";
import {
  ArrowLeft,
  FileText,
  Upload,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  PenLine,
  Trash2,
  Download,
  Eye,
  Plus,
  Building2,
} from "lucide-react";

export default function AccountantDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get("client");

  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState<string>(clientFilter || "all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadData, setUploadData] = useState({
    name: "",
    type: "invoice" as DocumentType,
    clientId: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.role !== "accountant") {
      router.push("/login");
      return;
    }

    const acc = getAccountantById(parsed.id);
    if (acc) {
      setAccountant(acc);
      setClients(getClientsByAccountant(acc.id));
      loadDocuments(acc.id);
    }

    setIsLoading(false);
  }, [router]);

  const loadDocuments = (accountantId: string) => {
    const allDocs = getDocuments().filter((d) => d.accountantId === accountantId);
    setDocuments(allDocs);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClient = filterClient === "all" || doc.clientId === filterClient;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesType = filterType === "all" || doc.type === filterType;

    return matchesSearch && matchesClient && matchesStatus && matchesType;
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.name || !uploadData.clientId) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (!accountant) return;

    // Convert file to base64 if exists
    let fileUrl = "";
    if (uploadData.file) {
      fileUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadData.file as File);
      });
    }

    addDocument({
      clientId: uploadData.clientId,
      accountantId: accountant.id,
      name: uploadData.name,
      type: uploadData.type,
      status: "pending",
      description: uploadData.description,
      fileUrl: fileUrl || undefined,
      fileName: uploadData.file?.name,
      fileSize: uploadData.file?.size,
      uploadedBy: "accountant",
    });

    loadDocuments(accountant.id);
    setIsUploadOpen(false);
    setUploadData({
      name: "",
      type: "invoice",
      clientId: "",
      description: "",
      file: null,
    });
    toast.success("Документ загружен");
  };

  const handleStatusChange = (docId: string, status: DocumentStatus) => {
    updateDocumentStatus(docId, status);
    if (accountant) {
      loadDocuments(accountant.id);
    }
    toast.success("Статус изменён");
  };

  const handleDelete = (docId: string) => {
    if (confirm("Удалить документ?")) {
      deleteDocument(docId);
      if (accountant) {
        loadDocuments(accountant.id);
      }
      toast.success("Документ удалён");
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.companyName || "Неизвестный клиент";
  };

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "pending").length,
    approved: documents.filter((d) => d.status === "approved").length,
    requiresSignature: documents.filter((d) => d.status === "requires_signature").length,
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
                <Link href="/accountant">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Документы</h1>
                <p className="text-muted-foreground text-sm">
                  Управление документооборотом
                </p>
              </div>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Загрузить документ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Загрузка документа</DialogTitle>
                  <DialogDescription>
                    Загрузите документ для клиента
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Клиент *</Label>
                    <Select
                      value={uploadData.clientId}
                      onValueChange={(value) => setUploadData({ ...uploadData, clientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите клиента" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Название документа *</Label>
                    <Input
                      value={uploadData.name}
                      onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                      placeholder="Счёт на оплату №123"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Тип документа</Label>
                    <Select
                      value={uploadData.type}
                      onValueChange={(value) => setUploadData({ ...uploadData, type: value as DocumentType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(documentTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Описание документа..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Файл</Label>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                    />
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, Excel или изображения
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <Upload className="mr-2 h-4 w-4" />
                      Загрузить
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Отмена
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Всего</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={stats.pending > 0 ? "border-yellow-200" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">На проверке</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Одобрено</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={stats.requiresSignature > 0 ? "border-blue-200" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <PenLine className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.requiresSignature}</p>
                    <p className="text-xs text-muted-foreground">Требует подписи</p>
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
                    placeholder="Поиск документов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Клиент" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все клиенты</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {Object.entries(documentStatusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {Object.entries(documentTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {documents.length === 0
                    ? "Нет документов. Загрузите первый документ!"
                    : "Документы не найдены по заданным фильтрам"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold truncate">{doc.name}</h3>
                          <Badge className={documentStatusColors[doc.status]}>
                            {documentStatusLabels[doc.status]}
                          </Badge>
                          <Badge variant="outline">{documentTypeLabels[doc.type]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Building2 className="inline h-3 w-3 mr-1" />
                          {getClientName(doc.clientId)}
                          {doc.description && ` • ${doc.description}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Загружен: {doc.uploadedAt}
                          {doc.fileName && ` • ${doc.fileName}`}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {doc.fileUrl && (
                            <DropdownMenuItem asChild>
                              <a href={doc.fileUrl} download={doc.fileName || doc.name}>
                                <Download className="mr-2 h-4 w-4" />
                                Скачать
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, "pending")}>
                            <Clock className="mr-2 h-4 w-4" />
                            На рассмотрении
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, "approved")}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Одобрить
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, "requires_signature")}>
                            <PenLine className="mr-2 h-4 w-4" />
                            Требует подписи
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, "rejected")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Отклонить
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(doc.id)}
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
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
