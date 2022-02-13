import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { prisma, apiHandler, errorHandler } from '@helpers/auth';
import { validate, resetPasswordSchema } from '@http/auth.validators';

export default validate(
  apiHandler({
    put: controller,
  }),
  resetPasswordSchema,
);

async function controller(req, res) {
  try {
    const { resetPasswordToken, newPassword } = req.body;

    if (resetPasswordToken) {
      return jwt.verify(
        resetPasswordToken,
        process.env.JWT_RESET_PASSWORD_SECRET,
        async function (err, decoded) {
          if (err) {
            throw { status: 401, message: 'Link expired' };
          }

          const user = await prisma.user.findFirst({
            where: { id: decoded.id },
          });

          if (!user) {
            throw { status: 401, message: 'Something went wrong. Try again later.' };
          }

          const hashed_password = await bcrypt.hash(newPassword, 10);

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              reset_password_link: null,
              hashed_password: hashed_password,
            },
          });

          return res.json({
            message: 'Password changed successfully.',
          });
        },
      );
    }
  } catch (error) {
    await errorHandler(error, req, res);
  }
}
