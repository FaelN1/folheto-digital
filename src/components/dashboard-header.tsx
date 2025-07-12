"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  companies: string[]
  tags: string[]
  emulators: string[]
  companyFilter: string | undefined
  tagFilter: string | undefined
  emulatorFilter: string | undefined
  setCompanyFilter: (value: string | undefined) => void
  setTagFilter: (value: string | undefined) => void
  setEmulatorFilter: (value: string | undefined) => void
  date: { from?: Date; to?: Date } | undefined
  setDate: (date: { from?: Date; to?: Date } | undefined) => void
}

export function DashboardHeader({
  companies,
  tags,
  emulators,
  companyFilter,
  tagFilter,
  emulatorFilter,
  setCompanyFilter,
  setTagFilter,
  setEmulatorFilter,
  date,
  setDate,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold">Dashboard de Métricas</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto lg:flex-shrink-0">
        {/* Date Picker */}
        <div className="w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date?.from ? { from: date.from, to: date?.to } : undefined}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select onValueChange={setCompanyFilter} value={companyFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filtrar por Empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setTagFilter} value={tagFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filtrar por Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setEmulatorFilter} value={emulatorFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filtrar por Emulador" />
            </SelectTrigger>
            <SelectContent>
              {emulators.map((emulator) => (
                <SelectItem key={emulator} value={emulator}>
                  {emulator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
