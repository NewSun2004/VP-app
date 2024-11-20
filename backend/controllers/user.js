const { User } = require("../model/model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Controller object
const userController = {
  addUser: async (req, res) => {
    try {
      const newUser = new User(req.body);
      const saveUser = await newUser.save();
      res.status(200).json(saveUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  login: async (req, res) => {
    const { user_email, user_password, rememberMe } = req.body;

    try {
      const user = await User.findOne({ user_email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      req.session.user = { user };

      if (rememberMe) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

        user.rememberMeToken = token;
        user.rememberMeExpiry = expiry;
        await user.save();

        res.cookie("rememberMe", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
      }

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error logging in." });
    }
  },
  getSession: async (req, res) => {
    if (req.session.user) {
      return res.status(200).json(req.session.user); // Return session user data
    } else {
      return res.status(401).json({ message: 'No active session' }); // No session found
    }
  },
  logOut: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send({ success: false, message: 'Failed to log out.' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.send({ success: true, message: 'Logged out successfully.' });
    });
  },
  forgotPassword: async (req, res) => {
    try {
      const { user_email } = req.body;

      // Kiểm tra xem email có tồn tại không
      const user = await User.findOne({ user_email });
      if (!user) {
        return res.status(404).json({ message: "This email is not registered." });
      }

      // Tạo mã OTP ngẫu nhiên
      const rawToken = Math.floor(10000 + Math.random() * 90000).toString();
      const hashedToken = await bcrypt.hash(rawToken, 10);

      // Lưu OTP vào user
      user.resetToken = hashedToken;
      user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token hết hạn sau 10 phút
      await user.save();

      // Gửi email với mã OTP
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
        subject: "Your Password Reset OTP Code",
        html: `
          <p>Dear ${user.first_name || "User"} ${user.last_name || ""},</p>
          <p>Your OTP for resetting your password is: <strong>${rawToken}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        res.status(200).json({ message: "Please check your email to reset your password." });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error occurred while processing your request." });
    }
  }
,
verifyForgot: async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    // Tìm user bằng email
    const user = await User.findOne({ user_email: email });

    if (!user || !user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // So sánh OTP
    const isMatch = await bcrypt.compare(token, user.resetToken);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Xóa resetToken và resetTokenExpiry sau khi xác thực thành công
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
},
resetPassword: async (req, res) => {
  try {
    const { email, user_password } = req.body;

    if (!email || !user_password) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    // Kiểm tra mật khẩu mới có hợp lệ không
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(user_password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include letters, numbers, and symbols.',
      });
    }

    // Tìm user bằng email
    const user = await User.findOne({ user_email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Mã hóa mật khẩu mới
    user.user_password = await bcrypt.hash(user_password, 10);

    // Lưu thay đổi vào database
    await user.save();

    res.status(200).json({ message: 'Password has been successfully updated.' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
};

// Export toàn bộ controller
module.exports = userController;
