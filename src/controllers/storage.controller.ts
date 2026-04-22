export interface User {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface OTPRecord {
  code: string;
  expiresAt: number;
}

// Helper to get users from localStorage
export function getUsers(): Record<string, User> {
  const usersStr = localStorage.getItem("app_users");
  if (!usersStr) return {};
  try {
    return JSON.parse(usersStr);
  } catch {
    return {};
  }
}

// Helper to save users
export function saveUsers(users: Record<string, User>) {
  localStorage.setItem("app_users", JSON.stringify(users));
}

// Get the currently logged-in user
export function getActiveUser(): User | null {
  const activeStr = localStorage.getItem("active_session");
  if (!activeStr) return null;
  try {
    return JSON.parse(activeStr);
  } catch {
    return null;
  }
}

// Set active session
export function setActiveSession(user: User | null) {
  if (user) {
    localStorage.setItem("active_session", JSON.stringify(user));
  } else {
    localStorage.removeItem("active_session");
  }
}

// Helper to get OTPs
export function getOTPs(): Record<string, OTPRecord> {
  const otpStr = localStorage.getItem("app_otps");
  if (!otpStr) return {};
  try {
    return JSON.parse(otpStr);
  } catch {
    return {};
  }
}

// Helper to save OTPs
export function saveOTPs(otps: Record<string, OTPRecord>) {
  localStorage.setItem("app_otps", JSON.stringify(otps));
}
