const { Temporary_user, User } = require('../model/model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.registerTemporaryUser = async (req, res) => {
  try {
    const { first_name, last_name, user_email, user_password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email has already been registered.' });
    }

    // Kiểm tra email trong Temporary_user
    const tempUser = await Temporary_user.findOne({ user_email });
    if (tempUser) {
      return res.status(400).json({ message: 'Check your email or wait another 10 minutes to do it again' });
    }

    // Tạo mã OTP ngẫu nhiên
    const rawToken = Math.floor(10000 + Math.random() * 90000).toString();

    // Mã hóa OTP
    const hashedToken = await bcrypt.hash(rawToken, 10);

    // Lưu thông tin vào Temporary_user
    const newTempUser = new Temporary_user({
      first_name,
      last_name,
      user_email,
      user_password,
      token: hashedToken,
      token_expiry: Date.now() + 10 * 60 * 1000, // Token hết hạn sau 10 phút
    });

    await newTempUser.save();

    // Gửi email chứa mã OTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: 'Your VPandas Eyewear OTP Code',
      html: `
        <p>Dear ${first_name} ${last_name},</p>
        <p>Your confirmation code is: <strong>${rawToken}</strong></p>
        <p>This code will expire after 10 minutes.</p>
        <p>Thank you for choosing <strong>VPandas Eyewear</strong>!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'A confirmation code has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error! Please try again.' });
  }
};
exports.verifyToken = async (req, res) => {
  try {
    const { email, token } = req.body; // Nhận email và OTP từ client

    // Tìm người dùng tạm thời bằng email
    const tempUser = await Temporary_user.findOne({ user_email: email });

    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'No user found for this email.' });
    }

    // Kiểm tra mã OTP
    const isMatch = await bcrypt.compare(token, tempUser.token);
    if (!isMatch || tempUser.token_expiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
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

    res.status(200).json({ success: true, message: 'Registration successful.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
};
