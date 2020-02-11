import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileItem } from '../../models/file-items.model';
import Swal from 'sweetalert2';
import { CalculosService } from '../../services/calculos.service';

@Component({
  selector: 'app-form-calculo',
  templateUrl: './form-calculo.component.html',
  styleUrls: ['./form-calculo.component.css']
})
export class FormCalculoComponent implements OnInit {
  @Output() calculoRealizado: EventEmitter<any> = new EventEmitter();

  historico: any[] = [];

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

  precioP1opt: number;
  precioP2opt: number;
  precioP3opt: number;
  precioP4opt: number;
  precioP5opt: number;
  precioP6opt: number;

  precioE1Actual: number;
  precioE2Actual: number;
  precioE3Actual: number;
  precioE4Actual: number;
  precioE5Actual: number;
  precioE6Actual: number;

  precioE1Optimizada: number;
  precioE2Optimizada: number;
  precioE3Optimizada: number;
  precioE4Optimizada: number;
  precioE5Optimizada: number;
  precioE6Optimizada: number;

  impuestoElectrico: number;

  descuentoPotencia: number;
  descuentoEnergia: number;

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

  constructor(private calculosServ: CalculosService) {}

  ngOnInit() {
    // this.propietario = 'Invesvil S.L';
    // this.tarifa = '3.0A';
    // this.p1 = 49;
    // this.p2 = 49;
    // this.p3 = 49;
    // this.impuestoElectrico = 100;
    // this.descuentoPotencia = 0;
    // this.descuentoEnergia = 0;

    // this.tarifa = '6.1A';
    // this.p1 = 700;
    // this.p2 = 700;
    // this.p3 = 700;
    // this.p4 = 700;
    // this.p5 = 700;
    // this.p6 = 700;
    // this.p1Calculos = 349;
    // this.p2Calculos = 349;
    // this.p3Calculos = 349;
    // this.p4Calculos = 349;
    // this.p5Calculos = 349;
    // this.p6Calculos = 700;
    // this.calculoAutomatico = 'no';

    // this.precioE1Actual = 0.14;
    // this.precioE2Actual = 0.14;
    // this.precioE3Actual = 0.14;
    // this.precioE4Actual = 0.14;
    // this.precioE5Actual = 0.14;
    // this.precioE6Actual = 0.14;
    // this.precioE1Optimizada = 0.095232;
    // this.precioE2Optimizada = 0.083532;
    // this.precioE3Optimizada = 0.062521;
    // this.precioE4Optimizada = 0.14;
    // this.precioE5Optimizada = 0.14;
    // this.precioE6Optimizada = 0.14;

    this.calculosServ.getConsultas().subscribe((data: any) => {
      // console.log(data);
      this.historico = data.datos;
    });
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
      precioP1opt: this.precioP1opt,
      precioP2opt: this.precioP2opt,
      precioP3opt: this.precioP3opt,
      precioP4opt: this.precioP4opt,
      precioP5opt: this.precioP5opt,
      precioP6opt: this.precioP6opt,
      archivo: this.archivos[0],
      precioE1Actual: this.precioE1Actual,
      precioE2Actual: this.precioE2Actual,
      precioE3Actual: this.precioE3Actual,
      precioE4Actual: this.precioE4Actual,
      precioE5Actual: this.precioE5Actual,
      precioE6Actual: this.precioE6Actual,
      precioE1Optimizada: this.precioE1Optimizada,
      precioE2Optimizada: this.precioE2Optimizada,
      precioE3Optimizada: this.precioE3Optimizada,
      precioE4Optimizada: this.precioE4Optimizada,
      precioE5Optimizada: this.precioE5Optimizada,
      precioE6Optimizada: this.precioE6Optimizada,
      impuestoElectrico: this.impuestoElectrico,
      descuentoPotencia: this.descuentoPotencia,
      descuentoEnergia: this.descuentoEnergia
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

  cargar(index: number) {
    // console.log(this.historico[index]);
    this.propietario = this.historico[index].propietario;
    this.tarifa = this.historico[index].tarifa;
    this.calculoAutomatico = this.historico[index].calculo_automatico;
    this.p1 = this.tratarCeros(this.historico[index].p1_act);
    this.p2 = this.tratarCeros(this.historico[index].p2_act);
    this.p3 = this.tratarCeros(this.historico[index].p3_act);
    this.p4 = this.tratarCeros(this.historico[index].p4_act);
    this.p5 = this.tratarCeros(this.historico[index].p5_act);
    this.p6 = this.tratarCeros(this.historico[index].p6_act);
    this.p1Calculos = this.tratarCeros(this.historico[index].p1_opt);
    this.p2Calculos = this.tratarCeros(this.historico[index].p2_opt);
    this.p3Calculos = this.tratarCeros(this.historico[index].p3_opt);
    this.p4Calculos = this.tratarCeros(this.historico[index].p4_opt);
    this.p5Calculos = this.tratarCeros(this.historico[index].p5_opt);
    this.p6Calculos = this.tratarCeros(this.historico[index].p6_opt);
    this.precioP1 = this.tratarCeros(this.historico[index].prc_p1_act);
    this.precioP2 = this.tratarCeros(this.historico[index].prc_p2_act);
    this.precioP3 = this.tratarCeros(this.historico[index].prc_p3_act);
    this.precioP4 = this.tratarCeros(this.historico[index].prc_p4_act);
    this.precioP5 = this.tratarCeros(this.historico[index].prc_p5_act);
    this.precioP6 = this.tratarCeros(this.historico[index].prc_p6_act);
    this.precioE1Actual = this.tratarCeros(this.historico[index].prc_e1_act);
    this.precioE2Actual = this.tratarCeros(this.historico[index].prc_e2_act);
    this.precioE3Actual = this.tratarCeros(this.historico[index].prc_e3_act);
    this.precioE4Actual = this.tratarCeros(this.historico[index].prc_e4_act);
    this.precioE5Actual = this.tratarCeros(this.historico[index].prc_e5_act);
    this.precioE6Actual = this.tratarCeros(this.historico[index].prc_e6_act);
    this.precioE1Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.precioE2Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.precioE3Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.precioE4Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.precioE5Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.precioE6Optimizada = this.tratarCeros(
      this.historico[index].prc_e1_opt
    );
    this.impuestoElectrico = this.historico[index].impuesto_elec;
    this.descuentoPotencia = this.historico[index].desc_pot;
    this.descuentoEnergia = this.historico[index].desc_ener;
  }

  tratarCeros(valor: any) {
    if (valor === '0' || valor === 0) {
      return undefined;
    } else {
      return valor;
    }
  }

  borrarRegistro(fecha: Date) {
    console.log(fecha);
    const dt = new Date(fecha);
    const fechaString =
      dt
        .getFullYear()
        .toString()
        .padStart(4, '0') +
      '-' +
      (dt.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      dt
        .getDate()
        .toString()
        .padStart(2, '0') +
      ' ' +
      dt
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      dt
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      dt
        .getSeconds()
        .toString()
        .padStart(2, '0');
    console.log(fechaString);
    Swal.fire({
      type: 'question',
      title: '¿Está seguro que desea borrar el registro seleccionado?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.calculosServ.borrarConsulta(fechaString).subscribe((data: any) => {
          if (data.ok) {
            Swal.fire('¡Borrado!', 'El registro ha sido eliminado.', 'success');
            this.calculosServ.getConsultas().subscribe((datos: any) => {
              // console.log(data);
              this.historico = datos.datos;
            });
          }
        });
      }
    });
  }
}
