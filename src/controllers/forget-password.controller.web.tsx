import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ytjt17j";
const TEMPLATE_ID = "template_o9zuo5c";
const PUBLIC_KEY = "z0ySDWBdSIT8_i47V";

export interface ForgotPasswordData {
  identifier: string;
  method: "email" | "sms";
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResult {
  success: boolean;
  message: string;
}

import { getOTPs, saveOTPs, getUsers, saveUsers } from "./storage.controller";

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required";
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return "Enter a valid 10-digit phone number";
  return null;
}

export function validateOTP(otp: string): string | null {
  if (!otp.trim()) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return null;
}

export function validateNewPassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

// ── Handlers ─────────────────────────────────────────────────

export async function handleForgotPassword(
  data: ForgotPasswordData,
): Promise<ForgotPasswordResult> {
  const isEmail = data.identifier.includes('@');
  
  if (isEmail) {
    const emailError = validateEmail(data.identifier);
    if (emailError) return { success: false, message: emailError };
  } else {
    const phoneError = validatePhone(data.identifier);
    if (phoneError) return { success: false, message: phoneError };
  }

  const users = getUsers();
  const user = Object.values(users).find(u => u.email === data.identifier || u.phone === data.identifier.replace(/\D/g, '').slice(-10) || u.phone === data.identifier.replace(/[\s-]/g, ''));
  
  if (!user) {
    return { success: false, message: "No account found with this information." };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP in localStorage DB
  const otps = getOTPs();
  otps[data.identifier] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  saveOTPs(otps);

  if (data.method === "sms") {
    try {
      const accountSid = import.meta.env.VITE_TWILIO_SID;
      const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
      const twilioNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
      
      const formData = new URLSearchParams();
      // Ensure number has country code for Twilio
      const formattedPhone = user.phone.startsWith("+") ? user.phone : `+91${user.phone}`;
      formData.append("To", formattedPhone);
      formData.append("From", twilioNumber);
      formData.append("Body", `Freelance.dev OTP code: ${otp}`);

      const response = await fetch(`/api/twilio/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
        },
        body: formData.toString()
      });
      
      const resData = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: "OTP sent via Twilio SMS! Check your phone.",
        };
      } else {
        console.error("Twilio Error:", resData);
        setTimeout(() => {
          alert(`[Twilio Error - Simulating]\n[To: ${user.phone}]\nOTP: ${otp}\nReason: ${resData.message}`);
        }, 500);
        return {
          success: true,
          message: "Twilio error. OTP shown via popup.",
        };
      }
    } catch (error) {
      console.error("Twilio Network Error:", error);
      setTimeout(() => {
        alert(`[Network Error - Simulating]\n[To: ${user.phone}]\nOTP: ${otp}`);
      }, 500);
      return {
        success: true,
        message: "Network error. OTP shown via popup.",
      };
    }
  } else {
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: user.email,
          otp: otp,
        },
        PUBLIC_KEY,
      );

      return {
        success: true,
        message: "OTP sent! Check your email inbox.",
      };
    } catch (error) {
      console.error("EmailJS error:", error);
      return {
        success: false,
        message: "Failed to send OTP to email. Please try again.",
      };
    }
  }
}

export async function handleVerifyOTP(
  data: VerifyOTPData,
): Promise<ForgotPasswordResult> {
  const otpError = validateOTP(data.otp);
  if (otpError) return { success: false, message: otpError };

  const otps = getOTPs();
  const storedOTP = otps[data.email];

  if (!storedOTP || Date.now() > storedOTP.expiresAt) {
    return {
      success: false,
      message: "OTP expired. Please request a new one.",
    };
  }

  if (storedOTP.code !== data.otp) {
    return { success: false, message: "Incorrect OTP. Please try again." };
  }

  return { success: true, message: "OTP verified successfully." };
}

export async function handleResetPassword(
  data: ResetPasswordData,
): Promise<ForgotPasswordResult> {
  const passwordError = validateNewPassword(data.newPassword);
  if (passwordError) return { success: false, message: passwordError };

  if (data.newPassword !== data.confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const otps = getOTPs();
  const storedOTP = otps[data.email];
  if (!storedOTP || storedOTP.code !== data.otp) {
    return { success: false, message: "Invalid session. Please start again." };
  }

  // Update password in localStorage db
  const users = getUsers();
  // Find user by email or phone (since identifier could be either)
  let foundUserKey = data.email;
  if (!users[foundUserKey]) {
    // Try to find by phone
    foundUserKey = Object.keys(users).find(k => users[k].phone === data.email) || "";
  }
  
  if (foundUserKey && users[foundUserKey]) {
    users[foundUserKey].password = data.newPassword;
    saveUsers(users);
  }

  // Delete used OTP
  delete otps[data.email];
  saveOTPs(otps);

  return {
    success: true,
    message: "Password reset successful! Please sign in.",
  };
}
