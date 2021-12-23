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

  value: any;

  disabled = false;

  touched = false;

  private iframe: HTMLIFrameElement| undefined;
  private content: Document | undefined;

  fonts = [
    'Arial',
    'Times New Roman',
    'Sans serif',
    'Courier New',
    'Verdana',
    'Roboto',
    'Cookie',
    'Lora'
  ]

  @Output() keyup = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

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

    this.content.body.addEventListener('keyup', () => {
      if (!this.content) { return; }

      this.onChange(this.content.body.innerHTML);
      this.keyup.emit(this.content.body.innerHTML);
    });

    this.elementRef.nativeElement.querySelectorAll("link, style").forEach((htmlElement: HTMLLinkElement | HTMLStyleElement) => {
      if (this.content) {
        const head = this.content.head;
        const hasStyle = Array.from(head.children).filter(
          (node: Element) => {
            console.log(htmlElement, node);
            
            return node.textContent == htmlElement.textContent;
          }
        ).length;

        if (!hasStyle) {
          head.appendChild(
            htmlElement.cloneNode(true)
          );
        }
      }
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
