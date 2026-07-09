import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/api/providers/mock";
import { supabaseProvider } from "@/lib/api/providers/supabase";
import { BACKEND_PROVIDER } from "@/lib/api/config";
import type { EnquiryInput } from "@/lib/api/types";

function formatReference(id: string) {
  return `PMC-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  let body: EnquiryInput;

  try {
    body = (await request.json()) as EnquiryInput;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }

  if (body.website?.trim()) {
    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        reference: "PMC-ACCEPTED",
        name: body.name,
        company: body.company,
        email: body.email,
        surveyType: body.surveyType,
        message: body.message,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });
  }

  const { name, email, message, surveyType } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim() || !surveyType?.trim()) {
    return NextResponse.json(
      { success: false, error: "Please complete all required fields." },
      { status: 400 }
    );
  }

  const provider = BACKEND_PROVIDER === "supabase" ? supabaseProvider : mockProvider;
  const result = await provider.submitEnquiry(body);

  if (!result.success || !result.data) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...result.data,
      reference: formatReference(result.data.id),
    },
  });
}
