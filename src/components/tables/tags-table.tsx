import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const tags = [
  { name: "Marketing", description: "Leads de campanhas de marketing" },
  { name: "Vendas", description: "Leads em processo de vendas" },
  { name: "Suporte", description: "Leads que precisam de suporte" },
  { name: "Produto", description: "Leads interessados em um produto específico" },
  { name: "Parceria", description: "Leads para potenciais parcerias" },
]

export function TagsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags Aplicadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Tag</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.name}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
