import { Component, OnInit } from '@angular/core';
import { CalculosService } from '../../services/calculos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string;
  pass: string;

  constructor(private calcServ: CalculosService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.calcServ
      .login(this.usuario, this.pass)
      .pipe(
        catchError((err: any) => {
          Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos'
          });
          return throwError(err);
        })
      )
      .subscribe((resp: any) => {
        if (resp.ok) {
          localStorage.setItem('fechaLogin', new Date().toString());
          localStorage.setItem('tokenEnergy', resp.token);
          this.router.navigate(['home']);
        }
      });
  }
}
