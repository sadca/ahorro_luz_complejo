import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FileItem } from '../../models/file-items.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-calculo',
  templateUrl: './form-calculo.component.html',
  styleUrls: ['./form-calculo.component.css']
})
export class FormCalculoComponent implements OnInit {
  @Output() calculoRealizado: EventEmitter<any> = new EventEmitter();
  propietario: string;
  tarifa: string;
  calculoAutomatico: string = 'si';

  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;

  p1Calculos: number;
  p2Calculos: number;
  p3Calculos: number;
  p4Calculos: number;
  p5Calculos: number;
  p6Calculos: number;

  precioP1: number;
  precioP2: number;
  precioP3: number;
  precioP4: number;
  precioP5: number;
  precioP6: number;

  impuestoElectrico: number;

  archivo: any;
  archivos: FileItem[] = [];
  estaSobreElemento = false;

  // { tarifa: '2A' },
  // { tarifa: '2.0A' },
  // { tarifa: '2.0DHA' },
  // { tarifa: '2.0DHS' },
  // { tarifa: '2.1A' },
  // { tarifa: '2.1DHA' },
  // { tarifa: '2.1DHS' },
  tarifas = [
    { tarifa: '3.0A' },
    { tarifa: '3.1A' },
    { tarifa: '6.1A' },
    { tarifa: '6.2' },
    { tarifa: '6.3' },
    { tarifa: '6.4' },
    { tarifa: '6.5' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.propietario = 'ALF TECH';
    this.p1 = 700;
    this.p2 = 700;
    this.p3 = 700;
    this.p4 = 700;
    this.p5 = 700;
    this.p6 = 700;
    this.tarifa = '6.1A';
  }

  calcular(form: any) {
    if (!form.valid || this.archivos.length <= 0) {
      if (this.archivos.length <= 0) {
        Swal.fire({
          type: 'error',
          text: 'Debe adjuntar algún archivo',
          allowOutsideClick: false
        });
      }
      return;
    }
    const datos = {
      propietario: this.propietario,
      tarifa: this.tarifa,
      calculoAutomatico: this.calculoAutomatico,
      p1: this.p1,
      p2: this.p2,
      p3: this.p3,
      p4: this.p4,
      p5: this.p5,
      p6: this.p6,
      p1Calculos: this.p1Calculos,
      p2Calculos: this.p2Calculos,
      p3Calculos: this.p3Calculos,
      p4Calculos: this.p4Calculos,
      p5Calculos: this.p5Calculos,
      p6Calculos: this.p6Calculos,
      precioP1: this.precioP1,
      precioP2: this.precioP2,
      precioP3: this.precioP3,
      precioP4: this.precioP4,
      precioP5: this.precioP5,
      precioP6: this.precioP6,
      archivo: this.archivos[0],
      impuestoElectrico: this.impuestoElectrico
    };
    this.calculoRealizado.emit(datos);
  }

  cargarFichero(evento: any) {
    if (evento.srcElement.files[0]) {
      const archivoNuevo = new FileItem(evento.srcElement.files[0]);
      if (this.archivoPuedeCargarse(evento.srcElement.files[0])) {
        if (this.archivos.length < 3) {
          this.archivos.push(archivoNuevo);
        } else {
          Swal.fire({
            type: 'error',
            text: 'Solo puede añadir 3 archivos.'
          });
        }
      }
    }
  }

  // Validaciones
  private archivoPuedeCargarse(archivo: File): boolean {
    if (
      !this.archivoYaSubido(archivo.name) &&
      this.esImagen(archivo.type) &&
      !this.tamanioSuperado(archivo.size)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private archivoYaSubido(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      // tslint:disable-next-line: triple-equals
      if (archivo.nombreArchivo == nombreArchivo) {
        Swal.fire({
          type: 'error',
          text: 'El archivo ' + nombreArchivo + ' ya está agregado.'
        });
        return true;
      }
    }

    return false;
  }

  private esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image') ||
          tipoArchivo.startsWith('application');
  }

  private tamanioSuperado(tamanio: number): boolean {
    tamanio = tamanio / 1024 / 1024;
    if (tamanio > 8) {
      Swal.fire({
        type: 'error',
        text: 'El archivo excede en tamaño.'
      });
      return true;
    } else {
      return false;
    }
  }

  eliminarArchivo(archivo: FileItem) {
    const i = this.archivos.indexOf(archivo);
    if (i !== -1) {
      this.archivos.splice(i, 1);
    }
  }

  eliminarArchivos() {
    this.archivos = [];
  }

  cambioTarifa() {
    if (!this.esTarifa6x()) {
      this.calculoAutomatico = 'si';
    }
  }

  esTarifa6x() {
    if (
      this.tarifa === '6.1A' ||
      this.tarifa === '6.2' ||
      this.tarifa === '6.3' ||
      this.tarifa === '6.4' ||
      this.tarifa === '6.5'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
