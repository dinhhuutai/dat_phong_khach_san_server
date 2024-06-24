const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const asyncHandle = require("express-async-handler");
const sendMail = require("../../utils/sendMail");
const generateOTP = require("../../utils/generateOTP");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "365d" }
    );
};

class AuthController {
    // [POST] /api/v1/user/login
    login = asyncHandle(async (req, res, next) => {
        const { email, password } = req.body;

        console.log(email, password);
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Email is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.json({
                    success: false,
                    message: "Incorrect username or password",
                });
            }

            const passwordValid = await argon2.verify(user.password, password);
            if (!passwordValid) {
                return res.json({
                    success: false,
                    message: "Incorrect username or password",
                });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: "/",
            //     sameSite: "strict",
            // });

            // Lưu refreshToken vào database
            user = await User.findByIdAndUpdate(
                user._id,
                { refreshToken },
                { new: true }
            ).select("-password -refreshToken");
            console.log(user);

            return res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    avatar: user.avatar,
                    isVerification: user.isVerification,
                    isAdmin: user.isAdmin,
                    payments: user.payments,
                    createDate: user.createDate,
                    role: user.role,
                    accessToken,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    // [POST] /api/v1/user/create
    register = asyncHandle(async (req, res, next) => {
        const { name, email, password } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Name is required" });
        }
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Username is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        try {
            const user = await User.findOne({ email });
            if (user) {
                return res.json({
                    success: false,
                    message: "Username already taken",
                });
            }

            const hashedPassword = await argon2.hash(password);

            let newUser = new User({
                ...req.body,
                password: hashedPassword,
            });

            await newUser.save();

            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: "/",
            //     sameSite: "strict",
            // });

            // Lưu refreshToken vào database
            newUser = await User.findByIdAndUpdate(
                newUser._id,
                { refreshToken },
                { new: true }
            );

            const otp = generateOTP();
            newUser = await User.findByIdAndUpdate(
                newUser._id,
                {
                    codeVerification: otp,
                    codeVerificationExpires: Date.now() + 5 * 60 * 1000,
                },
                { new: true }
            ).select(
                "-password -refreshToken -codeVerification -codeVerificationExpires"
            );

            const dataSendMail = {
                from: `Đặt phòng khách sạn <${process.env.EMAIL_NAME}>`, // sender address
                to: email, // list of receivers
                subject: "Verification code email", // Subject line
                html: `<h1>${otp}</h1>`, // html body
            };
            await sendMail(dataSendMail);

            res.status(200).json({
                success: true,
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    phone: newUser.phone,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    isVerification: newUser.isVerification,
                    isAdmin: newUser.isAdmin,
                    createDate: newUser.createDate,
                    role: newUser.role,
                    accessToken,
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    verification = asyncHandle(async (req, res, next) => {
        const { email, codeVerification } = req.body;
        if (!email || !codeVerification) {
            throw new Error("Invalid reset token");
            return;
        }

        try {
            const user = await User.findOne({
                email,
                codeVerification,
                codeVerificationExpires: { $gt: Date.now() },
            });

            if (!user) {
                throw new Error("Invalid reset token");
            } else {
                user.codeVerification = undefined;
                user.codeVerificationChangedAt = Date.now();
                user.codeVerificationExpires = undefined;
                user.isVerification = true;
                await user.save();

                const accessToken = generateAccessToken(user);

                return res.status(200).json({
                    success: true,
                    data: {
                        _id: user._id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                        avatar: user.avatar,
                        isVerification: user.isVerification,
                        isAdmin: user.isAdmin,
                        createDate: user.createDate,
                        role: user.role,
                        accessToken,
                    },
                });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    findOtp = asyncHandle(async (req, res, next) => {
        const { email } = req.body;

        try {
            const otp = generateOTP();
            const user = await User.findOneAndUpdate(
                { email },
                {
                    codeVerification: otp,
                    codeVerificationExpires: Date.now() + 5 * 60 * 1000,
                },
                { new: true }
            );

            const dataSendMail = {
                from: `Đặt phòng khách sạn <${process.env.EMAIL_NAME}>`, // sender address
                to: email, // list of receivers
                subject: "Verification code email", // Subject line
                html: `<h1>${otp}</h1>`, // html body
            };
            await sendMail(dataSendMail);

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    changePasswordNew = asyncHandle(async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const hashedPassword = await argon2.hash(password);
            const user = await User.findOneAndUpdate(
                { email },
                {
                    password: hashedPassword,
                    updateDate: Date.now(),
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });

    logout = asyncHandle(async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json("You're not authenticated");
            }

            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            const userId = decoded.id;

            const rs = await User.findOneAndUpdate(
                { refreshToken: refreshToken },
                { refreshToken: "" },
                { new: true }
            );

            if (rs) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                });
                return res.status(200).json({ success: true });
            }
        } catch (error) {
            return res.status(400).json({ success: false });
        }
    });

    // [POST] /api/v1/auth/createPartner
    createPartner = asyncHandle(async (req, res, next) => {
        const { name, email, password } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Name is required" });
        }
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Username is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        try {
            const user = await User.findOne({ email });
            if (user) {
                return res.json({
                    success: false,
                    message: "Username already taken",
                });
            }

            const hashedPassword = await argon2.hash(password);

            let newUser = new User({
                ...req.body,
                password: hashedPassword,
                avatar: "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.87/static/media/user-default.3ff115bb.png",
                role: 2,
                isAdmin: false,
                status: 1,
                isVerification: true,
            });

            await newUser.save();

            res.status(200).json({
                success: true,
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    phone: newUser.phone,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    isVerification: newUser.isVerification,
                    isAdmin: newUser.isAdmin,
                    createDate: newUser.createDate,
                    role: newUser.role,
                },
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    });
}

module.exports = new AuthController();
