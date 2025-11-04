// lib/api/professional-billing.js
import api from "../api";

export const professionalBillingAPI = {
  // Paiements
  getPayments: (period = "3m") =>
    api.get(`/professional/billing/payments?period=${period}`),

  // Factures
  getInvoices: () => api.get("/professional/billing/invoices"),

  createInvoice: (data) => api.post("/professional/billing/invoices", data),

  updateInvoice: (id, data) =>
    api.put(`/professional/billing/invoices/${id}`, data),

  downloadInvoice: (id) => api.get(`/professional/billing/invoices/${id}/pdf`),

  // Statistiques
  getAnalytics: (period = "3m") =>
    api.get(`/professional/billing/analytics?period=${period}`),

  // Actualiser les données
  refreshData: () => api.get("/professional/billing/refresh"),
};
