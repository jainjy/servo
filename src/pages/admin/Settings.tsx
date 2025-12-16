import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, Database, Bell, Shield, Mail, Globe, Users, Eye, Download, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "SERVO",
    supportEmail: "support@servo.mg",
    defaultLanguage: "fr",
    timezone: "Indian/Antananarivo",
    maintenanceMode: false,
    userRegistration: true,
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    autoBackup: true,
    dataRetention: "365",
    maxFileSize: "10",
    description: "Plateforme tout-en-un pour l'immobilier, les services et le tourisme."
  })

  const handleSave = () => {
    // Simulation de sauvegarde
    // console.log("Sauvegarde des paramètres:", settings)
    // Ici vous feriez un appel API pour sauvegarder les paramètres
  }

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configuration générale de la plateforme</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Settings className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Paramètres généraux */}
        <Card className="p-6 bg-card border-border">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Paramètres généraux</CardTitle>
            </div>
            <CardDescription>
              Configuration de base de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name" className="text-foreground">
                Nom de la plateforme
              </Label>
              <Input 
                id="platform-name" 
                value={settings.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="bg-background border-input" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-description" className="text-foreground">
                Description
              </Label>
              <Textarea 
                id="platform-description"
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-background border-input min-h-[80px]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-email" className="text-foreground">
                Email de support
              </Label>
              <Input
                id="support-email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground">
                  Langue par défaut
                </Label>
                <Select value={settings.defaultLanguage} onValueChange={(value) => handleInputChange('defaultLanguage', value)}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="mg">Malagasy</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-foreground">
                  Fuseau horaire
                </Label>
                <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indian/Antananarivo">Antananarivo (UTC+3)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres utilisateurs */}
        <Card className="p-6 bg-card border-border">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Paramètres utilisateurs</CardTitle>
            </div>
            <CardDescription>
              Gestion des inscriptions et profils
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Inscription utilisateurs</p>
                <p className="text-sm text-muted-foreground">Autoriser les nouvelles inscriptions</p>
              </div>
              <Switch 
                checked={settings.userRegistration}
                onCheckedChange={(checked) => handleInputChange('userRegistration', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Vérification email</p>
                <p className="text-sm text-muted-foreground">Obligatoire pour l'activation</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Profils publics</p>
                <p className="text-sm text-muted-foreground">Rendre les profils visibles</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2">
              <Label className="text-foreground">
                Sessions actives
              </Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-semibold">234</span>
                <Badge variant="secondary" className="ml-2">
                  En ligne
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-card border-border">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>
              Configuration des alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications email</p>
                <p className="text-sm text-muted-foreground">Alertes par email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications SMS</p>
                <p className="text-sm text-muted-foreground">Alertes par SMS</p>
              </div>
              <Switch 
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications push</p>
                <p className="text-sm text-muted-foreground">Alertes en temps réel</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Rapports quotidiens</p>
                <p className="text-sm text-muted-foreground">Envoi automatique</p>
              </div>
              <Button size="sm" variant="outline" className="border-border bg-transparent">
                Activé
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="p-6 bg-card border-border">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Sécurité</CardTitle>
            </div>
            <CardDescription>
              Paramètres de sécurité avancés
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Authentification 2FA</p>
                <p className="text-sm text-muted-foreground">Double authentification</p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Mode maintenance</p>
                <p className="text-sm text-muted-foreground">Accès restreint aux admins</p>
              </div>
              <Switch 
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2">
              <Label htmlFor="max-file-size" className="text-foreground">
                Taille max des fichiers (MB)
              </Label>
              <Input 
                id="max-file-size"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
                className="bg-background border-input" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-retention" className="text-foreground">
                Rétention des données (jours)
              </Label>
              <Input 
                id="data-retention"
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleInputChange('dataRetention', e.target.value)}
                className="bg-background border-input" 
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}