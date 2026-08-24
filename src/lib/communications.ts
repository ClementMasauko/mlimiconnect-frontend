import api from "./api";

export interface Conversation {
  id: number | string;
  participant: { id: number; username: string; avatar?: string; online?: boolean };
  last_message?: { text: string; created_at: string; sender_id: number };
  unread_count: number;
}

export interface ChatMessage {
  id: number | string;
  sender_id: number;
  text: string;
  created_at: string;
  read_at?: string | null;
  pending?: boolean;
}

export interface NotificationItem {
  id: number | string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read_at?: string | null;
  action_url?: string;
}

type Page<T> = { count?: number; next: string | null; results: T[] };
const asPage = <T>(data: T[] | Page<T>): Page<T> => Array.isArray(data) ? { next: null, results: data } : data;
const demoEnabled = import.meta.env.VITE_DEMO_DATA_ENABLED === "true";
const demoConversations: Conversation[] = [
  { id: 101, participant: { id: 11, username: "Mary Banda · Fresh Produce", online: true }, last_message: { text: "I can deliver the tomatoes to Lilongwe before 09:00 tomorrow.", created_at: new Date(Date.now() - 8 * 60000).toISOString(), sender_id: 11 }, unread_count: 2 },
  { id: 102, participant: { id: 12, username: "Central Farmers Cooperative" }, last_message: { text: "The 2-tonne maize quotation and traceability documents are ready.", created_at: new Date(Date.now() - 95 * 60000).toISOString(), sender_id: 12 }, unread_count: 0 },
  { id: 103, participant: { id: 13, username: "AgriTools Malawi" }, last_message: { text: "The tractor includes a six-month dealer warranty.", created_at: new Date(Date.now() - 86400000).toISOString(), sender_id: 13 }, unread_count: 0 },
];
const demoMessages: ChatMessage[] = [
  { id: 1, sender_id: 11, text: "Hello. Are you still interested in 200 kg of Grade A tomatoes?", created_at: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 2, sender_id: 1, text: "Yes. Can you deliver to Lilongwe tomorrow morning and include the batch reference?", created_at: new Date(Date.now() - 32 * 60000).toISOString(), read_at: new Date().toISOString() },
  { id: 3, sender_id: 11, text: "Yes, delivery is MWK 18,000. Batch TOM-26-041 is fully traceable.", created_at: new Date(Date.now() - 16 * 60000).toISOString() },
];
const demoNotifications: NotificationItem[] = [
  { id: 1, type: "Order", title: "Payment confirmed", message: "Order #1042 has been paid and is ready for fulfilment.", created_at: new Date(Date.now() - 12 * 60000).toISOString(), action_url: "/app/orders/1042" },
  { id: 2, type: "Advisory", title: "Heavy rainfall warning", message: "Protect harvested crops and check field drainage in Lilongwe.", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: "Auction", title: "You have been outbid", message: "A new bid was placed on the two-wheel tractor listing.", created_at: new Date(Date.now() - 5 * 3600000).toISOString(), read_at: new Date().toISOString() },
];

export const communicationsApi = {
  conversations: async () => demoEnabled ? { next: null, results: demoConversations } : asPage((await api.get<Page<Conversation> | Conversation[]>("/api/messages/conversations/", { params: { page_size: 30 } })).data),
  messages: async (conversationId: string) => demoEnabled ? { next: null, results: demoMessages } : asPage((await api.get<Page<ChatMessage> | ChatMessage[]>(`/api/messages/conversations/${conversationId}/messages/`, { params: { page_size: 50 } })).data),
  send: async (conversationId: string, text: string) => demoEnabled ? { id: Date.now(), sender_id: 1, text, created_at: new Date().toISOString() } : (await api.post<ChatMessage>(`/api/messages/conversations/${conversationId}/messages/`, { text })).data,
  markConversationRead: async (conversationId: string) => demoEnabled ? undefined : api.post(`/api/messages/conversations/${conversationId}/read/`),
  notifications: async () => demoEnabled ? { next: null, results: demoNotifications } : asPage((await api.get<Page<NotificationItem> | NotificationItem[]>("/api/notifications/", { params: { page_size: 30 } })).data),
  markNotificationRead: async (id: NotificationItem["id"]) => demoEnabled ? undefined : api.post(`/api/notifications/${id}/read/`),
  markAllNotificationsRead: async () => demoEnabled ? undefined : api.post("/api/notifications/read-all/"),
};

export const formatRelativeTime = (value?: string) => {
  if (!value) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return new Date(value).toLocaleDateString();
};
