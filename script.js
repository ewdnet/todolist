document.addEventListener('DOMContentLoaded', () => {
  // form element
  const formElement = document.querySelector('form');
  // input field to add new item
  const itemInput = document.getElementById('item-input');
  // button to clear input field
  const btnClearInput = document.getElementById('btn-clear-input');
  // button to add new item
  const btnAddItem = document.getElementById('btn-add-item');

  // INPUT FIELD & BUTTONS
  function btnDisable() {
    btnClearInput.classList.add('uk-disabled');
    btnAddItem.classList.add('uk-disabled');
  }
  // empty?
  itemInput.addEventListener('input', btnEnable);
  function btnEnable(e) {
    if (e.target.value.length > 0) {
      btnClearInput.classList.remove('uk-disabled');
      btnAddItem.classList.remove('uk-disabled');
    } else {
      btnClearInput.classList.add('uk-disabled');
      btnAddItem.classList.add('uk-disabled');
    }
  }
  // button clear input field
  btnClearInput.addEventListener('click', () => {
    // reset the form element
    formElement.reset();
    // disable the buttons
    btnDisable();
  });
  // button click and return press actions
  btnAddItem.addEventListener('click', userAction);
  formElement.addEventListener('submit', userAction);
  //
  function userAction(e) {
    e.preventDefault();
    // grab the value of the input element
    let newItem = itemInput.value;
    // if the input element is not empty then run the function to add an item
    if (newItem) {
      // this function will add a new item to the todo list
      addItemTodo(newItem);
      // reset the input after we added a new item
      itemInput.value = '';
      // disable the buttons
      btnDisable();
    }
  }
  // TODO: BTN MOVE ITEM -> to current or to completed | one function with parameters
  function addItemTodo(text) {
    // grab the `ul`
    let list = document.getElementById('current');
    // create an `li`
    let item = document.createElement('li');
    item.classList.add('uk-card', 'uk-card-default', 'uk-card-body', 'uk-card-hover', 'uk-padding-small', 'uk-flex', 'uk-flex-middle');
    item.setAttribute('data-itemid', Date.now());
    // create an checked button | todo: event listener and function to move the task to the completed list
    let complete = document.createElement('span');
    complete.classList.add('uk-margin-small-right', 'uk-text-warning', 'uk-icon-button');
    complete.setAttribute('data-uk-icon', 'icon: check; ratio: 1.3');
    //
    complete.addEventListener('click', completeItem);
    // wrap the task (text) into a span element
    let textWrap = document.createElement('span');
    textWrap.classList.add('uk-flex-auto');
    textWrap.innerText = text;
    // create a task delete button
    let remove = document.createElement('span');
    // remove.classList.add('uk-margin-small-left', 'uk-text-danger', 'uk-icon-button');
    remove.classList.add('uk-margin-small-left', 'uk-icon-button');
    remove.setAttribute('data-uk-icon', 'trash');
    // click calls the deleting function
    remove.addEventListener('click', removeItem);
    // append all three elements to the li element
    item.appendChild(complete);
    item.appendChild(textWrap);
    item.appendChild(remove);
    // insert the li on the top of the ul
    list.insertBefore(item, list.childNodes[0]);
  }

  function completeItem() {
    // this.classList.remove('uk-text-warning');
    // this.classList.add('uk-text-success');
    this.classList.toggle('uk-text-warning');
    // grab the `li` by targeting the parent of the button (button -> li)
    let item = this.parentNode;
    // grab the `ol` (li -> ol)
    let parent = item.parentNode;
    // grab the parent id
    let id = parent.id;
    // check if the item should go in the completed or if it should be re-added to todo by using a ternary operator
    let ol = id === 'current' ? document.getElementById('completed') : document.getElementById('current');
    // remove the item to its current `ol`
    parent.removeChild(item);
    // add the item to the new `ol`
    ol.insertBefore(item, ol.childNodes[0]);
  }

  // task remove function
  function removeItem() {
    // grab the li by targeting the parent of the button (span)
    let item = this.parentNode;
    // grab the ol (parent of li)
    let parent = item.parentNode;
    // remove li from ol
    parent.removeChild(item);
  }
});
