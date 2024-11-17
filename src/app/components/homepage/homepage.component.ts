import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule, NgFor, NgIf, CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe],
})
export class HomepageComponent implements OnInit {
  bestSellingProducts: any[] = [];
  visibleProducts: any[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 0;
  totalPages: number = 0; // Tổng số trang
  carouselTransform: string = 'translateX(0%)';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getBestSellingProducts().subscribe((products) => {
      this.bestSellingProducts = products;
      this.totalPages = Math.ceil(
        this.bestSellingProducts.length / this.itemsPerPage
      );
      this.updateVisibleProducts(); // Hiển thị sản phẩm ban đầu
    });
  }

  /**
   * Cập nhật các sản phẩm hiển thị trên giao diện
   */
  updateVisibleProducts(): void {
    const itemsPerPage = 8; // 2 hàng x 4 sản phẩm mỗi hàng
    const startIndex = this.currentIndex * itemsPerPage;

    // Kiểm tra nếu vượt quá số lượng sản phẩm
    if (startIndex >= this.bestSellingProducts.length) {
      this.visibleProducts = []; // Không còn sản phẩm để hiển thị
    } else {
      this.visibleProducts = this.bestSellingProducts.slice(
        startIndex,
        startIndex + itemsPerPage
      );
    }
  }

  /**
   * Điều hướng carousel trái/phải
   */
  navigate(direction: 'prev' | 'next'): void {
    const itemsPerPage = 8; // 2 hàng x 4 sản phẩm mỗi hàng
    const totalProducts = this.bestSellingProducts.length;

    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next') {
      if (this.currentIndex < totalPages - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Quay lại trang đầu tiên
      }
    }

    this.updateVisibleProducts();
  }

  /**
   * Hover đổi ảnh sản phẩm
   */
  hoverImage(productId: string, isHovering: boolean): void {
    const product = this.bestSellingProducts.find((p) => p._id === productId);
    const productLine = product.product_lines[0];

    if (isHovering) {
      productLine.image_urls = [
        productLine.image_urls[1],
        productLine.image_urls[0],
      ];
    } else {
      productLine.image_urls = [
        productLine.image_urls[1],
        productLine.image_urls[0],
      ];
    }
  }
}
