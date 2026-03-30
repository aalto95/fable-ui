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

  async getTodoById(req, res, next) {
    try {
      const result = await todoService.getTodoById(req.params.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addTodo(req, res, next) {
    try {
      const { name, text, dueDate } = req.body;

      const result = await todoService.addTodo({
        name,
        text,
        dueDate,
      });

      res.status(200).json({
        success: true,
        message: "Item added successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req, res, next) {
    try {
      const result = await todoService.updateTodo(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req, res, next) {
    try {
      const result = await todoService.deleteTodo(req.params.id);

      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodoController();
