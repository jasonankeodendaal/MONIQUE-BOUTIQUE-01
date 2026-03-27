import * as fs from 'fs';

const typesContent = fs.readFileSync('types.ts', 'utf8');
const sqlContent = fs.readFileSync('supabase.sql', 'utf8');

function getInterfaceFields(interfaceName: string): string[] {
  const regex = new RegExp(`export interface ${interfaceName} (?:extends \\w+ )?\\{([\\s\\S]*?)\\n\\}`, 'g');
  const match = regex.exec(typesContent);
  if (!match) return [];
  
  const fields: string[] = [];
  const lines = match[1].split('\n');
  for (const line of lines) {
    const fieldMatch = line.match(/^\s*([a-zA-Z0-9_]+)\??\s*:/);
    if (fieldMatch) {
      fields.push(fieldMatch[1]);
    }
  }
  
  // Handle inheritance
  const extendsMatch = typesContent.match(new RegExp(`export interface ${interfaceName} extends (\\w+)`, 'g'));
  if (extendsMatch) {
    const parentName = extendsMatch[0].split(' ').pop()!;
    fields.push(...getInterfaceFields(parentName));
  }
  
  return Array.from(new Set(fields));
}

function checkTable(tableName: string, interfaceName: string) {
  const fields = getInterfaceFields(interfaceName);
  if (fields.length === 0) {
    console.log(`Interface ${interfaceName} not found or empty.`);
    return;
  }

  // Find CREATE TABLE and ALTER TABLE statements for this table
  const createTableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName} \\(([\\s\\S]*?)\\);`, 'g');
  const alterTableRegex = new RegExp(`ALTER TABLE ${tableName}\\s+([\\s\\S]*?);`, 'g');
  
  let tableSql = '';
  let m;
  while ((m = createTableRegex.exec(sqlContent)) !== null) {
    tableSql += m[1] + ' ';
  }
  while ((m = alterTableRegex.exec(sqlContent)) !== null) {
    tableSql += m[1] + ' ';
  }

  const missing: string[] = [];
  for (const field of fields) {
    // Check for "field" or field in the SQL
    const fieldRegex = new RegExp(`(?:"${field}"|\\b${field}\\b)`, 'i');
    if (!fieldRegex.test(tableSql)) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    console.log(`Table ${tableName} (Interface ${interfaceName}) is missing fields: ${missing.join(', ')}`);
  } else {
    console.log(`Table ${tableName} (Interface ${interfaceName}) is complete.`);
  }
}

console.log("--- SQL SCAN RESULTS ---");
checkTable('settings', 'SiteSettings');
checkTable('clients', 'AppUser');
checkTable('admin_users', 'AdminUser');
checkTable('products', 'Product');
checkTable('orders', 'Order');
checkTable('enquiries', 'Enquiry');
checkTable('categories', 'Category');
checkTable('subcategories', 'SubCategory');
checkTable('hero_slides', 'CarouselSlide');
checkTable('product_stats', 'ProductStats');
checkTable('training_modules', 'TrainingModule');
checkTable('product_history', 'ProductHistory');
checkTable('system_logs', 'SystemLog');
checkTable('wishlist', 'WishlistItem');
checkTable('site_reviews', 'SiteReview');
