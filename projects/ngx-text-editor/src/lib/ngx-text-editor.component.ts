import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
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

  value: any;

  disabled = false;

  touched = false;

  private iframe: HTMLIFrameElement| undefined;
  private content: Document | undefined;

  fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Sans serif',
    'Courier New',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Arial Black',
    'Tahoma',
    'Lucida Console',
    'Monaco',
    'Brush Script MT',
    'Lucida Handwriting',
    'Copperplate',
    'Papyrus'
  ]

  @Output() keyup = new EventEmitter();

  constructor() { }

  onChange = (value: any) => {};

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

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngAfterViewInit(): void {
    const buttons = document.querySelectorAll('button');
    
    this.iframe = document.getElementById('output') as HTMLIFrameElement;
    const tmpDoc = this.iframe.contentDocument || this.iframe.contentWindow?.document;

    if (tmpDoc) {
      this.content = tmpDoc;
    } else {
      return;
    }

    let show = false;

    if (!this.content) { return ; }
    
    this.content.designMode = 'on';

    this.content.body.addEventListener('onkeyup', () => {
      if (!this.content) { return; }

      this.onChange(this.content.body.innerHTML);
      this.keyup.emit(this.content.body.innerHTML);
    });

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        let cmd = button.getAttribute('data-cmd') || '';

        if (!this.disabled) {
          if (button.name === 'active') {
            button.classList.toggle('active');
          }
  
          if (['createLink'].includes(cmd)) {
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
  
          } else {
            if (!this.content) {
              return ;
            }
  
            this.content.execCommand(cmd, false, undefined);

            this.onChange(this.content.body.innerHTML);
            this.keyup.emit(this.content.body.innerHTML);
          }
  
          if (cmd === 'showCode') {
            const textBody = this.content.querySelector('body');
  
            if (textBody) {
              if (show) {
                textBody.innerHTML = textBody.textContent || '';
                show = false;
              } else {
                textBody.textContent = textBody.innerHTML;
                show = true;
              }
            }
          }
        }
      });
    });
    
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
}
