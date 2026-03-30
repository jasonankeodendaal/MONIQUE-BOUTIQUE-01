export const generateWhatsAppMessage = (items: any[], total: number, currencySymbol: string = 'R') => {
  let message = 'Hello, I would like to inquire about the following items:\n\n';
  
  items.forEach(item => {
    const productName = item.product?.name || item.name || 'Unknown Product';
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    
    let variantString = '';
    if (item.variations && Object.keys(item.variations).length > 0) {
      variantString = ` (${Object.entries(item.variations).map(([k, v]) => `${k}: ${v}`).join(', ')})`;
    }
    
    message += `${quantity}x ${productName}${variantString} - ${currencySymbol}${price.toLocaleString()}\n`;
  });
  
  message += `\nEstimated Total: ${currencySymbol}${total.toLocaleString()}`;
  
  return encodeURIComponent(message);
};

export const generateSingleItemWhatsAppMessage = (product: any, variations: any = {}, currencySymbol: string = 'R') => {
  let message = `Hello, I would like to inquire about this item:\n\n`;
  
  const productName = product?.name || 'Unknown Product';
  const price = product?.price || 0;
  
  let variantString = '';
  if (variations && Object.keys(variations).length > 0) {
    variantString = ` (${Object.entries(variations).map(([k, v]) => `${k}: ${v}`).join(', ')})`;
  }
  
  message += `1x ${productName}${variantString} - ${currencySymbol}${price.toLocaleString()}\n`;
  
  return encodeURIComponent(message);
};
