import { RegisterForm } from "./registerForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Seção do Formulário - Lado Direito */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        {/* Background com padrão de círculos */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d23] to-[#23272f]">
          <div className="absolute inset-0 opacity-30">
            {/* Círculos grandes */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-sm"></div>
            <div className="absolute top-32 right-20 w-24 h-24 bg-white/8 rounded-full blur-sm"></div>
            <div className="absolute bottom-20 left-16 w-40 h-40 bg-white/4 rounded-full blur-sm"></div>
            <div className="absolute bottom-32 right-12 w-28 h-28 bg-white/6 rounded-full blur-sm"></div>

            {/* Círculos médios */}
            <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/7 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-white/12 rounded-full blur-sm"></div>

            {/* Círculos pequenos */}
            <div className="absolute top-16 right-1/3 w-8 h-8 bg-white/15 rounded-full blur-sm"></div>
            <div className="absolute top-2/3 left-1/2 w-6 h-6 bg-white/18 rounded-full blur-sm"></div>
            <div className="absolute bottom-16 right-1/3 w-10 h-10 bg-white/12 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 left-1/5 w-14 h-14 bg-white/8 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/4 right-1/5 w-18 h-18 bg-white/6 rounded-full blur-sm"></div>
          </div>

          {/* Overlay sutil para suavizar o efeito */}
          <div className="absolute inset-0 bg-[#23272f]/20"></div>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md relative z-10">
          <RegisterForm />
        </div>
      </div>
        {/* Seção da Logo - Lado Esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="text-center text-primary-foreground">
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-lg transform rotate-45"></div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-[#23272f]">FOLHETO DIGITAL</h1>
            <p className="text-xl text-primary-foreground/80 max-w-md">
              A plataforma completa para gerenciar seus folhetos digitais de forma moderna e eficiente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
