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
    let currentTasks = [];
    let completedTasks = [];

    // get current tasks from localStorage, if any
    // let currentFromLocalStorage = JSON.parse(localStorage.getItem('currentTasks'));
    // get them and call the render function
    // if (currentFromLocalStorage) {
    //     currentTasks = currentFromLocalStorage;
    //     render('current');
    // }
    // get completed tasks from localStorage, if any
    // const completedFromLocalStorage = JSON.parse(localStorage.getItem('completedTasks'));
    // get them and call the render function
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

    // TASK-LISTS FUNCTIONS
});
