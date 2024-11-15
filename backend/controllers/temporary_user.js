const { Temporary_user, User } = require('../model/model'); // Đảm bảo đường dẫn chính xác
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình cho Nodemailer với tùy chọn TLS
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Bỏ qua xác minh chứng chỉ
    }
});

// Hàm để tạo người dùng tạm thời và gửi link xác thực
exports.registerTemporaryUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_address } = req.body;

        // Tạo mã token ngẫu nhiên
        const token = crypto.randomBytes(16).toString('hex'); // Mã token ngẫu nhiên
        const tokenExpiry = Date.now() + 10 * 60 * 1000; // Hạn sử dụng token: 10 phút

        // Tạo và lưu người dùng tạm thời
        const tempUser = new Temporary_user({
            user_name,
            user_email,
            user_password, // Bạn có thể mã hóa mật khẩu ở đây nếu cần thiết
            user_address,
            token,
            token_expiry: tokenExpiry,
        });
        await tempUser.save();

        // Tạo link chứa mã token
        const verificationLink = `${process.env.BASE_URL}/register-temp/verify?token=${token}&email=${user_email}`;

        // Cấu hình và gửi email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: "Email Verification",
            text: `Please verify your email by clicking on the following link: ${verificationLink}`,
            html: `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">${verificationLink}</a>`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Verification email sent. Please check your inbox." });
    } catch (error) {
        console.error("Error in registerTemporaryUser:", error.message);
        res.status(500).json({ error: "Failed to register temporary user and send email" });
    }
};

// Hàm để xác thực token
exports.verifyToken = async (req, res) => {
    try {
        const { token, email } = req.query;

        // Tìm người dùng tạm thời với email và token
        const tempUser = await Temporary_user.findOne({ user_email: email, token });

        // Kiểm tra nếu người dùng tạm thời không tồn tại hoặc token đã hết hạn
        if (!tempUser) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Tạo người dùng mới từ thông tin người dùng tạm thời
        const newUser = new User({
            user_name: tempUser.user_name,
            user_email: tempUser.user_email,
            user_password: tempUser.user_password,
            user_address: tempUser.user_address,
        });

        await newUser.save(); // Lưu vào bảng người dùng chính

        // Xóa người dùng tạm thời sau khi đã xác thực
        await Temporary_user.deleteOne({ _id: tempUser._id });

        res.status(200).json({ message: "Email verified successfully. Registration complete!" });
    } catch (error) {
        console.error("Error in verifyToken:", error.message);
        res.status(500).json({ error: "Failed to verify email" });
    }
};
