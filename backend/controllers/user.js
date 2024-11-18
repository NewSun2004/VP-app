const { User } = require("../model/model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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
  
      req.session.user = { id: user._id, role: "user" };
  
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
  
      res.status(200).json({ message: "Login successful." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error logging in." });
    }
  },
  forgotPassword: async (req, res) =>{
    try {
      const { email } = req.body;
  
      // Kiểm tra email
      const user = await User.findOne({ user_email: email });
      if (!user) {
        return res.status(404).json({ message: 'Email này chưa được đăng ký.' });
      }
  
      // Tạo token reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút
      await user.save();
  
      // Gửi email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const resetLink = `http://localhost:4200/forgot-password/reset?token=${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Please check your email to reset your password.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  },
  resetPassword: async (req, res) =>{
    try {
      const { token, newPassword } = req.body;
  
      // Kiểm tra token
      const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
  
      // Mã hóa và cập nhật mật khẩu
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.user_password = hashedPassword;
  
      // Xóa token
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  }
  
};

// Export toàn bộ controller
module.exports = userController;
