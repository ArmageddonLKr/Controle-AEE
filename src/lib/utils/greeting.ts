export function getGreeting(nome: string): string {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return `Bom dia, ${nome} 👋`;
  if (hora >= 12 && hora < 18) return `Boa tarde, ${nome} 👋`;
  return `Boa noite, ${nome} 👋`;
}
