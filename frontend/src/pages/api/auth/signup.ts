import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { prisma, apiHandler, errorHandler } from '@helpers/api';
import { validate, signupSchema } from '@helpers/api/validators';

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
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
        if (err) {
          return res.status(403).json({
            message: 'Expired link. Signup again',
          });
        }

        const { username, email, password } = decoded;
        const hashed_password = await bcrypt.hash(password, 10);

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
      });
    }
  } catch (err) {
    errorHandler(err, res);
  }
}
