import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import { UserModel } from '../models/user.model';
import { NavController } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credential: UserModel;
  hideInputPassword = true;

  datos = {}

   pass = new Md5();

   

   urlLogin = this.service.login;

  constructor( private service: HttpService, public navCtrl   :  NavController,
    public toastController: ToastController) { }



  ngOnInit() {
    this.credential = new UserModel;
    this.getAuth();
  }

  getAuth() {
    const data = localStorage.getItem('Canal');
    if(data) this.navCtrl.navigateForward(['/formulario']);
    
  }
  async presentToast(messaje) {
    const toast = await this.toastController.create({
      message: messaje,
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }

  login(){
    this.credential.Pass = this.pass.appendStr(this.credential.Pass).end();

    this.service.auth(this.urlLogin, this.credential)
      .subscribe(resp => {
        console.log(resp);
        this.datos = resp;
        //@ts-ignore
        if (this.datos.Cedula != undefined) {
          
        //@ts-ignore
        console.log('lo que llega: ', this.datos.Cargo);
        //@ts-ignore
        localStorage.setItem("Cedula_usuario", this.datos.Cedula);
        //@ts-ignore
        localStorage.setItem("Canal", this.datos.Canal);
        //@ts-ignore
        localStorage.setItem("Nombre", this.datos.Nombre);
        this.navCtrl.navigateForward(['/formulario']);
        }else{
          console.log('datos incorrectos');
          this.presentToast('Datos Incorrectos')
          
        }
        
        
        
      }, (error) =>{
        console.log('hubo un error al autenticar: ', error);
        
      })


    
  }

}
