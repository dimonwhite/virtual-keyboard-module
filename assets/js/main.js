import keyboard from './keys';

export default class Keyboard {
  constructor(block, input) {
    this.keys = keyboard;
    this.wrapBlock = block;
    this.language = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'ru';
    this.keyboardBlock = document.createElement('div');
    this.textarea = input;
    this.up = false;
    this.shiftDown = false;
    this.capsDown = false;
    this.textareaSelection = 0;
  }

  saveLanguage() {
    sessionStorage.setItem('language', this.language);
  }

  toggleLanguage() {
    this.language = this.language === 'ru' ? 'en' : 'ru';
    this.keyboardBlock.classList.remove('ru', 'en');
    this.keyboardBlock.classList.add(this.language);
    this.saveLanguage();
  }

  editText(setting, text) {
    let start;
    let end;
    switch (setting) {
      case 'backspace':
        this.textareaSelection = this.textarea.selectionStart;
        if (this.textareaSelection !== 0) {
          start = this.textarea.value.slice(0, this.textareaSelection - 1);
          end = this.textarea.value.slice(this.textareaSelection);
          this.textarea.value = start + end;
          this.textarea.setSelectionRange(this.textareaSelection - 1, this.textareaSelection - 1);
        }
        break;
      case 'delete':
        this.textareaSelection = this.textarea.selectionStart;
        start = this.textarea.value.slice(0, this.textareaSelection);
        end = this.textarea.value.slice(this.textareaSelection + 1);
        this.textarea.value = start + end;
        this.textarea.setSelectionRange(this.textareaSelection, this.textareaSelection);
        break;
      case 'tab':
        this.textareaSelection = this.textarea.selectionStart;
        start = this.textarea.value.slice(0, this.textareaSelection);
        end = this.textarea.value.slice(this.textareaSelection);
        this.textarea.value = `${start}    ${end}`;
        this.textarea.setSelectionRange(this.textareaSelection + 4, this.textareaSelection + 4);
        break;
      default:
        this.textareaSelection = this.textarea.selectionStart;
        start = this.textarea.value.slice(0, this.textareaSelection);
        end = this.textarea.value.slice(this.textareaSelection);
        this.textarea.value = start + text + end;
        this.textarea.setSelectionRange(this.textareaSelection + 1, this.textareaSelection + 1);
        break;
    }
  }

  toggleUp() {
    this.up = !this.up;
    if (this.up) {
      this.keyboardBlock.classList.add('up');
    } else {
      this.keyboardBlock.classList.remove('up');
    }
  }

  mousedown(e) {
    e.preventDefault();
    const btn = e.target.closest('.keyboard_item');
    if (btn) {
      if (!btn.classList.contains('CapsLock')) {
        btn.classList.add('active');
      }
      if (btn.classList.contains('general')) {
        switch (true) {
          case btn.classList.contains('Backspace'):
            this.editText('backspace');
            break;
          case btn.classList.contains('Delete'):
            this.editText('delete');
            break;
          case btn.classList.contains('Tab'):
            this.editText('tab');
            break;
          case btn.classList.contains('Enter'):
            this.textarea.closest('form').requestSubmit();
            break;
          case btn.classList.contains('CapsLock'):
            this.capsDown = true;
            btn.classList.toggle('active');
            this.toggleUp();
            break;
          case btn.classList.contains('language'):
            this.toggleLanguage();
            break;
          case btn.classList.contains('ShiftLeft'):
          case btn.classList.contains('ShiftRight'):
            this.toggleUp();
            break;
          case btn.classList.contains('ArrowUp'):
            this.setSelection(0);
            break;
          case btn.classList.contains('ArrowDown'):
            this.setSelection(this.textarea.value.length);
            break;
          case btn.classList.contains('ArrowLeft'):
            this.setSelection(this.textarea.selectionStart > 0
              ? this.textarea.selectionStart - 1
              : 0);
            break;
          case btn.classList.contains('ArrowRight'):
            this.setSelection(this.textarea.selectionStart + 1);
            break;
          default:
            break;
        }
        return;
      }
      this.editText('text', btn.innerText);
    }
  }

  setSelection(position) {
    this.textarea.setSelectionRange(position, position);
  }

  removeActiveClass(e) {
    e.preventDefault();
    this.keyboardBlock.querySelectorAll('.keyboard_item.active').forEach((item) => {
      if (!item.classList.contains('CapsLock')) {
        item.classList.remove('active');
      }
      if ((item.classList.contains('ShiftLeft') || item.classList.contains('ShiftRight')) && (!this.capsDown || this.shiftDown) && (!this.capsDown && !this.shiftDown)) {
        this.toggleUp();
      }
    });
  }

  init() {
    this.keyboardBlock.classList.add('keyboard', this.language);
    this.wrapBlock.append(this.keyboardBlock);

    this.keys.forEach((row) => {
      const rowElement = document.createElement('div');
      rowElement.classList.add('keyboard_row');
      row.forEach((item) => {
        const btn = document.createElement('div');
        btn.classList.add('keyboard_item');
        btn.classList.add(item.code);
        if (item.class) {
          btn.classList.add(...item.class);
        }
        const { text } = item;

        Object.keys(text).forEach((key) => {
          btn.innerHTML += `<span class="${key}">${text[key]}</span>`;
        });
        rowElement.append(btn);
      });
      this.keyboardBlock.append(rowElement);
    });

    this.keyboardBlock.addEventListener('mousedown', (e) => {
      this.mousedown(e);
    });

    document.addEventListener('mouseup', (e) => {
      this.removeActiveClass(e);
    });

    this.saveLanguage();
  }
}
