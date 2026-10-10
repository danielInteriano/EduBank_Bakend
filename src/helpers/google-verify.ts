import { OAuth2Client } from "google-auth-library";
import type { TokenPayload } from "google-auth-library";

const googleId = process.env.GOOGLE_CLIENT_ID;

if (!googleId) {
  throw new Error("GOOGLE_CLIENT_ID no esta definida");
}

const client = new OAuth2Client(googleId);

export const googleVerify = async (token: string): Promise<TokenPayload> => {
  if (!token) {
    throw new Error("El token de Google es requerido");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleId,
  });

  const payload: TokenPayload | undefined = ticket.getPayload();

  if (!payload) {
    throw new Error("No se pudo obtener el perfil de Google");
  }

  return payload;
};
