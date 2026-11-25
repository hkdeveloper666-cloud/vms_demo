/**
 * VAXORA Mock Vaccines
 * Standard EPI (Expanded Programme on Immunization) schedule vaccines
 */

export const mockVaccines = [
  {
    id: "vac-1",
    name: "BCG (Bacillus Calmette–Guérin)",
    code: "BCG",
    targetDisease: "Tuberculosis (TB)",
    recommendedAge: "Birth (Within 48 Hours)",
    dosesRequired: 1,
    description: "Live attenuated vaccine protecting against severe childhood tuberculosis and tuberculous meningitis.",
    sideEffects: "Minor swelling or small papule at injection site.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-2",
    name: "Hepatitis B (Birth Dose)",
    code: "HepB-0",
    targetDisease: "Hepatitis B Virus",
    recommendedAge: "Birth (Within 24 Hours)",
    dosesRequired: 1,
    description: "Inactivated viral antigen preventing perinatal transmission of Hepatitis B liver infection.",
    sideEffects: "Mild tenderness at injection site.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-3",
    name: "OPV-1 (Oral Polio Vaccine)",
    code: "OPV-1",
    targetDisease: "Poliomyelitis",
    recommendedAge: "6 Weeks",
    dosesRequired: 3,
    description: "Oral drops containing bivalent live attenuated poliovirus to build mucosal immunity.",
    sideEffects: "Very rarely mild diarrhea.",
    status: "Available",
    temperatureStorage: "-20°C (Freezer) or 2°C to 8°C"
  },
  {
    id: "vac-4",
    name: "Pentavalent-1 (DTP-HepB-Hib)",
    code: "Penta-1",
    targetDisease: "Diphtheria, Tetanus, Pertussis, HepB, Hib",
    recommendedAge: "6 Weeks",
    dosesRequired: 3,
    description: "5-in-1 combination vaccine providing comprehensive immunity against five deadly childhood pathogens.",
    sideEffects: "Mild fever, localized redness.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-5",
    name: "Rotavirus-1",
    code: "Rota-1",
    targetDisease: "Severe Rotaviral Diarrhea",
    recommendedAge: "6 Weeks",
    dosesRequired: 2,
    description: "Oral vaccine preventing severe dehydration and diarrheal hospitalization in infants.",
    sideEffects: "Mild irritability or slight loose stools.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-6",
    name: "PCV-1 (Pneumococcal Conjugate)",
    code: "PCV-1",
    targetDisease: "Pneumonia & Meningitis",
    recommendedAge: "6 Weeks",
    dosesRequired: 3,
    description: "Conjugate vaccine defending against Streptococcus pneumoniae lung and bloodstream infections.",
    sideEffects: "Low-grade fever, fussiness.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-7",
    name: "Pentavalent-2",
    code: "Penta-2",
    targetDisease: "Diphtheria, Tetanus, Pertussis, HepB, Hib",
    recommendedAge: "10 Weeks",
    dosesRequired: 3,
    description: "Second booster dose reinforcing antibodies against five critical conditions.",
    sideEffects: "Transient soreness, mild fever.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-8",
    name: "Pentavalent-3",
    code: "Penta-3",
    targetDisease: "Diphtheria, Tetanus, Pertussis, HepB, Hib",
    recommendedAge: "14 Weeks",
    dosesRequired: 3,
    description: "Third foundational dose ensuring long-term cellular and humoral immunity.",
    sideEffects: "Mild fever for 24 hours.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-9",
    name: "Measles-1 (with Rubella)",
    code: "MR-1",
    targetDisease: "Measles & Rubella",
    recommendedAge: "9 Months",
    dosesRequired: 2,
    description: "Live attenuated vaccine immunizing against high-contagion measles rash and rubella birth defects.",
    sideEffects: "Mild rash 7-10 days after shot.",
    status: "Available",
    temperatureStorage: "2°C to 8°C"
  },
  {
    id: "vac-10",
    name: "Typhoid Conjugate Vaccine (TCV)",
    code: "TCV",
    targetDisease: "Typhoid Fever",
    recommendedAge: "9 Months",
    dosesRequired: 1,
    description: "Conjugate immunization providing sustained protection against Salmonella Typhi strains.",
    sideEffects: "Mild injection site tenderness.",
    status: "Unavailable",
    temperatureStorage: "2°C to 8°C"
  }
];
