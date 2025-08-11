import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionUser } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name: string | undefined = body?.name;
  const email: string | undefined = body?.email;
  const phone: string | undefined = body?.phone;

  if (!name || !email) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: { name, email, phone },
    update: { name, phone },
  });

  await setSessionUser(user.id);

  return NextResponse.json({ ok: true, user });
}