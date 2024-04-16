import { TodoApp } from "./TodoManager.js";
import {
  renderList,
  serialize,
  populate,
} from "./DOM-methods.js";

const lskey = 'todos';

// State
const memoryApp = new TodoApp({
  todos: JSON.parse(localStorage.getItem(lskey)) || [],
});


const saveTodos = (todos=memoryApp.todos, key=lskey) => {
  localStorage.setItem(key, JSON.stringify(todos));
}

// Elements
const list = document.getElementById("todos-list");
console.log("🚀 ~ file: index.js:8 ~ list", list);
const todosForm = document.forms["todos-form"];
console.log("🚀 ~ file: index.js:10 ~ todosForm", todosForm);

// Actions
// write todos into the list
renderList(list, memoryApp.todos);

// Event Bindings
todosForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get changes
  const data = serialize(todosForm);
  console.log(
    "🚀 ~ file: index.js:26 ~ todosForm.addEventListner ~ data",
    data
  );

  // Adjust memory
  if (data._id) {
    // update
    memoryApp.updateTodo(data._id, data);
  } else {
    // add
    memoryApp.createTodo(data);
  }
  saveTodos();

  // Re-render page
  renderList(list, memoryApp.todos);
  todosForm.reset();
});

// RESET HIDDEN INPUTS
const hiddenInputs = document.querySelectorAll('input[type="hidden"]')

todosForm.addEventListener('reset', (e) => {
  console.log('reset');
  for (const input of hiddenInputs) {
    input.value = '';
  }
});

list.addEventListener("click", (e) => {
  const { target } = e;
  const { id } = target.dataset;
  if (!id) return;
  const todo = memoryApp.findTodoById(id);
  // console.log(target);
  if (target.matches(".done-btn")) {
    console.log("done button");
    // mark todo as done
    if (todo.done) {
      todo.markNotDone();
    } else {
      todo.markDone();
    }
  } else if (target.matches(".update-btn")) {
    console.log("update button");
    populate(todosForm, todo);
    // update
  } else if (target.matches(".delete-btn")) {
    console.log("delete button", target.dataset);

    // delete the todo
    memoryApp.removeTodo(id);
  }
  
  saveTodos();
  renderList(list, memoryApp.todos);
});
