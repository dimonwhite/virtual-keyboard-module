import keyboard from "./keys";

class Keyboard {
  constructor(keys) {
    this.keys = keys;
    this.language = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'ru';
    this.body = document.querySelector('body');
    this.keyboardBlock = document.createElement('div');
    this.textarea = document.createElement('textarea');
    this.textLanguage = document.createElement('div');
    this.textWin = document.createElement('div');
    this.up = false;
    this.shiftDown = false;
    this.capsDown = false;
    this.languageDown = false;
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

  keydown(e) {
    e.preventDefault();
    const btn = this.keyboardBlock.querySelector(`.${e.code}`);

    if (btn) {
      if (e.code !== 'CapsLock') {
        btn.classList.add('active');
      }
      if (btn.classList.contains('general')) {
        switch (e.code) {
          case 'ControlLeft':
          case 'ControlRight':
            if (e.ctrlKey === true && e.shiftKey === true && !this.languageDown) {
              this.languageDown = true;
              this.toggleLanguage();
            }
            break;
          case 'Backspace':
            this.editText('backspace');
            break;
          case 'Delete':
            this.editText('delete');
            break;
          case 'Tab':
            this.editText('tab');
            break;
          case 'Enter':
            this.editText('text', '\n');
            break;
          case 'CapsLock':
            if (!this.capsDown) {
              this.capsDown = true;
              btn.classList.toggle('active');
              this.toggleUp();
            }
            break;
          case 'ShiftLeft':
          case 'ShiftRight':
            if (!this.shiftDown) {
              this.shiftDown = true;
              this.toggleUp();
            }
            if (e.ctrlKey === true && e.shiftKey === true && !this.languageDown) {
              this.languageDown = true;
              this.toggleLanguage();
            }
            break;
          default:
            break;
        }
        return;
      }
      this.editText('text', btn.innerText);
    }
  }

  keyup(e) {
    e.preventDefault();
    const btn = this.keyboardBlock.querySelector(`.${e.code}`);
    if (btn) {
      switch (e.code) {
        case 'ControlLeft':
        case 'ControlRight':
          btn.classList.remove('active');
          this.languageDown = false;
          break;
        case 'CapsLock':
          this.capsDown = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          btn.classList.remove('active');
          this.shiftDown = false;
          this.toggleUp();
          break;
        default:
          btn.classList.remove('active');
          break;
      }
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
            this.editText('text', '\n');
            break;
          case btn.classList.contains('CapsLock'):
            this.capsDown = true;
            btn.classList.toggle('active');
            this.toggleUp();
            break;
          case btn.classList.contains('ShiftLeft'):
          case btn.classList.contains('ShiftRight'):
            this.toggleUp();
            break;
          default:
            break;
        }
        return;
      }
      this.editText('text', btn.innerText);
    }
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
    this.textLanguage.classList.add('text');
    this.textLanguage.innerText = 'Клавиатура создана в операционной системе Windows';
    this.textWin.classList.add('text');
    this.textWin.innerText = 'Для переключения языка используйте комбинацию ctrl + shift';

    this.keyboardBlock.classList.add('keyboard', this.language);
    this.textarea.classList.add('textarea');
    this.body.append(this.textarea);
    this.body.append(this.keyboardBlock);
    this.body.append(this.textLanguage);
    this.body.append(this.textWin);

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

    document.addEventListener('keydown', (e) => {
      this.keydown(e);
    });

    document.addEventListener('keyup', (e) => {
      this.keyup(e);
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

const virtualKeyboard = new Keyboard(keyboard);

virtualKeyboard.init();
