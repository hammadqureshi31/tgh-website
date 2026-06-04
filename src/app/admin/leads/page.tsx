import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/admin/LeadsTable";

export const metadata = {
  title: "Admin Leads | The Gentry's House",
  robots: "noindex, nofollow",
};

async function getLeads(page: number, search: string, status: string) {
  const supabase = await createServerSupabaseClient();

  // Verify authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  // Build query
  let query = supabase.from("leads").select("*", { count: "exact" });

  // Apply status filter
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  // Apply search filter (check multiple fields)
  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(
      `name.ilike.*${search}*,email.ilike.*${search}*,phone.ilike.*${search}*`,
    );
  }

  // Order and paginate
  const {
    data: leads,
    count,
    error,
  } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  // console.log({
  //   leads,
  //   count,
  //   error,
  // });

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return {
    leads: leads || [],
    totalCount: count || 0,
    pageSize,
  };
}

interface AdminLeadsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const search = params.search || "";
  const status = params.status || "all";

  const { leads, totalCount, pageSize } = await getLeads(page, search, status);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b border-luxury-graphite bg-luxury-charcoal/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-playfair text-3xl font-bold text-luxury-ivory mb-2">
            Leads Management
          </h1>
          <p className="text-luxury-pearl font-outfit text-sm tracking-luxury">
            {totalCount} lead{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <LeadsTable
          leads={leads}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          currentSearch={search}
          currentStatus={status}
        />
      </div>
    </div>
  );
}
