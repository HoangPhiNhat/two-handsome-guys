# PostgreSQL: Bá Chủ Của Hệ Quản Trị Cơ Sở Dữ Liệu Quan Hệ (RDBMS)

❓ **Khái niệm (What is it?)**
PostgreSQL (hay Postgres) là hệ thống cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ và tiên tiến nhất thế giới. Không chỉ giới hạn ở bảng tính với các hàng và cột (Relational), Postgres là một hệ thống Đối tượng-Quan hệ (Object-Relational), hỗ trợ mạnh mẽ các chuẩn dữ liệu phi cấu trúc như JSON, mảng (Array), dữ liệu không gian định vị (GIS). Hãy nghĩ về nó như con dao Thụy Sĩ đa năng: bền bỉ, sắc bén, tích hợp mọi công cụ tinh xảo bạn cần để giải quyết dữ liệu thô.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cơ sở dữ liệu đời đầu (như MySQL cũ với MyISAM) thường khóa xích cả bảng dữ liệu khi bạn viết (Table-level lock), khiến hệ thống tê liệt khi hàng ngàn người truy cập cùng lúc. PostgreSQL sinh ra với sức mệnh đảm bảo tính Toàn Vẹn Số Liệu tuyệt đối (Chuẩn ACID) bằng cách dùng **MVCC (Multi-Version Concurrency Control)**. Nó giải quyết triệt để vấn đề truy cập bế tắc: Người đang đọc dữ liệu không bị chặn bởi người đang ghi đè lên dữ liệu đó và ngược lại.

⚙️ **Cách hoạt động ngầm (How it works)**
Khi bạn chạy lệnh `UPDATE users SET age = 25`, Postgres KHÔNG hề xóa và ghi đè trực tiếp lên ổ cứng vào ô nhớ chứa tuổi đang là 24.
Theo nguyên lý lõi MVCC: 
1. Postgres bí mật tạo ra hẳn một dòng rác mới (bản nháp - tupple) chứa tuổi 25.
2. Nó đánh dấu dòng 24 tuổi cũ là "Xóa ngầm" (Dead tupple).
Nhờ cách này, nếu có người dùng khác đang thực thi lệnh `SELECT` lúc bạn Update, họ vẫn đọc được bản nháp cũ 24 tuổi ở trong ổ đĩa an toàn. Sau đó, tiến trình dọn dẹp ngầm khét tiếng mang tên **Autovacuum** sẽ âm thầm lướt qua cái ổ cứng lúc nửa đêm dọn sạch đống dòng rác nháp kia đi để nhường lại không gian HDD. 

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Dùng PostgreSQL làm cột xương sống Mặc Định cho 99% dự án. Đặc biệt xuất sắc ở:
**Kịch bản 1: Search linh hoạt siêu đẳng như MongoDB!** Bảng User của bạn chứa cột JSONB chứa thông tin lổm chổm (Sở thích, Thiết bị). Bạn muốn tạo endpoint Query trực tiếp ngầm vô cục JSON đó.
**Kịch bản 2: Ứng dụng bản đồ Grab/Uber.** Nhúng extension `PostGIS` vào, bạn tính khoảng cách 2km từ tài xế cực kỳ vĩ đại bằng Index R-Tree Không gian thay vì vòng FOR tính vĩ tuyến ở Backend.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Sai lầm tủi nhục (Anti-pattern)**: Dùng khóa chính kiểu `UUID v4` random loạn xạ rỗng tuếch không theo thời gian cho các bảng INSERT siêu khủng (1 triệu dòng/ngày).
PostgreSQL sắp xếp bộ lục (B-Tree Index) nối tiếp. Nếu ID Random nhét vào, cây B-Tree bị băm xẻ rạch đôi liên tục (Index Fragmentation), Autovacuum thổi bùng, Server lết bánh. (Senior dùng `UUID v7` có tuần tự thời gian).

---

💻 **Code minh họa trong NestJS (Thực chiến)**

### 1. Kết nối Chuyên sâu bằng Pooling & TypeORM
Đừng bao giờ thiết lập DB hời hợt. TCP Handshake chết chóc. NestJS phải dùng Pool Cấp Sợi.

