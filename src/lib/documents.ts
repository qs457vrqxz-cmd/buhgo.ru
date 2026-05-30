// Document Management System for BuhGo

export type DocumentType =
  | "invoice"
  | "act"
  | "contract"
  | "report"
  | "declaration"
  | "other";

export type DocumentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "requires_signature";

export interface Document {
  id: string;
  clientId: string;
  accountantId?: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  description?: string;
  fileUrl?: string; // base64 or URL
  fileName?: string;
  fileSize?: number;
  uploadedBy: "client" | "accountant";
  uploadedAt: string;
  updatedAt?: string;
  comments?: DocumentComment[];
}

export interface DocumentComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "client" | "accountant" | "admin";
  text: string;
  createdAt: string;
}

// Storage key
const STORAGE_KEY = "buhgalter_documents";

// Document type labels
export const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Счёт",
  act: "Акт",
  contract: "Договор",
  report: "Отчёт",
  declaration: "Декларация",
  other: "Другое",
};

// Document status labels
export const documentStatusLabels: Record<DocumentStatus, string> = {
  pending: "На рассмотрении",
  approved: "Одобрен",
  rejected: "Отклонён",
  requires_signature: "Требует подписи",
};

// Status colors
export const documentStatusColors: Record<DocumentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  requires_signature: "bg-blue-100 text-blue-700",
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

// Default demo documents
const defaultDocuments: Document[] = [
  {
    id: "doc-1",
    clientId: "client-1",
    accountantId: "acc-1",
    name: "Счёт на оплату №123",
    type: "invoice",
    status: "approved",
    description: "Счёт за бухгалтерские услуги за март 2026",
    uploadedBy: "accountant",
    uploadedAt: "2026-03-15",
  },
  {
    id: "doc-2",
    clientId: "client-1",
    accountantId: "acc-1",
    name: "Акт выполненных работ №45",
    type: "act",
    status: "requires_signature",
    description: "Акт за услуги за февраль 2026",
    uploadedBy: "accountant",
    uploadedAt: "2026-03-01",
  },
  {
    id: "doc-3",
    clientId: "client-2",
    accountantId: "acc-1",
    name: "Декларация УСН",
    type: "declaration",
    status: "pending",
    description: "Годовая декларация по УСН за 2025 год",
    uploadedBy: "accountant",
    uploadedAt: "2026-02-28",
  },
  {
    id: "doc-4",
    clientId: "client-3",
    accountantId: "acc-2",
    name: "Договор на обслуживание",
    type: "contract",
    status: "approved",
    description: "Договор на бухгалтерское обслуживание",
    uploadedBy: "accountant",
    uploadedAt: "2024-05-01",
  },
];

// CRUD operations
export function getDocuments(): Document[] {
  return getFromStorage(STORAGE_KEY, defaultDocuments);
}

export function saveDocuments(documents: Document[]): void {
  saveToStorage(STORAGE_KEY, documents);
}

export function getDocumentById(id: string): Document | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function getDocumentsByClient(clientId: string): Document[] {
  return getDocuments().filter((d) => d.clientId === clientId);
}

export function getDocumentsByAccountant(accountantId: string): Document[] {
  return getDocuments().filter((d) => d.accountantId === accountantId);
}

export function addDocument(
  doc: Omit<Document, "id" | "uploadedAt">,
  accountantName?: string
): Document {
  const documents = getDocuments();
  const newDoc: Document = {
    ...doc,
    id: `doc-${Date.now()}`,
    uploadedAt: new Date().toISOString().split("T")[0],
  };
  documents.push(newDoc);
  saveDocuments(documents);

  // Trigger push notification for client if uploaded by accountant
  if (doc.uploadedBy === "accountant" && typeof window !== "undefined") {
    triggerDocumentNotification(newDoc.name, accountantName || "Ваш бухгалтер");
  }

  return newDoc;
}

// Trigger browser push notification for new document
async function triggerDocumentNotification(
  docName: string,
  accountantName: string
): Promise<void> {
  try {
    const { showLocalNotification, shouldShowNotification } = await import("./push-notifications");

    if (!shouldShowNotification("document")) return;

    await showLocalNotification("Новый документ", {
      body: `${accountantName} загрузил документ: ${docName}`,
      type: "document",
      url: "/dashboard?tab=documents",
      tag: "document",
    });
  } catch (error) {
    console.log("Push notification not available:", error);
  }
}

export function updateDocument(id: string, updates: Partial<Document>): void {
  const documents = getDocuments();
  const index = documents.findIndex((d) => d.id === id);
  if (index !== -1) {
    documents[index] = {
      ...documents[index],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    saveDocuments(documents);
  }
}

export function deleteDocument(id: string): void {
  const documents = getDocuments().filter((d) => d.id !== id);
  saveDocuments(documents);
}

export function addDocumentComment(
  documentId: string,
  comment: Omit<DocumentComment, "id" | "createdAt">
): void {
  const documents = getDocuments();
  const index = documents.findIndex((d) => d.id === documentId);
  if (index !== -1) {
    const newComment: DocumentComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    documents[index].comments = [...(documents[index].comments || []), newComment];
    saveDocuments(documents);
  }
}

export function updateDocumentStatus(
  id: string,
  status: DocumentStatus,
  notifyClient: boolean = true
): void {
  const doc = getDocumentById(id);
  updateDocument(id, { status });

  // Trigger push notification for client
  if (notifyClient && doc && typeof window !== "undefined") {
    triggerStatusNotification(doc.name, documentStatusLabels[status]);
  }
}

// Trigger browser push notification for status change
async function triggerStatusNotification(
  docName: string,
  statusLabel: string
): Promise<void> {
  try {
    const { showLocalNotification, shouldShowNotification } = await import("./push-notifications");

    if (!shouldShowNotification("status")) return;

    await showLocalNotification("Статус документа изменён", {
      body: `"${docName}" — ${statusLabel}`,
      type: "status",
      url: "/dashboard?tab=documents",
      tag: "status",
    });
  } catch (error) {
    console.log("Push notification not available:", error);
  }
}

// Statistics
export function getDocumentStats(clientId?: string, accountantId?: string) {
  let docs = getDocuments();

  if (clientId) {
    docs = docs.filter((d) => d.clientId === clientId);
  }
  if (accountantId) {
    docs = docs.filter((d) => d.accountantId === accountantId);
  }

  return {
    total: docs.length,
    pending: docs.filter((d) => d.status === "pending").length,
    approved: docs.filter((d) => d.status === "approved").length,
    rejected: docs.filter((d) => d.status === "rejected").length,
    requiresSignature: docs.filter((d) => d.status === "requires_signature").length,
  };
}

// Reset to defaults
export function resetDocumentsToDefaults(): void {
  saveDocuments(defaultDocuments);
}
