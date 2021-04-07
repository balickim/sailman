const { sendEmailWithNodemailer } = require("../helpers/email");
const Feedback = require("../models/feedback");

exports.contactForm = (req, res) => {
  const { name, email, message } = req.body;

  const emailData = {
    from: "your_name@gmail.com",
    to: "your_name@gmail.com",
    subject: "Website Contact Form",
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
    `,
  };

  sendEmailWithNodemailer(req, res, emailData);
};

exports.feedbackForm = (req, res) => {
  const { value, message, pathname } = req.body;

  const postedBy = req.user._id;

  let feedback = new Feedback({ value, message, pathname, postedBy });

  feedback.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
