// GET THE ELEMENTS
// form element
const formElement = document.getElementById('form');
// input field to add new item
const itemInput = document.getElementById('item-input');
// button to clear input field
const btnClearInput = document.getElementById('btn-clear-input');
// button to add new item
const btnAddItem = document.getElementById('btn-add-item');
// ol current
const olCurrent = document.getElementById('current');
// ol completed
const olCompleted = document.getElementById('completed');

let taskList = [];

//EVENT LISTENER
// enable buttons, if input not empty
itemInput.addEventListener('input', btnEnable);

// button clear input field
btnClearInput.addEventListener('click', () => {
    // reset the form element
    formElement.reset();
    // disable the buttons
    btnDisable();
});

// button click or return press actions calls the function
formElement.addEventListener('submit', addNewItem);

// BUTTONS DISABLE-ENABLE
// disable buttons if the input value is empty
function btnDisable() {
    btnClearInput.classList.add('uk-disabled');
    btnAddItem.classList.add('uk-disabled');
}
// enable buttons if the input value is not empty
function btnEnable(e) {
    if (e.target.value.length > 0) {
        btnClearInput.classList.remove('uk-disabled');
        btnAddItem.classList.remove('uk-disabled');
    } else {
        btnDisable();
    }
}

// add new Item
function addNewItem(e) {
    e.preventDefault();
    // set the id for the new item
    const itemId = Date.now();
    // get the text for the new item
    let itemText = itemInput.value;
    // if the imput value is not empty ...
    if (itemText !== '') {
        // build the new item as a object
        let itemObj = {
            id: itemId,
            check: false,
            text: itemText,
        };
        // push the item object into the Tasks List array
        taskList.push(itemObj);
        // reset the form (input value)
        formElement.reset();
        // save the array into the localStorage
        addToLocalStorage(taskList);
        // call the render function
        render();
        // disable the buttons
        btnDisable();
    }
}

// Render the tasks lists
function render() {
    olCurrent.innerHTML = '';
    olCompleted.innerHTML = '';
    taskList.forEach((item) => {
        const check = item.check;
        const collor = check ? 'success' : 'danger';
        let li = `
        <li class="uk-card uk-card-default uk-card-body uk-card-hover uk-padding-small uk-flex uk-flex-middle" data-check="${item.check}" data-id="${item.id}">
            <span class="btn-change uk-margin-small-right uk-icon-button uk-text-${collor}" data-uk-icon="icon: check; ratio: 1.3"></span>
            <span class="uk-flex-auto uk-flex uk-flex-between uk-flex-middle">
                <input class="flex-auto uk-input" type="text" value="${item.text}" readonly>
                <span class="btn-edit uk-margin-small-left uk-icon-button" data-uk-icon="icon: file-edit; ratio: 1.3"></span>
            </span>
            <span class="btn-delete uk-margin-small-left uk-icon-button uk-text-danger" data-uk-icon="icon: trash; ratio: 1.3"></span>
        </li>
        `;
        if (check === true) {
            olCompleted.innerHTML += li;
        } else {
            olCurrent.innerHTML += li;
        }
    });
}

// function to add tasks to localStorage
function addToLocalStorage(taskList) {
    // conver the array to string then store it.
    localStorage.setItem('Tasks List', JSON.stringify(taskList));
    // render them to screen
    render(taskList);
}

// tasks list initial loading from the localStorage
getFromLocalStorage();

// get tasks from localStorage
function getFromLocalStorage() {
    const data = localStorage.getItem('Tasks List');
    // if data exists
    if (data) {
        // converts back to array and store it in tasks array
        taskList = JSON.parse(data);
        // call the render function
        render();
    }
}

// XXXX

// toggle the value to completed and not completed
function moveItem(id) {
    taskList.forEach((item) => {
        // use == , because one is number and other is string
        if (item.id == id) {
            if (item.check === false) {
                item.check = true;
            } else if (item.check === true) {
                item.check = false;
            }
        }
    });
    addToLocalStorage(taskList);
}

function editItem(id, val) {
    taskList.forEach((item) => {
        if (item.id == id) {
            item.text = val;
        }
    });
    addToLocalStorage(taskList);
    console.log(id + ' ' + val);
}

// deletes a item from tasks array
function deleteItem(id) {
    // filters out the <li> with the id and updates the todos array
    taskList = taskList.filter((item) => item.id != id);
    // update the localStorage
    addToLocalStorage(taskList);
}

// eventListener on list elements
olCurrent.addEventListener('click', listActions);
olCompleted.addEventListener('click', listActions);
// list actions. click on buttons with class ...
function listActions(e) {
    if (e.target.parentElement.classList.contains('btn-change')) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        moveItem(id);
    }
    if (e.target.parentElement.classList.contains('btn-edit')) {
        const id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        const textInput = e.target.parentElement.previousElementSibling;
        textInput.removeAttribute('readonly');
        e.target.parentElement.classList.remove('uk-text-success');
        e.target.parentElement.classList.add('uk-text-warning');
        e.target.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('uk-text-warning');
            e.target.parentElement.classList.add('uk-text-success');
            const val = textInput.value;
            // console.log('Es funzt!');
            editItem(id, val);
        });
    }
    if (e.target.parentElement.classList.contains('btn-delete')) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        deleteItem(id);
    }
}
