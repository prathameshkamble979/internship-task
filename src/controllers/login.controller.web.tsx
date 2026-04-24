export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  redirectTo?: string;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required";

  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    return "Enter a valid 10-digit phone number";
  }
  return null;
}

export function validateIdentifier(identifier: string): string | null {
  if (!identifier.trim()) return "Identifier (Name, Email, or Phone) is required";
  return null;
}

export function validateLoginForm(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const identifierError = validateIdentifier(data.identifier);
  const passwordError = validatePassword(data.password);
  if (identifierError) errors.identifier = identifierError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateRegisterForm(
  data: RegisterFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Full name is required";
  const emailError = validateEmail(data.email);
  const phoneError = validatePhone(data.phone);
  const passwordError = validatePassword(data.password);

  if (emailError) errors.email = emailError;
  if (phoneError) errors.phone = phoneError;
  if (passwordError) errors.password = passwordError;
  if (!data.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
}

// Import storage helpers
import { getUsers, saveUsers, setActiveSession } from "./storage.controller";

export async function handleLogin(data: LoginFormData): Promise<AuthResult> {
  const errors = validateLoginForm(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: Object.values(errors)[0] };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getUsers();
  const user = Object.values(users).find(
    (u) =>
      u.email.toLowerCase() === data.identifier.toLowerCase() ||
      u.phone === data.identifier.replace(/\D/g, '').slice(-10) ||
      u.phone === data.identifier.replace(/[\s-]/g, '') ||
      u.name.toLowerCase() === data.identifier.toLowerCase()
  );

  if (!user || user.password !== data.password) {
    return { success: false, message: "Invalid credentials. Please check your information." };
  }

  // Save the logged in session
  setActiveSession(user);

  return {
    success: true,
    message: "Login successful!",
    redirectTo: "/dashboard",
  };
}

export async function handleRegister(
  data: RegisterFormData,
): Promise<AuthResult> {
  const errors = validateRegisterForm(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: Object.values(errors)[0] };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getUsers();

  // Check if either Email or Phone already exists in the database
  const emailExists = users[data.email];
  const phoneExists = Object.values(users).find(u => u.phone === data.phone);

  if (emailExists) {
    return { success: false, message: "This email address is already registered. Please login." };
  }
  
  if (phoneExists) {
    return { success: false, message: "This mobile number is already registered. Please login." };
  }

  // Save to localeStorage database
  users[data.email] = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password, // Storing password raw for prototype purposes only
  };
  saveUsers(users);

  return {
    success: true,
    message: "Account created successfully! You can now log in.",
    redirectTo: "/dashboard",
  };
}
