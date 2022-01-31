import jwt from 'jsonwebtoken';

import { prisma, apiHandler, errorHandler, sendEmail } from '@helpers/api';
import { validate, preSignupSchema } from '@helpers/api/validators';
import { signUpHtml, signUpText } from '@helpers/api/emails';

export default validate(
  apiHandler({
    post: preSignup,
  }),
  preSignupSchema,
);

async function preSignup(req, res) {
  try {
    const { username, email, password, lang } = req.body;
    let user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (user) {
      return res.status(400).json({
        message: 'Email is taken',
      });
    }

    user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user) {
      return res.status(400).json({
        message: 'Username is taken',
      });
    }

    const token = jwt.sign({ username, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '10m',
    });

    const url = `${process.env.NEXTAUTH_URL}/${lang ?? 'en'}/auth/account/activate/${token}`;
    const host = process.env.EMAIL_FROM;

    await sendEmail(res, email, signUpText(url, host), signUpHtml(email, host, url))
      .then(() => {
        return res.json({
          success: true,
        });
      })
      .catch(err => console.log(`Problem sending email: ${err}`));
  } catch (err) {
    errorHandler(err, res);
  }
}
