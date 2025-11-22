const User = require("../Models/userModel");

loginController = async (req, res) => {
  const { email, password } = req.body;
  // const user = users.find((u) => u.email === email && u.password === password);
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { id: user._id, username: user.username, email: user.email },
  });
};
registerController = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({ username, email, password });
    res.status(200).json({
      message: "Register successful",
      newUser: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ succes: false, message: error.message });
  }
};

getAllUsersController = async (req, res) => {
  const { id } = req.params;
  const filteredUsers = await User.find({ _id: { $ne: id } });
  res.status(200).json({ message: "Get all users", users: filteredUsers });
};

module.exports = { loginController, registerController, getAllUsersController };
