# Korea Car Import - Loyiha Qoidalari

Ushbu qoidalar loyihada kod yozayotgan barcha dasturchilar (va AI yordamchilari) uchun majburiy hisoblanadi. Har doim shu qoidalarga qat'iy amal qiling!

## 1. UI va Dizayn (Frontend)
- **Responsive Design**: UI har doim ham mobil (Mobile), ham kompyuter (Web/Desktop) versiyalari uchun 100% moslashuvchan (responsive) bo'lishi shart.
- **Tartibli tuzilma**: Frontend kodlari juda tartibli yozilishi kerak. Sahifalar qismlarga (sectional) va alohida ekran komponentlariga (screen components) aniqlikda bo'linishi shart. Bitta faylda yuzlab qator kod yozish taqiqlanadi, mantiqiy qismlarni `components/` papkasiga ajrating.
- **Inline CSS Yo'q**: Kod ichida to'g'ridan-to'g'ri (inline) `style={{...}}` ishlatish qat'iyan taqiqlanadi. Barcha stillar CSS fayllarda yoki Tailwind CSS klasslari orqali boshqarilishi kerak.

## 2. Arxitektura va Turlash (Backend & Shared)
- **Tartibli Fayl Strukturasi**: Backendda ishlatiladigan barcha Type'lar (types), Interface'lar, Enum'lar va yordamchi kodlar (helpers) o'ziga tegishli folder va fayllarga (`libs` yoki `packages/types`) tartib bilan joylashtirilishi shart.
- Hech qachon turli xil ma'lumot turlari aralashtirib yuborilmasin. Har bir modul o'zining aniq chegaralangan tiplariga ega bo'lsin.

## 3. Versiyalarni Boshqarish (Git)
- **Doimiy Commit**: Har qanday kichik yoki katta o'zgarish tugallangandan so'ng, u albatta `git add`, `git commit` va `git push` qilinishi shart.
- **Commit xabarlari**: Git commit xabarlari qisqa, aniq va inson yozganidek bo'lishi kerak. AI yoki bot yozgani bilinmasligi shart (masalan, ortiqcha uzun va doston xabarlar o'rniga qisqa `feat: add user profile components` kabi).

Ushbu qoidalarni har bir yangi vazifani boshlashdan oldin esga oling!
