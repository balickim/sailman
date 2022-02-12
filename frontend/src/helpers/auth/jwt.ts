import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';

import { prisma } from '.';

export function signToken(
  dataStoredInToken: object,
  expiration: number = 10 * 60,
  secret: string = process.env.JWT_ACCESS_TOKEN_SECRET,
) {
  const expiresIn: number = expiration;

  return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
}

export async function signRefreshToken(
  user: { id: string; email: string; username: string; role: string; hashed_password: string },
  expiration: number = 30 * 24 * 60 * 60,
): Promise<{ cookie: string; refreshToken: any }> {
  const dataStoredInToken = { id: user.id };
  const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET;
  const expiresIn: number = expiration;
  const refreshToken = jwt.sign(dataStoredInToken, secret, { expiresIn });

  const tokenData = { token: refreshToken, expiresIn };
  return { cookie: createCookie(tokenData), refreshToken };
}

function createCookie(tokenData: { token: string; expiresIn: number }): string {
  return `refreshToken=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
}

export function verifyRefreshToken(refreshToken): Promise<User> {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) reject({ status: 400, message: 'Unauthorized' });
      const tokenDb = await prisma.refreshToken.findMany({
        where: {
          token: refreshToken,
        },
      });

      if (tokenDb.length <= 0) reject({ status: 400, message: 'Unauthorized' });
      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      for (let i = 0; i < tokenDb.length; i++) {
        if (refreshToken === tokenDb[i].token && user.id === tokenDb[i].user_id)
          return resolve(user);
      }
      reject(err);
    });
  });
}
