"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { StepIndicator } from "@/components/auth/step-indicator";
import { CadastroStep1 } from "@/components/auth/cadastro-step1";
import { CadastroStep2 } from "@/components/auth/cadastro-step2";
import { CadastroStep3 } from "@/components/auth/cadastro-step3";
import { cadastroAction } from "@/app/actions/auth";
import { createCheckoutSession } from "@/app/actions/stripe";

const STEPS = ["Academia", "Acesso", "Plano"] as const;
const TOTAL_STEPS = STEPS.length;

type PlanoId = "basico" | "pro";

interface FormData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  email: string;
  senha: string;
}

function isPlanoId(value: string | null): value is PlanoId {
  return value === "basico" || value === "pro";
}

function CadastroContent() {
  const searchParams = useSearchParams();
  const planoParam = searchParams.get("plano");
  const planoInicial: PlanoId = isPlanoId(planoParam) ? planoParam : "basico";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const handleStep1Next = (data: Pick<FormData, "razaoSocial" | "cnpj" | "endereco">) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Next = (data: Pick<FormData, "email" | "senha">) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleFinalSubmit = async (plano: PlanoId) => {
    const result = await cadastroAction({
      razaoSocial: formData.razaoSocial!,
      cnpj: formData.cnpj!,
      endereco: formData.endereco!,
      email: formData.email!,
      senha: formData.senha!,
      plano,
    });
    if (result.error) throw new Error(result.error);
    if (result.fieldErrors) throw new Error("Verifique os dados e tente novamente.");
    const checkout = await createCheckoutSession(result.userId!, plano);
    if (checkout.error || !checkout.url) throw new Error(checkout.error ?? "Erro ao iniciar pagamento.");
    window.location.href = checkout.url;
  };

  const STEP_HEADINGS: Record<number, { title: string; sub: string }> = {
    1: { title: "Dados da Academia", sub: "Informe os dados da sua empresa" },
    2: { title: "Dados de Acesso", sub: "Crie seu e-mail e senha" },
    3: { title: "Escolha seu Plano", sub: "Revise e confirme antes de criar a conta" },
  };

  const { title, sub } = STEP_HEADINGS[step];

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316] opacity-[0.05] blur-[120px]"
      />

      {/* Diagonal accent */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-px w-1/2 origin-right -rotate-[10deg] bg-gradient-to-l from-[#F97316]/15 to-transparent" />
      </div>

      <div className="hero-fade-up relative z-10 w-full max-w-sm" style={{ animationDelay: "0.05s" }}>
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-75"
        >
          <Music2 size={22} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
        </Link>

        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={[...STEPS]} />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-[#222222] bg-[#0F0F0F] shadow-[0_0_60px_rgba(249,115,22,0.06)]">
          {/* Orange top border */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#F97316]/40 via-[#F97316] to-[#F97316]/40" />

          <div className="p-7">
            <div className="mb-7">
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                {title}
              </h1>
              <p className="mt-1 text-sm text-[#555555]">{sub}</p>
            </div>

            {step === 1 && (
              <CadastroStep1
                defaultValues={{ razaoSocial: formData.razaoSocial, cnpj: formData.cnpj, endereco: formData.endereco }}
                onNext={handleStep1Next}
              />
            )}

            {step === 2 && (
              <CadastroStep2
                defaultValues={{ email: formData.email, senha: formData.senha }}
                onNext={handleStep2Next}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <CadastroStep3
                planoInicial={planoInicial}
                onBack={() => setStep(2)}
                onSubmit={handleFinalSubmit}
              />
            )}
          </div>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-xs text-[#333333]">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#F97316] underline underline-offset-4 transition-colors hover:text-[#EA6E0A]"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroContent />
    </Suspense>
  );
}
