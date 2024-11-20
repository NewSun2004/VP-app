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
  itemsPerRow: number = 4; // Default: Desktop (4 sản phẩm mỗi hàng)
  itemsPerPage: number = 8; // 2 hàng x 4 sản phẩm
  carouselTransform: string = 'translateX(0%)';

  // Countdown variables
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';

  private countdownInterval: any;
  private resizeSubscription: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Fetch Best-Selling Products
    this.productService.getBestSellingProducts().subscribe(
      (products) => {
        console.log('Fetched Best-Selling Products:', products); // Log dữ liệu
        this.bestSellingProducts = products;
        this.updateVisibleProducts();
      },
      (error) => {
        console.error('Error fetching Best-Selling Products:', error);
      }
    );

    // Start countdown timer
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 12); // Thêm 12 ngày
    this.startCountdown(targetDate.toISOString());
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  /**
   * Điều chỉnh số lượng sản phẩm mỗi hàng dựa trên kích thước màn hình
   */
  updateItemsPerPage(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth < 480) {
      this.itemsPerRow = 2; // Mobile: 2 sản phẩm mỗi hàng
    } else if (screenWidth < 1024) {
      this.itemsPerRow = 3; // Tablet: 3 sản phẩm mỗi hàng
    } else {
      this.itemsPerRow = 4; // Desktop: 4 sản phẩm mỗi hàng
    }

    this.itemsPerPage = this.itemsPerRow * 2; // Luôn hiển thị 2 hàng
    this.updateVisibleProducts();
  }

  /**
   * Cập nhật danh sách sản phẩm hiển thị
   */
  updateVisibleProducts(): void {
    const startIndex = this.currentIndex * this.itemsPerPage;

    // Lọc sản phẩm theo loại
    const eyeGlasses = this.bestSellingProducts.filter(
      (product) => product.category_name === 'eye glasses'
    );
    const sunGlasses = this.bestSellingProducts.filter(
      (product) => product.category_name === 'sun glasses'
    );

    // Lấy sản phẩm cho từng hàng
    const eyeGlassesRow = eyeGlasses.slice(
      startIndex,
      startIndex + this.itemsPerRow
    );
    const sunGlassesRow = sunGlasses.slice(
      startIndex,
      startIndex + this.itemsPerRow
    );

    // Kết hợp sản phẩm từ cả 2 hàng
    this.visibleProducts = [...eyeGlassesRow, ...sunGlassesRow];

    // Nếu không đủ sản phẩm, thêm phần tử trống để lấp đầy hàng
    while (this.visibleProducts.length < this.itemsPerPage) {
      this.visibleProducts.push({}); // Placeholder cho sản phẩm trống
    }
  }

  /**
   * Điều hướng trái/phải trong carousel
   */
  navigate(direction: 'prev' | 'next'): void {
    const totalProducts = this.bestSellingProducts.length;
    const totalPages = Math.ceil(totalProducts / (this.itemsPerPage / 2));

    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next') {
      if (this.currentIndex < totalPages - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Quay lại trang đầu
      }
    }

    this.updateVisibleProducts();
  }
  /**
   * Hiệu ứng thay đổi ảnh khi hover chuột
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
   * Timer đếm ngược khuyến mãi
   */
  startCountdown(endDate: string): void {
    const endTime = new Date(endDate).getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = Math.max(endTime - now, 0);

      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval); // Dừng khi hết giờ
      }

      // Tính toán thời gian còn lại
      const formatTime = (time: number) => time.toString().padStart(2, '0');
      this.days = formatTime(Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
      this.hours = formatTime(
        Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      this.minutes = formatTime(
        Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      );
      this.seconds = formatTime(Math.floor((timeLeft % (1000 * 60)) / 1000));
    }, 1000);
  }
}
