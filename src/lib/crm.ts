// CRM Integration Library
// Supports: AmoCRM, Bitrix24, and custom webhooks

export type CRMProvider = "amocrm" | "bitrix24" | "webhook" | "local";

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  inn?: string;
  company?: string;
  service?: string;
  message?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  createdAt: Date;
  status: LeadStatus;
  metadata?: Record<string, string>;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface CRMConfig {
  provider: CRMProvider;
  apiUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
  pipelineId?: string;
  responsibleUserId?: string;
}

// Status labels
export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Новая",
  contacted: "Связались",
  qualified: "Квалифицирована",
  proposal: "Предложение",
  won: "Успешно",
  lost: "Отказ",
};

// Storage key
const LEADS_STORAGE_KEY = "crm_leads";
const CRM_CONFIG_KEY = "crm_config";

// Get CRM configuration
export const getCRMConfig = (): CRMConfig => {
  if (typeof window === "undefined") {
    return { provider: "local" };
  }

  const stored = localStorage.getItem(CRM_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { provider: "local" };
    }
  }

  return { provider: "local" };
};

// Save CRM configuration
export const saveCRMConfig = (config: CRMConfig): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CRM_CONFIG_KEY, JSON.stringify(config));
  }
};

// Get all leads from local storage
export const getLeads = (): Lead[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(LEADS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

// Save leads to local storage
const saveLeads = (leads: Lead[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  }
};

// Generate unique ID
const generateId = (): string => {
  return `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get UTM parameters from URL
export const getUTMParams = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
  };
};

// Create a new lead
export const createLead = async (leadData: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> => {
  const config = getCRMConfig();
  const utmParams = getUTMParams();

  const lead: Lead = {
    id: generateId(),
    ...leadData,
    ...utmParams,
    createdAt: new Date(),
    status: "new",
  };

  // Save locally first
  const leads = getLeads();
  leads.unshift(lead);
  saveLeads(leads);

  // Send to CRM based on provider
  try {
    switch (config.provider) {
      case "amocrm":
        await sendToAmoCRM(lead, config);
        break;
      case "bitrix24":
        await sendToBitrix24(lead, config);
        break;
      case "webhook":
        await sendToWebhook(lead, config);
        break;
      default:
        // Local only - do nothing
        break;
    }
  } catch (error) {
    console.error("Failed to send lead to CRM:", error);
    // Lead is still saved locally
  }

  // Track in analytics
  trackLeadCreation(lead);

  return lead;
};

// Update lead status
export const updateLeadStatus = (leadId: string, status: LeadStatus): Lead | null => {
  const leads = getLeads();
  const leadIndex = leads.findIndex((l) => l.id === leadId);

  if (leadIndex === -1) return null;

  leads[leadIndex].status = status;
  saveLeads(leads);

  return leads[leadIndex];
};

// Delete lead
export const deleteLead = (leadId: string): boolean => {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== leadId);

  if (filtered.length === leads.length) return false;

  saveLeads(filtered);
  return true;
};

// AmoCRM integration
const sendToAmoCRM = async (lead: Lead, config: CRMConfig): Promise<void> => {
  if (!config.apiUrl || !config.apiKey) {
    throw new Error("AmoCRM configuration is incomplete");
  }

  // AmoCRM API format
  const amoLead = {
    name: `Заявка: ${lead.name}`,
    price: 0,
    status_id: config.pipelineId,
    responsible_user_id: config.responsibleUserId,
    _embedded: {
      contacts: [
        {
          name: lead.name,
          custom_fields_values: [
            {
              field_code: "PHONE",
              values: [{ value: lead.phone }],
            },
            ...(lead.email
              ? [
                  {
                    field_code: "EMAIL",
                    values: [{ value: lead.email }],
                  },
                ]
              : []),
          ],
        },
      ],
    },
    custom_fields_values: [
      {
        field_name: "Услуга",
        values: [{ value: lead.service || "Не указана" }],
      },
      {
        field_name: "Сообщение",
        values: [{ value: lead.message || "" }],
      },
      {
        field_name: "Источник",
        values: [{ value: lead.source }],
      },
      {
        field_name: "UTM Source",
        values: [{ value: lead.utmSource || "" }],
      },
    ],
  };

  const response = await fetch(`${config.apiUrl}/api/v4/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify([amoLead]),
  });

  if (!response.ok) {
    throw new Error(`AmoCRM API error: ${response.status}`);
  }
};

