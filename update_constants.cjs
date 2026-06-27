const fs = require('fs');
const sqlContent = fs.readFileSync('supabase.sql', 'utf8');
let constantsContent = fs.readFileSync('constants.tsx', 'utf8');

const startIndex = constantsContent.indexOf("/* SQL_START */");
const endIndex = constantsContent.indexOf("/* SQL_END */");

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found", { startIndex, endIndex });
  process.exit(1);
}

const newConstantsContent = 
  constantsContent.substring(0, startIndex + "/* SQL_START */".length) + 
  "\n" + sqlContent.trim() + "\n" + 
  constantsContent.substring(endIndex);

fs.writeFileSync('constants.tsx', newConstantsContent);
console.log("Updated constants.tsx");
