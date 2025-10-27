import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login';

export const routes: Routes = [
    {path: '', component: LoginComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent, pathMatch: 'full'},
    {path: 'pages', loadChildren: () => import('./Components/layout/layout-module').then(m => m.LayoutModule)},
    {path: '**', redirectTo: 'login', pathMatch: 'full'} //cualquier otra ruta que no exista, redirecciona a la principal
];


/*
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

A tomar en cuenta esto por las dudas
*/