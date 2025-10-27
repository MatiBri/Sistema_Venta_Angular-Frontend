import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, registerables } from 'chart.js';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';

import { DashBoardService } from '../../../../Services/dash-board';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  imports: [
    MatCardModule,
    MatGridListModule,
    MatIcon,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './dash-board.html',
  styleUrls: ['./dash-board.css']
})
export class DashBoardComponent implements OnInit {

  totalIngresos: string= "0";
  totalVentas: string = "0";
  totalProductos: string = "0";

  constructor(
    private _dashboardServicio: DashBoardService
  ){

  }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]){
    const charBarras = new Chart('chartBarras',{
      type:"bar",
      data: {
        labels:labelGrafico,
        datasets:[{
          //Información por cada barra
          label:"# de Ventas",
          data: dataGrafico,
          backgroundColor:[
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options:{
        maintainAspectRatio : false,
        responsive : true,
        scales:{
          y:{
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next:(data) =>{
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData : any[] = data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          console.log(labelTemp, dataTemp);

          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (e) =>{}
    })
  }
}
