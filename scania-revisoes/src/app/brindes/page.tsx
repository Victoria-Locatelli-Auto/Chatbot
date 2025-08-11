import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPointsBalance, redeemRewardAction } from "@/app/actions";

export default async function RewardsPage() {
  const user = await getCurrentUser();
  if (!user) return <p>Você precisa estar logado.</p>;

  const [rewards, balance, myRedemptions] = await Promise.all([
    prisma.reward.findMany({ where: { active: true }, orderBy: { pointsCost: "asc" } }),
    getPointsBalance(user.id),
    prisma.redemption.findMany({ where: { userId: user.id }, include: { reward: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4">
        <h2 className="section-title">Brindes disponíveis</h2>
        <p className="mt-1 text-sm text-gray-600">Saldo: <span className="font-semibold text-brand">{balance}</span> pontos</p>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {rewards.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-gray-600">{r.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">{r.pointsCost} pts</div>
                <form action={redeemRewardAction}>
                  <input type="hidden" name="rewardId" value={r.id} />
                  <button className="btn" disabled={balance < r.pointsCost}>
                    Resgatar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h2 className="section-title">Meus resgates</h2>
        <div className="mt-3 divide-y">
          {myRedemptions.length === 0 && <p className="text-gray-600">Nenhum resgate ainda.</p>}
          {myRedemptions.map((x) => (
            <div key={x.id} className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{x.reward.name}</div>
                  <div className="text-sm text-gray-600">{new Date(x.createdAt).toLocaleString()}</div>
                </div>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">{x.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}