import prisma from "@/lib/prisma";

export async function ensureSeedData() {
  try {
    const count = await prisma.recruit.count();
    if (count > 0) return;

    console.log("[Auto-Seed] Initializing demo conscripts database...");

    // 1. Recruit 1: طارق كمال عبد الرحمن حسن
    await prisma.recruit.create({
      data: {
        fullName: "طارق كمال عبد الرحمن حسن",
        nationalId: "29903152801452",
        policeNumber: "2023/18420",
        fileNumber: "م/1402/ط",
        militaryNumber: "2023/18420/ج.س",
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("1999-03-15"),
        education: "مؤهل متوسط - دبلوم فني صناعي",
        serviceInformation: "سرية تأمين كمين عيون موسى - قطاع شمال الطور",
        administrativeStatus: "على القوة",
        records: {
          create: [
            {
              type: "كشف طبي",
              date: new Date("2024-10-18"),
              entity: "مستشفى الطور العسكري / عيادة الباطنة",
              description: "كشف طبي باطنة إثر شكوى نزلة معوية حادة وإجهاد حراري ناتج عن الخدمة الميدانية",
              details: "صرف محاليل وريدية وعلاج مضاد للتقلصات مع إعفاء من طابور اللياقة 48 ساعة",
              duration: "48 ساعة إعفاء",
            },
            {
              type: "إجازة مرضية",
              date: new Date("2024-08-14"),
              entity: "مستشفى هيئة الشرطة بمدينة نصر / عيادة الطور",
              description: "إجازة مرضية معتمدة لالتواء حاد بمفصل الكاحل الأيمن مع وذمة خفيفة أثناء التدريب",
              details: "راحة سلبية تامة وتثبيت رباط ضاغط ومسكنات ومضادات التهاب",
              startDate: new Date("2024-08-14"),
              endDate: new Date("2024-08-17"),
              duration: "3 أيام",
            },
            {
              type: "أشعة",
              date: new Date("2024-08-14"),
              entity: "قسم الأشعة - مستشفى الطور العام",
              description: "أشعة سينية عادية على الكاحل الأيمن في وضعيتين (AP & Lateral)",
              details: "تقرير الأشعة: سلامة العظام من أي شروخ أو كسور عظمية، ووجود ارتشاح بالأنسجة الرخوة",
              attachment: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
            },
            {
              type: "راحة",
              date: new Date("2024-05-10"),
              entity: "عيادة معسكر أمن الطور الميدانية",
              description: "راحة مرضية لارتفاع مفاجئ بدرجة الحرارة والتهاب لوزتين حاد",
              details: "صرف خافض حرارة ومضاد حيوي أوجمنتين 1 جم مع الراحة بالعنبر",
              startDate: new Date("2024-05-10"),
              endDate: new Date("2024-05-12"),
              duration: "يومان",
            },
            {
              type: "أجهزة طبية",
              date: new Date("2023-12-05"),
              entity: "عيادة الرمد - مستشفى الشرطة بالسويس",
              description: "فحص قاع عين وقياس حدة الإبصار وصرف نظارة طبية ميدانية واقية",
              details: "استجماتيزم بسيط بالعينين، تقرر صرف نظارة طبية واقية معتمدة للاستخدام في الخدمة الليلية",
              duration: "صرف دائم",
            },
            {
              type: "دخول مستشفى",
              date: new Date("2023-09-12"),
              entity: "مستشفى هيئة الشرطة بالعجوزة",
              description: "حجز وملاحظة سريرية بقسم الجراحة للاشتباه بالتهاب الزائدة الدودية الحاد",
              details: "الملاحظة الطبية لمدة 48 ساعة أثبتت تحسن الحالة تحت العلاج التحفظي دون الحاجة لتدخل جراحي عاجل",
              startDate: new Date("2023-09-12"),
              endDate: new Date("2023-09-14"),
              duration: "يومان حجز",
            },
            {
              type: "جزاء / أورنيك",
              date: new Date("2023-07-20"),
              entity: "قيادة معسكر أمن الطور - كتيبة التأمين",
              description: "توقيع جزاء انضباطي حجز لمدة 24 ساعة بالمعسكر لعدم الالتزام بضوابط تمام النظافة والتأخر عن الطابور الصباحي",
              details: "أورنيك جزاء رقم (318/ج) لسنة 2023 مع التنبيه المشدد بالانضباط العسكري",
              duration: "24 ساعة حجز",
            },
            {
              type: "تقرير طبي",
              date: new Date("2023-02-10"),
              entity: "القومسيون الطبي العسكري للشرطة بالسويس",
              description: "تقرير الفحص الطبي الشامل للالتحاق بقطاع قوات أمن جنوب سيناء",
              details: "رسم قلب سليم، تحاليل مخبرية معتمدة، كشف قاع عين، أشعة صدر نظيفة. القرار: لائق طبياً مستوى (أ)",
            },
          ],
        },
        statusHistory: {
          create: [
            {
              previousStatus: "مستجد",
              newStatus: "على القوة",
              changeDate: new Date("2023-03-01"),
              reason: "انتهاء فترة التدريب الأساسي بالمعسكر وتوزيعه على قوة سرية الحراسات",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "السجل العسكري والدفتري الرسمي",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    // 2. Recruit 2: محمود إبراهيم السيد أحمد
    await prisma.recruit.create({
      data: {
        fullName: "محمود إبراهيم السيد أحمد",
        nationalId: "29807121600981",
        policeNumber: "2022/10892",
        fileNumber: "س/489/ج.س",
        militaryNumber: "2022/10892/ط",
        photo:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("1998-07-12"),
        education: "مؤهل عالي - ليسانس حقوق",
        serviceInformation: "سرية الحراسات وتأمين المنشآت - معسكر فرق الأمن بالطور",
        administrativeStatus: "على القوة",
        records: {
          create: [
            {
              type: "إجازة مرضية",
              date: new Date("2024-09-01"),
              entity: "مستشفى الطور العام",
              description: "إجازة مرضية لنزلة شعبية حادة وكحة مستمرة",
              details: "صرف أدوية موسعة للشعب ومضادات حيوية مع الراحة التامة",
              startDate: new Date("2024-09-01"),
              endDate: new Date("2024-09-04"),
              duration: "3 أيام",
            },
            {
              type: "كشف طبي",
              date: new Date("2024-04-12"),
              entity: "عيادة الأسنان - مستشفى الشرطة بالسويس",
              description: "علاج عصب وحشو ضرس بالفك السفلي الأيسر",
              details: "تم إجراء جلسة الحشو بنجاح ومتابعة الحالة مع إعفاء من الوجبات الجافة 24 ساعة",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "أرشيف السجل العسكري الورقي",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    // 3. Recruit 3: أحمد عبد المنعم شلبي
    await prisma.recruit.create({
      data: {
        fullName: "أحمد عبد المنعم شلبي",
        nationalId: "30005221901124",
        policeNumber: "2023/04415",
        fileNumber: "س/812/ش.ش",
        militaryNumber: "2023/04415/ش",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("2000-05-22"),
        education: "مؤهل متوسط - دبلوم صناعي",
        serviceInformation: "كتيبة دعم الطرق والكمائن - قطاع قسم شرطة شرم الشيخ",
        administrativeStatus: "على القوة",
        records: {
          create: [
            {
              type: "كشف طبي",
              date: new Date("2024-06-15"),
              entity: "مستشفى شرم الشيخ الدولي",
              description: "كشف عيون وحساسية قرنية ناتجة عن الغبار ورياح الصحراء بالكمين",
              details: "صرف قطرات معقمة ومرطبة للعين ومرهم مضاد للالتهاب",
            },
            {
              type: "إجازة مرضية",
              date: new Date("2024-01-10"),
              entity: "مستشفى الطور العام",
              description: "إجازة مرضية لإصابة كدمية باليد اليمنى أثناء خدمة تأمين الكمين",
              details: "تثبيت جبيرة جبسية مؤقتة وإجازة راحة سلبية",
              startDate: new Date("2024-01-10"),
              endDate: new Date("2024-01-17"),
              duration: "7 أيام",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "السجل العسكري الدفتري",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    // 4. Recruit 4: كريم طارق حسني رضوان
    await prisma.recruit.create({
      data: {
        fullName: "كريم طارق حسني رضوان",
        nationalId: "30201101802341",
        policeNumber: "2024/00198",
        fileNumber: "س/104/ت.م",
        militaryNumber: "2024/00198/م",
        photo:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("2002-01-10"),
        education: "فوق متوسط - معهد فني تجاري",
        serviceInformation: "مركز تدريب قوات الأمن - جناح المستجدين (معسكر النصر)",
        administrativeStatus: "مستجد",
        records: {
          create: [
            {
              type: "كشف طبي",
              date: new Date("2024-11-02"),
              entity: "عيادة مركز التدريب بالطور",
              description: "فحص طبي دوري لمستجدي دفعة نوفمبر 2024 وقياس اللياقة البدنية والوزن والضغط",
              details: "لائق طبياً لاستكمال المرحلة الثانية من التدريب الأساسي",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "استمارة فحص المستجدين",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    // 5. Recruit 5: مصطفى كمال الدين علي
    await prisma.recruit.create({
      data: {
        fullName: "مصطفى كمال الدين علي",
        nationalId: "29704151200345",
        policeNumber: "2021/08901",
        fileNumber: "س/230/ر.د",
        militaryNumber: "2021/08901/ق",
        photo:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("1997-04-15"),
        education: "مؤهل عالي - بكالوريوس تجارة",
        serviceInformation: "سرية قيادة الإدارة المركزية - مديرية أمن جنوب سيناء بالطور",
        administrativeStatus: "رديف",
        records: {
          create: [
            {
              type: "تقرير طبي",
              date: new Date("2024-03-25"),
              entity: "القومسيون الطبي العسكري بالسويس",
              description: "فحص طبي نهائي مسائي لإنهاء الخدمة والتسريح بالقدوة الحسنة",
              details: "خلو المجند من أي إصابات أو عجز دائم خلال فترة الخدمة العسكرية، ولائق للاحتياط",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "سجل إنهاء الخدمة والشهادة العسكرية",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    // 6. Recruit 6: إسلام نبيل حسن مهران
    await prisma.recruit.create({
      data: {
        fullName: "إسلام نبيل حسن مهران",
        nationalId: "29908191401823",
        policeNumber: "2022/15310",
        fileNumber: "س/551/ن.و",
        militaryNumber: "2022/15310/ن",
        photo:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
        dateOfBirth: new Date("1999-08-19"),
        education: "عادة - الشهادة الإعدادية العامة",
        serviceInformation: "سرية حراسة معبر نويبع - ميناء نويبع البحري",
        administrativeStatus: "شطب",
        records: {
          create: [
            {
              type: "جزاء / أورنيك",
              date: new Date("2024-02-15"),
              entity: "قيادة قطاع خليج العقبة - نويبع",
              description: "تحرير إثبات غياب لتجاوز مدة الإجازة الميدانية أكثر من 21 يوماً دون عذر مقبول",
              details: "إصدار أمر شطب بالقرار الإداري رقم (88) لسنة 2024 وإخطار النيابة العسكرية",
            },
          ],
        },
        paperDocuments: {
          create: [
            {
              documentName: "ملف الإجراءات الانضباطية وقرار الشطب",
              filePath:
                "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      },
    });

    console.log("[Auto-Seed] Successfully created demo conscripts.");
  } catch (err) {
    console.warn("[Auto-Seed] Skipped or failed:", err);
  }
}
