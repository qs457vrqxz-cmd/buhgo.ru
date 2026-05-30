// User Management System for BuhGo

// Types
export type UserRole = "admin" | "accountant" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Accountant extends User {
  role: "accountant";
  position?: string;
  assignedClients: string[]; // client IDs
  permissions: AccountantPermissions;
  avatar?: string;
}

export interface Client extends User {
  role: "client";
  companyName: string;
  inn?: string;
  ogrn?: string;
  legalAddress?: string;
  actualAddress?: string;
  contactPerson?: string;
  assignedAccountant?: string; // accountant ID
  tariff?: string;
  contractDate?: string;
  notes?: string;
}

export interface AccountantPermissions {
  canViewClients: boolean;
  canEditClients: boolean;
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canSendMessages: boolean;
  canViewReports: boolean;
  canCreateReports: boolean;
}

// Default permissions for new accountants
export const defaultAccountantPermissions: AccountantPermissions = {
  canViewClients: true,
  canEditClients: false,
  canViewDocuments: true,
  canUploadDocuments: true,
  canSendMessages: true,
  canViewReports: true,
  canCreateReports: false,
};

// Storage keys
const STORAGE_KEYS = {
  accountants: "buhgalter_accountants",
  clients: "buhgalter_clients",
  users: "buhgalter_users",
};

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Default demo data
const defaultAccountants: Accountant[] = [
  {
    id: "acc-1",
    email: "maria@buhgalter.tech",
    name: "Мария Иванова",
    role: "accountant",
    phone: "+7 (999) 111-22-33",
    position: "Главный бухгалтер",
    createdAt: "2024-01-15",
    lastLogin: "2026-04-01",
    isActive: true,
    assignedClients: ["client-1", "client-2"],
    permissions: {
      ...defaultAccountantPermissions,
      canEditClients: true,
      canCreateReports: true,
    },
  },
  {
    id: "acc-2",
    email: "anna@buhgalter.tech",
    name: "Анна Петрова",
    role: "accountant",
    phone: "+7 (999) 222-33-44",
    position: "Бухгалтер",
    createdAt: "2024-06-20",
    lastLogin: "2026-03-28",
    isActive: true,
    assignedClients: ["client-3"],
    permissions: defaultAccountantPermissions,
  },
];

const defaultClients: Client[] = [
  {
    id: "client-1",
    email: "info@technoservice.ru",
    name: "Алексей Петров",
    role: "client",
    phone: "+7 (495) 123-45-67",
    companyName: "ООО «ТехноСервис»",
    inn: "7701234567",
    ogrn: "1177746123456",
    contactPerson: "Алексей Петров",
    assignedAccountant: "acc-1",
    tariff: "Базовый",
    contractDate: "2024-02-01",
    createdAt: "2024-02-01",
    lastLogin: "2026-03-30",
    isActive: true,
  },
  {
    id: "client-2",
    email: "smirnova@mail.ru",
    name: "Елена Смирнова",
    role: "client",
    phone: "+7 (916) 234-56-78",
    companyName: "ИП Смирнова Е.А.",
    inn: "771234567890",
    contactPerson: "Елена Смирнова",
    assignedAccountant: "acc-1",
    tariff: "Нулевая отчётность",
    contractDate: "2024-03-15",
    createdAt: "2024-03-15",
    lastLogin: "2026-03-25",
    isActive: true,
  },
  {
    id: "client-3",
    email: "kozlov@stroymaster.ru",
    name: "Дмитрий Козлов",
    role: "client",
    phone: "+7 (495) 345-67-89",
    companyName: "ООО «Строй-Мастер»",
    inn: "7709876543",
    ogrn: "1187746654321",
    contactPerson: "Дмитрий Козлов",
    assignedAccountant: "acc-2",
    tariff: "Расширенный",
    contractDate: "2024-05-01",
    createdAt: "2024-05-01",
    lastLogin: "2026-04-01",
    isActive: true,
  },
];

// Accountants CRUD
export function getAccountants(): Accountant[] {
  return getFromStorage(STORAGE_KEYS.accountants, defaultAccountants);
}

export function saveAccountants(accountants: Accountant[]): void {
  saveToStorage(STORAGE_KEYS.accountants, accountants);
}

export function getAccountantById(id: string): Accountant | undefined {
  return getAccountants().find((a) => a.id === id);
}

