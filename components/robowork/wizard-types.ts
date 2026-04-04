export interface RobotEntry {
  id: string;
  robotId: string | null;
  name: string;
  manufacturer: string;
  category: string;
  description: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  minimumDays: string;
  fulfillmentTypes: string[];
  operatorIncluded: boolean;
  remoteCapable: boolean;
  available: boolean;
  availableFrom: string;
  images: string[];
}

export interface WizardData {
  companyName: string;
  businessType: string;
  yearsInRobotics: number;
  website: string;
  linkedin: string;
  bio: string;
  profileImage: File | null;
  profileImageUrl: string;
  city: string;
  state: string;
  country: string;
  serviceRadius: number;
  additionalCities: { city: string; state: string }[];
  robots: RobotEntry[];
  specializations: string[];
  taskSpecializations: string[];
  specializationLevels: Record<string, "beginner" | "experienced" | "expert">;
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  identityMethod: "government_id" | "linkedin" | null;
  identityDocUrl: string;
  insuranceDocUrl: string;
  backgroundCheckConsent: boolean;
  paymentSetupStarted: boolean;
}

export function createEmptyWizardData(): WizardData {
  return {
    companyName: "",
    businessType: "",
    yearsInRobotics: 3,
    website: "",
    linkedin: "",
    bio: "",
    profileImage: null,
    profileImageUrl: "",
    city: "",
    state: "",
    country: "US",
    serviceRadius: 50,
    additionalCities: [],
    robots: [],
    specializations: [],
    taskSpecializations: [],
    specializationLevels: {},
    emailVerified: false,
    phoneNumber: "",
    phoneVerified: false,
    identityMethod: null,
    identityDocUrl: "",
    insuranceDocUrl: "",
    backgroundCheckConsent: false,
    paymentSetupStarted: false,
  };
}

export function createEmptyRobot(): RobotEntry {
  return {
    id: crypto.randomUUID(),
    robotId: null,
    name: "",
    manufacturer: "",
    category: "",
    description: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    minimumDays: "1",
    fulfillmentTypes: [],
    operatorIncluded: false,
    remoteCapable: false,
    available: true,
    availableFrom: "",
    images: [],
  };
}
