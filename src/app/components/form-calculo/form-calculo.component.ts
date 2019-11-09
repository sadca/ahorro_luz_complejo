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
  p1: number;
  p2: number;
  p3: number;
  precioP1: number;
  precioP2: number;
  precioP3: number;
  impuestoElectrico: number;
  archivo: any;
  archivos: FileItem[] = [];
  estaSobreElemento = false;

  tarifas = [
    { tarifa: '2A' },
    { tarifa: '2.0A' },
    { tarifa: '2.0DHA' },
    { tarifa: '2.0DHS' },
    { tarifa: '2.1A' },
    { tarifa: '2.1DHA' },
    { tarifa: '2.1DHS' },
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
    this.p1 = 45;
    this.p2 = 45;
    this.p3 = 45;
    this.tarifa = '3.0A';
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
      p1: this.p1,
      p2: this.p2,
      p3: this.p3,
      precioP1: this.precioP1,
      precioP2: this.precioP2,
      precioP3: this.precioP3,
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
}
