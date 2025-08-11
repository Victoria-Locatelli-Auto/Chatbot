import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dealerships = [
    {
      name: "Scania SP - Barra Funda",
      city: "São Paulo",
      state: "SP",
      address: "Av. Marquês de São Vicente, 3000",
      email: "contato-sp@scania.com",
      phone: "+55 11 3333-1111",
      cnpj: "12.345.678/0001-11",
    },
    {
      name: "Scania RJ - Duque de Caxias",
      city: "Duque de Caxias",
      state: "RJ",
      address: "Rod. Washington Luiz, km 125",
      email: "contato-rj@scania.com",
      phone: "+55 21 3333-2222",
      cnpj: "98.765.432/0001-22",
    },
    {
      name: "Scania PR - Curitiba",
      city: "Curitiba",
      state: "PR",
      address: "BR-116, km 98",
      email: "contato-pr@scania.com",
      phone: "+55 41 3333-3333",
      cnpj: "55.444.333/0001-33",
    },
  ];

  for (const d of dealerships) {
    const exists = await prisma.dealership.findFirst({ where: { name: d.name } });
    if (!exists) {
      await prisma.dealership.create({ data: d });
    }
  }

  const rewards = [
    { name: "Boné Scania", description: "Boné oficial", pointsCost: 100 },
    { name: "Camiseta Scania", description: "Camiseta oficial", pointsCost: 200 },
    { name: "Jaqueta Scania", description: "Jaqueta oficial", pointsCost: 500 },
  ];

  for (const r of rewards) {
    const exists = await prisma.reward.findFirst({ where: { name: r.name } });
    if (!exists) {
      await prisma.reward.create({ data: r });
    }
  }

  const demo = await prisma.user.findUnique({ where: { email: "demo@scania.com" } });
  if (!demo) {
    await prisma.user.create({
      data: {
        name: "Motorista Demo",
        email: "demo@scania.com",
        phone: "+55 11 99999-0000",
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });