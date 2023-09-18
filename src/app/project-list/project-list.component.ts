import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // If you are using Angular Forms
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent{
  projectForm: FormGroup;
  projects: any[] = [];
  selectedFileName: string = '';
  selectedFile: any;
  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      client: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      assigned_manager: ['', Validators.required],
      attachments: [null, Validators.required],
      remarks: ['', Validators.required],
    });
  }
  onSubmit() {
    const formData = new FormData();
  
    formData.append('name', this.projectForm.value.name);
    formData.append('client', this.projectForm.value.client);
    formData.append('start_date', this.projectForm.value.start_date);
    formData.append('end_date', this.projectForm.value.end_date);
    formData.append('assigned_manager', this.projectForm.value.assigned_manager);
    if (this.selectedFile) {
      formData.append('attachments', this.selectedFile, this.selectedFile.name);
    }
    formData.append('remarks', this.projectForm.value.remarks);
  
    this.http.post<any>('http://localhost:3000/create-project', formData).subscribe(
      (response) => {
        const projectId = response.id;
        console.log('Project created successfully', response);
        const newProject = {
          name: this.projectForm.value.name,
          client: this.projectForm.value.client,
          start_date: this.projectForm.value.start_date,
          end_date: this.projectForm.value.end_date,
          assigned_manager: this.projectForm.value.assigned_manager,
          attachments: this.selectedFileName,
          remarks: this.projectForm.value.remarks
        };
        this.projects.push(newProject);
        this.projectForm.reset();
        alert('Project created successfully');
        if (projectId !== undefined) {
          this.router.navigate(['/project-detail']);
        } else {
          console.error('Project ID is undefined.');
        }
      },
      (error) => {
        console.error('Error creating project', error);
      }
    );
  }
  
  
  onFileChange(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    } else {
      this.selectedFile = null;
    }
  }

}
