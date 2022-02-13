import jwt from 'jsonwebtoken';

import { prisma, apiHandler, errorHandler } from '@helpers/auth';

export default apiHandler({
  get: controller,
});

async function controller(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw { status: 401, message: 'Unauthorized' };
    }

    await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET),
      async (err, decoded) => {
        if (err) throw { status: 401, message: 'Unauthorized' };
      };

    const tokenDb = prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (tokenDb) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
        },
      });
    }

    res.setHeader(
      'Set-Cookie',
      'refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );

    res.status(200).json({
      message: 'Sign out success.',
    });
  } catch (error) {
    await errorHandler(error, req, res);
  }
}
