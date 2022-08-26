import Api, { RequestMethod } from './Api.js'

interface Doc {
  itemId: string,
  content: string,
  isDone: number
}

~function () {

  const itemAPI = new Api('item')

  const createForm: HTMLFormElement = document.querySelector('#create-form')!
  const itemsContainer: HTMLDivElement = document.querySelector('#item-container')!

  createForm?.addEventListener('submit', createItem)

  async function createItem(this: any, e: Event) {
    e.preventDefault()
    const content = this.input.value.trim()
    if (!content) return
    this.input.value = ''
    const { error, document: item } = await itemAPI.makeRequest(RequestMethod.post, 'create', { content })
    if (error) return alert(error)
    const placeholder = document.querySelector('#item-placeholder')
    if (placeholder) placeholder.remove()
    insertItem(item)
  }

  function backupContent(this: any, e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.innerText = this.innerText.trim()
      return this.blur()
    }
    const content = this.innerText.trim()
    if (content.length > 0) this.dataset.previousContent = content
  }

  async function updateContent(this: any, e: Event) {
    const content = this.innerText.trim()
    const container = this.parentElement
    const { itemId, isDone } = container.dataset
    this.classList.remove('border-blue-500')
    if (isDone === '1') this.classList.add('line-through')
    this.removeAttribute('contenteditable')
    if (content.length < 1) {
      this.innerText = this.dataset.previousContent
      return
    }
    const { error, document: item } = await itemAPI.makeRequest(RequestMethod.patch, `update/${itemId}/content`, { content })
    if (error) return alert(error)
    const { content: c } = item
    this.innerText = c
  }

  async function updateStatus(this: any, e: Event) {
    if (this.hasAttribute('contenteditable')) return
    const container = this.parentElement
    const { itemId, isDone } = container.dataset
    const is_done = !(isDone === '1')
    const { error, document: item } = await itemAPI.makeRequest(RequestMethod.patch, `update/${itemId}/status`, { is_done })
    if (error) return alert(error)
    const { isDone: i } = item
    if (i === 1) this.classList.add('line-through')
    else this.classList.remove('line-through')
    container.dataset.isDone = i
  }

  async function deleteItem(this: any) {
    if (!confirm('Remove this item?')) return
    const container = this.parentElement.parentElement
    const itemId = container.dataset.itemId
    const { error } = await itemAPI.makeRequest(RequestMethod.delete, `delete/${itemId}`)
    if (error) return alert(error)
    container.remove()
    if (itemsContainer.childElementCount < 1) generateItemPlaceholder()
  }

  async function enableEdit(this: any) {
    const container = this.parentElement.parentElement
    const itemContent = container.querySelector('.item-content')
    itemContent.setAttribute('contenteditable', true)
    itemContent.classList.add('border-blue-500')
    itemContent.classList.remove('line-through')
    itemContent.focus()

    if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
      const range = document.createRange()
      range.selectNodeContents(itemContent)
      range.collapse(false)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  function insertItem(item: Doc) {
    const { itemId, content, isDone } = item

    const mainContainer = document.createElement('div')
    mainContainer.className = 'shadow-md bg-gray-100 rounded-lg p-4 flex mb-4'
    mainContainer.dataset.itemId = itemId
    mainContainer.dataset.isDone = `${isDone}`

    const contentContainer = document.createElement('span')
    contentContainer.className = 'item-content grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden'
    if (isDone) contentContainer.classList.add('line-through')
    contentContainer.append(document.createTextNode(content))
    contentContainer.addEventListener('blur', updateContent)
    contentContainer.addEventListener('click', updateStatus)
    contentContainer.addEventListener('keyup', backupContent)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'w-auto ml-4 text-white text-center flex flex-col'

    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-btn bg-red-500 rounded-t-lg px-2 py-1 hover:bg-red-600'
    deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    deleteButton.addEventListener('click', deleteItem)

    const updateButton = document.createElement('button')
    updateButton.className = 'update-btn bg-blue-500 rounded-b-lg px-2 py-1 hover:bg-blue-700'
    updateButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    updateButton.addEventListener('click', enableEdit)

    buttonsContainer.append(deleteButton, updateButton)
    mainContainer.append(contentContainer, buttonsContainer)
    itemsContainer.append(mainContainer)
  }

  function generateItemPlaceholder() {
    if (document.querySelector('#item-placeholder')) return

    const container = document.createElement('div')
    container.className = 'shadow-md bg-gray-100 rounded-lg p-4 flex mb-4'
    container.id = 'item-placeholder'

    const contentContainer = document.createElement('span')
    contentContainer.className = 'grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden'
    contentContainer.append(document.createTextNode('📃 List is empty.'))

    container.append(contentContainer)
    itemsContainer.append(container)
  }

  ~function initialize() {
    const itemContents: NodeList = document.querySelectorAll('.item-content')
    const deleteButtons: NodeList = document.querySelectorAll('.delete-btn')
    const updateButtons: NodeList = document.querySelectorAll('.update-btn')

    for (let index = 0; index < itemContents.length; index++) {
      const itemContent = itemContents[index]
      const deleteButton = deleteButtons[index]
      const updateButton = updateButtons[index]

      itemContent.addEventListener('blur', updateContent)
      itemContent.addEventListener('keyup', backupContent as (e: Event) => void)
      itemContent.addEventListener('click', updateStatus)
      deleteButton.addEventListener('click', deleteItem)
      updateButton.addEventListener('click', enableEdit)
    }
  }()

}()