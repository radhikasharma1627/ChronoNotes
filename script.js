// ================= Name Input =================
function submitName() {
  const name = document.getElementById('userName').value.trim();
  if (!name) return alert('Please enter your name');
  document.getElementById('nameInput').style.display = 'none';
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('greeting').innerText = `Hello, ${name}! \n Choose your preference:`;
}

function openSection(section) {
  document.getElementById('menu').style.display = 'none';
  if (section === 'todo') {
    document.getElementById('todoSection').classList.add('active');
  } else {
    document.getElementById('notepadSection').classList.add('active');
  }
}

function backToMenu() {
  document.getElementById('todoSection').classList.remove('active');
  document.getElementById('notepadSection').classList.remove('active');
  document.getElementById('noteEditor').style.display = 'none';
  document.getElementById('menu').style.display = 'flex';
}

// ================= To-Do List =================
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => renderTask(task.text, task.completed));
  updateCounter();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').innerText,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateCounter();
}

function addTask() {
  if (!taskInput.value.trim()) return;
  renderTask(taskInput.value, false);
  taskInput.value = '';
  saveTasks();
}

function renderTask(text, completed) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const content = document.createElement('div');
  content.className = 'task-content';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  checkbox.checked = completed;
  checkbox.onchange = () => { li.classList.toggle('completed'); saveTasks(); };

  const span = document.createElement('span');
  span.innerText = text;

  const delBtn = document.createElement('button');
  delBtn.innerText = '✖';
  delBtn.className = 'delete-btn';
  delBtn.onclick = () => { li.remove(); saveTasks(); };

  content.appendChild(checkbox);
  content.appendChild(span);
  li.appendChild(content);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function clearAll() { taskList.innerHTML = ''; localStorage.removeItem('tasks'); updateCounter(); }
function clearCompleted() { document.querySelectorAll('#taskList li.completed').forEach(li => li.remove()); saveTasks(); }
function updateCounter() {
  const totalLeft = document.querySelectorAll('#taskList li:not(.completed)').length;
  const totalTasks = document.querySelectorAll('#taskList li').length;
  taskCounter.innerText = `${totalLeft} ${totalLeft === 1 ? 'Task' : 'tasks'} Left, ${totalTasks} Total`;
}
taskInput.addEventListener('keypress', function(e) { if(e.key==='Enter') addTask(); });
loadTasks();

// ================= Notepad =================
let currentNoteIndex = null;
const notepadArea = document.getElementById('notepadArea');

function loadNotesList() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteList = document.getElementById('noteList');
  noteList.innerHTML = '';
  notes.forEach((note,index)=>{
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.innerText = `${note.date} - ${note.title}`;
    span.style.cursor = 'pointer';
    span.onclick = () => editNote(index);

    const delBtn = document.createElement('button');
    delBtn.innerText = '✖';
    delBtn.className = 'delete-btn';
    delBtn.onclick = e => { 
      e.stopPropagation(); 
      notes.splice(index,1); 
      localStorage.setItem('notes',JSON.stringify(notes)); 
      loadNotesList(); 
      document.getElementById('noteEditor').style.display='none'; 
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    noteList.appendChild(li);
  });
}

function newNote() {
  currentNoteIndex = null;
  document.getElementById('noteEditor').style.display='block';
  document.getElementById('noteTitle').value='';
  document.getElementById('noteDate').valueAsDate = new Date();
  notepadArea.value='';
}

function editNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = notes[index];
  currentNoteIndex = index;
  document.getElementById('noteEditor').style.display='block';
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteDate').value = note.date;
  notepadArea.value = note.content;
}

function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const date = document.getElementById('noteDate').value;
  const content = notepadArea.value;

  if(!title || !date) return alert('Please enter title and date.');

  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  if(currentNoteIndex!==null) notes[currentNoteIndex] = {title,date,content};
  else notes.push({title,date,content});

  localStorage.setItem('notes',JSON.stringify(notes));
  alert('Note saved!');
  loadNotesList();
  document.getElementById('noteEditor').style.display='none';
}

function deleteNote() {
  if(currentNoteIndex===null) return alert('No note selected to delete.');
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(currentNoteIndex,1);
  localStorage.setItem('notes',JSON.stringify(notes));
  alert('Note deleted!');
  document.getElementById('noteEditor').style.display='none';
  loadNotesList();
}

notepadArea.addEventListener('input', function() { this.scrollTop = this.scrollHeight; });
loadNotesList();
