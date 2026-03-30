class ItemService {
  todos = [
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd28",
      name: "First todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
  ];

  async getTodos() {
    try {
      return {
        data: this.todos,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async getTodoById(id) {
    try {
      const todo = this.todos.find((todo) => todo.id === id);

      return todo;
    } catch (e) {
      throw new Error(e);
    }
  }

  async addTodo(todoData) {
    try {
      console.log("Saved todo:", todoData);
      this.todos.push({ id: crypto.randomUUID(), ...todoData });

      return {
        success: true,
        data: todoData,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateTodo(id, todoData) {
    try {
      console.log("Updated todo:", todoData);

      const index = this.todos.findIndex((todo) => todo.id === id);

      if (index === -1) {
        throw new Error(`Todo with id ${todoData.id} not found`);
      }

      // Update the todo while preserving the id
      this.todos[index] = { ...this.todos[index], ...todoData };

      return {
        success: true,
        data: this.todos[index],
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteTodo(id) {
    try {
      this.todos = this.todos.filter((todo) => todo.id !== id);

      return {
        success: true,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new ItemService();
