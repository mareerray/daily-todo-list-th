//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const prioritySelect = document.querySelector('.priority-select');
const sortBtn = document.querySelector('.sort-btn');
const thaiCalendarBtn = document.getElementById('thaiCalendarBtn');
const prevDateBtn = document.getElementById('prevDateBtn');
const nextDateBtn = document.getElementById('nextDateBtn');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const thaiCalendarOverlay = document.getElementById('thaiCalendarOverlay');
const calendarDays = document.getElementById('calendarDays');
const calendarMonthYear = document.getElementById('calendarMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarTodayBtn = document.getElementById('calendarTodayBtn');
const calendarCloseBtn = document.getElementById('calendarCloseBtn');

let selectedDate = new Date();
let currentCalendarMonth = new Date();

//Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
sortBtn.addEventListener('click', sortTodo);
thaiCalendarBtn.addEventListener('click', openThaiCalendar);
prevDateBtn.addEventListener('click', () => changeDate(-1));
nextDateBtn.addEventListener('click', () => changeDate(1));
prevMonthBtn.addEventListener('click', () => changeCalendarMonth(-1));
nextMonthBtn.addEventListener('click', () => changeCalendarMonth(1));
calendarTodayBtn.addEventListener('click', selectToday);
calendarCloseBtn.addEventListener('click', closeThaiCalendar);
thaiCalendarOverlay.addEventListener('click', (e) => {
    if (e.target === thaiCalendarOverlay) {
        closeThaiCalendar();
    }
});

function initializeApp() {
    displayTodosForDate(selectedDate);
    updateDateDisplay();
}

function openThaiCalendar() {
    currentCalendarMonth = new Date(selectedDate);
    renderCalendar();
    thaiCalendarOverlay.classList.add('active');
}

function closeThaiCalendar() {
    thaiCalendarOverlay.classList.remove('active');
}

function selectToday() {
    selectedDate = new Date();
    currentCalendarMonth = new Date();
    renderCalendar();
    displayTodosForDate(selectedDate);
}

function changeCalendarMonth(direction) {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + direction);
    renderCalendar();
}

function renderCalendar() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    
    // Display month and year in Thai Buddhist calendar
    const thaiYear = year + 543; // Convert to Buddhist Era
    const thaiMonthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    calendarMonthYear.textContent = `${thaiMonthNames[month]} ${thaiYear}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Clear calendar
    calendarDays.innerHTML = '';
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(dayDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;
        
        const currentDate = new Date(year, month, day);
        
        // Check if today
        if (currentDate.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }
        
        // Check if selected date
        if (currentDate.toDateString() === selectedDate.toDateString()) {
            dayDiv.classList.add('selected');
        }
        
        dayDiv.addEventListener('click', () => selectDate(currentDate));
        calendarDays.appendChild(dayDiv);
    }
    
    // Add next month's days to fill the grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
}

function selectDate(date) {
    selectedDate = new Date(date);
    displayTodosForDate(selectedDate);
    closeThaiCalendar();
}

function changeDate(days) {
    selectedDate.setDate(selectedDate.getDate() + days);
    displayTodosForDate(selectedDate);
}

function updateDateDisplay() {
    const dateStr = selectedDate.toLocaleDateString('th-TH-u-ca-buddhist', { 
        weekday: 'short',
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
    });
    selectedDateDisplay.textContent = dateStr;
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//Functions

function addTodo(event) {
    //Prevent form from submitting
    event.preventDefault();
    
    if(todoInput.value.trim() === '') return;
    
    //Get priority value
    const priority = prioritySelect.value;
    const dueDate = formatDateKey(selectedDate);
    
    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    todoDiv.dataset.priority = priority;
    todoDiv.dataset.dueDate = dueDate;
    
    //Priority badge
    const priorityBadge = document.createElement('div');
    priorityBadge.classList.add('priority-badge');
    priorityBadge.innerHTML = `
        <span class="priority-indicator priority-${priority}" title="Priority: ${priority}"></span>
    `;
    todoDiv.appendChild(priorityBadge);
    
    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    
    //Add todo to LocalStorage
    saveLocalTodos({
        text: todoInput.value,
        priority: priority,
        dueDate: dueDate,
        completed: false
    });
    
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    
    // Remove empty message if it exists
    const emptyMsg = todoList.querySelector('.empty-message');
    if(emptyMsg) {
        emptyMsg.remove();
    }
    
    //Append to LIST
    todoList.appendChild(todoDiv);
    //Clear todo Input Value
    todoInput.value = '';
}

function deleteCheck(e) {
    const item = e.target;
    //Delete
    if(item.classList[0]==='trash-btn') {
        const todo = item.parentElement;
        const todoText = todo.querySelector('.todo-item').innerText;
        
        // Ask for confirmation before deleting
        if(confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${todoText}"?`)) {
            //Animation        
            todo.classList.add('fall');
            removeLocalTodos(todo);
            todo.addEventListener('transitionend', function() {
                todo.remove();
            });
        }
    }

    //Check Mark
    if(item.classList[0] == 'complete-btn') {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        // Update in localStorage
        updateTodoCompletion(todo);
    }
}

