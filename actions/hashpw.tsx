const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const condition = await bcrypt.compare(password, hashedPassword);
  return condition
}
