import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { prisma, apiHandler, errorHandler } from '@helpers/auth';
import { validate, resetPasswordSchema } from '@helpers/auth/validators';

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
        process.env.JWT_RESET_PASSWORD,
        async function (err, decoded) {
          if (err) {
            console.log('%creset-password.ts line:24 err', 'color: #007acc;', err);
            throw { status: 401, message: 'Link expired' };
          }

          console.log('%creset-password.ts line:27 decoded', 'color: #007acc;', decoded);

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
    errorHandler(error, res);
  }
}
