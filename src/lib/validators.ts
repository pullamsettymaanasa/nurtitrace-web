export function isValidEmail(email: string): boolean {
  return /^[\w.-]+@[\w.-]+\.\w+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export function isValidFullname(name: string): boolean {
  return /^[a-zA-Z\s]{3,}$/.test(name);
}

export interface PasswordCheck {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
}

export function checkPassword(password: string): PasswordCheck {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };
}

export function isValidPassword(password: string): boolean {
  const check = checkPassword(password);
  return Object.values(check).every(Boolean);
}
