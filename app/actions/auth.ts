"use server";

import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { isValidCnpj, sanitizeCnpj } from "@/lib/validations/cnpj";

// ── LOGIN ────────────────────────────────────────────────────

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const next = (formData.get("next") as string | null) ?? "/dashboard";

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Não revelar se o e-mail existe ou não
    return { error: "E-mail ou senha incorretos." };
  }

  // Verifica status_assinatura antes de redirecionar
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const admin = createAdminClient();
    const { data: cliente } = await admin
      .from("clientes_academias")
      .select("status_assinatura")
      .eq("user_id", user.id)
      .single();

    // status != ativa ainda permite acesso — o banner no dashboard avisa o usuário
    // Apenas 'cancelada' bloqueia (futuro: redirecionar para página de reativação)
    if (cliente?.status_assinatura === "cancelada") {
      await supabase.auth.signOut();
      return { error: "Sua assinatura está cancelada. Entre em contato para reativar." };
    }
  }

  // redirect() lança internamente — deve ficar fora de try/catch
  redirect(next.startsWith("/") ? next : "/dashboard");
}

// ── CADASTRO ─────────────────────────────────────────────────

export interface CadastroInput {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  email: string;
  senha: string;
  plano: "basico" | "pro";
}

export interface CadastroState {
  error?: string;
  fieldErrors?: Partial<Record<keyof CadastroInput, string>>;
  /** userId retornado em caso de sucesso para a Issue #33 (Stripe Checkout) */
  userId?: string;
}

export async function cadastroAction(input: CadastroInput): Promise<CadastroState> {
  const { razaoSocial, cnpj, endereco, email, senha, plano } = input;

  // ── Validações no servidor ────────────────────────────────
  const fieldErrors: CadastroState["fieldErrors"] = {};

  if (!razaoSocial.trim() || razaoSocial.trim().length < 3) {
    fieldErrors.razaoSocial = "Razão social deve ter pelo menos 3 caracteres.";
  }

  const cnpjDigits = sanitizeCnpj(cnpj);
  if (!isValidCnpj(cnpjDigits)) {
    fieldErrors.cnpj = "CNPJ inválido. Verifique os dígitos.";
  }

  if (!endereco.trim()) {
    fieldErrors.endereco = "Endereço é obrigatório.";
  }

  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "E-mail inválido.";
  }

  if (senha.length < 8) {
    fieldErrors.senha = "Senha deve ter pelo menos 8 caracteres.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const admin = createAdminClient();

  // ── Verifica unicidade do CNPJ ────────────────────────────
  const { data: cnpjExists } = await admin
    .from("clientes_academias")
    .select("id")
    .eq("cnpj", cnpjDigits)
    .maybeSingle();

  if (cnpjExists) {
    return { fieldErrors: { cnpj: "Este CNPJ já está cadastrado." } };
  }

  // ── Cria usuário no Supabase Auth ─────────────────────────
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: senha,
    email_confirm: true, // confirma automaticamente (sem e-mail de verificação por ora)
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered")) {
      return { fieldErrors: { email: "Este e-mail já possui uma conta." } };
    }
    return { error: "Erro ao criar conta. Tente novamente." };
  }

  const userId = authData.user.id;

  // ── Insere registro em clientes_academias ─────────────────
  const { error: insertError } = await admin.from("clientes_academias").insert({
    razao_social: razaoSocial.trim(),
    cnpj: cnpjDigits,
    endereco_autorizado: endereco.trim(),
    status_assinatura: "trial",
    user_id: userId,
    // token_acesso gerado automaticamente pelo DEFAULT do banco
    // plano armazenado no Stripe metadata (Issue #33)
  });

  if (insertError) {
    // Rollback manual: remove o usuário criado para evitar inconsistência
    await admin.auth.admin.deleteUser(userId);
    return { error: "Erro ao salvar dados da academia. Tente novamente." };
  }

  // Retorna userId para a Issue #33 (criação do Stripe Checkout)
  return { userId };
}

// ── LOGOUT ───────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
