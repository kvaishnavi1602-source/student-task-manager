// State Management: Array to hold all task objects
    let tasks = [];

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dateInput = document.getElementById('dateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const sortPriorityBtn = document.getElementById('sortPriorityBtn');
    const sortDateBtn = document.getElementById('sortDateBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // Stats Elements
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');

    // Priority mapping for sorting (High = 3, Medium = 2, Low = 1)
    const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };

    // --- Core Functions ---

    // 1. Add Task
    function addTask() {
        const text = taskInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dateInput.value;

        // Prevent adding empty tasks
        if (text === '') {
            alert('Please enter a task description.');
            return;
        }

        const newTask = {
            id: Date.now().toString(), // Unique ID based on timestamp
            text: text,
            priority: priority,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        
        // Clear inputs
        taskInput.value = '';
        dateInput.value = '';
        
        renderTasks();
    }

    // Render the task list based on current state (handles filtering and sorting)
    function renderTasks() {
        // Clear the current list
        taskList.innerHTML = '';

        // 5. Search Tasks: Filter dynamically based on search input
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.text.toLowerCase().includes(searchTerm)
        );

        // Build DOM for each task
        filteredTasks.forEach(task => {
            // Create list item
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            // 2. Checkbox for Completion
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            // Task Text
            const spanText = document.createElement('span');
            spanText.className = 'task-text';
            spanText.textContent = task.text;

            // 8. Priority Badge
            const spanPriority = document.createElement('span');
            spanPriority.className = `priority-badge priority-${task.priority}`;
            const icon = task.priority === 'High' ? 'H' : task.priority === 'Medium' ? 'M' : 'L';
            spanPriority.textContent = icon;

            // 9. Due Date
            const spanDate = document.createElement('span');
            spanDate.className = 'task-date';
            spanDate.textContent = task.dueDate ? `Due: ${formatDate(task.dueDate)}` : 'No due date';

            // 4. Edit Button
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-edit';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task.id));

            // 3. Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            // Append all elements to the li, then li to the ul
            li.appendChild(checkbox);
            li.appendChild(spanText);
            li.appendChild(spanPriority);
            li.appendChild(spanDate);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });

        updateStats();
    }

    // 2. Mark as Completed (Toggle Status)
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }

    // 3. Delete Task
    function deleteTask(id) {
        if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
    }

    // 4. Edit Task
    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit your task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                renderTasks();
            }
        }
    }

    // 6. Display Statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        totalTasksEl.textContent = `Total Tasks: ${total}`;
        completedTasksEl.textContent = `Completed: ${completed}`;
        pendingTasksEl.textContent = `Pending: ${pending}`;
    }

    // 7. Clear Completed Tasks
    function clearCompleted() {
        tasks = tasks.filter(t => !t.completed);
        renderTasks();
    }

    // 10. Sort by Priority (High to Low)
    function sortTasksByPriority() {
        tasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
        renderTasks();
    }

    // 10. Sort by Due Date (Earliest to Latest, empty dates go to bottom)
    function sortTasksByDate() {
        tasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
        renderTasks();
    }

    // Helper Function: Format Date nicely (e.g., "28-Jun-2026")
    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    }

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);
    
    // Allow pressing "Enter" to add a task
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    searchInput.addEventListener('input', renderTasks); // Triggers dynamically as you type
    clearCompletedBtn.addEventListener('click', clearCompleted);
    sortPriorityBtn.addEventListener('click', sortTasksByPriority);
    sortDateBtn.addEventListener('click', sortTasksByDate);
