const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface UserWelcomeData {
    email: string;
    userName?: string;
}

export interface PaymentConfirmationData {
    email: string;
    userName?: string;
    serviceName?: string;
    amount: number;
    transactionId: string;
}

export interface SecurityAlertData {
    email: string;
    userName?: string;
    location: string;
    action: string;
}

export interface CguUpdateData {
    email: string;
    userName?: string;
    effectiveDate?: string;
}

export interface ProviderWelcomeData {
    email: string;
    providerName: string;
}

export interface ProviderBillingData {
    email: string;
    providerName: string;
    amount: number;
    period?: string;
    transactionId: string;
}

export interface ProviderSecurityData {
    email: string;
    providerName: string;
    location: string;
    action: string;
}

export interface ProviderCguData {
    email: string;
    providerName: string;
    effectiveDate?: string;
}

export interface ProviderOnboardingData {
    email: string;
    providerName: string;
    status?: 'validated' | 'additional-info-required';
}

class EmailApiService {
    // Email de bienvenue utilisateur
    async sendUserWelcome(data: UserWelcomeData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-user-welcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Confirmation RGPD
    async sendRgpdConfirmation(data: UserWelcomeData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-rgpd-confirmation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Confirmation de paiement
    async sendPaymentConfirmation(data: PaymentConfirmationData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-payment-confirmation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Alerte de sécurité
    async sendSecurityAlert(data: SecurityAlertData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-security-alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Mise à jour CGU
    async sendCguUpdate(data: CguUpdateData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-cgu-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Bienvenue prestataire
    async sendProviderWelcome(data: ProviderWelcomeData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-welcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // RGPD prestataire
    async sendProviderRgpd(data: ProviderWelcomeData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-rgpd`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Facturation prestataire
    async sendProviderBilling(data: ProviderBillingData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-billing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Sécurité prestataire
    async sendProviderSecurity(data: ProviderSecurityData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-security`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // CGU prestataire
    async sendProviderCgu(data: ProviderCguData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-cgu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Onboarding prestataire
    async sendProviderOnboarding(data: ProviderOnboardingData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Pack complet prestataire (2 emails)
    async sendProviderWelcomePack(data: ProviderWelcomeData): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/email/send-provider-welcome-pack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
}

export default new EmailApiService();