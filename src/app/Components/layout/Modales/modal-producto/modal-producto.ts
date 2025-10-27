import { Component, Inject, OnInit } from '@angular/core';

//Importaciónes
// Formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Angular
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Interfaces
import { Categoria } from '../../../../Interfaces/categoria';
import { Producto } from '../../../../Interfaces/producto';
import { CategoriaService } from '../../../../Services/categoria';
import { ProductoService } from '../../../../Services/producto';
import { UtilidadService } from '../../../../Reutilizable/utilidad';


@Component({
  selector: 'app-modal-producto',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './modal-producto.html',
  styleUrls: ['./modal-producto.css']
})
export class ModalProductoComponent {
  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
        @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
        private fb: FormBuilder,
        private _categoriaServicio : CategoriaService,
        private _productoSersicio : ProductoService,
        private _utilidadServicio : UtilidadService
  ){
    
    this.formularioProducto = this.fb.group({
      nombre : ['', Validators.required],
      idCategoria : ['', Validators.required],
      stock : ['', Validators.required],
      precio : ['', Validators.required],
      esActivo : ['1', Validators.required]
    });

    // Validacion
      //Si tenemos informacion
    if(this.datosProducto != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    //Lista de categorias
    this._categoriaServicio.lista().subscribe({
    next: (data) => {
      if(data.status) this.listaCategorias = data.value;
    },
    error: (e) => {}
  })
    
  }

  ngOnInit(): void{
    //Si datosProducto tiene información
    if(this.datosProducto != null){
      this.formularioProducto.patchValue({
        //Seteo los valores
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto(){
      const _producto : Producto = {
        idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
        nombre: this.formularioProducto.value.nombre,
        idCategoria: this.formularioProducto.value.idCategoria,
        descripcionCategoria: "",
        precio : this.formularioProducto.value.precio,
        stock: this.formularioProducto.value.stock,
        esActivo: parseInt(this.formularioProducto.value.esActivo)
      }
  
        //Servicio para guardar o editar un usuario
      if(this.datosProducto == null){
        //Creamos un usuario
        this._productoSersicio.guardar(_producto).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El producto fue registrado", "Exito");
              //Después de creado el usuario, se cerrará el modal
              this.modalActual.close("true");
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto", "Error");
            }          
          },
          error: (e) => {
            this._utilidadServicio.mostrarAlerta("Hubo un error", "Error");
          }
      })
      
    }else{
      this._productoSersicio.editar(_producto).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue editado", "Exito");
              //Después de creado el usuario, se cerrará el modal
              this.modalActual.close("true");
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error");
            }          
          },
          error: (e) => {
            this._utilidadServicio.mostrarAlerta("Hubo un error", "Error");
          }
      })
    }
  }
}