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
    formdata.append('calculoAutomatico', datos.calculoAutomatico);
    formdata.append('p1', datos.p1);
    formdata.append('p2', datos.p2);
    formdata.append('p3', datos.p3);
    formdata.append('p4', datos.p4);
    formdata.append('p5', datos.p5);
    formdata.append('p6', datos.p6);
    formdata.append('p1Calculos', datos.p1Calculos);
    formdata.append('p2Calculos', datos.p2Calculos);
    formdata.append('p3Calculos', datos.p3Calculos);
    formdata.append('p4Calculos', datos.p4Calculos);
    formdata.append('p5Calculos', datos.p5Calculos);
    formdata.append('p6Calculos', datos.p6Calculos);
    formdata.append('precioP1', datos.precioP1);
    formdata.append('precioP2', datos.precioP2);
    formdata.append('precioP3', datos.precioP3);
    formdata.append('precioP4', datos.precioP4);
    formdata.append('precioP5', datos.precioP5);
    formdata.append('precioP6', datos.precioP6);
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
    // return this.http.request(req);
    return this.http.post(url, formdata);
  }
}
