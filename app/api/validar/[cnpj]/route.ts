import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isValidCnpj, sanitizeCnpj } from "@/lib/validations/cnpj";

// ── Rate limiter em memória ────────────────────────────────────
// 30 requisições por janela de 60 s por IP.
// Adequado para instância única; em multi-instância use Redis/KV.
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// ── Handler ────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429 }
    );
  }

  const { cnpj: rawCnpj } = await params;
  const cnpjDigits = sanitizeCnpj(decodeURIComponent(rawCnpj));

  if (!isValidCnpj(cnpjDigits)) {
    return NextResponse.json(
      { error: "CNPJ inválido. Verifique os dígitos informados." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data } = await admin
    .from("clientes_academias")
    .select("razao_social, cnpj, endereco_autorizado, status_assinatura, data_validade")
    .eq("cnpj", cnpjDigits)
    .single();

  if (!data) {
    return NextResponse.json(
      { error: "CNPJ não encontrado no sistema." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    razao_social: data.razao_social,
    cnpj: data.cnpj,
    endereco_autorizado: data.endereco_autorizado,
    status_assinatura: data.status_assinatura,
    data_validade: data.data_validade,
  });
}
