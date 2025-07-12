"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const leads = [
  { id: "L001", name: "João Silva", company: "Empresa A", tag: "Marketing", status: "Novo" },
  { id: "L002", name: "Maria Souza", company: "Empresa B", tag: "Vendas", status: "Contato" },
  { id: "L003", name: "Carlos Lima", company: "Empresa A", tag: "Suporte", status: "Qualificado" },
  { id: "L004", name: "Ana Paula", company: "Empresa C", tag: "Marketing", status: "Novo" },
  { id: "L005", name: "Pedro Costa", company: "Empresa B", tag: "Produto", status: "Contato" },
]

export function LeadsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Leads</CardTitle>
        <Input
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.id}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.tag}</TableCell>
                <TableCell>{lead.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
