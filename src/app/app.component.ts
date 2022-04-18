import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController) {}

  async closeMenu() {
    this.menu.close('first');
  }

  cerrar() {
    localStorage.removeItem('Cedula_usuario');
    localStorage.removeItem('Canal');
    this.menu.close('first');
  }

}
