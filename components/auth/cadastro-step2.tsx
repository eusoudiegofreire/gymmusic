"use client";

import { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Step2Data {
  email: string;
  senha: string;
}

interface CadastroStep2Props {
  defaultValues?: Partial<Step2Data>;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

export function CadastroStep2({ defaultValues = {}, onNext, onBack }: CadastroStep2Props) {
  const [email, setEmail] = useState(defaultValues.email ?? "");
  const [senha, setSenha] = useState(defaultValues.senha ?? "");
  const [confirmar, setConfirmar] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string; confirmar?: string }>({});

  const emailId = useId();
  const senhaId = useId();
  const confirmarId = useId();

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim()) {
      next.email = "Campo obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "E-mail inválido";
    }
    if (senha.length < 8) {
      next.senha = "Mínimo 8 caracteres";
    }
    if (confirmar !== senha) {
      next.confirmar = "As senhas não coincidem";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext({ email: email.trim(), senha });
  };

  const labelClass = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]";
  const baseInput =
    "w-full rounded-md border bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-all duration-200 focus:ring-1";
  const fieldClass = (hasError: boolean) =>
    `${baseInput} ${hasError ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30" : "border-[#2A2A2A] focus:border-[#F97316] focus:ring-[#F97316]/30"}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* E-mail */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={emailId} className={labelClass}>
          E-mail
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="sua@academia.com.br"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
          className={fieldClass(!!errors.email)}
        />
        {errors.email && (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Senha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={senhaId} className={labelClass}>
          Senha
        </label>
        <div className="relative">
          <input
            id={senhaId}
            type={showSenha ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setErrors((p) => ({ ...p, senha: undefined })); }}
            className={`${fieldClass(!!errors.senha)} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowSenha((v) => !v)}
            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] transition-colors hover:text-[#F97316]"
          >
            {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.senha ? (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.senha}</p>
        ) : (
          <p className="text-[11px] text-[#444444]">Use letras, números e símbolos para uma senha forte</p>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={confirmarId} className={labelClass}>
          Confirmar senha
        </label>
        <div className="relative">
          <input
            id={confirmarId}
            type={showConfirmar ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={confirmar}
            onChange={(e) => { setConfirmar(e.target.value); setErrors((p) => ({ ...p, confirmar: undefined })); }}
            className={`${fieldClass(!!errors.confirmar)} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmar((v) => !v)}
            aria-label={showConfirmar ? "Ocultar confirmação" : "Mostrar confirmação"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] transition-colors hover:text-[#F97316]"
          >
            {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmar && (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.confirmar}</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-1 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[48px] flex-1 items-center justify-center rounded-md border border-[#2A2A2A] text-sm font-semibold text-[#666666] transition-all duration-200 hover:border-[#444444] hover:text-white"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex h-[48px] flex-[2] items-center justify-center rounded-md bg-[#F97316] text-sm font-bold text-white transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_24px_rgba(249,115,22,0.35)] active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
