# Baby Shark 🦈 — متجر مستلزمات الأطفال (Demo)

واجهة متجر تجريبية باللغة العربية مع دعم RTL، مبنية باستخدام **HTML + CSS + JavaScript** بدون Framework أو Backend.

> ⚠️ **نسخة استعراضية فقط:** الأسعار والمنتجات وبيانات التواصل أمثلة. تسجيل الدخول، إنشاء الحساب، نموذج التواصل، الاشتراك في البريد، وإتمام الطلب لا ترسل بيانات لأي خادم؛ لا توجد معالجة فعلية للطلبات أو الدفع. لا تستخدم الموقع لاستقبال عملاء حقيقيين قبل إضافة Backend وتأمينه وتحديث بيانات المتجر.

## الخصائص

- صفحة رئيسية، متجر، تفاصيل منتج، باقات، سلة، مفضلة، نموذج دفع، حساب، تواصل وسياسات.
- 20 منتجًا تجريبيًا و3 باقات.
- البحث، تصفية المنتجات، الترتيب، المعاينة السريعة.
- السلة والمفضلة محفوظتان محليًا في متصفح الزائر عبر `localStorage`.
- تصميم متجاوب عربي يدعم الاتجاه من اليمين إلى اليسار (RTL).

## التشغيل على جهازك

افتح `index.html` في المتصفح، أو شغّل خادم ملفات ثابتة محليًا:

```bash
python -m http.server 8000
```

ثم افتح: http://localhost:8000/

لا تحتاج إلى `npm install`، ولا توجد إعدادات API أو كلمات مرور.

## الرفع إلى GitHub من جهازك

1. أنشئ مستودعًا جديدًا على GitHub باسم `baby-shark`، و**لا تضف** README أو `.gitignore` عند إنشائه (لأنهما موجودان هنا بالفعل).
2. افتح Terminal داخل مجلد المشروع الذي يحتوي على `index.html`.
3. نفّذ الأوامر التالية مع استبدال `mohamed1641` باسم حسابك:

```bash
git init
git add .
git commit -m "Initial commit: Baby Shark static storefront"
git branch -M main
git remote add origin https://github.com/mohamed1641/baby-shark.git
git push -u origin main
```

> إذا كان المستودع موجودًا بالفعل أو رُبط مسبقًا، لا تضف `origin` مرة ثانية؛ استخدم عنوان المستودع الموجود أو `git remote set-url origin ...`.

### بديل بدون أوامر Git

أنشئ مستودعًا جديدًا على GitHub، ثم اختر **Add file → Upload files**، وارفع **محتويات مجلد المشروع** (وليس ملف ZIP نفسه)، وبعد ذلك اضغط **Commit changes**. يجب أن يظهر `index.html` مباشرة في جذر المستودع.

## نشر الموقع مجانًا باستخدام GitHub Pages

بعد رفع الملفات:

1. افتح المستودع → **Settings → Pages**.
2. تحت **Build and deployment**، اختر **Deploy from a branch**.
3. اختر فرع `main` والمجلد `/(root)`، ثم اضغط **Save**.
4. سيظهر رابط الموقع في صفحة Pages بعد اكتمال النشر. عادةً يكون بالشكل:

   `https://mohamed1641.github.io/baby-shark/`

الموقع يستخدم مسارات نسبية، لذلك يعمل من مجلد المشروع على GitHub Pages. الملف `.nojekyll` يمنع معالجة Jekyll غير اللازمة.

## فحص الملفات قبل الرفع

```bash
python scripts/validate_site.py
node --check assets/js/main.js
```

التحقق الآلي نفسه يعمل عند فتح Pull Request أو دفع تغييرات إلى `main` من خلال GitHub Actions.

## هيكل الملفات

```text
baby-shark/
├── index.html                 # الرئيسية
├── shop.html                  # المتجر
├── product.html               # التفاصيل
├── cart.html                  # السلة
├── checkout.html              # نموذج تجريبي فقط
├── wishlist.html              # المفضلة
├── auth.html                  # حساب تجريبي فقط
├── packages.html              # الباقات
├── contact.html               # تواصل تجريبي فقط
├── policies.html              # السياسات
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── images/
├── scripts/validate_site.py
└── .github/workflows/validate.yml
```

## تخصيص الموقع

- **المنتجات والأسعار:** تعدّل مصفوفة `CATALOG` داخل `assets/js/main.js`.
- **الباقات:** تعدّل `PACKS` في الملف نفسه.
- **التصميم والألوان:** `assets/css/main.css`.
- **الصور:** راجع `HOW_TO_ADD_REAL_PHOTOS.txt`.
- **بيانات الاتصال:** استبدل رقم الهاتف وعنوان البريد الإلكتروني الوهمي وروابط `#` قبل إطلاق الموقع للعامة.

ملاحظة: يوجد ملف `README.txt` الأصلي أيضًا. لم تُضف رخصة استخدام لأن صاحب المشروع لم يحدد الترخيص المطلوب.