function updateTodoCompletion(todoDiv) {
    const todoText = todoDiv.querySelector('.todo-item').innerText;
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.findIndex(t => t.text === todoText && t.dueDate === formatDateKey(selectedDate));
    if(todoIndex > -1) {
        todos[todoIndex].completed = todoDiv.classList.contains('completed');
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function displayTodosForDate(date) {
    // Clear current todos
    todoList.innerHTML = '';
    updateDateDisplay();
    
    // Get todos from localStorage
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    // Filter todos for selected date
    const dateKey = formatDateKey(date);
    const dateTodos = todos.filter(todo => todo.dueDate === dateKey);
    
    // Sort by priority (High -> Medium -> Low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    dateTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Display todos
    if(dateTodos.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.classList.add('empty-message');
        emptyMsg.textContent = 'ยังไม่มีงานสำหรับวันนี้';
        todoList.appendChild(emptyMsg);
    } else {
        dateTodos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add("todo");
            todoDiv.dataset.priority = todo.priority;
            todoDiv.dataset.dueDate = dateKey;
            if(todo.completed) {
                todoDiv.classList.add('completed');
            }
            
            // Priority badge
            const priorityBadge = document.createElement('div');
            priorityBadge.classList.add('priority-badge');
            priorityBadge.innerHTML = `
                <span class="priority-indicator priority-${todo.priority}" title="Priority: ${todo.priority}"></span>
            `;
            todoDiv.appendChild(priorityBadge);
            
            // Todo text
            const newTodo = document.createElement('li');
            newTodo.innerText = todo.text;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);
            
            // Complete button
            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            completedButton.classList.add('complete-btn');
            todoDiv.appendChild(completedButton);
            
            // Delete button
            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
            trashButton.classList.add('trash-btn');
            todoDiv.appendChild(trashButton);
            
            todoList.appendChild(todoDiv);
        });
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach((todo) => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains("completed")){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "high":
            case "medium":
            case "low":
                if(todo.dataset && todo.dataset.priority === e.target.value){
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;              
        }  
    });
}

function sortTodo() {
    // Set filter to show only active tasks
    filterOption.value = 'uncompleted';
    filterTodo({target: filterOption});
    
    // Then sort by priority
    const todos = Array.from(todoList.children);
    const priorityOrder = {high: 1, medium: 2, low: 3};
    
    todos.sort((a, b) => {
        const priorityA = priorityOrder[a.dataset.priority] || 999;
        const priorityB = priorityOrder[b.dataset.priority] || 999;
        return priorityA - priorityB;
    });
    
    // Re-append sorted todos to the list
    todos.forEach(todo => todoList.appendChild(todo));
}

function saveLocalTodos(todo) {
    //Check---Do I already have something in there?
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos',JSON.stringify(todos));
}

function getTodos() {
    //Check---Do I already have something in there?
    let todos;

    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    //To loop over
    todos.forEach(function(todo){
        // Handle both old format (string) and new format (object)
        const todoText = typeof todo === 'string' ? todo : todo.text;
        const priority = todo.priority || 'medium';
        
        //Todo DIV
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");
        todoDiv.dataset.priority = priority;
        
        //Priority badge
        const priorityBadge = document.createElement('div');
        priorityBadge.classList.add('priority-badge');
        priorityBadge.innerHTML = `
            <span class="priority-indicator priority-${priority}" title="Priority: ${priority}"></span>
        `;
        todoDiv.appendChild(priorityBadge);
        
        //Create LI
        const newTodo = document.createElement('li');
        newTodo.innerText = todoText;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        //Append to LIST
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    //Check---Do I already have something in there?
    let todos;

    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoText = todo.children[1].innerText; // Updated index due to priority badge
    const todoIndex = todos.findIndex(t => {
        const text = typeof t === 'string' ? t : t.text;
        return text === todoText;
    });
    if(todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
