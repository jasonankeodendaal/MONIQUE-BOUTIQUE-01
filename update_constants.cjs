const fs = require('fs');
const sqlContent = fs.readFileSync('supabase.sql', 'utf8');
let constantsContent = fs.readFileSync('constants.tsx', 'utf8');

const startIndex = constantsContent.indexOf("code: `-- MASTER ARCHITECTURE SCRIPT");
const endIndex = constantsContent.indexOf("FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();``,");

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

const newCodeBlock = "code: `" + sqlContent.trim() + "`";

const newConstantsContent = constantsContent.substring(0, startIndex) + newCodeBlock + constantsContent.substring(endIndex + "FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();``,".length - 2);

fs.writeFileSync('constants.tsx', newConstantsContent);
console.log("Updated constants.tsx");
