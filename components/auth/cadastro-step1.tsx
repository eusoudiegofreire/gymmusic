"use client";

import { useState, useId } from "react";

interface Step1Data {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
}

interface CadastroStep1Props {
  defaultValues?: Partial<Step1Data>;
  onNext: (data: Step1Data) => void;
}

function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function CadastroStep1({ defaultValues = {}, onNext }: CadastroStep1Props) {
  const [razaoSocial, setRazaoSocial] = useState(defaultValues.razaoSocial ?? "");
  const [cnpj, setCnpj] = useState(defaultValues.cnpj ?? "");
  const [endereco, setEndereco] = useState(defaultValues.endereco ?? "");
  const [errors, setErrors] = useState<Partial<Step1Data>>({});

  const razaoSocialId = useId();
  const cnpjId = useId();
  const enderecoId = useId();

  const validate = (): boolean => {
    const next: Partial<Step1Data> = {};
    if (!razaoSocial.trim()) next.razaoSocial = "Campo obrigatório";
    if (cnpj.replace(/\D/g, "").length !== 14) next.cnpj = "CNPJ inválido";
    if (!endereco.trim()) next.endereco = "Campo obrigatório";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext({ razaoSocial: razaoSocial.trim(), cnpj, endereco: endereco.trim() });
  };

  const inputClass =
    "w-full rounded-md border bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-all duration-200 focus:ring-1";

  const fieldClass = (hasError: boolean) =>
    `${inputClass} ${hasError ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30" : "border-[#2A2A2A] focus:border-[#F97316] focus:ring-[#F97316]/30"}`;

  const labelClass = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Razão Social */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={razaoSocialId} className={labelClass}>
          Razão Social
        </label>
        <input
          id={razaoSocialId}
          type="text"
          autoComplete="organization"
          placeholder="Academia Força Total Ltda."
          value={razaoSocial}
          onChange={(e) => { setRazaoSocial(e.target.value); setErrors((p) => ({ ...p, razaoSocial: undefined })); }}
          className={fieldClass(!!errors.razaoSocial)}
        />
        {errors.razaoSocial && (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.razaoSocial}</p>
        )}
      </div>

      {/* CNPJ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={cnpjId} className={labelClass}>
          CNPJ
        </label>
        <input
          id={cnpjId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => { setCnpj(maskCnpj(e.target.value)); setErrors((p) => ({ ...p, cnpj: undefined })); }}
          className={fieldClass(!!errors.cnpj)}
        />
        {errors.cnpj && (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.cnpj}</p>
        )}
      </div>

      {/* Endereço */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={enderecoId} className={labelClass}>
          Endereço completo
        </label>
        <input
          id={enderecoId}
          type="text"
          autoComplete="street-address"
          placeholder="Rua das Academias, 123 — São Paulo, SP"
          value={endereco}
          onChange={(e) => { setEndereco(e.target.value); setErrors((p) => ({ ...p, endereco: undefined })); }}
          className={fieldClass(!!errors.endereco)}
        />
        {errors.endereco && (
          <p className="text-[11px] text-[#EF4444]" role="alert">{errors.endereco}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-1 flex min-h-[48px] w-full items-center justify-center rounded-md bg-[#F97316] text-sm font-bold text-white transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_24px_rgba(249,115,22,0.35)] active:scale-[0.98]"
      >
        Continuar
      </button>
    </form>
  );
}
