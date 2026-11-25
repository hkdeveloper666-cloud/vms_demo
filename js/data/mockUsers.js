/**
 * VAXORA Mock Users
 * Pre-configured demo accounts for Admin, Parent, and Hospital roles
 */

export const mockUsers = [
  {
    id: "user-admin-1",
    name: "Dr. Zunaira Malik",
    email: "admin@vaxora.health",
    password: "Admin@1234",
    role: "admin",
    phone: "03001122334",
    title: "Chief Immunization Director",
    department: "National Health Surveillance",
    avatar: "ZM"
  },
  {
    id: "user-parent-1",
    name: "Fatima Ahmed",
    email: "fatima@gmail.com",
    password: "Parent@1234",
    role: "parent",
    phone: "03001234567",
    address: "House 42, Street 8, Sector F-7/2, Islamabad",
    city: "Islamabad",
    relation: "Mother",
    emergencyContact: "03009988776",
    children: ["child-1", "child-2"],
    avatar: "FA"
  },
  {
    id: "user-parent-2",
    name: "Tariq Mahmood",
    email: "tariq@gmail.com",
    password: "Parent@1234",
    role: "parent",
    phone: "03219876543",
    address: "House 15, Block C, Gulberg III, Lahore",
    city: "Lahore",
    relation: "Father",
    emergencyContact: "03217766554",
    children: ["child-3"],
    avatar: "TM"
  },
  {
    id: "user-hospital-1",
    name: "Shifa International Hospital",
    email: "shifa@hospital.com",
    password: "Hospital@1234",
    role: "hospital",
    phone: "03335551234",
    hospitalId: "hosp-1",
    address: "Sector H-8/4, Pitras Bukhari Road",
    city: "Islamabad",
    location: "33.6844° N, 73.0479° E (Islamabad Capital)",
    avatar: "SI"
  },
  {
    id: "user-hospital-2",
    name: "Aga Khan University Hospital",
    email: "agakhan@hospital.com",
    password: "Hospital@1234",
    role: "hospital",
    phone: "03017778899",
    hospitalId: "hosp-2",
    address: "National Stadium Road, Karachi",
    city: "Karachi",
    location: "24.8934° N, 67.0700° E (Karachi Central)",
    avatar: "AK"
  },
  {
    id: "user-hospital-3",
    name: "The Indus Hospital",
    email: "indus@hospital.com",
    password: "Hospital@1234",
    role: "hospital",
    phone: "03456667788",
    hospitalId: "hosp-3",
    address: "Plot 38, Block B, Jubilee Town, Lahore",
    city: "Lahore",
    location: "31.4285° N, 74.2412° E (Lahore South)",
    avatar: "IH"
  }
];
