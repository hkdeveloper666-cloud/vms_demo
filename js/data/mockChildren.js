/**
 * VAXORA Mock Children
 * Registered infant and child profiles linked to parent accounts
 */

export const mockChildren = [
  {
    id: "child-1",
    name: "Rayan Ahmed",
    dob: "2024-03-15",
    gender: "Male",
    bloodGroup: "O+",
    parentId: "user-parent-1",
    parentName: "Fatima Ahmed",
    parentPhone: "03001234567",
    parentRelation: "Mother",
    emergencyContact: "03009988776",
    allergies: "None",
    notes: "Active infant, reached developmental milestones on schedule.",
    completedDoses: 4,
    totalRequiredDoses: 10,
    status: "Partially Vaccinated"
  },
  {
    id: "child-2",
    name: "Zainab Ahmed",
    dob: "2022-08-10",
    gender: "Female",
    bloodGroup: "A+",
    parentId: "user-parent-1",
    parentName: "Fatima Ahmed",
    parentPhone: "03001234567",
    parentRelation: "Mother",
    emergencyContact: "03009988776",
    allergies: "Mild Penicillin sensitivity reported",
    notes: "Primary school enrollment immunization record up to date.",
    completedDoses: 10,
    totalRequiredDoses: 10,
    status: "Fully Vaccinated"
  },
  {
    id: "child-3",
    name: "Hamza Tariq",
    dob: "2025-01-20",
    gender: "Male",
    bloodGroup: "B+",
    parentId: "user-parent-2",
    parentName: "Tariq Mahmood",
    parentPhone: "03219876543",
    parentRelation: "Father",
    emergencyContact: "03217766554",
    allergies: "None",
    notes: "Newborn requiring BCG and birth dose Hepatitis B follow-up.",
    completedDoses: 2,
    totalRequiredDoses: 10,
    status: "Partially Vaccinated"
  },
  {
    id: "child-4",
    name: "Meerab Fatima",
    dob: "2024-11-05",
    gender: "Female",
    bloodGroup: "AB+",
    parentId: "user-parent-3",
    parentName: "Sana Tariq",
    parentPhone: "03339998877",
    parentRelation: "Mother",
    emergencyContact: "03332221100",
    allergies: "None",
    notes: "Premature delivery at 36 weeks, weight gain normal.",
    completedDoses: 3,
    totalRequiredDoses: 10,
    status: "Partially Vaccinated"
  }
];
