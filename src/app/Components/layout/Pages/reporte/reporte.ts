import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Formularios
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import moment from 'moment';

import * as XLSX from "xlsx";

//Interfaces
import { Reporte } from '../../../../Interfaces/reporte';

//Servicios
import { VentaService } from '../../../../Services/venta';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

//Formato de las fechas
export const MY_DATA_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-reporte',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './reporte.html',
  styleUrls: ['./reporte.css'],
  providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit {

  //Variables
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ["fechaRegistro", "numeroVenta", "tipoPago", "total", "producto", "cantidad", "precio", "totalProducto"];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  //Variable para la paginación
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    //Inyecciónes de dependencia
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){
    //Campos que va a tener el formulario 
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  //Método para la paginación
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  //Método para poder realizar la búsqueda según un rango de fecha especificado
  buscarVentas(){

    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');

    //Validamos si las fechas son validas o no
    if(_fechaInicio === "invalid date" || _fechaFin === "invalid date"){
      this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
      return;
    }

    //Ejecuto el servicio para obtener el reporte
    this._ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      //Me suscribo para obtener la información
      next: (data) =>{
        if(data.status){
          this.listaVentasReporte = data.value; //Actualizo la lista de ventas de reporte con la información de la API
          this.dataVentaReporte.data = data.value; //Actualizo el origen de la información de la tabla
        }else{
          //Limpio los campos
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    })
  }

  //Método para poder exportar el Excel
  exportarExcel(){
    const wb = XLSX.utils.book_new(); //Creo un nuevo libro de Excel
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte); //Y con este array lleno la hoja

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte Ventas.xlsx"); //Exporto el excel a través de un array (listaVentasReporte es el array)
  }
}
