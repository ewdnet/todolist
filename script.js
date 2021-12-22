// GET THE ELEMENTS
// form element
const form = document.getElementById('form');
// input field to add new item
const input = document.getElementById('item-input');
// button to clear input field
const btnClearInput = document.getElementById('btn-clear-input');
// button to add new item
const btnAddItem = document.getElementById('btn-add-item');
// ol current
const olCurrent = document.getElementById('current');
// ol completed
const olCompleted = document.getElementById('completed');

const currentBadge = document.getElementById('current-badge');
const completedBadge = document.getElementById('completed-badge');

const deleteCurrent = document.querySelector('.btn-delete-current');
const deleteCompleted = document.querySelector('.btn-delete-completed');

// button click or return press actions calls the function
form.addEventListener('submit', newTask);

let taskList = [];

function getFromLocalStorage() {
    const data = localStorage.getItem('Tasks List');
    taskList = JSON.parse(data) || [];
    render();
}

function addToLocalStorage() {
    taskList = taskList.sort((a, b) => b.id - a.id);
    localStorage.setItem('Tasks List', JSON.stringify(taskList));
    getFromLocalStorage();
}

getFromLocalStorage();

function Task(text) {
    this.id = Date.now();
    this.check = false;
    this.text = text;
}

function newTask(event) {
    event.preventDefault();
    const text = input.value;
    if (text !== '') {
        const task = new Task(text);
        addNewTask(task);
        form.reset();
    }
}

function addNewTask(task) {
    taskList.push(task);
    addToLocalStorage();
}

function checkTask(id) {
    taskList.forEach((item) => {
        if (item.id == id) {
            if (item.check === false) item.check = true;
            else if (item.check === true) item.check = false;
        }
    });
    addToLocalStorage();
}

function editTask(id, val) {
    taskList.forEach((item) => {
        if (item.id == id) item.text = val;
    });
    addToLocalStorage();
}

function deleteTask(id) {
    taskList = taskList.filter((item) => item.id !== id);
    addToLocalStorage();
}

function deleteAll(checked) {
    taskList = taskList.filter((item) => item.check !== checked);
    addToLocalStorage();
}

function counter(checked) {
    const items = Number(taskList.filter((item) => item.check === checked).length);
    return items;
}

function itemsCounter() {
    const currentItems = counter(false);
    const completedItems = counter(true);
    currentBadge.innerText = currentItems;
    completedBadge.innerText = completedItems;
}

function render() {
    olCurrent.innerHTML = '';
    olCompleted.innerHTML = '';
    // taskList = taskList.reverse();
    taskList.forEach((item) => {
        const check = item.check;
        const collor = check ? 'success' : 'danger';
        const change = check ? 'current' : 'completed';
        let li = `
        <li class="uk-card uk-card-default uk-card-body uk-card-hover uk-padding-small uk-flex uk-flex-middle" data-check="${item.check}" data-id="${item.id}">
            <span role="button" class="btn-check uk-margin-small-right uk-icon-button uk-text-${collor}" data-uk-tooltip="title: Mark the Task as ${change}" data-uk-icon="icon: check; ratio: 1.3"></span>
            <span class="uk-flex-auto uk-flex uk-flex-between uk-flex-middle">
                <input class="flex-auto uk-input" type="text" value="${item.text}" readonly>
                <span role="button" class="btn-edit uk-margin-small-left uk-icon-button" data-uk-tooltip="title: Edit the Task" data-uk-icon="icon: file-edit; ratio: 1.3"></span>
            </span>
            <span role="button" class="btn-delete uk-margin-small-left uk-icon-button uk-text-danger" data-uk-tooltip="title: Delete the Task" data-uk-icon="icon: trash; ratio: 1.3"></span>
        </li>
        `;
        check === true ? (olCompleted.innerHTML += li) : (olCurrent.innerHTML += li);
    });
    itemsCounter();
    footerButtons();
}

olCurrent.addEventListener('click', itemActions);
olCompleted.addEventListener('click', itemActions);

function itemActions(event) {
    if (event.target.parentElement.classList.contains('btn-check')) {
        const id = event.target.parentElement.parentElement.getAttribute('data-id');
        checkTask(id);
    }
    if (event.target.parentElement.classList.contains('btn-edit')) {
        const id = event.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        const input = event.target.parentElement.previousElementSibling;
        input.removeAttribute('readonly');
        input.focus();
        event.target.parentElement.classList.add('uk-text-success');
        event.target.parentElement.setAttribute('data-uk-tooltip', 'title: Save the Changes');
        event.target.onclick = () => {
            const val = input.value;
            editTask(id, val);
        };
    }
    if (event.target.parentElement.classList.contains('btn-delete')) {
        const id = Number(event.target.parentElement.parentElement.getAttribute('data-id'));
        deleteTask(id);
    }
}

deleteCurrent.onclick = () => deleteAll(false);
deleteCompleted.onclick = () => deleteAll(true);

function footerButtons() {
    counter(false) > 3 ? deleteCurrent.classList.remove('uk-hidden') : deleteCurrent.classList.add('uk-hidden');
    counter(true) > 3 ? deleteCompleted.classList.remove('uk-hidden') : deleteCompleted.classList.add('uk-hidden');
}
