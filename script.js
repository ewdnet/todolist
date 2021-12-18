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

// footer Buttons: print items list, delete all list items
const footerCurrent = document.getElementById('current-footer');
const footerCompleted = document.getElementById('completed-footer');

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
    const itemText = itemInput.value;
    // if the imput value is not empty ...
    if (itemText !== '') {
        // build the new item as a object
        const itemObj = {
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
        // render();
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
        const change = check ? 'current' : 'completed';
        let li = `
        <li class="uk-card uk-card-default uk-card-body uk-card-hover uk-padding-small uk-flex uk-flex-middle" data-check="${item.check}" data-id="${item.id}">
            <span class="btn-change uk-margin-small-right uk-icon-button uk-text-${collor}" data-uk-tooltip="title: Mark the Task as ${change}" data-uk-icon="icon: check; ratio: 1.3"></span>
            <span class="uk-flex-auto uk-flex uk-flex-between uk-flex-middle">
                <input class="flex-auto uk-input" type="text" value="${item.text}" readonly>
                <span class="btn-edit uk-margin-small-left uk-icon-button" data-uk-tooltip="title: Edit the Task" data-uk-icon="icon: file-edit; ratio: 1.3"></span>
            </span>
            <span class="btn-delete uk-margin-small-left uk-icon-button uk-text-danger" data-uk-tooltip="title: Delete the Task" data-uk-icon="icon: trash; ratio: 1.3"></span>
        </li>
        `;
        check === true ? (olCompleted.innerHTML += li) : (olCurrent.innerHTML += li);
    });
    // taskList.length > 3 ? activeFooterButtons(taskList) : ''; // Gio asking
    activeFooterButtons(taskList);
    itemsCounter();
}

// function to add tasks to localStorage
function addToLocalStorage(taskList) {
    // conver the array to string then store it.
    localStorage.setItem('Tasks List', JSON.stringify(taskList));
    // render them to screen
    // render(taskList);
    getFromLocalStorage();
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

// item actions: eventListener on the list items and the functions

// toggle the value to completed or not completed
function moveItem(id) {
    taskList.forEach((item) => {
        // just for the item with the id
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
    // new text (val) for the item with the id
    taskList.forEach((item) => {
        if (item.id == id) {
            item.text = val;
        }
    });
    // update the localStorage
    addToLocalStorage(taskList);
}

// deletes a item from the tasks array
function deleteItem(id) {
    // filters out the item with the id and updates the todos array
    taskList = taskList.filter((item) => item.id != id);
    // update the localStorage
    addToLocalStorage(taskList);
}

// eventListener on the list (ol) elements
olCurrent.addEventListener('click', itemActions);
olCompleted.addEventListener('click', itemActions);
// item actions: move, edit, delete
function itemActions(e) {
    // move item: current <-> completed
    if (e.target.parentElement.classList.contains('btn-change')) {
        // get the item id (li data-id)
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        // call the function
        moveItem(id);
    }
    // edit item
    if (e.target.parentElement.classList.contains('btn-edit')) {
        // get the item id (li data-id)
        const id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        // get the input element
        const textInput = e.target.parentElement.previousElementSibling;
        // make the input writable
        textInput.removeAttribute('readonly');
        // change the button color to green
        e.target.parentElement.classList.add('uk-text-success');
        // change the button tooltip
        e.target.parentElement.setAttribute('data-uk-tooltip', 'title: Save the Changes');
        // add onclick event
        e.target.onclick = () => {
            // get the new text (value) from input
            const val = textInput.value;
            // call the edit function
            editItem(id, val);
        };
    }
    // delete item
    if (e.target.parentElement.classList.contains('btn-delete')) {
        // get the item id (li data-id)
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        // call the function
        deleteItem(id);
    }
}

// EXTRA

// Printing & Deleting

// active footer buttons
function activeFooterButtons(taskList) {
    // if data exists
    if (taskList) {
        const curr = taskList.some((item) => item.check === false);
        const comp = taskList.some((item) => item.check === true);
        // active footer Buttons
        // current
        curr ? footerCurrent.classList.remove('uk-hidden') : footerCurrent.classList.add('uk-hidden');
        // completed
        comp ? footerCompleted.classList.remove('uk-hidden') : footerCompleted.classList.add('uk-hidden');
    }
}

// deletes all current or completed items from the tasks array
const deleteItems = (taskList, checked) => {
    // filters out the item with the check value true/false
    taskList = taskList.filter((item) => item.check === checked);
    // update the localStorage
    addToLocalStorage(taskList);
};
// footerButtons
// get the delete buttons from footer
const currentDelete = document.getElementById('current-delete');
const completedDelete = document.getElementById('completed-delete');
// onclick events for the delete buttons
currentDelete.onclick = () => deleteItems(taskList, true);
completedDelete.onclick = () => deleteItems(taskList, false);

// items counter
function itemsCounter() {
    // get the span elements for the counter (badge)
    const currentBadge = document.getElementById('current-badge');
    const completedBadge = document.getElementById('completed-badge');
    // count the current items
    const currentItems = taskList.filter((item) => item.check === false).length;
    // count the completed items
    const completedItems = taskList.filter((item) => item.check === true).length;
    //
    currentBadge.innerText = currentItems;
    completedBadge.innerText = completedItems;
}

// items list print preview (just for testing)

// get the elements for the
// print-title
const printTitle = document.getElementById('print-title');
// and the print-list
const printList = document.getElementById('print-list');
// get the nuttons for print
// the current list
const currentPrint = document.getElementById('current-print');
// and the completed list
const completedPrint = document.getElementById('completed-print');

// add eventListener to the print buttons (footerButtons)
currentPrint.onclick = () => printPreview(false);
completedPrint.onclick = () => printPreview(true);

// print preview function
function printPreview(list) {
    // const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');
    printTitle.innerText = list ? 'Completed Tasks' : 'Current Tasks';
    printList.innerHTML = '';
    taskList.forEach((item) => {
        if (item.check === list) {
            const li = `<li>${item.text}</li>`;
            printList.innerHTML += li;
        }
    });
}

function printpart() {
    const printwin = window.open('');
    printwin.document.write(document.getElementById('print-body').innerHTML);
    printwin.stop();
    printwin.print();
    printwin.close();
}

const getToPrinter = document.getElementById('get-to-printer');
getToPrinter.addEventListener('click', printpart);
