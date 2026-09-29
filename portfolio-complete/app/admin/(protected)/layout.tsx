import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const data = await getPortfolioData().catch(() => null);
  const profileImage = data?.profile.profile_image_url ?? null;
  const profileName  = data?.profile.full_name ?? null;

  return (
    <AdminShell email={user.email} profileImage={profileImage} profileName={profileName}>
      {children}
    </AdminShell>
  );
}
