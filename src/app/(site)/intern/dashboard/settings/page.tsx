"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bell, Globe, Settings, Shield, User, Users, Zap, Palette, Languages, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth/useAuth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function CampaignSettings() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Determinar aba ativa baseada no parâmetro da URL
  const getInitialTab = () => {
    const tab = searchParams.get('tab')
    if (tab && ['account', 'general', 'campaigns', 'notifications', 'integrations'].includes(tab)) {
      return tab
    }
    return 'account'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())
  
  const [settings, setSettings] = useState({
    // Informações da Conta (vindas do contexto de auth)
    userName: "",
    userRole: "",
    accountEmail: "",
    companyId: "",
    companyName: "",
    
    // Configurações Gerais
    theme: "system" as "light" | "dark" | "system",
    language: "pt-BR",
    
    // Configurações de Campanhas
    autoApproval: false,
    budgetLimit: "10000",
    defaultMessage: "",
    
    // Configurações de Notificações
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    
    // Configurações de Integrações
    googleAdsConnected: false,
    facebookAdsConnected: false,
    metaAdsConnected: false,
  })

  // Atualizar aba quando parâmetro da URL mudar
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['account', 'general', 'campaigns', 'notifications', 'integrations'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Carrega as informações do usuário quando o componente monta
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        userName: user.name || "",
        userRole: user.role || "",
        accountEmail: user.email || "",
        companyId: user.companyId || "",
        // Aqui você pode carregar o nome da empresa se disponível
        companyName: user.companyName || "",
      }))
    }
  }, [user])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Aqui você faria a chamada para sua API para salvar as configurações
      // await updateUserSettings(settings)
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula delay da API
      
      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar configurações")
      console.error("Erro:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      'MASTER': 'Administrador Master',
      'ADMIN': 'Administrador',
      'USER': 'Usuário',
      'GUEST': 'Convidado'
    }
    return roleMap[role as keyof typeof roleMap] || role
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'MASTER':
        return 'bg-red-100 text-red-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'USER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando informações do usuário...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header melhorado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências pessoais e configurações da conta
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          <TabsTrigger value="account" className="flex items-center gap-2 py-3">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Conta</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2 py-3">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2 py-3">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Campanhas</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-3">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2 py-3">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Integrações</span>
          </TabsTrigger>
        </TabsList>


        {/* Aba: Conta */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Seus dados pessoais e informações de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Nome</Label>
                    <Input
                      id="userName"
                      value={settings.userName}
                      onChange={(e) => handleSettingChange("userName", e.target.value)}
                      placeholder="Digite seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountEmail">Email</Label>
                    <Input
                      id="accountEmail"
                      type="email"
                      value={settings.accountEmail}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Entre em contato com o administrador para alterar o email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Função no Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Sua função determina suas permissões de acesso
                    </p>
                  </div>
                  <Badge className={getRoleBadgeColor(settings.userRole)}>
                    {getRoleDisplayName(settings.userRole)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      Alterar Senha
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use uma senha forte com pelo menos 8 caracteres
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>
                  Dados da empresa associada à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyId">ID da Empresa</Label>
                    <Input
                      id="companyId"
                      value={settings.companyId}
                      disabled
                      className="bg-muted font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba: Geral */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro, escuro ou automático
                  </p>
                </div>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="language">Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Idioma da interface do sistema
                  </p>
                </div>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Campanhas */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configurações de Campanhas
              </CardTitle>
              <CardDescription>
                Configure o comportamento padrão das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Aprovação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Campanhas são aprovadas automaticamente sem revisão manual
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproval}
                  onCheckedChange={(checked) => handleSettingChange("autoApproval", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Limite de Orçamento Diário (R$)</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  value={settings.budgetLimit}
                  onChange={(e) => handleSettingChange("budgetLimit", e.target.value)}
                  className="w-full md:w-[200px]"
                  placeholder="10000"
                />
                <p className="text-sm text-muted-foreground">
                  Limite máximo de gasto diário por campanha
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultMessage">Mensagem Padrão</Label>
                <Textarea
                  id="defaultMessage"
                  value={settings.defaultMessage}
                  onChange={(e) => handleSettingChange("defaultMessage", e.target.value)}
                  placeholder="Digite a mensagem padrão que será usada nas campanhas..."
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  Esta mensagem será pré-carregada ao criar novas campanhas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando você deseja ser notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'emailNotifications',
                  title: 'Notificações por Email',
                  description: 'Receba atualizações importantes por email',
                  checked: settings.emailNotifications
                },
                {
                  key: 'pushNotifications',
                  title: 'Notificações Push',
                  description: 'Receba notificações em tempo real no navegador',
                  checked: settings.pushNotifications
                },
                {
                  key: 'weeklyReports',
                  title: 'Relatórios Semanais',
                  description: 'Receba um resumo semanal das suas campanhas',
                  checked: settings.weeklyReports
                }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>{notification.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <Switch
                    checked={notification.checked}
                    onCheckedChange={(checked) => handleSettingChange(notification.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Integrações */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações de Plataformas
              </CardTitle>
              <CardDescription>
                Conecte sua conta com plataformas publicitárias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'googleAdsConnected',
                  name: 'Google Ads',
                  description: 'Conecte sua conta do Google Ads',
                  icon: Globe,
                  connected: settings.googleAdsConnected
                },
                {
                  key: 'facebookAdsConnected',
                  name: 'Facebook Ads',
                  description: 'Conecte sua conta do Facebook Ads',
                  icon: Users,
                  connected: settings.facebookAdsConnected
                },
                {
                  key: 'metaAdsConnected',
                  name: 'Meta Ads',
                  description: 'Conecte sua conta do Meta Ads',
                  icon: Shield,
                  connected: settings.metaAdsConnected
                }
              ].map((integration) => {
                const IconComponent = integration.icon
                return (
                  <div key={integration.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label className="font-medium">{integration.name}</Label>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Conectado
                        </Badge>
                      )}
                      <Button 
                        variant={integration.connected ? "outline" : "default"} 
                        size="sm"
                        onClick={() => handleSettingChange(integration.key, !integration.connected)}
                      >
                        {integration.connected ? "Desconectar" : "Conectar"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <Button variant="outline" className="order-2 sm:order-1">
          Cancelar
        </Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="order-1 sm:order-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </div>
    </div>
  )
}