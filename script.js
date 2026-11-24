const STORAGE_KEY = 'vanilla_todo_tasks_v1';

const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Load tasks from localStorage on startup
let tasks = loadTasks();
renderTasks();

// Step 2: Add new list items on form submit / button click
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskInput.focus();
});

// Step 3: Event delegation to mark items as completed or delete them
taskList.addEventListener('click', (event) => {
  const listItem = event.target.closest('.task-item');
  if (!listItem) return;

  const taskId = listItem.dataset.id;

  // Handle delete button click
  if (event.target.classList.contains('delete-btn')) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
    return;
  }

  // Handle toggling completed status
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

// Step 5: Persist tasks in localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to parse tasks from localStorage:', error);
    return [];
  }
}

function renderTasks() {
  taskList.innerHTML = '';

  const remainingCount = tasks.filter((t) => !t.completed).length;
  taskCounter.textContent = `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} remaining`;

  if (tasks.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'empty-state';
    emptyMsg.textContent = 'No tasks yet. Add one above!';
    taskList.appendChild(emptyMsg);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;

    const label = document.createElement('label');
    label.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete ${task.text}`);

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}
