# tugas3-BasicUIAutomation
Tugas Basic Automation Cypress dari After Office

Tugas 3 - Basic UI Automation
Website: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
Buat Automation UI test untuk flow e2e yang mencakup alur dari:
1. Menambahkan Karyawan Baru
a. Login Sebagai Admin
b. Tambah karyawan (di menu PIM > add employee)
c. Buat akun untuk karyawan (di menu admin > users > +add)
2. Menambahkan jatah cuti untuk karyawan baru
a. Login sebagai admin
b. Tambahkan cuti untuk karyawan baru (di menu leave > entitlement)
3. Karyawan Baru request cuti
a. Login sebagai karyawan baru
b. Request cuti
c. Login sebagai admin
d. Approve cuti pegawai
e. Login sebagai karyawan
f. Expect cuti di approve

Tidak perlu menggunakan POM dan juga env variable, pakai kodingan basic dulu saja.
Masing-masing flow paling tidak memiliki:
- Assertion
- 1 Positive case dan 1 negative case
- Berikan screenshot test berhasil dijalankan, bisa ditaruh di 1 file docs