```js
// typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'ecommerce_db',
  // Ánh xạ file thực thể
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // 🔴 Sai lầm Chí tử: Mở synchronize: true
  // Tự quét và Drop Column Production nếu code bị sai.
  synchronize: false, 
  
  // ✅ Đúng: Khống chế Connection Pool
  extra: {
    // Không cho phép NestJS bóp nghẹt Postgres mở quá 20 luồng (Socket)
    // Ngay cả khi có 1000 người gọi API. Giữ DB ổn định.
    max: 20,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
  }
};
```

### 2. Các Kiểu Dữ Liệu Dị Biệt Postgres & UUID

```js
// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity('users')
export class User {
  // Dùng uuid thay vì Incremental ID sinh số dễ bị Crawl Web Cướp Dữ Liệu
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Postgres native Array, thay vì tạo dư 1 Bảng 1-Nhiều cực nhọc cho Tags
  @Column('text', { array: true, default: [] })
  tags: string[];

  // ENUM type ở mức DB gốc, ép DB từ chối giá trị lạ
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  // Sức mạnh hủy diệt MongoDB (JSONB)
  @Column({ type: 'jsonb', default: {} })
  metadata: {
    preferences?: any;
    loginHistory?: string[];
  };
}
```

### 3. Vận Động Mọi Loại JOIN (Kẹp TypeORM với SQL Raw)
Hiểu JOIN không chỉ là Code, mà là mường tượng bảng nháp.

```js
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async giantQueryShowcase() {
    return this.userRepository.createQueryBuilder('user')
      /* 
       1. INNER JOIN (Mặc đinh): Tì sát lấy ra cục GIAO NHAU (Lấy User CÓ BẮT BUỘC Đơn Hàng)
       SQL Tương ứng: SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id
       */
      .innerJoinAndSelect('user.orders', 'order')

      /* 
       2. LEFT JOIN: Ưu Tiên Bảng Cầm Trịch. Đọc hết User dù có hay không Đơn Hàng (Đơn trống rớt NULL).
       Dùng khi Lọc User chưa từng mua đồ ráp báo cáo.
       SQL: LEFT JOIN profiles ON profiles.user_id = user.id
       */
      .leftJoinAndSelect('user.profile', 'profile')

      /* 
       3. RIGHT JOIN: Ưu Tiên Bảng Bị Gọi. Ở TypeORM ít xài, nó ngược LEFT JOIN. 
       Kiếm TẤT CẢ Thẻ Bảo Hành DÙ CÓ hay KHÔNG Trúng User.
       */
      .rightJoin('user.warranties', 'warranty', 'warranty.status = :status', { status: 'ACTIVE' })

      // CROSS JOIN: Điên Mất Não. 100 User X 100 Sản phẩm = Nhả ra 10.000 dòng cặp đôi tất cả. (Typeorm cực hiếm xài raw)
      
      // Khúc Dữ JSONB (Bắn xuyên mảng JSON DB Query)
      // Tìm thằng User có cái Sở thích (JSON metadata) chứa key là 'Dark_Mode'
      // Toán tử @> Nghĩa là: Liệu cái vế Trái có Bao Phủ Nốt cái Object vế Phải?
      .andWhere(`user.metadata @> '{"preferences": {"theme": "Dark_Mode"}}'`)
      .getMany();
  }
}
```

### 4. Bàn Cân Sắt Đá: Transaction Với QueryRunner
Muốn làm hàm Thanh Toán (Đang Trừ Tiền Kẹt Điện). Phải dùng Rào Giao Dịch (Transaction).

```js
// payment.service.ts
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(private dataSource: DataSource) {}

  async transferMoney(fromId: string, toId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Khai Sứ Mở Kênh Cấm
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); // Cô Lập (Isolation) chặn Đọc Rác bẩn từ Query Khác Đang Mâm

    try {
      const sender = await queryRunner.manager.findOne(User, { where: { id: fromId } });
      if (sender.balance < amount) throw new Error('Ví Trống Lép');

      // Thực thi Nháp Bộ đệm DB
      sender.balance -= amount;
      await queryRunner.manager.save(sender);

      const receiver = await queryRunner.manager.findOne(User, { where: { id: toId } });
      receiver.balance += amount;
      await queryRunner.manager.save(receiver);

      // ✅ OK Mọi Thứ Sống. Thả Van Nén Lên Ổ Đĩa Hoàn Chỉnh Mãi Mãi
      await queryRunner.commitTransaction();
    } catch (err) {
      // 🔴 Sấm Chớp Gảy: Lệnh Xóa Bỏ Hoạt Cảnh Trước Đó Về Tình Trạng An Toàn
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Chết Lên Chết Cụ Phải Trả Nhả Rút Sợi Dây Mạng Lại Hồ Chứa
      await queryRunner.release();
    }
  }
}
```

