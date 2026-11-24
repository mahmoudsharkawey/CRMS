const path = require("path");

// Mock process.cwd if needed
process.env.DATA_DIR = path.join(__dirname, "..", "data");

async function testJsonDb() {
  console.log("=== Testing JSON DB directly ===");

  const {
    getRecruits,
    getRecruitById,
    updateRecruit,
    updateRecruitStatus,
    addRecord,
    updateRecord,
    deleteRecord,
  } = require("../src/lib/json-db");

  // 1. Get all recruits
  const all = await getRecruits();
  console.log(`[Test 1] All recruits count: ${all.length}`);
  if (all.length !== 6) throw new Error(`Expected 6 recruits, got ${all.length}`);

  // 2. Search by name
  const byName = await getRecruits("طارق");
  console.log(`[Test 2] Search 'طارق': found ${byName.length} (${byName[0]?.fullName})`);
  if (byName.length !== 2) throw new Error(`Expected 2 matches for 'طارق'`);

  // 3. Search by police number
  const byPolice = await getRecruits("18420");
  console.log(`[Test 3] Search '18420': found ${byPolice.length} (${byPolice[0]?.policeNumber})`);
  if (byPolice.length !== 1) throw new Error(`Expected 1 match for '18420'`);

  // 4. Get by ID
  const recruit = await getRecruitById("rec_1");
  console.log(`[Test 4] Get rec_1: ${recruit?.fullName}`);
  console.log(`Records: ${recruit?.records?.length}`);
  console.log(`History: ${recruit?.statusHistory?.length}`);
  console.log(`PaperDocs: ${recruit?.paperDocuments?.length}`);

  // 5. Add record
  const newRec = await addRecord({
    recruitId: "rec_1",
    type: "إجازة مرضية",
    date: new Date("2024-11-20"),
    entity: "مستشفى هيئة الشرطة بالعجوزة",
    description: "إجازة مرضية تجريبية للتحقق من JSON DB",
    duration: "4 أيام",
  });
  console.log(`[Test 5] Added record ID: ${newRec.id} - ${newRec.type}`);

  // 6. Update record
  const updatedRec = await updateRecord(newRec.id, {
    description: "تم تعديل الوصف بنجاح في JSON",
    duration: "5 أيام",
  });
  console.log(`[Test 6] Updated record: ${updatedRec.description} - ${updatedRec.duration}`);

  // 7. Update status
  const statusRes = await updateRecruitStatus(
    "rec_1",
    "رديف",
    "اختبار تغيير الحالة الإدارية في JSON"
  );
  console.log(
    `[Test 7] New status: ${statusRes.recruit.administrativeStatus}, History: ${statusRes.history.previousStatus} -> ${statusRes.history.newStatus}`
  );

  // 8. Delete record
  const deleted = await deleteRecord(newRec.id);
  console.log(`[Test 8] Deleted test record: ${deleted}`);

  // Re-verify count
  const verify = await getRecruitById("rec_1");
  console.log(`[Test 9] Final records count: ${verify?.records?.length}`);

  console.log("\n=== ALL JSON DB TESTS PASSED PERFECTLY! ===");
}

testJsonDb().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
