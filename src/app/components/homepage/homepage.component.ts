// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ProductService } from '../../services/product.service';
// import ColorThief from 'color-thief';

// @Component({
//   selector: 'app-homepage',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.css'],
// })
// export class HomepageComponent implements OnInit {
//   bestSellingProducts: any[] = [];
//   productLinesByProduct: { [key: string]: any[] } = {};
//   extractedColors: { [key: string]: string[] } = {};
//   selectedColors: { [key: string]: number } = {};
//   visibleProducts: any[] = [];
//   currentPageIndex = 0;
//   productsPerPage = 4; // Default for desktop
//   carouselTransform = 'translateX(0)';

//   private productService = inject(ProductService);

//   ngOnInit(): void {
//     this.calculateProductsPerPage();

//     // Lấy danh sách sản phẩm best-selling
//     this.productService.getBestSellingProducts().subscribe(
//       (data) => {
//         this.bestSellingProducts = data;
//         this.initializeProductLines();
//         this.updateVisibleProducts();
//       },
//       (error) => {
//         console.error('Error fetching best-selling products:', error);
//       }
//     );

//     // Theo dõi kích thước màn hình
//     window.addEventListener('resize', this.onResize.bind(this));
//   }

//   // Tính toán số lượng sản phẩm hiển thị theo màn hình
//   calculateProductsPerPage() {
//     const screenWidth = window.innerWidth;

//     if (screenWidth >= 1024) {
//       this.productsPerPage = 4; // Desktop
//     } else if (screenWidth >= 768) {
//       this.productsPerPage = 3; // Tablet
//     } else {
//       this.productsPerPage = 2; // Phone
//     }
//   }

//   // Khi thay đổi kích thước màn hình
//   onResize() {
//     this.calculateProductsPerPage();
//     this.updateVisibleProducts();
//   }

//   // Khởi tạo productLines và colors
//   initializeProductLines() {
//     this.bestSellingProducts.forEach((product) => {
//       // Lấy product lines cho từng sản phẩm
//       this.productLinesByProduct[product._id] = product.product_lines;

//       // Khởi tạo selectedColors mặc định là 0
//       this.selectedColors[product._id] = 0;

//       // Trích xuất màu từ hình ảnh đầu tiên của từng product line
//       this.extractedColors[product._id] = [];
//       product.product_lines.forEach((line, index) => {
//         const imageUrl = line.image_urls[0];
//         this.extractColorFromImage(imageUrl, product._id, index);
//       });
//     });
//   }

//   // Hàm trích xuất màu từ hình ảnh sử dụng Color Thief
//   extractColorFromImage(
//     imageUrl: string,
//     productId: string,
//     lineIndex: number
//   ) {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous'; // Đảm bảo tải ảnh từ nguồn ngoài
//     img.src = imageUrl;

//     img.onload = () => {
//       const colorThief = new ColorThief();
//       const rgb = colorThief.getColor(img); // Trích xuất mã màu RGB
//       const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

//       if (!this.extractedColors[productId]) {
//         this.extractedColors[productId] = [];
//       }
//       this.extractedColors[productId][lineIndex] = color;
//     };

//     img.onerror = (err) => {
//       console.error(
//         `Error loading image for color extraction: ${imageUrl}`,
//         err
//       );
//       if (!this.extractedColors[productId]) {
//         this.extractedColors[productId] = [];
//       }
//       this.extractedColors[productId][lineIndex] = '#ccc'; // Màu mặc định nếu lỗi
//     };
//   }

//   // Cập nhật các sản phẩm hiển thị dựa trên trang hiện tại
//   updateVisibleProducts() {
//     const startIndex = this.currentPageIndex * this.productsPerPage;
//     const endIndex = startIndex + this.productsPerPage;

//     this.visibleProducts = this.bestSellingProducts.slice(startIndex, endIndex);

//     // Cập nhật vị trí carousel
//     this.carouselTransform = `translateX(-${this.currentPageIndex * 100}%)`;
//   }

//   // Chuyển trang trái
//   navigateLeft() {
//     if (this.currentPageIndex > 0) {
//       this.currentPageIndex--;
//       this.updateVisibleProducts();
//     }
//   }

//   // Chuyển trang phải
//   navigateRight() {
//     const totalPages = Math.ceil(
//       this.bestSellingProducts.length / this.productsPerPage
//     );
//     if (this.currentPageIndex < totalPages - 1) {
//       this.currentPageIndex++;
//       this.updateVisibleProducts();
//     }
//   }

//   // Đổi ảnh khi hover
//   hoverImage(productId: string, hover: boolean) {
//     const selectedIndex = this.selectedColors[productId];
//     const imageIndex = hover ? 0 : 1; // Hover dùng ảnh [0], không hover dùng ảnh [1]

//     this.productLinesByProduct[productId][selectedIndex].image_urls[1] =
//       this.productLinesByProduct[productId][selectedIndex].image_urls[
//         imageIndex
//       ];
//   }

//   // Thay đổi màu
//   changeColor(productId: string, colorIndex: number) {
//     this.selectedColors[productId] = colorIndex;
//   }
// }
