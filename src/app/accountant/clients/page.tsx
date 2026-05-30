"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getClientsByAccountant,
  getAccountantById,
  type Client,
  type Accountant,
} from "@/lib/users";
import { getDocumentsByClient } from "@/lib/documents";
import { getConversationsByClient } from "@/lib/messages";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AccountantClientsPage() {
  const router = useRouter();
  const [accountant, setAccountant] = useState<Accountant | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    }

    setIsLoading(false);
  }, [router]);

  const filteredClients = clients.filter((client) =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.inn && client.inn.includes(searchQuery))
  );

  const getClientStats = (clientId: string) => {
    const docs = getDocumentsByClient(clientId);
    const convs = getConversationsByClient(clientId);
    const unread = convs.reduce((sum, c) => sum + c.unreadCount, 0);
    return { docsCount: docs.length, unreadMessages: unread };
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/accountant">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Мои клиенты</h1>
              <p className="text-muted-foreground text-sm">
                {clients.length} компаний на обслуживании
              </p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, ИНН..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {clients.length === 0
                    ? "Нет назначенных клиентов"
                    : "Клиенты не найдены по запросу"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id);
                return (
                  <Card key={client.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{client.companyName}</h3>
                          <p className="text-sm text-muted-foreground truncate">{client.name}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {client.tariff && (
                          <Badge variant="outline" className="mr-2">
                            {client.tariff}
                          </Badge>
                        )}
                        {client.inn && (
                          <p className="text-xs text-muted-foreground">ИНН: {client.inn}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {stats.docsCount} док.
                        </span>
                        {stats.unreadMessages > 0 && (
                          <span className="flex items-center gap-1 text-red-600">
                            <MessageSquare className="h-4 w-4" />
                            {stats.unreadMessages} новых
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                        {client.email && (
                          <a
                            href={`mailto:${client.email}`}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {client.phone && (
                          <a
                            href={`tel:${client.phone}`}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                        <div className="flex-1" />
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/accountant/documents?client=${client.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Документы
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/accountant/messages?client=${client.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Чат
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
