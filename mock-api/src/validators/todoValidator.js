const validateTodo = (req, res, next) => {
  const { name, text } = req.body;

  // Basic validation
  if (!name || !text) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, text) are required",
    });
  }

  next();
};

module.exports = validateTodo;
