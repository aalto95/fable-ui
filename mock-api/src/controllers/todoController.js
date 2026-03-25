const todoService = require("../services/todoService");

class TodoController {
  async getTodos(req, res, next) {
    try {
      const result = await todoService.getTodos();

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveTodo(req, res, next) {
    try {
      const { name, text } = req.body;

      const result = await todoService.saveTodo({
        name,
        text,
      });

      res.status(200).json({
        success: true,
        message: "Item saved successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodoController();
