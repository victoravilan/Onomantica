export type HistoriaTipo = 'histórica' | 'bíblica' | 'mitológica' | 'poética' | 'fantástica'

export interface NombreItem {
  nombre: string
  genero: 'M'|'F'|'U'|string
  origen: string
  significado: string
  historia: { tipo: HistoriaTipo, relato: string }
}
