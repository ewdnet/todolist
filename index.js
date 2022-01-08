// GET THE ELEMENTS
// form element
const form = document.getElementById('form')
// input field to add new item
const input = document.getElementById('item-input')
// button to clear input field
const clear = document.getElementById('btn-clear-input')
// button to add new item
const add = document.getElementById('btn-add-item')
// ol current
const currOl = document.getElementById('current')
// ol completed
const compOl = document.getElementById('completed')
// counter for the current / completed list items
const currBdg = document.getElementById('current-badge')
const compBdg = document.getElementById('completed-badge')
// delete buttons for the current / completed lists
const currDel = document.querySelector('.btn-delete-current')
const compDel = document.querySelector('.btn-delete-completed')

// enable buttons, if input not empty
input.addEventListener('input', btnEnable)

// button click or return press actions calls the function
form.addEventListener('submit', newTask)
//
clear.addEventListener('click', clearInput)

//

function btnDisable() {
  clear.classList.add('uk-disabled')
  add.classList.add('uk-disabled')
}

function btnEnable(e) {
  if (e.target.value.length > 0) {
    clear.classList.remove('uk-disabled')
    add.classList.remove('uk-disabled')
  } else {
    btnDisable()
  }
}

function clearInput() {
  form.reset()
  btnDisable()
}

//

let list = []

function getFromLocalStorage() {
  const data = localStorage.getItem('Tasks List')
  list = JSON.parse(data) || []
  render()
}

function addToLocalStorage() {
  list = list.sort((a, b) => b.id - a.id)
  localStorage.setItem('Tasks List', JSON.stringify(list))
  getFromLocalStorage()
}

getFromLocalStorage()

function Task(text) {
  this.id = Date.now()
  this.check = false
  this.text = text
}

function newTask(event) {
  event.preventDefault()
  const text = input.value
  const task = new Task(text)
  addNewTask(task)
  clearInput()
}

function addNewTask(task) {
  list.push(task)
  addToLocalStorage()
}

function checkTask(id) {
  list.forEach(item => {
    if (item.id === id) item.check = !item.check
  })
  addToLocalStorage()
}

function editTask(id, val) {
  list.forEach(item => {
    if (item.id === id) item.text = val
  })
  addToLocalStorage()
}

function deleteTask(id) {
  list = list.pop(item => item.id === id)
  addToLocalStorage()
}

function deleteAll(check) {
  list = list.filter(item => item.check !== check)
  addToLocalStorage()
}

function counter(checked) {
  const items = Number(list.filter(item => item.check === checked).length)
  return items
}

function itemsCounter() {
  const currentItems = counter(false)
  const completedItems = counter(true)
  currBdg.innerText = currentItems
  compBdg.innerText = completedItems
}

function render() {
  currOl.textContent = ''
  compOl.textContent = ''
  list.forEach(item => {
    const check = item.check
    const collor = check ? 'success' : 'danger'
    const change = check ? 'current' : 'completed'
    let li = `
        <li class="uk-card uk-card-default uk-card-body uk-card-hover uk-padding-small uk-flex uk-flex-middle" data-check="${item.check}" data-id="${item.id}">
            <span role="button" class="btn-check uk-margin-small-right uk-icon-button uk-text-${collor}" data-uk-tooltip="title: Mark the Task as ${change}" data-uk-icon="icon: check; ratio: 1.3"></span>
            <span class="input-wrap uk-flex-auto uk-flex uk-flex-between uk-flex-middle">
                <input class="flex-auto uk-input" type="text" value="${item.text}" readonly>
                <span role="button" class="btn-edit uk-margin-small-left uk-icon-button" data-uk-tooltip="title: Edit the Task" data-uk-icon="icon: file-edit; ratio: 1.3"></span>
            </span>
            <span role="button" class="btn-delete uk-margin-small-left uk-icon-button uk-text-danger" data-uk-tooltip="title: Delete the Task" data-uk-icon="icon: trash; ratio: 1.3"></span>
        </li>
        `
    check === true ? compOl.insertAdjacentHTML('beforeend', li) : currOl.insertAdjacentHTML('beforeend', li)
  })
  itemsCounter()
  footerButtons()
}

currOl.addEventListener('click', itemActions)
compOl.addEventListener('click', itemActions)

function itemActions(event) {
  if (event.target.closest('.btn-check')) {
    const id = Number(event.target.closest('li').getAttribute('data-id'))
    checkTask(id)
  }
  if (event.target.closest('.btn-edit')) {
    const id = Number(event.target.closest('li').getAttribute('data-id'))
    const input = event.target.closest('.input-wrap').firstElementChild
    input.removeAttribute('readonly')
    input.focus()
    event.target.closest('.btn-edit').classList.add('uk-text-success')
    event.target.closest('.btn-edit').setAttribute('data-uk-tooltip', 'title: Save the Changes')
    event.target.closest('.btn-edit').onclick = () => {
      const val = input.value
      editTask(id, val)
    }
  }
  if (event.target.closest('.btn-delete')) {
    const id = Number(event.target.closest('li').getAttribute('data-id'))
    deleteTask(id)
  }
}

currDel.onclick = () => deleteAll(false)
compDel.onclick = () => deleteAll(true)

function footerButtons() {
  counter(false) > 3 ? currDel.classList.remove('uk-hidden') : currDel.classList.add('uk-hidden')
  counter(true) > 3 ? compDel.classList.remove('uk-hidden') : compDel.classList.add('uk-hidden')
}
