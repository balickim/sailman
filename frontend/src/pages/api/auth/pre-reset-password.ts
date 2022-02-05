import { prisma, apiHandler, errorHandler, sendEmail } from '@helpers/auth';
import { validate, preResetPasswordSchema } from '@helpers/auth/validators';
import { signToken } from '@helpers/auth/jwt';
import { resetPasswordHtml } from '@helpers/auth/emails';

export default validate(
  apiHandler({
    put: controller,
  }),
  preResetPasswordSchema,
);

async function controller(req, res) {
  try {
    const { email, lang } = req.body;
    if (!email) {
      throw {
        status: 400,
        message: 'Please Enter your email',
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const { token } = await signToken({ id: user.id }, 10 * 60, process.env.JWT_RESET_PASSWORD);

    await prisma.user.update({
      where: { id: user.id },
      data: { reset_password_link: token },
    });

    const url = `${process.env.NEXTAUTH_URL}/${lang ?? 'en'}/auth/password/reset/${token}`;

    await sendEmail(email, 'Password reset', resetPasswordHtml(url))
      .then(() => {
        return res.json({
          success: true,
        });
      })
      .catch(err => console.log(`Problem sending email: ${err}`));
  } catch (error) {
    errorHandler(error, res);
  }
}
