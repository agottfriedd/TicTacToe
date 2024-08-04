import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiServicesService } from '../api-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]); //aqui pongo validators.email para que me valide que sea un correo electronico
  registerForm: FormGroup; //registerForm: FormGroup es para que se pueda usar en el html y quiere decir que es un formulario


  constructor(private router: Router, private formBuilder:FormBuilder, private apiServices:ApiServicesService) {
    this.registerForm = this.formBuilder.group({
      names: ['', Validators.required],
      lastnames: ['', Validators.required],
      username: ['', Validators.required],
      email: this.emailFormControl,
      password: ['', Validators.required] 
    })
   }

   postRegister = () => {
    try{
      if(this.registerForm.valid){
        this.apiServices.postUsers(this.registerForm.value).subscribe(
          response => {
            alert('Registrado exitosamente');
            this.navigateToLogin();
          },
          error => {
            alert(error.error.message);
          }
        );
      }else{
        alert('Porfavor llena todos los campos');
      }
    } catch(error) {
        alert('Error al registrar, Contacte a Sistema');
      }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
