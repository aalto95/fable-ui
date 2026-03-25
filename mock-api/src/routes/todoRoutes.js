const express = require("express");
const todoController = require("../controllers/todoController");
const validateTodo = require("../validators/todoValidator");

const router = express.Router();

router.get("/todo", todoController.getTodos);
router.get("/todo/:id", todoController.getTodoById);
router.post("/todo", validateTodo, todoController.addTodo);
router.put("/todo/:id", todoController.updateTodo);

module.exports = router;
