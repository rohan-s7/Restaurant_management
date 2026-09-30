export const demoCredentials = {
  customer: {
    email: 'customer@restaurant.com',
    password: 'customer123',
    role: 'CUSTOMER',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    address: '42, Park Avenue, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038'
  },
  staff: {
    email: 'staff@restaurant.com',
    password: 'staff123',
    role: 'STAFF',
    name: 'Vikram Singh',
    phone: '+91 98765 11223',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    station: 'Head Chef / Kitchen Lead'
  },
  admin: {
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Ananya Verma',
    phone: '+91 98765 99887',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    title: 'General Manager'
  }
};

export const initialCustomers = [
  {
    id: 'CUST-101',
    name: 'Rahul Sharma',
    email: 'customer@restaurant.com',
    phone: '+91 98765 43210',
    address: '42, Park Avenue, Indiranagar, Bengaluru',
    pincode: '560038',
    ordersCount: 14,
    totalSpent: 8940,
    status: 'Active',
    joinDate: '2025-11-10',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-102',
    name: 'Priya Sundaram',
    email: 'priya.s@gmail.com',
    phone: '+91 98111 22334',
    address: 'Flat 4B, Green Meadows, Koramangala, Bengaluru',
    pincode: '560034',
    ordersCount: 9,
    totalSpent: 5320,
    status: 'Active',
    joinDate: '2025-12-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-103',
    name: 'Amitabh Sen',
    email: 'amitabh.sen@outlook.com',
    phone: '+91 97222 33445',
    address: '12/8, Palm Grove, HSR Layout, Bengaluru',
    pincode: '560102',
    ordersCount: 6,
    totalSpent: 4190,
    status: 'Active',
    joinDate: '2026-01-14',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-104',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@yahoo.com',
    phone: '+91 96333 44556',
    address: 'Plot 77, Silver Oaks, Whitefield, Bengaluru',
    pincode: '560066',
    ordersCount: 18,
    totalSpent: 12400,
    status: 'Active',
    joinDate: '2025-08-20',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-105',
    name: 'Rohan Mehra',
    email: 'rohan.m@gmail.com',
    phone: '+91 95444 55667',
    address: '29, Residency Road, Shanthala Nagar, Bengaluru',
    pincode: '560025',
    ordersCount: 4,
    totalSpent: 2650,
    status: 'Active',
    joinDate: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-106',
    name: 'Divya Nambiar',
    email: 'divya.nambiar@gmail.com',
    phone: '+91 94555 66778',
    address: '504, Prestige Towers, MG Road, Bengaluru',
    pincode: '560001',
    ordersCount: 11,
    totalSpent: 7890,
    status: 'Active',
    joinDate: '2025-10-18',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-107',
    name: 'Karthik Rao',
    email: 'karthik.rao@rediffmail.com',
    phone: '+91 93666 77889',
    address: '88, 5th Main, Jayanagar 4th Block, Bengaluru',
    pincode: '560011',
    ordersCount: 2,
    totalSpent: 1120,
    status: 'Inactive',
    joinDate: '2026-03-01',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'CUST-108',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@gmail.com',
    phone: '+91 92777 88990',
    address: '33, Lakeview Drive, Bellandur, Bengaluru',
    pincode: '560103',
    ordersCount: 8,
    totalSpent: 5980,
    status: 'Active',
    joinDate: '2026-01-29',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  }
];

export const initialStaff = [
  {
    id: 'STF-01',
    name: 'Vikram Singh',
    email: 'staff@restaurant.com',
    phone: '+91 98765 11223',
    role: 'Kitchen Staff',
    shift: 'Morning (09:00 AM - 05:00 PM)',
    status: 'Active',
    joinedDate: '2024-03-15',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'STF-02',
    name: 'Suresh Menon',
    email: 'suresh.m@grandtable.com',
    phone: '+91 98765 22334',
    role: 'Kitchen Staff',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Active',
    joinedDate: '2024-06-01',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'STF-03',
    name: 'Manoj Tiwari',
    email: 'manoj.t@grandtable.com',
    phone: '+91 98765 33445',
    role: 'Waiter',
    shift: 'Full Day (11:00 AM - 09:00 PM)',
    status: 'Active',
    joinedDate: '2025-01-10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'STF-04',
    name: 'Anil Kumar',
    email: 'anil.k@grandtable.com',
    phone: '+91 98765 44556',
    role: 'Waiter',
    shift: 'Evening (05:00 PM - 11:30 PM)',
    status: 'Active',
    joinedDate: '2025-02-18',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'STF-05',
    name: 'Rajesh Nair',
    email: 'rajesh.nair@grandtable.com',
    phone: '+91 98765 55667',
    role: 'Manager',
    shift: 'All Shifts (Supervisor)',
    status: 'Active',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
  }
];
