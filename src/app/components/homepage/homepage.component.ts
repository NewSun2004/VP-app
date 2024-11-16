import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule], // Import CommonModule để sử dụng *ngFor, *ngIf
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  bestSellingProducts: any[] = []; // Biến lưu danh sách sản phẩm best-seller

  // Sử dụng `inject` để inject `ProductService`
  private productService = inject(ProductService);

  ngOnInit(): void {
    // Gọi API lấy danh sách sản phẩm best-seller
    this.productService.getBestSellingProducts().subscribe(
      (data) => {
        this.bestSellingProducts = data; // Lưu dữ liệu vào biến `bestSellingProducts`
      },
      (error) => {
        console.error('Error fetching best-selling products:', error);
      }
    );
  }
}
