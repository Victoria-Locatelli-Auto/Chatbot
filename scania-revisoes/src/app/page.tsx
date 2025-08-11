import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPointsBalance } from "@/app/actions";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="section-title">Bem-vindo ao Scania Revisões</h1>
        <p>Faça login para agendar revisões, acumular pontos e trocar por brindes.</p>
        <Link className="btn" href="/login">Entrar</Link>
      </div>
    );
  }

  const [appointments, balance] = await Promise.all([
    prisma.appointment.findMany({
      where: { userId: user.id },
      include: { dealership: true, truck: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
    getPointsBalance(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h2 className="section-title">Saldo de pontos</h2>
          <p className="mt-2 text-3xl font-bold text-brand">{balance}</p>
        </div>
        <div className="card p-4">
          <h2 className="section-title">Meus caminhões</h2>
          <Link className="mt-3 inline-block text-brand underline" href="/caminhoes">Gerenciar</Link>
        </div>
        <div className="card p-4">
          <h2 className="section-title">Brindes</h2>
          <Link className="mt-3 inline-block text-brand underline" href="/brindes">Ver brindes</Link>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="section-title">Próximos agendamentos</h2>
        <div className="mt-3 divide-y">
          {appointments.length === 0 && <p className="text-gray-600">Nenhum agendamento. <Link className="text-brand underline" href="/agendamentos">Agendar agora</Link></p>}
          {appointments.map((a) => (
            <div key={a.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.dealership.name}</div>
                  <div className="text-sm text-gray-600">{new Date(a.date).toLocaleString()} • {a.serviceType} • {a.truck.plate}</div>
                </div>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">{a.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}