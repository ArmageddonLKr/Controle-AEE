import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.atendimento.deleteMany();
  await prisma.evolucao.deleteMany();
  await prisma.aluno.deleteMany();

  const today = new Date();
  const currentYear = today.getFullYear();

  // Helper to set birthday to be N days from now in current year
  function birthdayInDays(days: number, birthYear: number): Date {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    d.setFullYear(birthYear);
    return d;
  }

  const alunos = await prisma.aluno.createMany({
    data: [
      {
        nome: "Ana Beatriz Souza",
        dataNascimento: birthdayInDays(3, currentYear - 8),
        turma: "3º Ano A",
        escola: "E.M. Monteiro Lobato",
        responsavel: "Maria Souza",
        telefone: "(11) 99999-1111",
        necessidadeEspecial: "TEA",
        observacoes: "Aluna comunicativa, gosta de atividades visuais.",
        ativo: true,
      },
      {
        nome: "Carlos Eduardo Lima",
        dataNascimento: birthdayInDays(6, currentYear - 10),
        turma: "5º Ano B",
        escola: "E.M. Monteiro Lobato",
        responsavel: "João Lima",
        telefone: "(11) 99999-2222",
        necessidadeEspecial: "TDAH",
        observacoes: "Necessita de pausas frequentes durante atividades.",
        ativo: true,
      },
      {
        nome: "Gabriela Oliveira",
        dataNascimento: new Date(currentYear - 9, 2, 15),
        turma: "4º Ano A",
        escola: "E.M. Santos Dumont",
        responsavel: "Fernanda Oliveira",
        telefone: "(11) 99999-3333",
        necessidadeEspecial: "Deficiência Visual",
        ativo: true,
      },
      {
        nome: "Rafael Mendes Costa",
        dataNascimento: new Date(currentYear - 11, 7, 22),
        turma: "6º Ano",
        escola: "E.M. Santos Dumont",
        responsavel: "Paulo Costa",
        telefone: "(11) 99999-4444",
        necessidadeEspecial: "Deficiência Auditiva",
        observacoes: "Usa aparelho auditivo. Leitura labial.",
        ativo: true,
      },
      {
        nome: "Sophia Rodrigues",
        dataNascimento: new Date(currentYear - 7, 10, 5),
        turma: "2º Ano B",
        escola: "E.M. Monteiro Lobato",
        responsavel: "Carla Rodrigues",
        telefone: "(11) 99999-5555",
        necessidadeEspecial: "Síndrome de Down",
        ativo: true,
      },
      {
        nome: "Lucas Ferreira",
        dataNascimento: new Date(currentYear - 9, 4, 18),
        turma: "4º Ano B",
        escola: "E.M. Santos Dumont",
        responsavel: "Roberto Ferreira",
        telefone: "(11) 99999-6666",
        necessidadeEspecial: "TEA",
        ativo: false,
      },
    ],
  });

  console.log(`Criados ${alunos.count} alunos.`);

  const todosAlunos = await prisma.aluno.findMany();

  // Create atendimentos for the last 60 days
  const tiposAtendimento = ["individual", "grupo", "avaliacao", "reuniao_familia"];
  const atendimentosData = [];

  for (const aluno of todosAlunos.slice(0, 5)) {
    for (let i = 0; i < 8; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 1;
      const data = new Date(today);
      data.setDate(data.getDate() - daysAgo);
      atendimentosData.push({
        alunoId: aluno.id,
        data,
        tipo: tiposAtendimento[Math.floor(Math.random() * 3)] as string,
        duracaoMin: [30, 45, 50, 60][Math.floor(Math.random() * 4)],
        objetivo: "Desenvolvimento de habilidades comunicativas e cognitivas.",
        presente: Math.random() > 0.15,
      });
    }
  }

  await prisma.atendimento.createMany({ data: atendimentosData });
  console.log(`Criados ${atendimentosData.length} atendimentos.`);

  // Create evolucao records
  const evolucaoData = [];
  const periodos = ["1º Bimestre 2025", "2º Bimestre 2025"];
  const areas = [
    '["comunicação","socialização"]',
    '["motricidade","cognição"]',
    '["leitura","escrita"]',
    '["autonomia","autocuidado"]',
  ];

  for (const aluno of todosAlunos.slice(0, 4)) {
    for (const periodo of periodos) {
      evolucaoData.push({
        alunoId: aluno.id,
        data: new Date(today.getFullYear(), periodo.includes("1º") ? 2 : 5, 15),
        periodo,
        descricao:
          "Demonstrou avanços significativos nas atividades propostas. Mostra maior concentração e participação nas sessões de AEE.",
        areas: areas[Math.floor(Math.random() * areas.length)],
      });
    }
  }

  await prisma.evolucao.createMany({ data: evolucaoData });
  console.log(`Criados ${evolucaoData.length} registros de evolução.`);

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
