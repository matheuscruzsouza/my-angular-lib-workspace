import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-text-editor',
  templateUrl: './ngx-text-editor.component.html',
  styleUrls: [
    './ngx-text-editor.component.css'
  ]
})
export class NgxTextEditorComponent implements AfterViewInit {

  editable = true;

  selectedColor = "#000";

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
    'Tahoma'
  ]

  @Output() keyup = new EventEmitter();

  constructor() { }

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

    if (!this.content) {
      return ;
    }
    
    this.content.designMode = 'on';

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        let cmd = button.getAttribute('data-cmd') || '';

        if (button.name === 'active') {
          button.classList.toggle('active');
        }

        if (['insertImage', 'createLink'].includes(cmd)) {
          let url = prompt('Insira o link aqui', '')  || '';
          
          if (!this.content) {
            return ;
          }

          this.content.execCommand(cmd, false, url);

          if (cmd === 'insertImage') {
            const images = this.content.querySelectorAll('img') || [];

            images.forEach((image: HTMLImageElement) => {
              image.style.width = '100%';
            });
            
          } else {
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
        } else {
          if (!this.content) {
            return ;
          }

          this.content.execCommand(cmd, false, undefined);
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
      });
    });
    
  }

  chooseColor(event: any){
    if (!this.content) {
      return ;
    }

    this.content.execCommand('foreColor', false, event.target.value);
  }

  changeFont(event: any){
    if (!this.content) {
      return ;
    }

    this.content.execCommand('fontName', false, event.target.value);
  }

  changeSize(event: any){
    if (!this.content) {
      return ;
    }

    this.content.execCommand('fontSize', false, event.target.value);
  }

  onKey(event: any): void {
    this.keyup.emit(event.target.value);
  }
}
