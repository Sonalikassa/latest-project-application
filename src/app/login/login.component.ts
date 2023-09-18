import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
    ) { }

    onLoginSubmit() {
      const credentials = {
        username: this.username,
        password: this.password
      }; 
      const backendURL = 'http://localhost:3000';
      this.http.post(`${backendURL}/login`, credentials).subscribe(
        (response: any) => { 
          if (response.success) { 
            this.router.navigate(['project-list']);
          } else {
            console.error('Login failed:', response.message);
          }
        },
        (error) => {
          console.error('An error occurred:', error);
        }
      );
    }
}
