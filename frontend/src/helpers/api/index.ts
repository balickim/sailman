import nodemailer from 'nodemailer';
import { Prisma, PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { PrismaError } from './PrismaError';

export const prisma = new PrismaClient();

const limiter = rateLimit({
  windowMs: process.env.API_RATE_LIMIT_TIME_MS,
  max: process.env.API_RATE_LIMIT_REQUESTS_PER_TIME,

  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
});

export function apiHandler(handler) {
  return async (req, res) => {
    const method = req.method.toLowerCase();

    // check handler supports HTTP method
    if (!handler[method]) return res.status(405).end(`Method ${req.method} Not Allowed`);

    try {
      // global middleware
      await runMiddleware(req, res, limiter);
      await runMiddleware(req, res, hpp());
      await runMiddleware(req, res, helmet());

      // route handler
      await handler[method](req, res);
    } catch (err) {
      // global error handler
      errorHandler(err, res);
    }
  };
}

export function runMiddleware(req, res, fn) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export function errorHandler(err, res) {
  if (typeof err === 'string' && err.toLowerCase().endsWith('not found')) {
    return res.status(404).json({ message: err });
  }

  const e = err;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be accessed in a type-safe manner
    if (e.code === PrismaError.UniqueConstraintViolation) {
      return res.status(429).json('Too many requests, please try again later.');
    }
  }

  if (typeof err === 'object') {
    const statusCode = err.status;
    return res.status(statusCode).json({ message: err.message });
  }

  // default to 500 server error
  console.error(err);
  return res.status(500).json({ message: err.message });
}

export async function sendEmail(
  res: { json: (arg0: { success: boolean }) => any },
  email: any,
  text,
  html,
) {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GOOGLE_APP_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  return transport.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `${process.env.NEXT_PUBLIC_APP_NAME} account activation link`,
    // text,
    html,
  });
}
