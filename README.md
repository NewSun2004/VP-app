# VPApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

# Start

Sau khi clone repo này, vào thư mục backend, chạy lệnh "npm i" để cài node_modules cần thiết. Sau đó vào ".env" file và thay đổi các giá trị sau thành "true" để khởi tạo và thêm dữ liệu vào mongodb:
      IMPORT_DATA=false
      IMPORT_CARRIER_DATA=false
      UPDATE_BEST_SELLERS=false
Sau lần khởi tạo đầu tiên, thay đổi các giá trị trên trở lại thành "false".
Đối với thư mục VP-app, cần chạy lệnh "npm i" để cài tất cả node_modules cần thiêt.
Từ đây, VP-app đã có thể kết nối tới backend và hoạt động bình thường.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
