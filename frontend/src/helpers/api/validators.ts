import { object, string } from 'yup';

export function validate(apiHandler, schema) {
  return async (req, res) => {
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json(err);
    }
    await apiHandler(req, res);
  };
}

export const preSignupSchema = object({
  username: string().required('Please Enter your username').min(2).max(32),
  email: string().required('Please Enter your email').email(),
  password: string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
  lang: string().oneOf(['pl', 'en']),
});

export const signupSchema = object({
  token: string().required().max(700),
});

export const loginSchema = object({
  email: string().required('Please Enter your email').email(),
  password: string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});

export const preResetPasswordSchema = object({
  email: string().required('Please Enter your email').email(),
});

export const resetPasswordSchema = object({
  resetPasswordToken: string(),
  newPassword: string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});
