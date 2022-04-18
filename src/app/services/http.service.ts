import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  urlBase: string = 'https://test-gestion.amstigo.com.co/api/convergencia';
  urlReporte: string = 'https://test-gestion.amstigo.com.co/api/general/';
  login: string = 'https://api.amstigo.com.co/po/po.php';
  urlCalculadora = 'https://test-gestion.amstigo.com.co/api/';
  urlGeneral = 'https://test-gestion.amstigo.com.co/api/';

  constructor( private http: HttpClient) { }

   headers = new HttpHeaders({'Content-type':'application/x-www-form-urlencoded'});

  get(url: string) {
    return this.http.get(url)
      .pipe(
        map( resp => {
          return resp;
        })
      )
  }

  auth(url: string, datos) {
    //console.log(datos)
    const formData = new FormData()
    formData.append('Cedula', datos.Cedula)
    formData.append('Pass', datos.Pass)
    return this.http.post(url, formData)
  }

  post(url: string, datos) {
    return this.http.post(url, datos)
      .pipe(
        map( resp => {
          return resp;
        })
      )
  }

  delete(url: string) {
    return this.http.delete(url)
      .pipe(
        map( resp => {
          return resp;
        })
      )
  }

  put(url: string, datos) {
    return this.http.put(url, datos)
      .pipe(
        map( resp => {
          return resp;
        })
      )
  }
}
