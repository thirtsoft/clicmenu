import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { ResetPasswordComponent } from './pages/reset-password-component/reset-password-component';
import { ForgotPasswordComponent } from './pages/forgot-password-component/forgot-password-component';


export const AUTH_ROUTES: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },


  {
    path: 'login',
    component: LoginComponent
  },

   {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

   {
    path: 'mot-de-passe-oublie',
    component: ForgotPasswordComponent
  },

];
