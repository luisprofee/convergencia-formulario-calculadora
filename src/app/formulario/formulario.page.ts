import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {

  forma: FormGroup;

  private url = this.service.urlBase;
  private urlGeneral = this.service.urlGeneral+'buscar/cliente/';

  stateForm = true;

  vacio = {}

  usuario = {
    cedula: '',
    canal: '',
    nombre: ''
  }
  

  formulario = {
    cedula_cliente:'',
    linea_cliente:'',
    transaccion:'',
    cedula_usuario:'',
    canal:'',
    id: 0
  }

  datos = [];
  

  constructor(private fb: FormBuilder,
    private service: HttpService,
    public navCtrl   :  NavController,
    public toastController: ToastController) {  }

    

  ngOnInit() {
    
  }

  eliminarRegistro( id: number ) {
    console.log('id recibido: ', id);
    this.service.delete(this.url+'/'+id)
      .subscribe( resp => {
        console.log('delete: ', resp);
        this.getRegistros();
        this.presentToast('Registro eliminado con exito.!');
      },(error) => {
        console.log('huboun error al eliminar el registro: ', error);
        
      })
    
  }

  apdateCliente( id: number ) {
    this.service.get(this.urlGeneral+id)
      .subscribe(resp => {
        console.log(resp);
        this.formulario = resp[0][0];
        console.log('datosa enviar: ', this.formulario);
        this.stateForm = false;
      }, (error) =>{
        console.log('hubo un error para editar: ', error);
        
      })
  }

  ionViewWillEnter() {
    this.getAuth();
    this.getRegistros();
	}


  getAuth() {
    const data = localStorage.getItem('Canal');
    if(!data) this.navCtrl.navigateForward(['/login']);
    if(data){
      this.usuario.canal = localStorage.getItem('Canal');
      this.usuario.cedula = localStorage.getItem('Cedula_usuario');
      this.usuario.nombre = localStorage.getItem('Nombre');
    }
  }


  async presentToast(messaje) {
    const toast = await this.toastController.create({
      message: messaje,
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }


  getRegistros() {
    const cedula = localStorage.getItem('Cedula_usuario');
    this.service.get(this.url+'/'+cedula)
      .subscribe( resp => {
        console.log('datos registrados: ', resp);
        this.datos = resp[0];
      },(error) => {
        console.log('hubo un error para obtener los registros: ', error);
        
      })
  }

 

  

  guardar( form: NgForm ){
    if( form.invalid ) {return}
    const cedula = localStorage.getItem('Cedula_usuario');
    const canal = localStorage.getItem('Canal');
    this.formulario.cedula_usuario = cedula;
    this.formulario.canal = canal;
    console.log('valido', this.formulario);

    this.service.post(this.url, this.formulario)
      .subscribe( resp =>{
        console.log('guarda bien:', resp);
        this.presentToast('Los datos fueron guardados con exito ');
        this.getRegistros()
        this.formulario.cedula_cliente = ''; 
        this.formulario.linea_cliente = ''; 
        this.formulario.transaccion = ''; 
      },(error) =>{
        console.log('hubo un error al guardar: ', error);
        
      })
    
  }

  cancelar() {
    this.stateForm = true;
    this.formulario.cedula_cliente = ''; 
    this.formulario.linea_cliente = ''; 
    this.formulario.transaccion = ''; 
  }

  actualizar() {
    this.service.put(this.url+'/'+this.formulario.id, this.formulario)
      .subscribe(resp => {
        console.log(resp);
        this.getRegistros();
        this.presentToast('Datos Actualizados Correctamente.!')
      },(error) => {
        console.log('hubo un error al editar cliente: ', error);
        
      })
  }

}
