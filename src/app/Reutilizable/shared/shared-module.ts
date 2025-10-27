//Acá importamos todos los archivos y recursos necesarios que voy a estar utilizando para la aplicación
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Importaciones
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Formularios activos y reactivos
import { HttpClientModule } from '@angular/common/http'; //Solicitudes HTTP Client

//Componentes de Angular Material
import {MatCardModule} from '@angular/material/card'; //Tarjetas
import {MatInputModule} from '@angular/material/input'; //Inputs para trabajar con las cajas de texto (desplegables, textarea, texto, numérico, correo, etc)
import {MatSelectModule} from '@angular/material/select'; //Select para trabajar con listas desplegables
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; //Spinner de carga, preview de un loading para la página
import {MatGridListModule} from '@angular/material/grid-list'; //Grid List para trabajar con listas en grillas

//Para los menús de navegación
import {LayoutModule} from '@angular/cdk/layout'; //Layout para trabajar con layouts responsivos
import {MatToolbarModule} from '@angular/material/toolbar'; //Toolbar para trabajar con barras de herramientas
import {MatSidenavModule} from '@angular/material/sidenav'; //Sidenav para trabajar con menús laterales
import {MatButtonModule} from '@angular/material/button'; //Button para trabajar con botones
import {MatIconModule} from '@angular/material/icon'; //Icon para trabajar con íconos
import {MatListModule} from '@angular/material/list'; //List para trabajar con listas

//Datatables
import {MatTableModule} from '@angular/material/table'; //Table para trabajar con tablas de Angular
import {MatPaginatorModule} from '@angular/material/paginator'; //Paginator para trabajar con la paginación de las tablas
import {MatDialogModule} from '@angular/material/dialog'; //Dialog para trabajar con cuadros de diálogo
import {MatSnackBarModule} from '@angular/material/snack-bar'; //SnackBar para trabajar con notificaciones y alertas
import {MatTooltipModule} from '@angular/material/tooltip'; //Tooltip para trabajar con tooltips
import {MatAutocompleteModule} from '@angular/material/autocomplete'; //Autocomplete para trabajar con autocompletados
import {MatDatepickerModule} from '@angular/material/datepicker'; //Datepicker para trabajar con selectores de fecha

//
import {MatNativeDateModule} from '@angular/material/core'; //NativeDateModule para trabajar con fechas nativas
import {MomentDateModule} from '@angular/material-moment-adapter'; //MomentDateModule para poder cambiar el formanto de las fechas

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule
  ],
  providers:[
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }

//Esto lo vamos a utilizar dentro del moludo principal de la aplicación (app.module.ts) para no tener que estar importando todos estos recursos en cada uno de los módulos que vayamos creando. Solo vamos a importar este módulo compartido (SharedModule) y ya vamos a tener acceso a todos estos recursos en cualquier módulo de la aplicación.