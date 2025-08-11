import { prisma } from "@/lib/prisma";

export default async function DealershipsPage() {
  const dealerships = await prisma.dealership.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="card p-4">
      <h1 className="section-title">Concessionárias</h1>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {dealerships.map((d) => (
          <div key={d.id} className="rounded border p-3">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm text-gray-600">{d.address}, {d.city} - {d.state}</div>
            {d.phone && <div className="text-sm text-gray-600">{d.phone}</div>}
            {d.email && <div className="text-sm text-gray-600">{d.email}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}