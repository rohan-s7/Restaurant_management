export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('en-IN', options);
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const d = new Date(dateTimeString);
    return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  } catch {
    return dateTimeString;
  }
};

export const generateOrderId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomNum}`;
};

export const generateReservationId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RES-${randomNum}`;
};

export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
};
