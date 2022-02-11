import bcrypt from 'bcryptjs';

import { prisma, apiHandler, errorHandler } from '@helpers/auth';
import { validate, loginSchema } from '@http/auth.validators';
import { signToken, signRefreshToken } from '@helpers/auth/jwt';
import { LoginDto } from '@http/auth.dtos';

export default validate(
  apiHandler({
    post: controller,
  }),
  loginSchema,
);

async function controller(req, res) {
  try {
    const userData: LoginDto = req.body;
    const { cookie, refreshToken, findUser, accessTokenData } = await service(userData);

    // TODO expiration timestamp in db, cron job deleting old refresh tokens
    await prisma.refreshToken.create({
      data: {
        user_id: findUser.id,
        token: refreshToken,
      },
    });

    ['id', 'hashed_password'].forEach(e => delete findUser[e]);

    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ user: findUser, accessToken: accessTokenData.token, message: 'login' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function service(
  userData: LoginDto,
): Promise<{ cookie: string; refreshToken; findUser; accessTokenData }> {
  const findUser = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      hashed_password: true,
    },
    where: {
      email: userData.email,
    },
  });

  if (!findUser)
    throw {
      status: 409,
      errors: [`Email ${userData.email} was not found`],
      code: 'VALIDATION_ERROR',
    };

  const isPasswordMatching: boolean = await bcrypt.compare(
    userData.password,
    findUser.hashed_password,
  );
  delete findUser.hashed_password;

  if (!isPasswordMatching) {
    throw {
      status: 409,
      errors: ['Incorrect password'],
      code: 'VALIDATION_ERROR',
    };
  }

  const { cookie, refreshToken } = await signRefreshToken(findUser);
  const accessTokenData = signToken({ id: findUser.id, role: findUser.role });

  return { cookie, refreshToken, findUser, accessTokenData };
}
