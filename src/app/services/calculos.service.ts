import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { FileItem } from '../models/file-items.model';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {
  webServiceUrl: string;

  constructor(private http: HttpClient) {
    // this.webServiceUrl = 'http://localhost:3000/';
    this.webServiceUrl = 'https://sadca.es:3000/';
  }

  getConsultas() {
    const url = this.webServiceUrl + 'consultas';

    const headers: HttpHeaders = new HttpHeaders({
      token: localStorage.getItem('tokenEnergy')
    });

    return this.http.get(url, { headers });
  }

  getCalculo(datos: any) {
    // console.log(datos);
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
    formdata.append('precioP1opt', datos.precioP1opt);
    formdata.append('precioP2opt', datos.precioP2opt);
    formdata.append('precioP3opt', datos.precioP3opt);
    formdata.append('precioP4opt', datos.precioP4opt);
    formdata.append('precioP5opt', datos.precioP5opt);
    formdata.append('precioP6opt', datos.precioP6opt);
    formdata.append('precioE1Actual', datos.precioE1Actual);
    formdata.append('precioE2Actual', datos.precioE2Actual);
    formdata.append('precioE3Actual', datos.precioE3Actual);
    formdata.append('precioE4Actual', datos.precioE4Actual);
    formdata.append('precioE5Actual', datos.precioE5Actual);
    formdata.append('precioE6Actual', datos.precioE6Actual);
    formdata.append('precioE1Optimizada', datos.precioE1Optimizada);
    formdata.append('precioE2Optimizada', datos.precioE2Optimizada);
    formdata.append('precioE3Optimizada', datos.precioE3Optimizada);
    formdata.append('precioE4Optimizada', datos.precioE4Optimizada);
    formdata.append('precioE5Optimizada', datos.precioE5Optimizada);
    formdata.append('precioE6Optimizada', datos.precioE6Optimizada);
    formdata.append('impuestoElectrico', datos.impuestoElectrico);
    formdata.append('descuentoPotencia', datos.descuentoPotencia);
    formdata.append('descuentoEnergia', datos.descuentoEnergia);
    formdata.append('comparadorPrecios', datos.comparadorPrecios);

    const url = this.webServiceUrl;

    const headers: HttpHeaders = new HttpHeaders({
      token: localStorage.getItem('tokenEnergy')
    });

    const req = new HttpRequest('POST', url, formdata, {
      headers,
      reportProgress: true,
      responseType: 'text'
    });
    // return this.http.request(req);
    return this.http.post(url, formdata, { headers });
  }

  login(usuario: string, pass: string) {
    const formdata: FormData = new FormData();
    formdata.append('usuario', usuario);
    formdata.append('pass', pass);

    const url = this.webServiceUrl + 'login';

    return this.http.post(url, formdata);
  }

  estaLogeado() {
    const fechaLogin = new Date(localStorage.getItem('fechaLogin'));
    const hoy = new Date();
    if (fechaLogin.getMilliseconds() - hoy.getMilliseconds() > 7200000) {
      return false;
    } else {
      return true;
    }
  }

  borrarConsulta(fecha: any) {
    const url = this.webServiceUrl + 'consulta/' + fecha;

    const headers: HttpHeaders = new HttpHeaders({
      token: localStorage.getItem('tokenEnergy')
    });
    return this.http.delete(url, { headers });
  }
}