// Bitrix24 integration
const sendToBitrix24 = async (lead: Lead, config: CRMConfig): Promise<void> => {
  if (!config.webhookUrl) {
    throw new Error("Bitrix24 webhook URL is not configured");
  }

  // Bitrix24 format
  const bitrixLead = {
    fields: {
      TITLE: `Заявка: ${lead.name}`,
      NAME: lead.name,
      PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
      EMAIL: lead.email ? [{ VALUE: lead.email, VALUE_TYPE: "WORK" }] : [],
      COMPANY_TITLE: lead.company || "",
      COMMENTS: `Услуга: ${lead.service || "Не указана"}\n\nСообщение: ${lead.message || ""}\n\nИсточник: ${lead.source}`,
      SOURCE_ID: "WEB",
      UTM_SOURCE: lead.utmSource || "",
      UTM_MEDIUM: lead.utmMedium || "",
      UTM_CAMPAIGN: lead.utmCampaign || "",
    },
  };

  const response = await fetch(`${config.webhookUrl}/crm.lead.add.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bitrixLead),
  });

  if (!response.ok) {
    throw new Error(`Bitrix24 API error: ${response.status}`);
  }
};

// Generic webhook integration
const sendToWebhook = async (lead: Lead, config: CRMConfig): Promise<void> => {
  if (!config.webhookUrl) {
    throw new Error("Webhook URL is not configured");
  }

  const response = await fetch(config.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      event: "lead.created",
      timestamp: new Date().toISOString(),
      data: lead,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`);
  }
};

// Track lead creation in analytics
const trackLeadCreation = (lead: Lead): void => {
  // Yandex Metrika
  if (typeof window !== "undefined" && window.ym) {
    window.ym(89113684, "reachGoal", "form_submit", {
      service: lead.service,
      source: lead.source,
    });
  }

  // Google Analytics 4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "generate_lead", {
      currency: "RUB",
      value: 0,
      lead_source: lead.source,
      lead_service: lead.service,
    });
  }
};

// Get lead statistics
export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<string, number>;
  byService: Record<string, number>;
  conversionRate: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

export const getLeadStats = (): LeadStats => {
  const leads = getLeads();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const byStatus: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  };

  const bySource: Record<string, number> = {};
  const byService: Record<string, number> = {};
  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;

  for (const lead of leads) {
    // By status
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;

    // By source
    bySource[lead.source] = (bySource[lead.source] || 0) + 1;

    // By service
    if (lead.service) {
      byService[lead.service] = (byService[lead.service] || 0) + 1;
    }

    // Time-based counts
    const leadDate = new Date(lead.createdAt);
    if (leadDate >= today) todayCount++;
    if (leadDate >= weekAgo) weekCount++;
    if (leadDate >= monthAgo) monthCount++;
  }

  const total = leads.length;
  const won = byStatus.won || 0;
  const lost = byStatus.lost || 0;
  const conversionRate = total > 0 ? (won / (won + lost || 1)) * 100 : 0;

  return {
    total,
    byStatus,
    bySource,
    byService,
    conversionRate,
    todayCount,
    weekCount,
    monthCount,
  };
};

// Export leads as CSV
export const exportLeadsCSV = (): string => {
  const leads = getLeads();

  const headers = [
    "ID",
    "Имя",
    "Телефон",
    "Email",
    "ИНН",
    "Компания",
    "Услуга",
    "Сообщение",
    "Источник",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Статус",
    "Дата создания",
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.phone,
    lead.email || "",
    lead.inn || "",
    lead.company || "",
    lead.service || "",
    lead.message?.replace(/\n/g, " ") || "",
    lead.source,
    lead.utmSource || "",
    lead.utmMedium || "",
    lead.utmCampaign || "",
    leadStatusLabels[lead.status],
    new Date(lead.createdAt).toLocaleString("ru-RU"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
};

// Download CSV file
export const downloadLeadsCSV = (): void => {
  const csv = exportLeadsCSV();
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
