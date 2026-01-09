// services/notificationService.ts
import { io, Socket } from "socket.io-client";
import AuthService from "./authService";

export interface Notification {
  id: number;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: ((notif: Notification) => void)[] = [];

  private getBackendUrl(): string {
    const VITE_API_URL =
      import.meta.env.VITE_API_URL2 || "http://localhost:3001";
    return VITE_API_URL;
  }

  connect(): void {
    const token = AuthService.getToken();
    if (!token) return;

    if (this.socket) return;

    this.socket = io(this.getBackendUrl(), {
      auth: { token }, // 🔥 CORRECTION
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      // console.log("✅ WebSocket Authentifié");
    });

    this.socket.on("new_notification", (notification: Notification) => {
      // console.log("📩 Nouvelle notification reçue :", notification);
      this.listeners.forEach((cb) => cb(notification));
    });

    this.socket.on("disconnect", () => {
      // console.log("❌ Déconnecté du WebSocket");
      this.socket = null;
    });
  }

  async fetchNotifications(): Promise<Notification[]> {
    const token = AuthService.getToken();
    const backendUrl = this.getBackendUrl();
    const url = `${backendUrl.replace(/\/$/, "")}/api/notificationadmin`;

    try {
      // console.log("🔎 fetchNotifications -> URL :", url, " token:", !!token);

      const res = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json", // demande explicitement JSON
        },
        credentials: "include", // si tu utilises cookies/session
      });

      const status = res.status;
      const text = await res.text();

      // Si la réponse est vide, on log et on retourne []
      if (!text) {
        console.error(
          "❌ fetchNotifications: réponse vide (status: " + status + ")"
        );
        return [];
      }

      // Essayer de parser le JSON, sinon logger la réponse brute
      try {
        const data = JSON.parse(text);
        if (data && data.success) return data.data;
        console.warn(
          "⚠️ fetchNotifications: backend renvoie JSON sans success=true",
          data
        );
        return data.data || [];
      } catch (parseErr) {
        // Réponse non-JSON (souvent HTML) : log complet pour debug
        console.error(
          "❌ Réponse non JSON pour /api/notificationadmin (status: " +
            status +
            ")"
        );
        console.error("----- BEGIN RESPONSE -----");
        console.error(text);
        console.error("-----  END RESPONSE  -----");
        return [];
      }
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
      return [];
    }
  }

  async deleteNotification(id: number): Promise<boolean> {
    const token = AuthService.getToken();
    const backendUrl = this.getBackendUrl();
    const url = `${backendUrl.replace(/\/$/, "")}/api/notificationadmin/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("❌ deleteNotification failed", res.status, txt);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Erreur deleteNotification:", err);
      return false;
    }
  }

  async markAsRead(id: number): Promise<boolean> {
    const token = AuthService.getToken();
    const backendUrl = this.getBackendUrl();
    const url = `${backendUrl.replace(
      /\/$/,
      ""
    )}/api/notificationadmin/${id}/read`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // console.log(`🔵 markAsRead - Status: ${res.status}, ID: ${id}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ markAsRead failed", {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
          url: url,
        });

        if (res.status === 404) {
          console.warn(`⚠️ Notification ${id} non trouvée`);
        } else if (res.status === 403) {
          console.warn(`⚠️ Accès refusé pour la notification ${id}`);
        }

        return false;
      }

      const result = await res.json();
      // console.log(`✅ markAsRead success:`, result);
      return result.success === true;
    } catch (err) {
      console.error("❌ Erreur markAsRead:", err);
      return false;
    }
  }
  onNewNotification(callback: (notif: Notification) => void): void {
    this.listeners.push(callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new NotificationService();
