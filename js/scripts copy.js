// Element selection
const todoForm = document.querySelector("#todo-form");
const editForm = document.querySelector("#edit-form");
const todoInput = document.querySelector("#todo-input");
const editInput = document.querySelector("#edit-input");
const todoList = document.querySelector("#todo-list");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;

// Funtions
const saveTodoTask = (text) => {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const todoTitleH3 = document.createElement("h3");
  todoTitleH3.innerText = text;
  todoDiv.appendChild(todoTitleH3);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todoDiv.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todoDiv.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-todo");
  removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todoDiv.appendChild(removeBtn);

  todoList.appendChild(todoDiv);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodoTask = (text) => {
  const taskList = document.querySelectorAll(".todo");

  taskList.forEach((task) => {
    let todoTitle = task.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
    }

  });
};

// Events
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodoTask(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerHTML;
  }

  if (parentEl && targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
  }

  if (parentEl && targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;

    editInput.focus();
  }

  if (parentEl && targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
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
    updateTodoTask(editInputValue);
  }

  toggleForms();
});
