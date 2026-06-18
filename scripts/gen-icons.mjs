// scripts/gen-icons.mjs
// Gera o emblema do Controle AEE (capelo de formatura sobre um globo — tema
// educacional) e exporta os ícones do PWA (192 e 512) já centralizados, com
// margem de segurança para ícones "maskable". Também atualiza o logo do app.
//
// Uso: node scripts/gen-icons.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// Cores do tema
const AZUL_GLOBO = "#3E8FD0";
const VERDE = "#35C77E";
const NAVY = "#2A3C5B";
const CONTORNO = "#15243B";
const OURO = "#F2A41C";

// Emblema desenhado num quadro 0 0 100 100 (será escalado conforme o uso).
// Globo embaixo, capelo (mortarboard) bem em cima, borla dourada à direita.
function emblema() {
  return `
  <g stroke="${CONTORNO}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">
    <!-- Globo -->
    <circle cx="50" cy="64" r="26" fill="${AZUL_GLOBO}"/>
    <!-- Continentes (recortados ao globo) -->
    <g clip-path="url(#globo)" stroke-width="1.5">
      <path d="M44,62 C42,55 54,53 57,60 C60,66 55,76 49,77 C43,78 41,69 44,62 Z" fill="${VERDE}"/>
      <path d="M30,66 C28,63 35,62 36,67 C37,71 31,73 30,69 Z" fill="${VERDE}"/>
      <path d="M60,74 C63,71 69,75 64,80 C60,84 56,77 60,74 Z" fill="${VERDE}"/>
    </g>
    <!-- Brilho sutil do globo -->
    <path d="M32,54 A26,26 0 0 1 47,41" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2.2" fill="none"/>
    <!-- Rebordo do capelo apoiado no topo do globo -->
    <path d="M37,33 L63,33 L60,42 Q50,47 40,42 Z" fill="${NAVY}"/>
    <!-- Aba do capelo (losango) — centralizada sobre o globo -->
    <path d="M50,11 L84,25 L50,39 L16,25 Z" fill="${NAVY}"/>
    <!-- Botão central -->
    <circle cx="50" cy="25" r="3" fill="${OURO}"/>
    <!-- Cordão da borla -->
    <path d="M50,25 L80,30 L80,49" fill="none" stroke="${OURO}" stroke-width="3"/>
    <!-- Borla -->
    <path d="M80,49 C76,50 76,50 76,55 L84,55 C84,50 84,50 80,49 Z" fill="${OURO}"/>
  </g>`;
}

// SVG completo de um ícone quadrado com fundo claro arredondado (full-bleed
// para maskable) e o emblema centralizado dentro da zona segura (~64%).
function svgIcone(tamanho) {
  const t = tamanho;
  const escala = (t * 0.64) / 100;       // emblema ocupa ~64% do canvas
  const desloc = (t - 100 * escala) / 2; // centraliza
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">
  <defs>
    <clipPath id="globo"><circle cx="50" cy="64" r="26"/></clipPath>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EAF4FB"/>
      <stop offset="1" stop-color="#CFE4F5"/>
    </linearGradient>
  </defs>
  <rect width="${t}" height="${t}" fill="url(#bg)"/>
  <g transform="translate(${desloc},${desloc}) scale(${escala})">
    ${emblema()}
  </g>
</svg>`;
}

// Logo do app (usado na sidebar): emblema sobre um quadro claro arredondado.
function svgLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <clipPath id="globo"><circle cx="50" cy="64" r="26"/></clipPath>
  </defs>
  <rect x="2" y="2" width="96" height="96" rx="22" fill="#EAF4FB"/>
  <g transform="translate(8,8) scale(0.84)">
    ${emblema()}
  </g>
</svg>`;
}

// Logo com texto ao lado.
function svgLogoTexto() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 100" fill="none">
  <defs>
    <clipPath id="globo"><circle cx="50" cy="64" r="26"/></clipPath>
  </defs>
  <rect x="2" y="2" width="96" height="96" rx="22" fill="#EAF4FB"/>
  <g transform="translate(8,8) scale(0.84)">
    ${emblema()}
  </g>
  <text x="116" y="46" font-family="Plus Jakarta Sans, sans-serif" font-size="26" font-weight="400" fill="#4A6080">Controle</text>
  <text x="116" y="80" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="800" fill="#1E3A5F" letter-spacing="1">AEE</text>
</svg>`;
}

// ── Escrita dos arquivos ──────────────────────────────────────────────
writeFileSync(join(PUBLIC, "logo.svg"), svgLogo().trim() + "\n");
writeFileSync(join(PUBLIC, "logo-text.svg"), svgLogoTexto().trim() + "\n");

for (const tam of [192, 512]) {
  const buf = Buffer.from(svgIcone(tam));
  await sharp(buf).png().toFile(join(PUBLIC, "icons", `icon-${tam}.png`));
  console.log(`gerado icons/icon-${tam}.png`);
}
console.log("logo.svg e logo-text.svg atualizados");
