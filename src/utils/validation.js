export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const cleanPhone = String(phone).replace(/[^\d+]/g, '');
  return cleanPhone.length >= 10;
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
