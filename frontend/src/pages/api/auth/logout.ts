import jwt from 'jsonwebtoken';

import { prisma, apiHandler, errorHandler } from '@helpers/api';

export default apiHandler({
  get: controller,
});

async function controller(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken || '';

    if (!refreshToken) {
      return res.status(401).send('Invalid request. Token not found.');
    }

    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET),
      async (err, decoded) => {
        if (err) throw { status: 401, message: 'Unauthorized' };
      };

    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    res.clearCookie('refreshToken');

    res.json({
      message: 'Sign out success.',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
