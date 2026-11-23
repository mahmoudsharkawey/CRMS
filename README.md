# منظومة إدارة شؤون المجندين (CRMS)
### إدارة قوات أمن جنوب سيناء – قطاع قوات الأمن – وزارة الداخلية

مشروع كامل باللغة العربية (RTL) لإدارة شؤون المجندين وسجلاتهم الطبية والإدارية.

التطبيق موجود بالكامل داخل المجلد:
`./crms`

يرجى مراجعة ملف التعليمات التفصيلي:
[crms/README.md](./crms/README.md)

### التشغيل السريع:
```bash
cd crms
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```
ثم فتح المتصفح على: `http://localhost:3000`