---

🔍 **Đào sâu (Deep dive & Edge cases)**

### EXPLAIN ANALYZE - Ánh Sáng Giải Phẫu
Mỗi khi bạn Viết một `createQueryBuilder`, Postgres trước hết Nện nó qua Bảng Kế Hoạch (Query Planner). Fresher chạy Query thấy Dòng Trả về là vui. Senior Bật Ghi Máy Soi Ống Dòm (EXPLAIN ANALYZE).

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@mew.com';
-- Output Phế Rác: 
-- Seq Scan on users (cost=0.00..12450.00 rows=1 width=96) (Cày Lết Xác Quét Mọi 1 Triệu Dòng)
-- Actual time=140.231 ms

-- Sáng Mắt Sau Khi Bấm Lệnh Tạo Index (B-Tree): 
CREATE INDEX idx_users_email ON users(email);

-- Output Thiên Thần:
-- Index Scan using idx_users_email (cost=0.43..8.45 rows=1 width=96) (Móc Cột Nhằm Tim)
-- Actual time=0.054 ms
```
* **B-Tree Index:** Phổ cập, xài so sánh `=`, `<`, `>`. Rất nhanh.
* **GIN (Generalized Inverted Index):** Sống Cứu JSONB và FULL-TEXT SEARCH. Nó Phanh rách Cục text bự chữ thề ra thành các từ khóa mục lục nằm ở cuối cuốn sáh giáo khoa. 
* **BRIN:** Bảng bám Chùm Block. Sinh ra dọ thám dữ liệu IoT Thời tiết 1 tỷ dòng Thời gian (Xài bộ đếm Max Min Rào Phân Mảnh Chứ K Lặp Điểm Khóa Tổ Yến).

### Cán Láng MySQL Gốc?
- PostgreSQL gán **JSONB** thành khối Binary và áp mạng lưới GIN xịn xò. MySQL Xài JSON Thường rớt hạng Text Căng.
- Postgres sở Hữu Cấu Trụ **Window Functions** Nặng Nghiep Vụ Rank Tính Luỹ Kế Siêu Gắt (vd Xếp Thứ Hạng Top Sale Của Từng Công Ty Chẻ Ra Hộp Ngay Bằng Câu Xoáy Window Hàm `RANK() OVER (PARTITION BY company_id ORDER BY sales DESC)`).

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó đè Nẹp Bảng Xếp Chuẩn **ACID** & **Transactions**. Móng Cầu Cho Việc Giải Trữ **ElasticSearch** Cồng Kềnh.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Cô lập Đọc Rác Bẩn (Dirty Read) Là Nghĩ Gì Và Các Cấp Isolation Kháng Thự Ở PG Ngữ Nào?**
   *Đáp án:* Trong lúc Anh A Đang Chuyển Tiền, DB trừ tiền nhưng lệnh Chưa Ký Commit Xuống dĩa cứng. Gã B Đọc Lệnh Thấy Tiền Đã Trừ Làm Gãy Tín Cương Phân. PG Trang Cự 4 Cấp (Read Uncommitted, Read Committed, Repeatable Read, Serializable). Mặc định Postgres Bật Rào `Read Committed` Thắng Điểm Rớt Thủng Thấp Cấm Đọc Đừng Mẩu Lề Đứt Bóng Ảo Kia.
2. **Tại sao Nested Lồng Mỏ Query Lại Văng Hiệu Suất Tệ Hơn JOIN Thắt Ngặt Ngang?**
   *Đáp án:* Hàm SubQuery Cấu Viết Như Này `SELECT * FROM a WHERE id IN (SELECT id FROM b)`. Họa Hại Là PG Phân Mã SubQuery Khởi Động Thành Vòng Lặp Trầm. Engine Kéo Bảng A Đi Khối Quét Từng Thằng Một Vát Tròng Nhảy Soi Cho Mảng B (Độ phức Tạp Chát O(N*M)) Khác Với JOIN Ngay Cửa Khung Móc Lỗ 2 Cối B-Tree Cảo Trừ Nát Ra 1 Thớt Sức Khảo. (Tuy PG Mới Tối Ưu, Nhưng Thợ Cao Vẫn Giữ Joins Làm Thước Lượng Chóp!).
