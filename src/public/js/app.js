var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Api, { RequestMethod } from './Api.js';
~function () {
    const itemAPI = new Api('item');
    const createForm = document.querySelector('#create-form');
    const itemsContainer = document.querySelector('#item-container');
    createForm === null || createForm === void 0 ? void 0 : createForm.addEventListener('submit', createItem);
    function createItem(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const content = this.input.value.trim();
            if (!content)
                return;
            this.input.value = '';
            const { error, document: item } = yield itemAPI.makeRequest(RequestMethod.post, 'create', { content });
            if (error)
                return alert(error);
            const placeholder = document.querySelector('#item-placeholder');
            if (placeholder)
                placeholder.remove();
            insertItem(item);
        });
    }
    function backupContent(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.innerText = this.innerText.trim();
            return this.blur();
        }
        const content = this.innerText.trim();
        if (content.length > 0)
            this.dataset.previousContent = content;
    }
    function updateContent(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = this.innerText.trim();
            const container = this.parentElement;
            const { itemId, isDone } = container.dataset;
            this.classList.remove('border-blue-500');
            if (isDone === '1')
                this.classList.add('line-through');
            this.removeAttribute('contenteditable');
            if (content.length < 1) {
                this.innerText = this.dataset.previousContent;
                return;
            }
            const { error, document: item } = yield itemAPI.makeRequest(RequestMethod.patch, `update/${itemId}/content`, { content });
            if (error)
                return alert(error);
            const { content: c } = item;
            this.innerText = c;
        });
    }
    function updateStatus(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasAttribute('contenteditable'))
                return;
            const container = this.parentElement;
            const { itemId, isDone } = container.dataset;
            const is_done = !(isDone === '1');
            const { error, document: item } = yield itemAPI.makeRequest(RequestMethod.patch, `update/${itemId}/status`, { is_done });
            if (error)
                return alert(error);
            const { isDone: i } = item;
            if (i === 1)
                this.classList.add('line-through');
            else
                this.classList.remove('line-through');
            container.dataset.isDone = i;
        });
    }
    function deleteItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm('Remove this item?'))
                return;
            const container = this.parentElement.parentElement;
            const itemId = container.dataset.itemId;
            const { error } = yield itemAPI.makeRequest(RequestMethod.delete, `delete/${itemId}`);
            if (error)
                return alert(error);
            container.remove();
            if (itemsContainer.childElementCount < 1)
                generateItemPlaceholder();
        });
    }
    function enableEdit() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.parentElement.parentElement;
            const itemContent = container.querySelector('.item-content');
            itemContent.setAttribute('contenteditable', true);
            itemContent.classList.add('border-blue-500');
            itemContent.classList.remove('line-through');
            itemContent.focus();
            if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
                const range = document.createRange();
                range.selectNodeContents(itemContent);
                range.collapse(false);
                const selection = window.getSelection();
                selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
                selection === null || selection === void 0 ? void 0 : selection.addRange(range);
            }
        });
    }
    function insertItem(item) {
        const { itemId, content, isDone } = item;
        const mainContainer = document.createElement('div');
        mainContainer.className = 'shadow-md bg-gray-100 rounded-lg p-4 flex mb-4';
        mainContainer.dataset.itemId = itemId;
        mainContainer.dataset.isDone = `${isDone}`;
        const contentContainer = document.createElement('span');
        contentContainer.className = 'item-content grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden';
        if (isDone)
            contentContainer.classList.add('line-through');
        contentContainer.append(document.createTextNode(content));
        contentContainer.addEventListener('blur', updateContent);
        contentContainer.addEventListener('click', updateStatus);
        contentContainer.addEventListener('keyup', backupContent);
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'w-auto ml-4 text-white text-center flex flex-col';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn bg-red-500 rounded-t-lg px-2 py-1 hover:bg-red-600';
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteButton.addEventListener('click', deleteItem);
        const updateButton = document.createElement('button');
        updateButton.className = 'update-btn bg-blue-500 rounded-b-lg px-2 py-1 hover:bg-blue-700';
        updateButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        updateButton.addEventListener('click', enableEdit);
        buttonsContainer.append(deleteButton, updateButton);
        mainContainer.append(contentContainer, buttonsContainer);
        itemsContainer.append(mainContainer);
    }
    function generateItemPlaceholder() {
        if (document.querySelector('#item-placeholder'))
            return;
        const container = document.createElement('div');
        container.className = 'shadow-md bg-gray-100 rounded-lg p-4 flex mb-4';
        container.id = 'item-placeholder';
        const contentContainer = document.createElement('span');
        contentContainer.className = 'grow bg-white p-4 rounded-lg border border-gray-200 w-8/12 text-ellipsis overflow-hidden';
        contentContainer.append(document.createTextNode('📃 List is empty.'));
        container.append(contentContainer);
        itemsContainer.append(container);
    }
    ~function initialize() {
        const itemContents = document.querySelectorAll('.item-content');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const updateButtons = document.querySelectorAll('.update-btn');
        for (let index = 0; index < itemContents.length; index++) {
            const itemContent = itemContents[index];
            const deleteButton = deleteButtons[index];
            const updateButton = updateButtons[index];
            itemContent.addEventListener('blur', updateContent);
            itemContent.addEventListener('keyup', backupContent);
            itemContent.addEventListener('click', updateStatus);
            deleteButton.addEventListener('click', deleteItem);
            updateButton.addEventListener('click', enableEdit);
        }
    }();
}();
