"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Calendar20Props {
  onDateSelect?: (date: Date | undefined) => void
  onTimeSelect?: (time: string | null) => void
  selectedDate?: Date
  selectedTime?: string | null
}

export function Calendar20({ 
  onDateSelect, 
  onTimeSelect, 
  selectedDate, 
  selectedTime 
}: Calendar20Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date(2025, 5, 12)
  )
  const [time, setTime] = React.useState<string | null>(selectedTime || null)
  const [customTime, setCustomTime] = React.useState<string>("")
  const [showCustomTime, setShowCustomTime] = React.useState(false)
  
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = Array.from(
    { length: 3 },
    (_, i) => new Date(2025, 5, 17 + i)
  )

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onDateSelect?.(newDate)
  }

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime)
    setShowCustomTime(false)
    setCustomTime("")
    onTimeSelect?.(newTime)
  }

  const handleCustomTimeChange = (value: string) => {
    setCustomTime(value)
    // Validar formato HH:MM
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      setTime(value)
      onTimeSelect?.(value)
    }
  }

  const toggleCustomTime = () => {
    setShowCustomTime(!showCustomTime)
    if (showCustomTime) {
      setCustomTime("")
    }
  }

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            defaultMonth={date}
            disabled={bookedDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("pt-BR", { weekday: "short" })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          {/* Botão para horário personalizado */}
          <div className="mb-2">
            <Button
              variant="outline"
              onClick={toggleCustomTime}
              className="w-full shadow-none text-sm whitespace-normal break-words px-6 py-5"
              type="button"
            >
              {showCustomTime ? "Horários Sugeridos" : "Horário Personalizado"}
            </Button>
          </div>

          {/* Campo de horário personalizado */}
          {showCustomTime ? (
            <div className="space-y-2 mb-4">
              <Label htmlFor="custom-time" className="text-sm font-medium">
          Digite o horário (HH:MM)
              </Label>
              <Input
          id="custom-time"
          type="time"
          value={customTime}
          onChange={(e) => handleCustomTimeChange(e.target.value)}
          className="w-full"
          placeholder="14:30"
              />
              {customTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(customTime) && (
          <p className="text-xs text-red-500">
            Formato inválido. Use HH:MM (ex: 14:30)
          </p>
              )}
            </div>
          ) : (
            /* Horários sugeridos */
            <div className="grid gap-2">
              {timeSlots.map((timeSlot) => (
          <Button
            key={timeSlot}
            variant={time === timeSlot ? "default" : "outline"}
            onClick={() => handleTimeSelect(timeSlot)}
            className="w-full shadow-none"
            type="button"
          >
            {timeSlot}
          </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm text-center md:text-left flex-1">
          {date && time ? (
            <div className="space-y-1">
              <p className="text-green-700 font-medium">
                ✓ Agendamento selecionado
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {date.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
                {" às "}
                <span className="font-medium text-foreground">{time}</span>
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Selecione uma data e horário para agendar sua campanha
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}