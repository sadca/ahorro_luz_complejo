import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Router } from '@angular/router';
import { CalculosService } from '../services/calculos.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticationGuard implements CanActivate {
  constructor(private router: Router, private calcServ: CalculosService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.calcServ.estaLogeado()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
