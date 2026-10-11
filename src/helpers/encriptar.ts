import bcrypt from "bcryptjs";

export const encriptarPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync();
  const passwordEncriptada = bcrypt.hashSync(password, salt);

  return passwordEncriptada;
};
