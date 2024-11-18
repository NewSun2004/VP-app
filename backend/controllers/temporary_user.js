// const { Temporary_user, User } = require('../model/model');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// exports.registerTemporaryUser = async (req, res) => {
//   try {
//     const { first_name,last_name, user_email, user_password} = req.body;

//     const token = crypto.randomBytes(32).toString('hex');
//     const temporaryUser = new Temporary_user({
//       first_name,
//       last_name,
//       user_email,
//       user_password,
//       token,
//       token_expiry: Date.now() + 10 * 60 * 1000 // Token expires in 10 minutes
//     });

//     await temporaryUser.save();

//     // Send email with token
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       },
//       tls: {
//         rejectUnauthorized: false // Bỏ qua xác minh chứng chỉ
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user_email,
//       subject: 'Email Verification',
//       html: `<p>Please verify your email by clicking <a href="http://localhost:3001/register-temp/verify?token=${token}">here</a>.</p>`
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Verification email sent.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error registering temporary user.' });
//   }
// };

// exports.verifyToken = async (req, res) => {
//   try {
//     const { token } = req.query;
//     const tempUser = await Temporary_user.findOne({ token });

//     if (!tempUser || tempUser.token_expiry < Date.now()) {
//       return res.status(400).json({ error: 'Invalid or expired token.' });
//     }

//     // Move data to User schema
//     const newUser = new User({
//       first_name: tempUser.first_name,
//       last_name: tempUser.last_name,
//       user_email: tempUser.user_email,
//       user_password: tempUser.user_password,
//     });

//     await newUser.save();
//     await Temporary_user.deleteOne({ _id: tempUser._id });

//     res.status(200).json({ message: 'User verified and registered.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error verifying token.' });
//   }
// };
const { Temporary_user, User } = require('../model/model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerTemporaryUser = async (req, res) => {
  try {
    const { first_name, last_name, user_email, user_password } = req.body;

    // Kiểm tra email trong bảng User
    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email has been registered.' });
    }

    // Kiểm tra email trong bảng Temporary_user
    const tempUser = await Temporary_user.findOne({ user_email });
    if (tempUser) {
      return res.status(400).json({ message: 'The process is waiting for you to confirm your email.' });
    }

    // Tạo token và lưu vào bảng Temporary_user
    const token = crypto.randomBytes(32).toString('hex');
    const newTempUser = new Temporary_user({
      first_name,
      last_name,
      user_email,
      user_password,
      token,
      token_expiry: Date.now() + 10 * 60 * 1000, // Token hết hạn sau 10 phút
    });

    await newTempUser.save();

    // Gửi email xác thực
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
                rejectUnauthorized: false // Bỏ qua xác minh chứng chỉ
    }});

    const verificationLink = `http://localhost:3001/register-temp/verify?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: 'Complete Your Registration at VPandas Eyewear',
      html: `
        <p>Dear ${first_name} ${last_name},</p>
        <p>Thank you for registering an account at <strong>VPandas Eyewear</strong>. To complete your registration and activate your account, please confirm your email by clicking the link below:</p>
        <p><a href="${verificationLink}" style="color: #1a73e8;">Verify Your Email</a></p>
        <p>This link will expire after <strong>10 minutes</strong>. Please ensure you do not share this information with anyone.</p>
        <p>Thank you for choosing <strong>VPandas Eyewear</strong>!</p>
        <p>Best regards,</p>
        <p>The VPandas Eyewear Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Please check your email to verify your account' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error! Please try again.' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.query;
    const tempUser = await Temporary_user.findOne({ token });

    if (!tempUser || tempUser.token_expiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Chuyển thông tin từ Temporary_user sang User
    const newUser = new User({
      first_name: tempUser.first_name,
      last_name: tempUser.last_name,
      user_email: tempUser.user_email,
      user_password: tempUser.user_password,
    });

    await newUser.save();
    await Temporary_user.deleteOne({ _id: tempUser._id });

    res.status(200).json({ message: 'User verified and registered.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error verifying token.' });
  }
};
