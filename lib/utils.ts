export function generateWhatsAppLink(
  phoneNumber: string,
  items: { name: string; variant?: string; price: number; quantity: number }[],
  total: number,
  currencySymbol: string = '$'
): string {
  if (!phoneNumber) return '';
  
  let message = 'Hi, I am interested in:\n';
  items.forEach(item => {
    const variantText = item.variant ? ` (${item.variant})` : '';
    message += `${item.quantity}x ${item.name}${variantText} - ${currencySymbol}${item.price.toFixed(2)}\n`;
  });
  message += `\nTotal: ${currencySymbol}${total.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
