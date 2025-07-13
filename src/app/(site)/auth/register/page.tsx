"use client"

import Image from "next/image"
import { RegisterForm } from "../../../../components/Auth/register/registerForm"
import {Linkedin, Instagram } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
    

   

         {/* Seção do Formulário - Lado Direito */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        {/* Background com padrão de orbs etéreos */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d23] to-[#23272f]">
          <div className="absolute inset-0">
            {/* Orbs grandes e difusos com pulsação lenta */}
            <div
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl animate-slow-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-blue-400/4 rounded-full blur-3xl animate-slow-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-400/3 rounded-full blur-3xl animate-slow-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
            <div
              className="absolute top-10 right-10 w-[250px] h-[250px] bg-white/3 rounded-full blur-3xl animate-slow-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-300/2 rounded-full blur-3xl animate-slow-pulse"
              style={{ animationDelay: "3s" }}
            ></div>

            {/* Partículas de brilho muito sutis com fade in/out */}
            <div
              className="absolute top-[15%] left-[30%] w-1 h-1 bg-white/60 rounded-full animate-fade-in-out"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-[40%] right-[25%] w-1 h-1 bg-blue-300/50 rounded-full animate-fade-in-out"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute bottom-[20%] left-[40%] w-1 h-1 bg-white/70 rounded-full animate-fade-in-out"
              style={{ animationDelay: "2.5s" }}
            ></div>
            <div
              className="absolute top-[60%] left-[10%] w-1 h-1 bg-purple-300/40 rounded-full animate-fade-in-out"
              style={{ animationDelay: "3.5s" }}
            ></div>
            <div
              className="absolute bottom-[5%] right-[50%] w-1 h-1 bg-white/50 rounded-full animate-fade-in-out"
              style={{ animationDelay: "4.5s" }}
            ></div>
          </div>

          {/* Overlay sutil para suavizar o efeito */}
          <div className="absolute inset-0 bg-[#23272f]/20"></div>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md relative z-10">
          <RegisterForm />
        </div>
        {/* Rodapé com Ícones de Redes Sociais */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6 z-10">
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="WhatsApp">
            <FaWhatsapp className="h-6 w-6" />
          </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6" />
          </a>
         
        </div>
      </div>
      {/* Seção da Logo - Lado Esquerdo */}
         <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
           <div className="text-center text-primary-foreground">
             <div className="mb-8">
               {/* Logo real */}
               <div className="flex flex-col items-center mb-6">
                 <Image
                   src="/images/Logos_folheto/LogoBlue.png"
                   alt="Folheto Digital"
                   width={500}
                   height={120}
                   className="mb-4"
                   priority
                 />
                 {/* <h1 className="text-4xl font-bold text-[#23272f]">FOLHETO DIGITAL</h1> */}
               </div>
               {/* <p className="text-xl text-primary-foreground/80 max-w-md">
                 A plataforma completa para gerenciar seus folhetos digitais de forma moderna e eficiente
               </p> */}
             </div>
           </div>
         </div>
    </div>
  )
}
