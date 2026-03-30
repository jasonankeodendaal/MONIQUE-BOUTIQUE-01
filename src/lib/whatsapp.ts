/**
 * Formats a phone number and message into a wa.me link.
 */
export const generateWhatsAppLink = (phoneNumber: string, message: string): string => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Formats a multi-item inquiry message for WhatsApp.
 */
export interface InquiryItem {
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

export const formatInquiryMessage = (items: InquiryItem[]): string => {
  let message = "Hi, I am interested in:\n\n";
  let total = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const variantStr = item.variant ? ` (${item.variant})` : "";
    message += `${item.quantity}x [${item.name}]${variantStr} - $${item.price.toFixed(2)}\n`;
  });

  message += `\nTotal: $${total.toFixed(2)}`;
  return message;
};

/**
 * Formats a single-item inquiry message for WhatsApp.
 */
export const formatSingleItemMessage = (item: InquiryItem): string => {
  const variantStr = item.variant ? ` (${item.variant})` : "";
  return `Hi, I am interested in: ${item.quantity}x [${item.name}]${variantStr} - $${item.price.toFixed(2)}. Total: $${(item.price * item.quantity).toFixed(2)}`;
};
