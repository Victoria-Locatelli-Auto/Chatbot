import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createTruckAction } from "@/app/actions";

export default async function TrucksPage() {
  const user = await getCurrentUser();
  if (!user) return <p>Você precisa estar logado.</p>;

  const trucks = await prisma.truck.findMany({ where: { ownerId: user.id } });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4">
        <h2 className="section-title">Meus caminhões</h2>
        <div className="mt-3 divide-y">
          {trucks.length === 0 && <p className="text-gray-600">Nenhum caminhão cadastrado.</p>}
          {trucks.map((t) => (
            <div key={t.id} className="py-2">
              <div className="font-medium">{t.plate} • {t.model} • {t.year}</div>
              <div className="text-sm text-gray-600">VIN: {t.vin}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-4">
        <h2 className="section-title">Adicionar caminhão</h2>
        <form action={createTruckAction} className="mt-3 space-y-3">
          <div>
            <label className="label">Placa</label>
            <input className="input" name="plate" placeholder="ABC1D23" required />
          </div>
          <div>
            <label className="label">VIN</label>
            <input className="input" name="vin" placeholder="17 caracteres" required />
          </div>
          <div>
            <label className="label">Modelo</label>
            <input className="input" name="model" placeholder="R 450" required />
          </div>
          <div>
            <label className="label">Ano</label>
            <input className="input" name="year" type="number" min="1990" max="2100" required />
          </div>
          <button className="btn" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}