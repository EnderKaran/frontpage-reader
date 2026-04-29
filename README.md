

---

# Frontpage

**Frontpage**, modern web teknolojileriyle inşa edilmiş, "Quiet Luxury" tasarım felsefesini benimseyen, minimalist ve yüksek performanslı bir kişisel RSS okuyucudur. Karmaşadan uzak, sadece içeriğe odaklanan bir okuma deneyimi sunar.

<img width="1888" height="937" alt="bannner" src="https://github.com/user-attachments/assets/58141014-9bcc-46d2-985d-42cbed5b8b41" />


## Özellikler

* **Next.js 16 & Server Actions:** En yeni React özellikleriyle ultra hızlı sayfa geçişleri ve API rotasına ihtiyaç duymayan veri yönetimi.
* **Akıllı Senkronizasyon:** RSS kaynaklarını tek tıkla güncelleyen entegre `rss-parser` sistemi.
* **Okuma Durumu Takibi:** Hangi makalelerin okunduğunu görsel olarak takip edebilme.
* **Favoriler (Saved):** Daha sonra okumak istediğiniz içerikleri kişisel arşivinize ekleme.
* **Dinamik Kategori Yönetimi:** Makaleleri ilgi alanlarınıza göre (AI, Frontend, Backend vb.) otomatik gruplandırma.
* **Abonelik Yönetimi:** Arayüz üzerinden yeni RSS kaynakları ekleme veya mevcutları silme.
* **Sonsuz Kaydırma (Infinite Scroll):** Kesintisiz bir okuma akışı için aşağı kaydırdıkça otomatik yüklenen içerikler.
* **Tam Duyarlı (Responsive) Tasarım:** Masaüstünde sabit sidebar, mobilde ise zarif bir "Drawer" menü ile her cihazda kusursuz deneyim.

## Teknoloji Yığını

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Database:** [PostgreSQL (Neon DB)](https://neon.tech/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Date Handling:** [date-fns](https://date-fns.org/)

## Kurulum

1.  **Depoyu kopyalayın:**
    ```bash
    git clone https://github.com/kullaniciadi/frontpage.git
    cd frontpage
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Environment variables (.env) dosyasını oluşturun:**
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/frontpage"
    ```

4.  **Veritabanı şemasını hazırlayın:**
    ```bash
    npx prisma db push
    npx prisma generate
    ```

5.  **Uygulamayı başlatın:**
    ```bash
    npm run dev
    ```

## Gelecek Özellikler (Roadmap)

Frontpage sürekli gelişmeye devam ediyor. Yakında eklenmesi planlanan özellikler:

* [ ] ** Dark Mode:** Gece okumaları için göz yormayan karanlık tema desteği.
* [ ] **OPML Import/Export:** Diğer RSS okuyuculardaki abonelikleri tek tıkla içeri aktarma.
* [ ] **Mark All as Read:** Belirli bir kategorideki tüm makaleleri tek seferde okundu işaretleme.
* [ ] **Okuma İstatistikleri:** Haftalık okuma alışkanlıklarını gösteren kişisel dashboard.
* [ ] **Bildirim Sistemi:** Takip edilen kaynaklardan yeni içerik geldiğinde anlık tarayıcı bildirimi.
* [ ] **PWA Desteği:** Uygulamayı telefona veya masaüstüne yerel bir App gibi yükleyebilme.

## Lisans

Bu proje MIT lisansı altında korunmaktadır.

---

**Geliştiren:** [Ender Karan](https://github.com/enderkaran)

---
