import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // If you are using Angular Forms
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  projectId: number = 0; 
  projectForm: FormGroup;
  selectedFileName: string = '';
  projectDetails: any; 
  projects: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder,private router: Router,private datePipe: DatePipe) {this.projectForm = this.fb.group({
    name: ['', Validators.required],
    client: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    assigned_manager: ['', Validators.required],
    attachments: [null, Validators.required],
    remarks: ['', Validators.required],
  }); }

  ngOnInit(): void {
    this.fetchAllProjectDetails();
  }

  private fetchAllProjectDetails() {
    this.http
      .get<any[]>('http://localhost:3000/project-details')
      .subscribe(
        (response) => {
          this.projectDetails = response;
        },
        (error) => {
          console.error('Error fetching project details', error);
        }
      );
  }


  onSubmit() {
    const formData = new FormData(); 
    formData.append('name', this.projectForm.value.name);
    formData.append('client', this.projectForm.value.client);
    formData.append('start_date', this.projectForm.value.start_date);
    formData.append('end_date', this.projectForm.value.end_date);
    formData.append('assigned_manager', this.projectForm.value.assigned_manager);
    formData.append('attachments', this.selectedFileName);
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
          this.router.navigate(['/project-detail', projectId]);
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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.selectedFileName = selectedFile.name;
    } else {
      this.selectedFileName = '';
    }
  }

  goback(){
    this.router.navigate(['project-list']);
  }
  onCompleted(){
    alert("Project has been successfully Completed");
  }

  onRejected(){
    alert("Project has been rejeted");
  }
}
