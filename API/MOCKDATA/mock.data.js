export const BLOOD_DONORS = [
  {
    name: "Jerry",
    bloodGroup: "O+",
    age: 23,
    phone: "9876543210",
    city: "Ramnad",
    email: "jerees2004@gmail.com",
    password: "123",
    isDonor: true,
    lastDonated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    name: "Arun",
    bloodGroup: "A+",
    age: 28,
    phone: "9123456780",
    city: "Sivangangai",
    email: "arun.sivangangai@mailinator.com",
    password: "Arun@123",
    isDonor: true,
    lastDonated: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString() // 4 months ago
  },
  {
    name: "Pisher",
    bloodGroup: "O+",
    age: 23,
    phone: "9876543211",
    city: "Ramnad",
    email: "pisher.ramnad@mailinator.com",
    password: "Pisher@123",
    isDonor: true,
    lastDonated: null // Never donated
  },
  {
    name: "Priya",
    bloodGroup: "B+",
    age: 25,
    phone: "9012345678",
    city: "Hyderabad",
    email: "priya.hyderabad@mailinator.com",
    password: "Priya@123",
    isDonor: true,
    lastDonated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    name: "Rahul",
    bloodGroup: "AB+",
    age: 30,
    phone: "9988776655",
    city: "Mumbai",
    email: "rahul.mumbai@mailinator.com",
    password: "Rahul@123",
    isDonor: true,
    lastDonated: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString() // ~5 months ago
  },
  {
    name: "Sneha",
    bloodGroup: "O-",
    age: 27,
    phone: "8899776655",
    city: "Delhi",
    email: "sneha.delhi@mailinator.com",
    password: "Sneha@123",
    isDonor: true,
    lastDonated: new Date().toISOString() // Today
  },
  {
    name: "Mathi",
    bloodGroup: "AB-",
    age: 29,
    phone: "8899776985",
    city: "Delhi",
    email: "mathi.delhi@mailinator.com",
    password: "Mathi@123",
    isDonor: true,
    lastDonated: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString() // > 1 year
  }
];

