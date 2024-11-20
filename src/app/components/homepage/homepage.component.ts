import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule, NgFor, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe],
})
export class HomepageComponent implements OnInit, OnDestroy {
  bestSellingProducts: any[] = [];
  visibleProducts: any[] = [];
  currentIndex: number = 0;
  itemsPerRow: number = 4; // Mặc định là 4 sản phẩm mỗi hàng (Desktop)
  itemsPerPage: number = 8; // 2 hàng x 4 sản phẩm
  carouselTransform: string = 'translateX(0%)';

  // Biến cho đồng hồ đếm ngược
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';

  private countdownInterval: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Lấy sản phẩm từ API
    this.productService.getBestSellingProducts().subscribe((products) => {
      this.bestSellingProducts = products;
      this.updateItemsPerPage(); // Xác định số sản phẩm hiển thị
      this.updateVisibleProducts(); // Hiển thị sản phẩm ban đầu
    });

    // Bắt đầu đồng hồ đếm ngược
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 12); // Thêm 12 ngày
    this.startCountdown(targetDate.toISOString());

    // Thêm sự kiện lắng nghe resize
    window.addEventListener('resize', this.updateItemsPerPage.bind(this));
  }

  ngOnDestroy(): void {
    // Gỡ bỏ sự kiện và đồng hồ đếm ngược khi component bị hủy
    window.removeEventListener('resize', this.updateItemsPerPage.bind(this));
    clearInterval(this.countdownInterval); // Dừng đồng hồ đếm ngược
  }

  /**
   * Cập nhật số sản phẩm hiển thị trên mỗi trang dựa trên kích thước màn hình
   */
  updateItemsPerPage(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth < 480) {
      // Mobile rất nhỏ: 2 sản phẩm mỗi hàng, 2 hàng
      this.itemsPerRow = 2;
    } else if (screenWidth < 1024) {
      // Tablet/Mobile: 3 sản phẩm mỗi hàng, 2 hàng
      this.itemsPerRow = 3;
    } else {
      // Desktop: 4 sản phẩm mỗi hàng, 2 hàng
      this.itemsPerRow = 4;
    }

    this.itemsPerPage = this.itemsPerRow * 2; // Luôn hiển thị 2 hàng
    this.updateVisibleProducts(); // Cập nhật danh sách sản phẩm hiển thị
  }

  /**
   * Cập nhật các sản phẩm hiển thị trên giao diện
   */
  updateVisibleProducts(): void {
    const startIndex = this.currentIndex * this.itemsPerPage;
    const totalProducts = this.bestSellingProducts.length;

    // Lấy sản phẩm từ danh sách
    this.visibleProducts = this.bestSellingProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );

    // Nếu không đủ sản phẩm, lấp thêm từ đầu danh sách
    if (this.visibleProducts.length < this.itemsPerPage) {
      const remaining = this.itemsPerPage - this.visibleProducts.length;
      this.visibleProducts = [
        ...this.visibleProducts,
        ...this.bestSellingProducts.slice(0, remaining),
      ];
    }
  }

  /**
   * Điều hướng carousel trái/phải
   */
  navigate(direction: 'prev' | 'next'): void {
    const totalProducts = this.bestSellingProducts.length;
    const totalPages = Math.ceil(totalProducts / this.itemsPerPage);

    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next') {
      if (this.currentIndex < totalPages - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Quay lại trang đầu
      }
    }

    this.updateVisibleProducts(); // Cập nhật danh sách sản phẩm hiển thị
  }

  /**
   * Hover đổi ảnh sản phẩm
   */
  hoverImage(productId: string, isHovering: boolean): void {
    const product = this.bestSellingProducts.find((p) => p._id === productId);
    const productLine = product.product_lines[0];

    if (isHovering) {
      // Khi hover: đổi ảnh từ image_urls[1] sang image_urls[0]
      const temp = productLine.image_urls[0];
      productLine.image_urls[0] = productLine.image_urls[1];
      productLine.image_urls[1] = temp;
    } else {
      // Khi không hover: đổi lại ảnh ban đầu
      const temp = productLine.image_urls[0];
      productLine.image_urls[0] = productLine.image_urls[1];
      productLine.image_urls[1] = temp;
    }
  }

  /**
   * Hàm đếm ngược
   */
  startCountdown(endDate: string): void {
    const endTime = new Date(endDate).getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        this.days = '00';
        this.hours = '00';
        this.minutes = '00';
        this.seconds = '00';
        clearInterval(this.countdownInterval); // Dừng khi hết giờ
        return;
      }

      // Tính thời gian còn lại
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Cập nhật giá trị
      this.days = days.toString().padStart(2, '0');
      this.hours = hours.toString().padStart(2, '0');
      this.minutes = minutes.toString().padStart(2, '0');
      this.seconds = seconds.toString().padStart(2, '0');
    }, 1000);
  }
}
