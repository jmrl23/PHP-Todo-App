~function () {

  const createForm = document.querySelector('#create-form')
  const itemContainer = document.querySelector('#item-container')

  createForm.addEventListener('submit', e => {
    e.preventDefault()
    const content = createForm.input.value.trim()
    if (!content) return
    createForm.input.value = ''
    createForm.input.blur()
    createTodo(content)
  })

  bindDeleteToButtons()
  bindUpdateButtons()

  function generateItemPlaceholder() {
    itemContainer.innerHTML += `
    <div class="shadow-md bg-gray-100 rounded-lg p-4 flex mb-4" id="item-placeholder">
      <span class="grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden">
        📃 List is empty.
      </span>
    </div>
    `
  }

  function safeHTML(html) {
    const map = {
      '&': '&#38;',
      '"': '&#34;',
      '\'': '&#39;',
      '<': '&lt;',
      '>': '&gt;'
    }
    return html.replace(/[\&\"\'\<\>]/g, e => map[e])
  }

  function bindUpdateButtons() {
    const updateButtons = document.querySelectorAll('.update-btn')
    for (const button of updateButtons) {
      const itemContent = button.parentElement.parentElement.querySelector('.item-content')

      const container = button.parentElement.parentElement
      const itemId = container.dataset.itemId
      let htmlContent = itemContent.innerHTML

      itemContent.addEventListener('blur', async () => {
        itemContent.classList.remove('border-blue-500')
        if (!itemContent.innerText) return itemContent.innerHTML = htmlContent
        if (!!+container.dataset.isDone) itemContent.classList.add('line-through')
        itemContent.removeAttribute('contenteditable')
        const content = itemContent.innerText.trim()
        try {
          const response = await fetch(`api/item/update/${itemId}/content`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({ content })
          })
          const { error, document: item } = await response.json()
          if (error) return alert(error)
          itemContent.innerHTML = safeHTML(item.content)
          htmlContent = itemContent.innerHTML
        } catch (error) {
          alert(error)
        }
      })

      itemContent.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          itemContent.innerHTML = itemContent.innerHTML.trim()
          itemContent.blur()
          return
        }
        if (itemContent.innerText) htmlContent = itemContent.innerHTML
      })

      itemContent.addEventListener('click', async () => {
        if (itemContent.hasAttribute('contenteditable')) return
        const isDone = !!+container.dataset.isDone
        try {
          const response = await fetch(`api/item/update/${itemId}/status`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({ is_done: !isDone })
          })
          const { error, document: item } = await response.json()
          if (error) return alert(error)
          container.dataset.isDone = item.isDone
          if (item.isDone) return itemContent.classList.add('line-through')
          itemContent.classList.remove('line-through')
        } catch (error) {
          alert(error.message)
        }
      })

      itemContent.addEventListener('focus', () => {
        itemContent.classList.remove('line-through')

        if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
          const range = document.createRange()
          range.selectNodeContents(itemContent)
          range.collapse(false)
          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
        } else if (typeof document.body.createTextRange != 'undefined') {
          const textRange = document.body.createTextRange()
          textRange.moveToElementText(itemContent)
          textRange.collapse(false)
          textRange.select()
        }
      })

      button.addEventListener('click', () => {
        itemContent.setAttribute('contenteditable', true)
        itemContent.classList.add('border-blue-500')
        itemContent.focus()
      })
    }
  }

  function bindDeleteToButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn')
    for (const button of deleteButtons) {
      button.addEventListener('click', async () => {
        if (!confirm('Remove this item?')) return
        const container = button.parentElement.parentElement
        const itemId = container.dataset.itemId
        try {
          const response = await fetch(`api/item/delete/${itemId}`, {
            method: 'DELETE'
          })
          const { error } = await response.json()
          if (error) return alert(error)
          container.remove()
          if (!document.querySelector('#item-placeholder') && itemContainer.childElementCount < 1)
            generateItemPlaceholder()
        } catch (error) {
          alert(error.message)
        }
      })
    }
  }

  function outputDocument(item) {
    const itemPlaceholder = itemContainer.querySelector('#item-placeholder')
    if (itemPlaceholder) itemPlaceholder.remove()
    itemContainer.innerHTML += `
    <div class="shadow-md bg-gray-100 rounded-lg p-4 flex mb-4" data-item-id="${item.itemId}" data-is-done="${parseInt(item.isDone)}">
      <span class="item-content ${item.isDone ? 'line-through ' : ''}grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden">
        ${safeHTML(item.content)}
      </span>
      <div class="w-auto ml-4 text-white text-center flex flex-col">
        <button class="delete-btn bg-red-500 rounded-t-lg px-2 py-1 hover:bg-red-600">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button class="update-btn bg-blue-500 rounded-b-lg px-2 py-1 hover:bg-blue-700">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>
    </div>
    `
    bindDeleteToButtons()
    bindUpdateButtons()
  }

  async function createTodo(content) {
    try {
      const response = await fetch('api/item/create', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ content })
      })
      const { error, document: item } = await response.json()
      if (error) return alert(error)
      outputDocument(item)
    } catch (error) {
      alert(error.message)
    }
  }

}()
