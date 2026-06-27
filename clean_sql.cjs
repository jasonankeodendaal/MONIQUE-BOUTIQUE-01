const fs = require('fs');
['constants.tsx', 'supabase.sql'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/CREATE TABLE IF NOT EXISTS clients[^\n]*\n/g, '');
  code = code.replace(/CREATE TABLE IF NOT EXISTS orders[^\n]*\n/g, '');
  code = code.replace(/ALTER TABLE clients[^\n]*\n/g, '');
  code = code.replace(/ALTER TABLE orders[^\n]*\n/g, '');
  code = code.replace(/CREATE POLICY "Enable all for anon clients"[^\n]*\n/g, '');
  code = code.replace(/CREATE POLICY "Enable all for anon orders"[^\n]*\n/g, '');
  code = code.replace(/DROP POLICY IF EXISTS "Enable all for anon clients"[^\n]*\n/g, '');
  code = code.replace(/DROP POLICY IF EXISTS "Enable all for anon orders"[^\n]*\n/g, '');
  code = code.replace(/DROP POLICY IF EXISTS "Public Read clients"[^\n]*\n/g, '');
  code = code.replace(/DROP POLICY IF EXISTS "Public Read orders"[^\n]*\n/g, '');
  
  // Also replace any specific data insertion for clients and orders
  code = code.replace(/INSERT INTO public\.clients[\s\S]*?(?=INSERT|ON CONFLICT|;);/g, '');
  
  fs.writeFileSync(file, code);
});
console.log("SQL files cleaned.");
