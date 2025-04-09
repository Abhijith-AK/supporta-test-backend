const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")

exports.registerUserController = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(406).json("All Fields except profile-photo are required!")
    }
    try {
        // checking existing user with same email
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json("User already exists!")
        }
        // encrypting password
        const encryptedPassword = await bcrypt.hash(password, 10)
        // TODO : profile pic upload
        const profilePhoto = req.file ? req.file.filename : null;

        const newUser = new User({
            username, email, password: encryptedPassword, profilePhoto
        })
        await newUser.save()
        return res.status(201).json({message: "Registered Successfully", newUser})
    } catch (error) {
        res.status(500).json(error)
        console.log(`Error inside registerUserController:-  ${error}`)
    }
}

exports.loginUserController = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(406).json("All Fields are required!")
    }
    try {
        // checking existing user with email
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json("Invalid Credentials!")
        }
        // comparing passwords
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json("Invalid Credentials!")            
        }
        // TODO : cookie generation
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        // set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 mins
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ message: "Login successful", user, refreshToken})
    } catch (error) {
        res.status(500).json(error)
        console.log(`Error inside loginUserController:-  ${error}`)
    }
}

exports.updateUserController = async (req, res) => {
    const userId = req.userId; // from jwt middleware
    const { username, email } = req.body;
    const profilePhoto = req.file ? req.file.filename : undefined;

    try {
        const updates = {
            ...(username && { username }),
            ...(email && { email }),
            ...(profilePhoto && { profilePhoto })
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json("User not found");
        }

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json(error);
    }
};

exports.deleteUserController = async (req, res) => {
    const userId = req.userId; // from jwt middleware

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json("User not found");
        }

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json(error);
    }
};

exports.blockUserController = async (req, res) => {
    const userId = req.userId;
    const { userId: targetUserId } = req.params;

    if (userId === targetUserId) {
        return res.status(400).json("You cannot block yourself!");
    }

    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: targetUserId } });
        return res.status(200).json("User blocked successfully");
    } catch (error) {
        console.error("Error blocking user:", error);
        return res.status(500).json(error);
    }
};

exports.unblockUserController = async (req, res) => {
    const userId = req.userId;
    const { userId: targetUserId } = req.params;

    try {
        await User.findByIdAndUpdate(userId, { $pull: { blockedUsers: targetUserId } });
        return res.status(200).json("User unblocked successfully");
    } catch (error) {
        console.error("Error unblocking user:", error);
        return res.status(500).json(error);
    }
};

exports.refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            return res.status(401).json("Refresh token missing");
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const validUser = await User.findById(decoded.id)
        if (!decoded || !validUser) {
            return res.status(403).json("Invalid refresh token");
        }

        // generate new acces token
        const newAccessToken = generateAccessToken(validUser)

        // new cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 mins
        });

        return res.status(200).json({ message: "Access token refreshed successfully" });
        
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json(error);
    }
}