"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function createTruckAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado");

  const plate = String(formData.get("plate") || "").toUpperCase().trim();
  const vin = String(formData.get("vin") || "").toUpperCase().trim();
  const model = String(formData.get("model") || "").trim();
  const year = Number(formData.get("year") || 0);

  if (!plate || !vin || !model || !year) throw new Error("Campos obrigatórios ausentes");

  await prisma.truck.create({
    data: {
      plate,
      vin,
      model,
      year,
      ownerId: user.id,
    },
  });

  revalidatePath("/caminhoes");
}

export async function createAppointmentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado");

  const truckId = String(formData.get("truckId") || "");
  const dealershipId = String(formData.get("dealershipId") || "");
  const date = new Date(String(formData.get("date") || ""));
  const serviceType = String(formData.get("serviceType") || "REVISAO") as any;
  const notes = String(formData.get("notes") || "");

  if (!truckId || !dealershipId || isNaN(date.getTime())) throw new Error("Dados inválidos");

  const appointment = await prisma.appointment.create({
    data: {
      userId: user.id,
      truckId,
      dealershipId,
      date,
      status: "PENDENTE",
      serviceType,
      notes: notes || null,
      pointsAwarded: 50, // Pontos base por agendamento
    },
  });

  await prisma.pointsTransaction.create({
    data: {
      userId: user.id,
      amount: 50,
      type: "EARN",
      meta: `Agendamento ${appointment.id}`,
    },
  });

  revalidatePath("/agendamentos");
  revalidatePath("/");
}

export async function redeemRewardAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autenticado");

  const rewardId = String(formData.get("rewardId") || "");
  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  if (!reward || !reward.active) throw new Error("Brinde inválido");

  const balance = await getPointsBalance(user.id);
  if (balance < reward.pointsCost) throw new Error("Pontos insuficientes");

  await prisma.$transaction(async (tx) => {
    await tx.redemption.create({
      data: { userId: user.id, rewardId: reward.id, pointsSpent: reward.pointsCost },
    });
    await tx.pointsTransaction.create({
      data: { userId: user.id, amount: -reward.pointsCost, type: "SPEND", meta: `Resgate ${reward.name}` },
    });
  });

  revalidatePath("/brindes");
  revalidatePath("/");
}

export async function getPointsBalance(userId: string): Promise<number> {
  const { _sum } = await prisma.pointsTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return _sum.amount ?? 0;
}