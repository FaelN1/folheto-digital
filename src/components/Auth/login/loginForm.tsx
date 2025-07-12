'use client';
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth/useAuth";
import Link from "next/link"
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

   try {
  console.log('[LoginForm] Enviando dados para login...');
  await login(email, password);
  console.log('[LoginForm] Login OK');
} catch (error: any) {
  console.error('[LoginForm] Erro no login:', error);
}
  };

  return (
    <Card className="w-full border-0 shadow-large bg-card/100 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold text-foreground">
          Entrar
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Acesse sua conta para continuar
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-border bg-background/50 focus:bg-background transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-border bg-background/50 focus:bg-background transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-muted-foreground">Lembrar de mim</span>
            </label>
          </div>
          
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full cursor-pointer h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="text-primary cursor-pointer hover:text-primary-glow transition-colors font-medium"
         
            >
              Criar conta
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}