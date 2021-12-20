import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-text-editor',
  templateUrl: './ngx-text-editor.component.html',
  styleUrls: [
    './ngx-text-editor.component.css'
  ]
})
export class NgxTextEditorComponent implements AfterViewInit {
  constructor() { }

  ngAfterViewInit(): void {
    const buttons = document.querySelectorAll('button');
    const textField = document.getElementById('textField') as HTMLIFrameElement;

    let show = false;

    if (textField.contentDocument) {
      textField.contentDocument.designMode = 'On';
    }
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        let cmd = button.getAttribute('data-cmd') || '';

        if (button.name === 'active') {
          button.classList.toggle('active');
        }

        if (['insertImage', 'createLink'].includes(cmd) && textField) {
          let url = prompt('Insira o link aqui', '')  || '';
          textField.contentDocument?.execCommand(cmd, false, url);

          if (cmd === 'insertImage') {
            const images = textField.contentDocument?.querySelectorAll('img') || [];

            images.forEach((image: HTMLImageElement) => {
              image.style.width = '100%';
            });
            
          } else {
            const links = textField.contentDocument?.querySelectorAll('a') || [];

            links.forEach((link: HTMLAnchorElement) => {
              link.target = '_blank';

              link.addEventListener('mouseover', () => {
                if (textField.contentDocument) {
                  textField.contentDocument.designMode = 'Off';
                } 
              });
              link.addEventListener('mouseout', () => {
                if (textField.contentDocument) {
                  textField.contentDocument.designMode = 'On';
                } 
              });
            });

          }
        } else {
          textField.contentDocument?.execCommand(cmd, false, undefined);
        }

        if (cmd === 'showCode') {
          const textBody = textField.contentDocument?.querySelector('body');

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

}
