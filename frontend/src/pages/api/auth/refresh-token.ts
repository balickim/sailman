import { apiHandler, errorHandler } from '@helpers/api';
import { signToken, verifyRefreshToken } from '@helpers/api/jwt';

export default apiHandler({
  post: controller,
});

async function controller(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken || '';
    if (!refreshToken) throw { status: 400, message: 'Unauthorized' };
    const user = await verifyRefreshToken(refreshToken);

    const accessToken = await signToken({ id: user.id, role: user.role });
    return res.json({ accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
}
