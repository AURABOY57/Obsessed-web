"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminSessionToken, setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/auth";

const LoginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida."),
});

export type AuthResponse = {
  success: boolean;
  message?: string;
};

export async function loginAdminAction(
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> {
  try {
    const rawPassword = formData.get("password");
    const result = LoginSchema.safeParse({ password: rawPassword });

    if (!result.success) {
      return {
        success: false,
        message: "Por favor, ingresa una contraseña válida.",
      };
    }

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin";

    if (result.data.password !== expectedPassword) {
      return {
        success: false,
        message: "Contraseña incorrecta.",
      };
    }

    // Generar y establecer cookie de sesión segura
    const token = await createAdminSessionToken();
    await setAdminSessionCookie(token);

    return {
      success: true,
      message: "Sesión iniciada correctamente.",
    };
  } catch (error) {
    console.error("[LOGIN_ADMIN_ERROR]:", error);
    return {
      success: false,
      message: "Error al procesar el inicio de sesión.",
    };
  }
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
