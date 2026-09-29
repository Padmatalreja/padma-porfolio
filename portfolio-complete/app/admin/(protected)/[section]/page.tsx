import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { sectionConfigs } from "@/lib/admin-config";
import { AdminSection } from "@/components/admin/admin-section";

export const dynamic = "force-dynamic";

async function ConnectedSection({
  section,
  sp,
}: {
  section: string;
  sp: { edit?: string; saved?: string; new?: string };
}) {
  const config = sectionConfigs[section]!;

  const orderClause = config.orderable
    ? `ORDER BY display_order ASC`
    : `ORDER BY created_at DESC`;

  const records = (await query(
    `SELECT * FROM "${config.table}" ${orderClause}`,
    []
  )) as Record<string, unknown>[];

  let editing: Record<string, unknown> | null = null;
  if (sp.edit) editing = records.find((r) => r.id === sp.edit) || null;
  else if (config.singleton) editing = records[0] || null;
  else if (sp.new || records.length === 0) editing = { is_public: true };

  const selectOptions: Record<string, Array<{ label: string; value: string }>> = {};
  let projectImages: Array<{ id: string; project_id: string; image_url: string }> = [];

  if (section === "skills") {
    const cats = (await query`
      SELECT id, name FROM skill_categories ORDER BY display_order ASC
    `) as any[];
    selectOptions.category_id = cats.map((c) => ({ label: c.name, value: c.id }));
  }

  if (section === "projects") {
    projectImages = (await query`
      SELECT id, project_id, image_url FROM project_images ORDER BY display_order ASC
    `) as any[];
  }

  return (
    <AdminSection
      section={section}
      config={config}
      records={records}
      editing={editing}
      selectOptions={selectOptions}
      saved={sp.saved === "1"}
      projectImages={projectImages}
    />
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ edit?: string; saved?: string; new?: string }>;
}) {
  const { section } = await params;
  const sp = await searchParams;
  const config = sectionConfigs[section];
  if (!config) notFound();

  return <ConnectedSection section={section} sp={sp} />;
}
