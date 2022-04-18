import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  private urlInternet = this.service.urlCalculadora+'internet';
  private urlTelevision = this.service.urlCalculadora+'television';
  private urlCombinacion = this.service.urlCalculadora+'combinacion';
  private urlPospago = this.service.urlCalculadora+'pospago';
  private urlbuscar = this.service.urlCalculadora+'buscar/pospago/';

  constructor(private service: HttpService,
    public toastController: ToastController) { }

  stateH = 1;
  stateM = 1;

  costo: any = 0;
  costoA = 0;
  costoM = 0;
  costoMa = 0;
  ahorroH = 0;
  ahorroM = 0;
  ahorro = 0;
  totalH=0;
  totalM=0;
  total = 0;
  totalHb = 0;
  totalMb = 0;
  totalB = 0;
  descueto_familia = 0;
  valor_familia = 0;
  valor_descuento_movil = 0;

  data = [];
  pospagos = [];
  datosCompartir = 'Seleccione un Plan';

  internets = [];
  televisions =[];
  calculadora ={
    internet : 0,
    television: 0,
    estrato:0,
    pospago:0,
    telefonia:0,
    familia: 0,
    basico_movil: 0,
    basico_hogar: 0
  }

  ngOnInit() {
    this.internet();
    this.television();
    this.pospago();
  }


  internet() {
    this.service.get(this.urlInternet)
      .subscribe( resp => {
        this.internets = resp[0];
        console.log('internet: ', this.internets);
        
      },(error) => {
        console.log('hubo un error para obtener intetnet: ', error);
        
      })
  }
  

  television() {
    this.service.get(this.urlTelevision)
      .subscribe( resp => {
        this.televisions = resp[0];
        console.log('televisions: ', this.televisions);
        
      },(error) => {
        console.log('hubo un error en la tv: ', error);
        
      })
  }

  calculo() {
    this.ahorro = (this.ahorroH + this.ahorroM) * 12;
    this.total = this.totalH + this.totalM;
    this.totalB = this.totalHb + this.totalMb;
  }

  calcularHogar() {

    this.service.get(this.urlCombinacion+'/'+this.calculadora.internet+'/'+this.calculadora.television+'/'+this.calculadora.estrato)
    .subscribe(resp => {
      //console.log(resp);
      this.data = resp[0];
      console.log('la data',this.data);
      if(this.calculadora.estrato != 0 && this.calculadora.internet != 0 && this.calculadora.telefonia != 0){
        if(this.data.length > 0){
          this.costo = this.data[0].price_final;
          this.costoA = this.data[0].price;
          this.ahorroH = this.data[0].price - this.data[0].price_final;
          this.totalH = parseInt(this.data[0].price_final);
          this.totalHb = parseInt(this.data[0].price);
          this.calculo();
        }else{
          this.presentToast('Esta Combinación no es Valida..!');
          this.costo = 0;
          this.costoA = 0;
        }
      }else{
        this.costo = 0;
      }
      
      
      
      
    },(error) => {
      console.log('hubo un erro combinación');
      
    })

  }

  validar($event) {
   if(this.calculadora.television != 0) this.calcularHogar();
  }



  estrato( valor ) {
    console.log(valor);
    this.calculadora.estrato = valor;
    this.validar(1);
  }

  hogarEstado(valor) {
     this.stateH = valor;
  }

  movilEstado(valor) {
    this.stateM = valor
  }

  async presentToast(messaje) {
    const toast = await this.toastController.create({
      message: messaje,
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }

  pospago() {
    this.service.get(this.urlPospago)
      .subscribe(resp => {
        this.pospagos = resp[0];
        console.log('pospagos: ', this.pospagos);
        
      },(error) => {
        console.log('hubo un error para obtener pospagos: ', error);
        
      })
  }

  buscarDatos($event) {
    const id = $event.target.value;
    this.service.get(this.urlbuscar+id)
      .subscribe(resp => {
        console.log(resp);
        this.datosCompartir = resp[0][0].compartir;
        this.costoM = parseInt(resp[0][0].valor_descuento);
        this.costoMa = parseInt(resp[0][0].cargo_basico);
        this.ahorroM = resp[0][0].cargo_basico - resp[0][0].valor_descuento;
        this.valor_descuento_movil = parseInt(resp[0][0].valor_descuento);
        this.calculadora.basico_movil = parseInt(resp[0][0].cargo_basico);
        this.totalM = parseInt(resp[0][0].valor_descuento);
        this.totalMb = parseInt(resp[0][0].cargo_basico);
        this.descueto_familia = this.costoM - parseInt(resp[0][0].valor_plan_familia);
        this.valor_familia = parseInt(resp[0][0].valor_plan_familia);
        this.calculo();
        if(this.calculadora.familia != 0) this.planFamilia();
      },(error)=> {
        console.log('hubo un error: ', error);
        
      })
  }

  planFamilia() {
    if(this.calculadora.familia == 1) {

      this.costoM -= this.descueto_familia;
      this.totalM -= this.descueto_familia;
      this.ahorroM = this.calculadora.basico_movil - this.valor_familia;
      this.calculo();
    }

    if(this.calculadora.familia == 2) {
      this.costoM = this.valor_descuento_movil;
      this.totalM = this.valor_descuento_movil;
      this.costoMa = this.calculadora.basico_movil
      this.ahorroM = this.calculadora.basico_movil - this.valor_descuento_movil;
      this.calculo();
    }
  }

}
