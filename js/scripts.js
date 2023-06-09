/********** Seleção de elementos **********/
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const searchInput = document.querySelector("#search-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
const cleanUpBtn = document.querySelector("#clean-up-btn");

let originalInputValue;

/********** Function - General **********/
const saveTodo = (text, done = 0, doing = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  const doingBtn = document.createElement("button");
  doingBtn.classList.add("doing-todo");
  doingBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  todo.appendChild(doingBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  } else if (doing) {
    todo.classList.add("doing");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0, doing: 0 });
  }

  todoList.appendChild(todo);
  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText === originalInputValue) {
      todoTitle.innerText = text;
      // Utilizando dados da localStorage
      updateTodoLocalStorage(originalInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = "flex";
    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");
  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done") && !todo.classList.contains("doing")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "doing":
      todos.forEach((todo) =>
        todo.classList.contains("doing")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, todo.doing, 0);
  });
};

const cleanUpStorage = () => {
  const cleanUpConfirmation = confirm("Do you want to delete all tasks?");
  if (cleanUpConfirmation) {
    localStorage.clear();
    loadTodos();
  }
};

/********** Funtion - Local Storage **********/
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.text != todoText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoStatusDoingLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoText ? (todo.doing = !todo.doing) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

/********** Eventos **********/
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;
  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    if (parentEl.classList.contains("doing")) {
      parentEl.classList.remove("doing");
    }
    parentEl.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    originalInputValue = todoTitle;
  }

  if (targetEl.classList.contains("doing-todo")) {
    if (!parentEl.classList.contains("done")) {
      parentEl.classList.toggle("doing");
      updateTodoStatusDoingLocalStorage(todoTitle);
    }
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;
  if (editInputValue) {
    updateTodo(editInputValue);
  }
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

cleanUpBtn.addEventListener("click", () => {
  cleanUpStorage();
});

loadTodos();
