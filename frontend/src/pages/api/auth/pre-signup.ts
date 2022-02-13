import { prisma, apiHandler, errorHandler, sendEmail } from '@helpers/auth';
import { validate, preSignupSchema } from '@http/auth.validators';
import { signUpHtml } from '@helpers/auth/emails';
import { signToken } from '@helpers/auth/jwt';

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
      throw {
        status: 409,
        errors: ['Email is taken'],
      };
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

    const { token } = await signToken(
      { username, email, password },
      10 * 60,
      process.env.JWT_ACCOUNT_ACTIVATION_SECRET,
    );

    const url = `${process.env.DOMAIN}/${lang ?? 'en'}/auth/account/activate/${token}`;
    const host = process.env.EMAIL_FROM;

    await sendEmail(email, 'Account verification', signUpHtml(email, host, url))
      .then(() => {
        return res.json({
          success: true,
        });
      })
      .catch(err => console.log(`Problem sending email: ${err}`));
  } catch (err) {
    await errorHandler(err, req, res);
  }
}
