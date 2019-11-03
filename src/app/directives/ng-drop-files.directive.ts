import { FileItem } from '../models/file-items.model';
import Swal from 'sweetalert2';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  constructor() {}

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this.prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
    this.prevenirDetener(event);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    this.mouseSobre.emit(false);

    const transferencia = this.getTransferencia(event);
    if (!transferencia) {
      return;
    }
    this.extraerArchivos(transferencia.files);
    this.prevenirDetener(event);
    this.mouseSobre.emit(false);
  }

  @HostListener('click', ['$event'])
  public click(event: any) {
    // console.log('Click');
  }

  // Para la compatibilidad con varios navegadores
  private getTransferencia(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private extraerArchivos(archivosLista: FileList) {
    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this.archivoPuedeCargarse(archivoTemporal)) {
        if (this.archivos.length < 1) {
          const nuevoArchivo = new FileItem(archivoTemporal);
          this.archivos.push(nuevoArchivo);
        } else {
          Swal.fire({
            type: 'error',
            text: 'Solo puede añadir 1 archivo.'
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

  private prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
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
      : tipoArchivo.startsWith('application');
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
}
