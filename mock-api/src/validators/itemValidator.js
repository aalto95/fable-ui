const validateItem = (req, res, next) => {
  const { name, status, description } = req.body;

  // Basic validation
  if (!name || !status || !description) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, status, description) are required",
    });
  }

  // Validate status
  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be either "active" or "inactive"',
    });
  }

  next();
};

module.exports = validateItem;
