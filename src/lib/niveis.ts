// Pastas/níveis em que as crianças ficam organizadas na aba Crianças.
// Ordem define a exibição das pastas.
export const NIVEIS = [
  "Infantário",
  "Maternal",
  "Nível I",
  "Nível II",
  "Nível III",
  "1º ano fundamental",
] as const;

// Rótulo da pasta para crianças que ainda não foram colocadas em nenhum nível.
export const SEM_PASTA = "Sem pasta";

/** Retorna a pasta efetiva de uma criança (ou "Sem pasta") */
export function pastaDaCrianca(nivel?: string): string {
  return nivel && nivel.trim() ? nivel : SEM_PASTA;
}
