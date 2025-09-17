(function(){
  const inputElement = document.getElementById('todo-input');
  const addButton = document.getElementById('add-btn');
  const listElement = document.getElementById('todo-list');
  const STORAGE_KEY = 'todo_app_items';

  function saveTodos(){
    const items = Array.from(listElement.querySelectorAll('li')).map(function(li){
      const textEl = li.querySelector('.text');
      return {
        text: textEl ? textEl.textContent : '',
        completed: li.classList.contains('completed')
      };
    });
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }catch(e){
      // ignore quota or serialization errors
    }
  }

  function loadTodos(){
    let data;
    try{
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }catch(e){
      data = [];
    }
    if(!Array.isArray(data)) return;
    data.forEach(function(item){
      const listItem = createTodoItem(item.text, !!item.completed);
      listElement.appendChild(listItem);
    });
  }

  function createTodoItem(text, completed){
    const listItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.setAttribute('aria-label', '删除');
    removeButton.textContent = '✕';

    if(completed){
      listItem.classList.add('completed');
      checkbox.checked = true;
    }

    checkbox.addEventListener('change', function(){
      if (checkbox.checked) {
        listItem.classList.add('completed');
      } else {
        listItem.classList.remove('completed');
      }
      saveTodos();
    });

    removeButton.addEventListener('click', function(){
      listItem.remove();
      saveTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(textSpan);
    listItem.appendChild(removeButton);

    return listItem;
  }

  function addTodo(){
    const value = (inputElement.value || '').trim();
    if(!value) return;
    const item = createTodoItem(value, false);
    listElement.appendChild(item);
    inputElement.value = '';
    inputElement.focus();
    saveTodos();
  }

  addButton.addEventListener('click', addTodo);

  // Toggle completed by clicking the list item (excluding checkbox/remove button)
  listElement.addEventListener('click', function(event){
    const target = event.target;
    const listItem = target.closest('li');
    if(!listItem || !listElement.contains(listItem)) return;
    if(target.matches('input[type="checkbox"], .remove')) return;

    const checkbox = listItem.querySelector('input[type="checkbox"]');
    const willComplete = !listItem.classList.contains('completed');
    listItem.classList.toggle('completed', willComplete);
    if(checkbox) checkbox.checked = willComplete;
    saveTodos();
  });

  // Load from storage on startup
  loadTodos();
})();
