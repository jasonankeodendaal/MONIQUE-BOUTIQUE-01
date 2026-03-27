import * as fs from 'fs';

const typesContent = fs.readFileSync('types.ts', 'utf8');
const sqlContent = fs.readFileSync('supabase.sql', 'utf8');

const notifMatch = typesContent.match(/export interface Notification \{([\s\S]*?)\n\}/);
if (!notifMatch) {
  console.log("Notification not found");
  process.exit(1);
}

const fields = [];
const lines = notifMatch[1].split('\n');
for (const line of lines) {
  const match = line.match(/^\s*([a-zA-Z0-9_]+)\??\s*:/);
  if (match) {
    fields.push(match[1]);
  }
}

const tableMatch = sqlContent.match(/CREATE TABLE IF NOT EXISTS notifications \(([\s\S]*?)\);/);
const alterMatch = sqlContent.match(/ALTER TABLE notifications\s+([\s\S]*?);/);

const tableSql = (tableMatch ? tableMatch[1] : '') + ' ' + (alterMatch ? alterMatch[1] : '');

const missingFields = [];
for (const field of fields) {
  if (!tableSql.includes(`"${field}"`) && !tableSql.includes(` ${field} `)) {
    missingFields.push(field);
  }
}

console.log("Missing fields in notifications:", missingFields);
