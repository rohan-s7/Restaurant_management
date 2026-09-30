export const initialSettings = {
  restaurantName: 'The Grand Table',
  tagline: 'Good Food. Great Moments.',
  phone: '+91 98765 00112',
  email: 'contact@grandtable.com',
  address: '100 Feet Road, 12th Main, Indiranagar, Bengaluru, Karnataka',
  pincode: '560038',
  openingTime: '11:00 AM',
  closingTime: '11:30 PM',
  currency: '₹',
  taxRate: 5, // 5% GST
  serviceChargeRate: 5, // 5% Service charge
  minOrderAmount: 150,
  freeDeliveryThreshold: 500,
  deliveryFee: 40,
  notifications: {
    newOrderAlerts: true,
    reservationAlerts: true,
    reviewAlerts: true,
    emailAlerts: true,
    smsAlerts: false
  }
};
