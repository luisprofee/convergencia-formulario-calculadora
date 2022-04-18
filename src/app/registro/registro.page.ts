import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../services/http.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  private url = this.service.urlReporte;

  data = [];

  info={
    fecha_ini:'',
    fecha_fin:''
  }
  constructor(private service: HttpService) { }

  ngOnInit() {
  }

  buscar( form: NgForm){
    if( form.invalid ) {return}
    console.log(this.info.fecha_ini);

    this.service.get(this.url+this.info.fecha_ini+'/'+this.info.fecha_fin)
      .subscribe( resp => {
        console.log('resultado: ', resp);
        this.data = resp[0];
        
      }, (error) => {
        console.log('hubo un error al consultar el reporte: ', error);
        
      })
    
  }

  DescargarExcel(){
    this.exportToExcel(this.data, 'Convergencia');
  }

  async exportToExcel(data, filename) {
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
    
  }
}
