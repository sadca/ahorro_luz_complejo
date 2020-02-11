import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculosComponent } from './components/calculos/calculos.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AutenticationGuard } from './guards/autentication.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AutenticationGuard] },
  {
    path: 'calculos',
    component: CalculosComponent,
    canActivate: [AutenticationGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
