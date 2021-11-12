import { prisma, apiHandler, errorHandler, sendEmail } from '@helpers/api';
import { validate, preResetPasswordSchema } from '@helpers/api/validators';
import { signToken } from '@helpers/api/jwt';
import { resetPasswordHtml, resetPasswordText } from '@helpers/api/emails';

export default validate(
  apiHandler({
    put: controller,
  }),
  preResetPasswordSchema,
);

async function controller(req, res) {
  try {
    const { email } = req.body;
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

    const { token } = await signToken({ id: user.id }, 30 * 60, process.env.JWT_RESET_PASSWORD);

    await prisma.user.update({
      where: { id: user.id },
      data: { reset_password_link: token },
    });

    const url = `${process.env.CLIENT_URL}/auth/password/reset/${token}`;

    await sendEmail(res, email, resetPasswordText(url), resetPasswordHtml(url))
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
