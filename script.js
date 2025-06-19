document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен и готов к работе!');

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Загрузка задач из localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, idx) => {
            const li = document.createElement('li');
            li.textContent = todo;
            const btn = document.createElement('button');
            btn.textContent = 'Удалить';
            btn.addEventListener('click', function() {
                todos.splice(idx, 1);
                saveTodos();
                renderTodos();
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const value = input.value.trim();
        if (value) {
            todos.push(value);
            saveTodos();
            renderTodos();
            input.value = '';
        }
    });

    renderTodos();
}); 