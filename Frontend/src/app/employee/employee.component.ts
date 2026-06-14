import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  showModal = false;
  isViewMode = false;
  formData: any = { fullName: '', birthDate: '', address: '' };
  
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  
  fetchEmployees() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data.map(emp => ({
          ...emp,
         
          age: emp.age !== undefined ? emp.age : this.calculateAge(emp.birthDate)
        }));
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
        alert('ไม่สามารถดึงข้อมูลจาก Server ได้');
      }
    });
  }

  
  calculateAge(birthDateStr: string): number {
    if (!birthDateStr) return 0;
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return 0; 

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  openAddModal() {
    this.isViewMode = false;
    this.formData = { fullName: '', birthDate: '', address: '' };
    this.showModal = true;
  }

  openViewModal(emp: any) {
    this.isViewMode = true;
    this.formData = { ...emp };
    this.showModal = true;
  }

  save() {
    
    if (!this.formData.fullName || !this.formData.birthDate) {
      alert('รบกวนพี่กรอก ชื่อ-สกุล และ วันเกิด ให้ครบก่อนนะครับ');
      return;
    }

    this.http.post(this.apiUrl, this.formData).subscribe({
      next: () => {
        this.fetchEmployees(); 
        this.showModal = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', err);
        alert('บันทึกข้อมูลไม่สำเร็จ ลองใหม่อีกครั้งครับพี่');
      }
    });
  }
}