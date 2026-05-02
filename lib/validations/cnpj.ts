/**
 * Valida CNPJ com verificação dos dois dígitos verificadores.
 * Aceita strings com ou sem pontuação (14 dígitos no total).
 */
export function isValidCnpj(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");

  if (digits.length !== 14) return false;

  // Rejeita sequências repetidas (ex: "00000000000000")
  if (/^(\d)\1+$/.test(digits)) return false;

  return checkDigit(digits, 12) && checkDigit(digits, 13);
}

function checkDigit(digits: string, position: number): boolean {
  const weights =
    position === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const sum = weights.reduce(
    (acc, weight, i) => acc + Number(digits[i]) * weight,
    0
  );

  const remainder = sum % 11;
  const expected = remainder < 2 ? 0 : 11 - remainder;

  return Number(digits[position]) === expected;
}

/** Remove pontuação e retorna somente os 14 dígitos. */
export function sanitizeCnpj(raw: string): string {
  return raw.replace(/\D/g, "");
}
