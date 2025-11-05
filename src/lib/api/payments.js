// lib/api/payments.js
import api from "../api";

export const paymentsAPI = {
  // Transactions
  getTransactions: (period = "3m") =>
    api.get(`/payments/transactions?period=${period}`),

  // Factures
  getInvoices: () => api.get("/payments/invoices"),

  // Méthodes de paiement
  getPaymentMethods: () => api.get("/payments/payment-methods"),

  addPaymentMethod: (data) => api.post("/payments/payment-methods", data),

  setDefaultPaymentMethod: (id) =>
    api.put(`/payments/payment-methods/${id}/default`),

  removePaymentMethod: (id) => api.delete(`/payments/payment-methods/${id}`),

  // Adresse de facturation
  getBillingAddress: () => api.get("/payments/billing-address"),

  updateBillingAddress: (data) => api.put("/payments/billing-address", data),

  // Téléchargements
  downloadReceipt: (id) => api.get(`/payments/receipt/${id}`),

  downloadInvoice: (id) => api.get(`/payments/invoice/${id}/pdf`),
};
