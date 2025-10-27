import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatColumnDef } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenav } from "@angular/material/sidenav";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from '@angular/material/list';


import { Router } from '@angular/router';

import { Menu } from '../../Interfaces/menu';

import { MenuService } from '../../Services/menu';
import { UtilidadService } from '../../Reutilizable/utilidad';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenav,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {

  listaMenus: Menu [] = [];
  correoUsuario: string = "";
  rolUsuario: string = "";

  constructor(
    private router: Router,
    private _menuServicio: MenuService,
    private _utilidadServicio: UtilidadService
  ){}

  ngOnInit(): void {
    const usuario = this._utilidadServicio.obtenerSesionUsuario();

    if(usuario != null){
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      this._menuServicio.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if(data.status) this.listaMenus = data.value;
        },
        error: (e) => {}
      });
    }
  }

  cerrarSesion(){
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
