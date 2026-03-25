class ItemService {
  todos = [
    {
      name: "First todo",
      text: "Example",
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

  async saveTodo(todoData) {
    try {
      console.log("Saved todo:", todoData);
      this.todos.push(todoData);

      return {
        success: true,
        data: todoData,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new ItemService();
