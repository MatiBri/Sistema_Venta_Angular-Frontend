import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';

//Nota, acá deberían aparecer los componentes, el Layout y Login, si mas adelante tengo problemas, 
//habrá que ver de hacer un import y de resolver esto

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('AppSistemaVenta');
}


/*
@NgModule({
declarations: [
  AppComponent,
  LoginComponent,
  LayoutComponent
],
imports: [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,

  SharedModule,
],
providers: [],
bootstrap: [AppComponent]
})
export class AppRoutingModule { }

A tomar en cuenta esto por las dudas
*/