import Jwt, { type SignOptions } from "jsonwebtoken";

export const generarJWT = (uid: string): string => {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("JWT-secret no esta definida");
  }

  const payload = { uid };
  const options: SignOptions = {
    expiresIn: "2h",
  };
  return Jwt.sign(payload, secret, options);
};
