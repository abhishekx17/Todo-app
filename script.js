const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.querySelector(".todoList");
const numbers = document.getElementById("numbers");
const progress = document.getElementById("progress");
let celebrationAudio = document.getElementById("celebrationAudio");

let celebrationPlayed = false;

// Local Storage Logic
const saveTodos = () => {
  let todos = [];
  todoList.querySelectorAll("li").forEach((li) => {
    todos.push({
      text: li.querySelector(".task").textContent,
      completed: li.querySelector("input").checked,
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

const loadTodos = () => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todoList.innerHTML = "";
  todos.forEach(todo => createTodo(todo.text, todo.completed));
  updateStats();
};


// Function to update stats + progress bar
const updateStats = () => {
  let total = todoList.children.length;
  let completed = todoList.querySelectorAll("input[type='checkbox']:checked").length;

  numbers.textContent = `${completed} / ${total}`;

  if (total === 0) {
    progress.style.width = "0%";
    celebrationAudio.pause();
    celebrationAudio.currentTime = 0;
    celebrationPlayed = false;
  } else {
    let percent = (completed / total) * 100;
    progress.style.width = `${percent}%`;

    if (completed === total) {
      if (!celebrationPlayed) {
        winningEffect();
        celebrationAudio.play();
        celebrationPlayed = true;
      }
    } else {
      celebrationAudio.pause();
      celebrationAudio.currentTime = 0;
      celebrationPlayed = false;
    }
  }
};

// Function to create a todo item
const createTodo = (text, completed = false) => {
  let li = document.createElement("li");
  li.innerHTML = `
    <div class="left">
      <input type="checkbox" ${completed ? "checked" : ""}>
      <span class="task">${text}</span>
    </div>
    <div class="actions">
      <img src="img/edit.png" class="edit" alt="edit">
      <img src="img/bin.png" class="delete" alt="delete">
    </div>
  `;

  const checkbox = li.querySelector("input");
  const span = li.querySelector("span");

  if (completed) {
    span.style.textDecoration = "line-through";
    span.style.color = "red";
  }

  // Delete
  li.querySelector(".delete").onclick = () => {
    li.remove();
    updateStats();
    saveTodos();
  };

  // Edit
  li.querySelector(".edit").onclick = () => {
    let newText = prompt("Edit task:", span.textContent);
    if (newText) {
      span.textContent = newText;
      saveTodos();
    }
  };

  // Checkbox toggle
  checkbox.onchange = () => {
    if (checkbox.checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "red";
    } else {
      span.style.textDecoration = "none";
      span.style.color = "black";
    }
    updateStats();
    saveTodos();
  };

  todoList.appendChild(li);
};

// Add new todo
const addTodo = () => {
  const inputText = inputBox.value.trim();
  if (inputText.length <= 0) return;
  createTodo(inputText, false);
  inputBox.value = "";
  inputBox.focus();
  updateStats();
  saveTodos();
};

addBtn.addEventListener("click", addTodo);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

// effects
const winningEffect = () => {
  const count = 200,
    defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

// Load todos on start
loadTodos();
