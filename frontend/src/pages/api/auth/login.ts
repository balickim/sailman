import bcrypt from 'bcryptjs';
import getT from 'next-translate/getT';
import Cookies from 'cookies';

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
    const { token, refreshToken, findUser, accessTokenData } = await service(userData, req);
    const cookies = new Cookies(req, res);

    // TODO expiration timestamp in db, cron job deleting old refresh tokens
    await prisma.refreshToken.create({
      data: {
        user_id: findUser.id,
        token: refreshToken,
      },
    });

    ['id', 'hashed_password'].forEach(e => delete findUser[e]);

    cookies.set('refreshToken', token.token, {
      expires: new Date(Date.now() + token.expiresIn),
      secure: false, // set to true if your using https
      sameSite: 'Lax',
      httpOnly: true,
    });

    res.status(200).json({ user: findUser, accessToken: accessTokenData.token, message: 'login' });
  } catch (error) {
    console.error('LOGIN FAILED error:');
    console.error(error);
    errorHandler(error, res);
  }
}

async function service(
  userData: LoginDto,
  req,
): Promise<{
  token: { token: string; expiresIn: number };
  refreshToken;
  findUser;
  accessTokenData;
}> {
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
  const t = await getT(
    req.query.__nextLocale ?? req.headers['accept-language'].substring(0, 2),
    'common',
  ); // TODO fix this

  if (!findUser)
    throw {
      status: 409,
      errors: [t('errorCode.api_email_not_found')],
      code: 'VALIDATION_ERROR',
    };

  const isPasswordMatching: boolean = await bcrypt.compare(
    userData.password,
    findUser.hashed_password,
  );

  if (!isPasswordMatching) {
    throw {
      status: 409,
      errors: [t('errorCode.api_incorrect_password')],
      code: 'VALIDATION_ERROR',
    };
  }

  const { token, refreshToken } = await signRefreshToken(findUser);
  const accessTokenData = signToken({ id: findUser.id, role: findUser.role });

  return { token, refreshToken, findUser, accessTokenData };
}
