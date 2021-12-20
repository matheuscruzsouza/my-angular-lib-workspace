import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-text-editor',
  templateUrl: './ngx-text-editor.component.html',
  styleUrls: [
    './ngx-text-editor.component.css'
  ]
})
export class NgxTextEditorComponent implements AfterViewInit {

  editable = true;

  @Output() keyup = new EventEmitter();

  constructor() { }

  ngAfterViewInit(): void {
    const buttons = document.querySelectorAll('button');
    const iframe = document.getElementById('output') as HTMLIFrameElement;
    const content = iframe.contentDocument || iframe.contentWindow?.document;

    let show = false;

    if (content) {
      content.designMode = 'on';

      buttons.forEach(button => {
        button.addEventListener('click', () => {
          let cmd = button.getAttribute('data-cmd') || '';
  
          if (button.name === 'active') {
            button.classList.toggle('active');
          }
  
          if (['insertImage', 'createLink'].includes(cmd)) {
            let url = prompt('Insira o link aqui', '')  || '';
            content.execCommand(cmd, false, url);
  
            if (cmd === 'insertImage') {
              const images = content.querySelectorAll('img') || [];
  
              images.forEach((image: HTMLImageElement) => {
                image.style.width = '100%';
              });
              
            } else {
              const links = content.querySelectorAll('a') || [];
  
              links.forEach((link: HTMLAnchorElement) => {
                link.target = '_blank';
  
                link.addEventListener('mouseover', () => {
                  content.designMode = 'off';
                });
                link.addEventListener('mouseout', () => {
                  content.designMode = 'on';
                });
              });
  
            }
          } else {
            content.execCommand(cmd, false, undefined);
          }
  
          if (cmd === 'showCode') {
            const textBody = content.querySelector('body');
  
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

  onKey(event: any): void {
    this.keyup.emit(event.target.value);
  }
}
