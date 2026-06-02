"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type LeadStatus = Lead["status"];

export async function getLeads({
  page = 1,
  search = "",
  status = "all",
}: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<{
  leads: Lead[];
  totalCount: number;
  page: number;
  pageSize: number;
}> {
  const supabase = await createServerSupabaseClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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

  // Apply search filter
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

  console.log({
    leads,
    count,
    error,
  });

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return {
    leads: leads || [],
    totalCount: count || 0,
    page,
    pageSize,
  };
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus,
): Promise<Lead> {
  const supabase = await createServerSupabaseClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Validate status
  const validStatuses: LeadStatus[] = ["new", "contacted", "booked", "closed"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  // Update the lead
  const { data: updatedLead, error } = await (supabase as any)
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead status: ${error.message}`);
  }

  if (!updatedLead) {
    throw new Error("Lead not found");
  }

  return updatedLead;
}
