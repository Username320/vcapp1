document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен и готов к работе!');

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Безопасная загрузка задач из localStorage
    let todos = [];
    try {
        const raw = localStorage.getItem('todos');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                todos = parsed;
            }
        }
    } catch (e) {
        console.error('Ошибка чтения задач из localStorage:', e);
        todos = [];
    }

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, idx) => {
            let text = '';
            let date = '';
            if (typeof todo === 'object' && todo !== null && 'text' in todo && 'date' in todo) {
                text = todo.text;
                date = todo.date;
            } else if (typeof todo === 'string') {
                text = todo;
                date = '';
            }
            const li = document.createElement('li');
            const content = document.createElement('span');
            content.textContent = text + (date ? ' — ' + date : '');

            // Кнопка редактирования
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editBtn.setAttribute('aria-label', 'Редактировать');
            editBtn.style.marginRight = '8px';
            editBtn.addEventListener('click', function() {
                // Показываем поле для редактирования
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = text;
                editInput.style.marginRight = '8px';
                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Сохранить';
                saveBtn.addEventListener('click', function() {
                    const newText = editInput.value.trim();
                    if (newText) {
                        todos[idx].text = newText;
                        saveTodos();
                        renderTodos();
                    }
                });
                // Очищаем li и добавляем элементы для редактирования
                li.innerHTML = '';
                li.appendChild(editInput);
                li.appendChild(saveBtn);
            });

            // Кнопка удаления
            const btn = document.createElement('button');
            btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btn.setAttribute('aria-label', 'Удалить');
            btn.addEventListener('click', function() {
                todos.splice(idx, 1);
                saveTodos();
                renderTodos();
            });

            li.appendChild(content);
            li.appendChild(editBtn);
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
            const now = new Date();
            const dateStr = now.toLocaleString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            todos.push({ text: value, date: dateStr });
            saveTodos();
            renderTodos();
            input.value = '';
        }
    });

    // Миграция старого формата (если есть)
    if (todos.length && typeof todos[0] === 'string') {
        todos = todos.map(t => ({ text: t, date: new Date().toLocaleString('ru-RU') }));
        saveTodos();
    }

    renderTodos();
}); 