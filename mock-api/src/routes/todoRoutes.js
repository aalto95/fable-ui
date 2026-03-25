const express = require("express");
const todoController = require("../controllers/todoController");
const validateTodo = require("../validators/todoValidator");

const router = express.Router();

router.get("/todo", todoController.getTodos);
router.post("/todo", validateTodo, todoController.saveTodo);

module.exports = router;
