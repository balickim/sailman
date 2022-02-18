import { apiHandler, errorHandler } from '@helpers/auth';
import { signToken, verifyRefreshToken } from '@helpers/auth/jwt';

export default apiHandler({
  get: controller,
});

async function controller(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw { status: 400, message: 'Unauthorized' };

    const user = await verifyRefreshToken(refreshToken);
    const accessToken = await signToken({ id: user.id, role: user.role });

    return res.json({ accessToken });
  } catch (error) {
    await errorHandler(error, req, res);
  }
}
