"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-[#F97316] text-sm font-bold text-white transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_24px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Entrando…
        </>
      ) : (
        "Entrar"
      )}
    </button>
  );
}

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  const emailId = useId();
  const passId = useId();

  const inputClass =
    "w-full rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-all duration-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Hidden field para redirect pós-login */}
      {next && <input type="hidden" name="next" value={next} />}

      {/* Erro da Server Action */}
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-[#EF4444]/20 bg-[#EF4444]/10 px-3.5 py-3"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#EF4444]" aria-hidden="true" />
          <p className="text-sm text-[#FCA5A5]">{state.error}</p>
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={emailId}
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]"
        >
          E-mail
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="sua@academia.com.br"
          required
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={passId}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]"
          >
            Senha
          </label>
          <Link
            href="/esqueci-senha"
            className="text-[11px] text-[#555555] underline underline-offset-4 transition-colors hover:text-[#F97316]"
          >
            Esqueci minha senha
          </Link>
        </div>

        <div className="relative">
          <input
            id={passId}
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] transition-colors hover:text-[#F97316]"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <SubmitButton />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1E1E1E]" />
        <span className="text-[11px] text-[#333333]">ou</span>
        <div className="h-px flex-1 bg-[#1E1E1E]" />
      </div>

      {/* Sign-up link */}
      <p className="text-center text-sm text-[#555555]">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-[#F97316] underline underline-offset-4 transition-colors hover:text-[#EA6E0A]"
        >
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
