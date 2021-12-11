// TODO list
document.addEventListener('DOMContentLoaded', () => {
    // GET THE ELEMENTS
    // form element
    const formElement = document.querySelector('form');
    // input field to add new item
    const itemInput = document.getElementById('item-input');
    // button to clear input field
    const btnClearInput = document.getElementById('btn-clear-input');
    // button to add new item
    const btnAddItem = document.getElementById('btn-add-item');

    // start the task-arrays
    // let currentTasks = [];
    // let completedTasks = [];

    // get current tasks from localStorage, if any
    // let currentTasks = JSON.parse(localStorage.getItem('currentTasks')) || [];
    // get them and call the render function
    // if (currentFromLocalStorage) {
    //     currentTasks = currentFromLocalStorage;
    //     render('current');
    // }
    let currentTasks = JSON.parse(localStorage.getItem('currentTasks')) || [];
    if (currentTasks.length > 0) {
        render('current');
    }
    // render('current');
    // get completed tasks from localStorage, if any
    // let completedFromLocalStorage = JSON.parse(localStorage.getItem('completedTasks'));
    // // get them and call the render function
    // if (completedFromLocalStorage) {
    //     completedTasks = completedFromLocalStorage;
    //     render('completed');
    // }

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

    // button click or return press actions: ADD NEW TASK
    btnAddItem.addEventListener('click', addNewItem);
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
            btnClearInput.classList.add('uk-disabled');
            btnAddItem.classList.add('uk-disabled');
        }
    }

    // XXXX
    //
    function addNewItem(e) {
        e.preventDefault();
        currentTasks = JSON.parse(localStorage.getItem('currentTasks'));
        const itemId = Date.now();
        let itemText = itemInput.value;
        if (itemText != '') {
            let itemObj = {
                itemid: itemId,
                text: itemText,
            };
            // push the item object
            currentTasks.push(itemObj);
            itemText = '';
            localStorage.setItem('currentTasks', JSON.stringify(currentTasks));
            // render('current', itemId, false);
            render('current');
            // reset the array currentTasks
            currentTasks = [];
            // reset the input after we added a new item
            itemInput.value = '';
            // disable the buttons
            btnDisable();
        }
    }

    // Task lists render function
    function render(list) {
        const taskList = `${list}Tasks`;
        const items = JSON.parse(localStorage.getItem(taskList));

        let olEl = document.getElementById(list);
        let checked = list === 'completed' ? 'success' : 'warning';
        for (let i = 0; i < items.length; i++) {
            let itemid = items[i].itemid;
            // create an li
            let item = document.createElement('li');
            item.classList.add('uk-card', 'uk-card-default', 'uk-card-body', 'uk-card-hover', 'uk-padding-small', 'uk-flex', 'uk-flex-middle');
            item.setAttribute('data-itemid', itemid);
            // create an checked button and event listener on it
            let complete = document.createElement('span');
            complete.classList.add('uk-margin-small-right', 'uk-text-' + checked, 'uk-icon-button');
            complete.setAttribute('data-uk-icon', 'icon: check; ratio: 1.3');
            // complete.addEventListener('click', completeItem);
            // wrap the task (text) into a span element
            let textWrap = document.createElement('span');
            textWrap.classList.add('uk-flex-auto');
            textWrap.innerText = items[i].text;
            // create a task delete button and event listener on it
            let remove = document.createElement('span');
            remove.classList.add('uk-margin-small-left', 'uk-text-danger', 'uk-icon-button');
            remove.setAttribute('data-uk-icon', 'trash');
            remove.addEventListener('click', () => {
                let items = JSON.parse(localStorage.getItem(taskList));
                let index = items.findIndex((item) => item.itemid == itemid);
                items.splice(index, 1);
                localStorage.setItem(taskList, JSON.stringify(items));
            });

            // append all three elements to the li element
            item.appendChild(complete);
            item.appendChild(textWrap);
            item.appendChild(remove);
            // insert the li on the top of the ul
            olEl.insertBefore(item, olEl.childNodes[0]);
        }
    }
});
