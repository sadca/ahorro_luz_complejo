import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { FileItem } from '../models/file-items.model';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {
  webServiceUrl: string;

  constructor(private http: HttpClient) {
    // this.webServiceUrl = 'http://localhost:8080/';
    this.webServiceUrl = 'http://localhost:3000/';
  }

  getCalculo(datos: any) {
    const formdata: FormData = new FormData();
    formdata.append('archivo', datos.archivo.archivo);
    formdata.append('propietario', datos.propietario);
    formdata.append('tarifa', datos.tarifa);
    formdata.append('p1', datos.p1);
    formdata.append('p2', datos.p2);
    formdata.append('p3', datos.p3);
    formdata.append('impuestoElectrico', datos.impuestoElectrico);

    const url = this.webServiceUrl;

    const headers: HttpHeaders = new HttpHeaders({
      token: localStorage.getItem('token')
    });

    const req = new HttpRequest('POST', url, formdata, {
      headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    // return this.http.post(url, { archivo });
  }
}
