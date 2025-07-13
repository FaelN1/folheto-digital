'use client'

import { format } from "date-fns"
import {MessageCircle, MoreVertical, Smile, Paperclip, Send, Wifi, Signal, BatteryCharging } from 'lucide-react'
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Lead {
  name: string
  avatar?: string
}

interface IPhoneMockupProps {
  message: string
  imageUrl: string | null
  selectedLead?: Lead
}

export default function IPhoneMockup({ message, imageUrl, selectedLead }: IPhoneMockupProps) {
  const currentTime = format(new Date(), "HH:mm")
  const exampleTime = format(new Date(Date.now() - 300000), "HH:mm") // 5 minutes ago

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Corpo do iPhone */}
      <div className="relative w-80 h-[640px] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
        {/* Tela */}
        <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white text-sm font-semibold text-black">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              <Signal className="w-4 h-4" />
              <BatteryCharging className="w-5 h-5 text-green-500" />
            </div>
          </div>
          {/* WhatsApp Header */}
          <div className="flex items-center gap-3 px-4 py-4 bg-green-600 text-white shadow-lg">
            <Avatar className="w-10 h-10 border-2 border-white/50">
              {selectedLead?.avatar ? (
                <AvatarImage src={selectedLead.avatar || "/placeholder.svg"} alt={selectedLead.name} />
              ) : (
                <AvatarFallback className="bg-white/20 text-white text-sm font-bold">
                  {selectedLead?.name ? selectedLead.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-base">{selectedLead ? selectedLead.name : "Selecione um lead"}</div>
              <div className="text-xs text-green-100 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-300 rounded-full" />
                online
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle className="w-5 h-5" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-auto w-auto p-0 text-white hover:bg-transparent hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                    <span className="sr-only">Mais opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver contato</DropdownMenuItem>
                  <DropdownMenuItem>Limpar conversa</DropdownMenuItem>
                  <DropdownMenuItem>Bloquear</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50"> {/* Simplified background */}
            <div className="flex flex-col gap-3">
              {/* Mensagem de exemplo do usuário */}
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm max-w-[85%] text-sm border">
                  <div className="text-gray-800">Olá! Como posso ajudar?</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>{exampleTime}</span>
                  </div>
                </div>
              </div>
              {/* Mensagem da campanha */}
              {(message || imageUrl) && (
                <div className="flex justify-end">
                  <div className="bg-green-500 text-white p-3 rounded-2xl rounded-tr-md shadow-lg max-w-[85%]">
                    {imageUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          width={200} // Adjusted for mockup size
                          height={120} // Adjusted for mockup size
                          className="w-full h-auto object-cover max-h-40 rounded-xl"
                        />
                      </div>
                    )}
                    {message && (
                      <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message}</div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-xs text-green-100">{currentTime}</span>
                      <div className="text-green-100 text-sm">✓✓</div>
                    </div>
                  </div>
                </div>
              )}
              {!message && !imageUrl && (
                <div className="text-center text-gray-400 text-sm mt-12 px-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">Prévia da mensagem</p>
                  <p className="text-xs mt-1">Sua mensagem aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 pr-1 py-1">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
                <span className="sr-only">Emoji</span>
              </Button>
              <Input
                type="text"
                placeholder="Digite uma mensagem"
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-gray-700 placeholder:text-gray-500"
                readOnly // Make it read-only for mockup purposes
              />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                  <span className="sr-only">Anexar</span>
                </Button>
                <Button size="icon" className="w-9 h-9 bg-green-500 rounded-full shadow-md hover:bg-green-600">
                  <Send className="w-4 h-4 text-white" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}