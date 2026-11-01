import Jwt, { type SignOptions } from "jsonwebtoken";

export const generarJWT = (uid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = uid;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      reject(new Error("La variable JWT_SECRET no está definida."));
      return;
    }

    Jwt.sign(
      { id: uid },
      jwtSecret,
      {
        expiresIn: "2h",
      },
      (error, token) => {
        if (error || !token) {
          reject(new Error("No se logró elaborar el JWT"));
          return;
        }
        resolve(token);
      },
    );
  });
};
