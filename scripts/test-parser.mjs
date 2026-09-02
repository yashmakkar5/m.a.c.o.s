import { validateResumeFile } from "../lib/parsing/resumeParser.ts";

console.log("--- Testing Resume Validation ---");

// Test 1: Valid PDF
const t1 = validateResumeFile("resume.pdf", 1024 * 100, "application/pdf");
console.log("Test 1 (Valid PDF):", t1.valid ? "PASSED" : "FAILED", t1);

// Test 2: Valid DOCX
const t2 = validateResumeFile("cv.docx", 1024 * 200, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
console.log("Test 2 (Valid DOCX):", t2.valid ? "PASSED" : "FAILED", t2);

// Test 3: Invalid extension
const t3 = validateResumeFile("virus.exe", 1024, "application/octet-stream");
console.log("Test 3 (Invalid ext):", !t3.valid ? "PASSED (rejected correctly)" : "FAILED", t3.error);

// Test 4: Oversized file (6MB)
const t4 = validateResumeFile("huge.pdf", 6 * 1024 * 1024, "application/pdf");
console.log("Test 4 (Oversized):", !t4.valid ? "PASSED (rejected correctly)" : "FAILED", t4.error);

// Test 5: Empty file
const t5 = validateResumeFile("empty.pdf", 0, "application/pdf");
console.log("Test 5 (Empty file):", !t5.valid ? "PASSED (rejected correctly)" : "FAILED", t5.error);

if (t1.valid && t2.valid && !t3.valid && !t4.valid && !t5.valid) {
  console.log("\nALL PARSER VALIDATION TESTS PASSED!");
} else {
  console.error("\nSOME TESTS FAILED!");
  process.exit(1);
}
