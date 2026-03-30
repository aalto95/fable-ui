type Todo = {
  id: string;
  name: string;
  text: string;
  dueDate?: string;
};

class ItemService {
  todos: Todo[] = [
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd28",
      name: "First todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd29",
      name: "Second todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd30",
      name: "Third todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd31",
      name: "Fourth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd32",
      name: "Fifth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd33",
      name: "Sixth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd34",
      name: "Seventh todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd35",
      name: "Eighth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd36",
      name: "Ninth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd37",
      name: "Tenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd38",
      name: "Eleventh todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd39",
      name: "Twelfth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd40",
      name: "Thirteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd41",
      name: "Fourteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd42",
      name: "Fifteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd43",
      name: "Sixteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd44",
      name: "Seventeenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd45",
      name: "Eighteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd46",
      name: "Nineteenth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd47",
      name: "Twentieth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd48",
      name: "Twenty-first todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd49",
      name: "Twenty-second todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd50",
      name: "Twenty-third todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd51",
      name: "Twenty-fourth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd52",
      name: "Twenty-fifth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    },
    {
      id: "8e487950-ed12-4f6c-a230-1968cb84dd53",
      name: "Twenty-sixth todo",
      text: "Example",
      dueDate: "2026-03-27T15:00:00.000Z",
    }
  ];

  async getTodos(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = this.todos.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: this.todos.slice(startIndex, endIndex),
      total,
      totalPages,
    };
  }

  async getTodoById(id: string) {
    const todo = this.todos.find((t) => t.id === id);
    return todo;
  }

  async addTodo(todoData: { name: string; text: string; dueDate?: string }) {
    console.log("Saved todo:", todoData);
    this.todos.push({ id: crypto.randomUUID(), ...todoData });

    return {
      success: true,
      data: todoData,
    };
  }

  async updateTodo(id: string, todoData: Record<string, unknown>) {
    console.log("Updated todo:", todoData);

    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo with id ${todoData.id} not found`);
    }

    this.todos[index] = { ...this.todos[index], ...todoData } as (typeof this.todos)[number];

    return {
      success: true,
      data: this.todos[index],
    };
  }

  async deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    return {
      success: true,
    };
  }
}

export const todoService = new ItemService();
