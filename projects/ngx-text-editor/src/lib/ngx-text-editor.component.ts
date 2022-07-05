import { AfterViewInit, Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ngx-text-editor',
  templateUrl: './ngx-text-editor.component.html',
  styleUrls: [
    './ngx-text-editor.component.css'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: NgxTextEditorComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: NgxTextEditorComponent
    }
  ]
})
export class NgxTextEditorComponent implements ControlValueAccessor, AfterViewInit {

  editable = true;
  selectedColor = "#000";
  selectedFont = "Arial";
  selectedSize = 3;
  value: any;
  disabled = false;
  touched = false;
  showingCode = false;

  private iframe: HTMLIFrameElement| undefined;
  private content: Document | undefined;

  fonts = [
    {font: 'Arial', url: null},
    {font: 'Times New Roman', url: null},
    {font: 'Sans serif', url: null},
    {font: 'Courier New', url: null},
    {font: 'Verdana', url: null},
    {font: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'},
    {font: 'Cookie', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap'},
    {font: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Cookie&display=swap'},
  ];

  @Output() keyup = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  onChange = (_value: any) => {};

  onTouched = () => {};

  writeValue(obj: any): void {
    if (!this.content) {
      return;
    }

    const textBody = this.content.querySelector('body');

    if (!textBody) {
      return;
    }

    textBody.textContent = obj;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngAfterViewInit(): void {
    this.iframe = document.getElementById('output') as HTMLIFrameElement;
    this.content = this.iframe.contentDocument || this.iframe.contentWindow?.document;

    if (!this.content) { return ; }

    this.content.designMode = 'on';

    this.setEventListener();

    this.setFonts();

    this.setButtonActions();
  }

  chooseColor(event: any){
    if (!this.content) {
      return ;
    }

    this.selectedColor = event.target.value;

    this.content.execCommand('foreColor', false, event.target.value);

    this.onChange(this.content.body.innerHTML);
    this.keyup.emit(this.content.body.innerHTML);
  }

  changeFont(event: any){
    if (!this.content) {
      return ;
    }

    this.content.execCommand('fontName', false, event.target.value);
    this.selectedFont = event.target.value;

    this.onChange(this.content.body.innerHTML);
    this.keyup.emit(this.content.body.innerHTML);
  }

  changeSize(event: any){
    if (!this.content) {
      return ;
    }

    this.content.execCommand('fontSize', false, event.target.value);

    this.onChange(this.content.body.innerHTML);
    this.keyup.emit(this.content.body.innerHTML);
  }

  onFileChange(event: any) {
    var reader = new FileReader();

    reader.onload = (e: any) => {
      if (!this.content) {
        return ;
      }

      const imgRaw = "<img src='" + e.target.result + "' />";

      this.content.execCommand('insertHTML', false, imgRaw);

      this.onChange(this.content.body.innerHTML);
      this.keyup.emit(this.content.body.innerHTML);

      const images = this.content.querySelectorAll('img') || [];

      images.forEach((image: HTMLImageElement) => {
        image.style.width = '100%';
      });

    }

    reader.readAsDataURL(event.target.files[0]);
  }

  private setFonts() {
    this.fonts.forEach((font: any) => {
      if (this.content && font.url) {
        const head = this.content.head;

        const link = this.content.createElement("link");
        link.rel = "stylesheet";
        link.href = font.url;

        head.appendChild(link);
      }
    });
  }

  private setButtonActions() {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        let cmd = button.getAttribute('data-cmd') || '';

        if (!this.disabled) {
          if (button.name === 'active') {
            button.classList.toggle('active');
          }

          console.log(cmd);

          switch (cmd) {
            case 'createLink':
              this.createLink(cmd);
              break;

            case 'showCode':
              this.showCode();
              break;

            default:
              this.executeCommand(cmd);
              break;
          }
        }
      });
    });
  }

  private setEventListener() {
    if (!this.content) { return ; }

    this.content.body.addEventListener('keyup', () => {
      if (!this.content) { return; }

      this.onChange(this.content.body.innerHTML);
      this.keyup.emit(this.content.body.innerHTML);
    });
  }

  private executeCommand(cmd: string) {
    if (!this.content) {
      return ;
    }

    this.content.execCommand(cmd, false, undefined);

    this.onChange(this.content.body.innerHTML);
    this.keyup.emit(this.content.body.innerHTML);
  }

  private boldCommand() {
    const strongElement = document.createElement("strong");
    const userSelection = window.getSelection();
    if (userSelection) {
      const selectedTextRange = userSelection.getRangeAt(0);
      selectedTextRange.surroundContents(strongElement);
    }
  }

  private createLink(cmd: string) {
    let url = prompt('Insira o link aqui', '')  || '';

    if (!this.content) {
      return ;
    }

    this.content.execCommand(cmd, false, url);

    this.onChange(this.content.body.innerHTML);
    this.keyup.emit(this.content.body.innerHTML);

    const links = this.content.querySelectorAll('a') || [];

    links.forEach((link: HTMLAnchorElement) => {
      link.target = '_blank';

      link.addEventListener('mouseover', () => {
        if (!this.content) {
          return ;
        }

        this.content.designMode = 'off';
      });
      link.addEventListener('mouseout', () => {
        if (!this.content) {
          return ;
        }

        this.content.designMode = 'on';
      });
    });
  }

  private showCode() {
    if (!this.content) {
      return ;
    }

    const textBody = this.content.querySelector('body');

    if (textBody) {
      console.log(textBody.textContent, textBody.innerHTML);
      if (this.showingCode) {
        textBody.innerHTML = textBody.textContent || '';
      } else {
        textBody.textContent = textBody.innerHTML;
      }
      this.showingCode = !this.showingCode;
    }
  }
}
