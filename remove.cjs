const fs = require('fs');
let code = fs.readFileSync('pages/Admin.tsx', 'utf8');
const startMatch = "const filteredOrders = orders.filter";
const endMatch = "const renderEnquiries = () => (";
const startIndex = code.indexOf(startMatch);
const endIndex = code.indexOf(endMatch);
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('pages/Admin.tsx', code);
  console.log("Removed orders and clients code successfully.");
} else {
  console.log("Could not find start or end matches.");
}