export function addAccountant(accountant: Omit<Accountant, "id" | "createdAt" | "role">): Accountant {
  const accountants = getAccountants();
  const newAccountant: Accountant = {
    ...accountant,
    id: `acc-${Date.now()}`,
    role: "accountant",
    createdAt: new Date().toISOString().split("T")[0],
    assignedClients: accountant.assignedClients || [],
    permissions: accountant.permissions || defaultAccountantPermissions,
  };
  accountants.push(newAccountant);
  saveAccountants(accountants);
  return newAccountant;
}

export function updateAccountant(id: string, updates: Partial<Accountant>): void {
  const accountants = getAccountants();
  const index = accountants.findIndex((a) => a.id === id);
  if (index !== -1) {
    accountants[index] = { ...accountants[index], ...updates };
    saveAccountants(accountants);
  }
}

export function deleteAccountant(id: string): void {
  const accountants = getAccountants().filter((a) => a.id !== id);
  saveAccountants(accountants);

  // Remove accountant from assigned clients
  const clients = getClients();
  clients.forEach((client) => {
    if (client.assignedAccountant === id) {
      updateClient(client.id, { assignedAccountant: undefined });
    }
  });
}

export function toggleAccountantStatus(id: string): void {
  const accountants = getAccountants();
  const index = accountants.findIndex((a) => a.id === id);
  if (index !== -1) {
    accountants[index].isActive = !accountants[index].isActive;
    saveAccountants(accountants);
  }
}

// Clients CRUD
export function getClients(): Client[] {
  return getFromStorage(STORAGE_KEYS.clients, defaultClients);
}

export function saveClients(clients: Client[]): void {
  saveToStorage(STORAGE_KEYS.clients, clients);
}

export function getClientById(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function addClient(client: Omit<Client, "id" | "createdAt" | "role">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: `client-${Date.now()}`,
    role: "client",
    createdAt: new Date().toISOString().split("T")[0],
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): void {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates };
    saveClients(clients);
  }
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  saveClients(clients);

  // Remove client from accountant's assigned list
  const accountants = getAccountants();
  accountants.forEach((acc) => {
    if (acc.assignedClients.includes(id)) {
      updateAccountant(acc.id, {
        assignedClients: acc.assignedClients.filter((cId) => cId !== id),
      });
    }
  });
}

export function toggleClientStatus(id: string): void {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients[index].isActive = !clients[index].isActive;
    saveClients(clients);
  }
}

// Assignment functions
export function assignClientToAccountant(clientId: string, accountantId: string): void {
  // Update client
  updateClient(clientId, { assignedAccountant: accountantId });

  // Update accountant
  const accountant = getAccountantById(accountantId);
  if (accountant && !accountant.assignedClients.includes(clientId)) {
    updateAccountant(accountantId, {
      assignedClients: [...accountant.assignedClients, clientId],
    });
  }
}

export function unassignClientFromAccountant(clientId: string): void {
  const client = getClientById(clientId);
  if (client?.assignedAccountant) {
    const accountant = getAccountantById(client.assignedAccountant);
    if (accountant) {
      updateAccountant(accountant.id, {
        assignedClients: accountant.assignedClients.filter((id) => id !== clientId),
      });
    }
    updateClient(clientId, { assignedAccountant: undefined });
  }
}

// Get clients for specific accountant
export function getClientsByAccountant(accountantId: string): Client[] {
  return getClients().filter((c) => c.assignedAccountant === accountantId);
}

// Get statistics
export function getAccountantStats() {
  const accountants = getAccountants();
  const clients = getClients();

  return {
    totalAccountants: accountants.length,
    activeAccountants: accountants.filter((a) => a.isActive).length,
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.isActive).length,
    unassignedClients: clients.filter((c) => !c.assignedAccountant).length,
  };
}

// Reset to defaults
export function resetUsersToDefaults(): void {
  saveAccountants(defaultAccountants);
  saveClients(defaultClients);
}

// Password management (simplified for demo)
export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Check if email is already used
export function isEmailTaken(email: string, excludeId?: string): boolean {
  const accountants = getAccountants();
  const clients = getClients();

  const accountantExists = accountants.some(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.id !== excludeId
  );
  const clientExists = clients.some(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.id !== excludeId
  );

  return accountantExists || clientExists || email.toLowerCase() === "admin@buhgalter.tech";
}
