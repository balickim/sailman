import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { prisma, apiHandler, errorHandler } from '@helpers/auth';
import { validate, signupSchema } from '@http/auth.validators';

export default validate(
  apiHandler({
    post: signup,
  }),
  signupSchema,
);

async function signup(req, res) {
  try {
    const token = req.body.token;
    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(403).json({
            message: 'Expired link. Signup again',
          });
        }

        const { username, email, password } = decoded;
        const hashed_password = await bcrypt.hash(password, 10);

        try {
          await prisma.user.create({
            data: {
              username,
              email,
              hashed_password,
            },
          });

          return res.status(201).json({
            message: 'Signup success! Please sign in',
          });
        } catch (err) {
          await errorHandler(err, req, res);
        }
      });
    }
  } catch (err) {
    await errorHandler(err, req, res);
  }
}
