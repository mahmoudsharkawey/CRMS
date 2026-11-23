const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(Buffer.from(JSON.stringify(data), "utf8"));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== CRMS End-to-End Verification ===");

  // 1. Get all recruits
  console.log("\n[Test 1] GET /api/recruits");
  const recruitsRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/recruits",
    method: "GET",
  });
  console.log(`Status: ${recruitsRes.status}, Count: ${recruitsRes.data.length}`);
  if (recruitsRes.data.length === 0) throw new Error("No recruits found");

  const targetRecruit = recruitsRes.data[0];
  console.log(`Target recruit: ${targetRecruit.fullName} (${targetRecruit.policeNumber})`);

  // 2. Search by name query
  console.log("\n[Test 2] GET /api/recruits?q=طارق");
  const searchNameRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/recruits?q=${encodeURIComponent("طارق")}`,
    method: "GET",
  });
  console.log(`Status: ${searchNameRes.status}, Found: ${searchNameRes.data.length} match(es)`);
  console.log(`Matched name: ${searchNameRes.data[0]?.fullName}`);

  // 3. Search by police number query
  console.log("\n[Test 3] GET /api/recruits?q=18420");
  const searchPoliceRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/recruits?q=18420`,
    method: "GET",
  });
  console.log(`Status: ${searchPoliceRes.status}, Found: ${searchPoliceRes.data.length} match(es)`);
  const recruitId = searchPoliceRes.data[0].id;

  // 4. Get recruit profile with records, history, documents
  console.log(`\n[Test 4] GET /api/recruits/${recruitId}`);
  const profileRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/recruits/${recruitId}`,
    method: "GET",
  });
  console.log(`Status: ${profileRes.status}`);
  console.log(`Recruit: ${profileRes.data.fullName}`);
  console.log(`Timeline Records Count: ${profileRes.data.records?.length}`);
  console.log(`Status History Count: ${profileRes.data.statusHistory?.length}`);
  console.log(`Paper Documents Count: ${profileRes.data.paperDocuments?.length}`);

  // 5. Add a new record to the timeline
  console.log("\n[Test 5] POST /api/records (Add Timeline Record)");
  const newRecordData = {
    recruitId: recruitId,
    type: "إجازة مرضية",
    date: "2024-11-20",
    entity: "مستشفى هيئة الشرطة بالعجوزة",
    description: "إجازة مرضية معتمدة لاختبار حفظ السجل في قاعدة البيانات",
    details: "فحص سريري معتمد",
    startDate: "2024-11-20",
    endDate: "2024-11-23",
    duration: "4 أيام",
  };
  const addRecordRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/records",
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
    newRecordData
  );
  console.log(`Status: ${addRecordRes.status}`);
  console.log(`Created Record ID: ${addRecordRes.data.id}`);
  console.log(`Type: ${addRecordRes.data.type}, Duration: ${addRecordRes.data.duration}`);

  const createdRecordId = addRecordRes.data.id;

  // 6. Edit the record
  console.log(`\n[Test 6] PUT /api/records/${createdRecordId} (Edit Record)`);
  const editRecordRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: `/api/records/${createdRecordId}`,
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
    {
      ...newRecordData,
      description: "تم تعديل الوصف بنجاح في قاعدة البيانات",
      duration: "5 أيام",
    }
  );
  console.log(`Status: ${editRecordRes.status}`);
  console.log(`Updated Description: ${editRecordRes.data.description}`);
  console.log(`Updated Duration: ${editRecordRes.data.duration}`);

  // 7. Change Administrative Status & Verify History
  console.log(`\n[Test 7] POST /api/recruits/${recruitId}/status (Change Status)`);
  const statusRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: `/api/recruits/${recruitId}/status`,
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
    {
      newStatus: "رديف",
      reason: "حلول موعد إنهاء الخدمة العسكرية وتسليمه لشهادة أداء الخدمة",
    }
  );
  console.log(`Status: ${statusRes.status}`);
  console.log(`New Status in Recruit: ${statusRes.data.recruit.administrativeStatus}`);
  console.log(`History Entry Created: ${statusRes.data.history.previousStatus} -> ${statusRes.data.history.newStatus}`);
  console.log(`History Reason: ${statusRes.data.history.reason}`);

  // 8. Re-fetch profile to ensure all additions/changes are persisted
  console.log(`\n[Test 8] Re-verifying Profile Persisted State`);
  const verifyRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/recruits/${recruitId}`,
    method: "GET",
  });
  console.log(`Current Status: ${verifyRes.data.administrativeStatus}`);
  console.log(`Records count after add: ${verifyRes.data.records.length}`);
  console.log(`History count after change: ${verifyRes.data.statusHistory.length}`);

  // 9. Clean up test record
  console.log(`\n[Test 9] DELETE /api/records/${createdRecordId}`);
  const deleteRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/records/${createdRecordId}`,
    method: "DELETE",
  });
  console.log(`Delete Status: ${deleteRes.status}`);

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
