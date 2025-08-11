import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createAppointmentAction } from "@/app/actions";

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  if (!user) return <p>Você precisa estar logado.</p>;

  const [appointments, trucks, dealerships] = await Promise.all([
    prisma.appointment.findMany({
      where: { userId: user.id },
      include: { truck: true, dealership: true },
      orderBy: { date: "desc" },
    }),
    prisma.truck.findMany({ where: { ownerId: user.id } }),
    prisma.dealership.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4">
        <h2 className="section-title">Meus agendamentos</h2>
        <div className="mt-3 divide-y">
          {appointments.length === 0 && <p className="text-gray-600">Nenhum agendamento.</p>}
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

      <div className="card p-4">
        <h2 className="section-title">Novo agendamento</h2>
        {trucks.length === 0 ? (
          <p className="text-gray-600">Cadastre um caminhão primeiro na aba Caminhões.</p>
        ) : (
          <form action={createAppointmentAction} className="mt-3 space-y-3">
            <div>
              <label className="label">Caminhão</label>
              <select className="input" name="truckId" required>
                <option value="">Selecione</option>
                {trucks.map((t) => (
                  <option key={t.id} value={t.id}>{t.plate} • {t.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Concessionária</label>
              <select className="input" name="dealershipId" required>
                <option value="">Selecione</option>
                {dealerships.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} • {d.city}/{d.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Data e hora</label>
              <input className="input" type="datetime-local" name="date" required />
            </div>
            <div>
              <label className="label">Tipo de serviço</label>
              <select className="input" name="serviceType" defaultValue="REVISAO">
                <option value="REVISAO">Revisão</option>
                <option value="TROCA_OLEO">Troca de óleo</option>
                <option value="FREIOS">Freios</option>
                <option value="MOTOR">Motor</option>
                <option value="SUSPENSAO">Suspensão</option>
                <option value="ELETRICA">Elétrica</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea className="input" name="notes" rows={3} placeholder="Detalhes adicionais" />
            </div>
            <button className="btn" type="submit">Agendar</button>
          </form>
        )}
      </div>
    </div>
  );
}