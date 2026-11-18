const User = require('../models/User');
const {
  hashPassword,
  comparePassword,
} = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    // Check whether the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered',
      });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Something went wrong during registration',
    });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Explicitly include the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Compare submitted password with stored hash
    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    // Store JWT in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Something went wrong during login',
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({
    message: 'Logout successful',
  });
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);

    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = { register, login, logout, getMe, };