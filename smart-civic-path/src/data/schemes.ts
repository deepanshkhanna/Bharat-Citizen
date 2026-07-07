export type MatchLevel = "high" | "medium" | "low";

export type EligibilityItem = { label: string; met: boolean };

export type Scheme = {
  id: string;
  name: string;
  shortName?: string;
  category:
    | "Students"
    | "Farmers"
    | "Women"
    | "Senior Citizens"
    | "Business"
    | "Health"
    | "Housing"
    | "Education";
  tagline: string;
  overview: string;
  match: MatchLevel;
  eligibility: EligibilityItem[];
  documents: string[];
  resources: {
    officialPortal: string;
    applicationForm?: string;
    learnMore?: string;
  };
  ministry: string;
};

export const schemes: Scheme[] = [
  {
    id: "pm-scholarship",
    name: "PM Scholarship Scheme",
    shortName: "PM Scholarship",
    category: "Students",
    tagline: "Higher education support for meritorious students.",
    overview:
      "Financial assistance for wards of ex/serving personnel and meritorious students pursuing professional and technical courses.",
    match: "high",
    eligibility: [
      { label: "Full-time student in recognised institution", met: true },
      { label: "Age between 18 and 25", met: true },
      { label: "Family income under specified limit", met: false },
    ],
    documents: ["Aadhaar", "Income Certificate", "Student ID", "Bank Passbook"],
    resources: {
      officialPortal: "https://scholarships.gov.in",
      applicationForm: "https://scholarships.gov.in",
      learnMore: "https://scholarships.gov.in",
    },
    ministry: "Ministry of Education",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    shortName: "Ayushman Bharat",
    category: "Health",
    tagline: "Health cover of ₹5 lakh per family per year.",
    overview:
      "Cashless secondary and tertiary care hospitalization for eligible families at empanelled public and private hospitals.",
    match: "high",
    eligibility: [
      { label: "Listed in SECC 2011 database", met: true },
      { label: "No existing government health cover", met: true },
    ],
    documents: ["Aadhaar", "Ration Card", "Mobile Number"],
    resources: {
      officialPortal: "https://pmjay.gov.in",
      learnMore: "https://pmjay.gov.in",
    },
    ministry: "Ministry of Health and Family Welfare",
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    shortName: "PM-KISAN",
    category: "Farmers",
    tagline: "₹6,000 per year direct income support to farmers.",
    overview:
      "Income support of ₹6,000 per year in three equal installments to all landholding farmer families across the country.",
    match: "medium",
    eligibility: [
      { label: "Landholding farmer family", met: true },
      { label: "Not an income tax payee", met: true },
      { label: "Land records updated", met: false },
    ],
    documents: ["Aadhaar", "Land Records", "Bank Account Details"],
    resources: {
      officialPortal: "https://pmkisan.gov.in",
      applicationForm: "https://pmkisan.gov.in/RegistrationForm.aspx",
    },
    ministry: "Ministry of Agriculture & Farmers Welfare",
  },
  {
    id: "pmay-g",
    name: "Pradhan Mantri Awas Yojana — Gramin",
    shortName: "PMAY-G",
    category: "Housing",
    tagline: "Pucca house with basic amenities for rural households.",
    overview:
      "Assistance for construction of a pucca house with basic amenities for rural households that are houseless or living in kutcha houses.",
    match: "medium",
    eligibility: [
      { label: "Houseless / living in 0-2 room kutcha house", met: true },
      { label: "Listed in SECC 2011", met: true },
    ],
    documents: ["Aadhaar", "Job Card (MGNREGA)", "Bank Passbook"],
    resources: { officialPortal: "https://pmayg.nic.in" },
    ministry: "Ministry of Rural Development",
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    category: "Women",
    tagline: "Small savings scheme for the girl child.",
    overview:
      "A tax-free small savings scheme for the girl child, with high interest and long-term maturity for education and marriage.",
    match: "high",
    eligibility: [
      { label: "Girl child under 10 years", met: true },
      { label: "Account opened by parent/guardian", met: true },
    ],
    documents: ["Birth Certificate", "Guardian ID", "Address Proof"],
    resources: { officialPortal: "https://www.nsiindia.gov.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India",
    category: "Business",
    tagline: "Bank loans for SC/ST and women entrepreneurs.",
    overview:
      "Composite loans between ₹10 lakh and ₹1 crore for greenfield enterprises by SC/ST and women entrepreneurs.",
    match: "medium",
    eligibility: [
      { label: "Age 18 or above", met: true },
      { label: "SC/ST or Woman entrepreneur", met: true },
      { label: "Greenfield project only", met: false },
    ],
    documents: ["Aadhaar", "PAN", "Business Plan", "Caste Certificate (if applicable)"],
    resources: { officialPortal: "https://www.standupmitra.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "mudra",
    name: "Pradhan Mantri MUDRA Yojana",
    shortName: "Mudra Yojana",
    category: "Business",
    tagline: "Collateral-free loans up to ₹10 lakh for small businesses.",
    overview:
      "Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises under Shishu, Kishor and Tarun categories.",
    match: "medium",
    eligibility: [
      { label: "Small / micro enterprise", met: true },
      { label: "Indian citizen", met: true },
    ],
    documents: ["Aadhaar", "PAN", "Business Proof", "Bank Statement"],
    resources: { officialPortal: "https://www.mudra.org.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "nps-senior",
    name: "National Pension System — Senior Citizens",
    shortName: "NPS for Seniors",
    category: "Senior Citizens",
    tagline: "Regular pension income after retirement.",
    overview:
      "Voluntary, long-term retirement savings scheme with market-linked returns and regular pension payouts.",
    match: "medium",
    eligibility: [
      { label: "Indian citizen aged 60–70", met: true },
      { label: "KYC compliant", met: true },
    ],
    documents: ["Aadhaar", "PAN", "Bank Details"],
    resources: { officialPortal: "https://www.npscra.nsdl.co.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "skill-india",
    name: "Skill India — PMKVY",
    shortName: "PMKVY",
    category: "Education",
    tagline: "Free skill training and certification for youth.",
    overview:
      "Short-term training and recognition of prior learning for Indian youth, with certification and placement support.",
    match: "high",
    eligibility: [
      { label: "Indian citizen aged 15–45", met: true },
      { label: "Not pursuing formal education", met: false },
    ],
    documents: ["Aadhaar", "Educational Certificates", "Bank Account"],
    resources: { officialPortal: "https://www.pmkvyofficial.org" },
    ministry: "Ministry of Skill Development & Entrepreneurship",
  },
  {
    id: "bbbp",
    name: "Beti Bachao Beti Padhao",
    category: "Women",
    tagline: "Empowerment and education of the girl child.",
    overview:
      "Convergent effort to prevent gender-biased sex selective elimination, ensure survival and protection, and enable education of the girl child.",
    match: "medium",
    eligibility: [{ label: "Applicable to all districts", met: true }],
    documents: ["Aadhaar", "School Enrolment Proof"],
    resources: { officialPortal: "https://wcd.nic.in/bbbp-scheme" },
    ministry: "Ministry of Women and Child Development",
  },
  {
    id: "pmegp",
    name: "PMEGP",
    category: "Business",
    tagline: "Credit-linked subsidy for new micro enterprises.",
    overview:
      "Generates self-employment opportunities through establishment of micro-enterprises in the non-farm sector.",
    match: "low",
    eligibility: [
      { label: "Age 18 or above", met: true },
      { label: "VIII pass for projects above ₹10 lakh", met: false },
    ],
    documents: ["Aadhaar", "PAN", "Project Report", "Caste/Category Certificate"],
    resources: { officialPortal: "https://www.kviconline.gov.in/pmegpeportal" },
    ministry: "Ministry of MSME",
  },
  {
    id: "nsp",
    name: "National Scholarship Portal",
    shortName: "NSP",
    category: "Students",
    tagline: "One-stop access to central and state scholarships.",
    overview:
      "A single window for students to search, apply and track scholarships offered by central ministries and state departments.",
    match: "high",
    eligibility: [
      { label: "Enrolled student", met: true },
      { label: "Scheme-specific criteria apply", met: true },
    ],
    documents: ["Aadhaar", "Bonafide Certificate", "Bank Details", "Income Certificate"],
    resources: { officialPortal: "https://scholarships.gov.in" },
    ministry: "Ministry of Electronics & IT",
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi",
    category: "Business",
    tagline: "Working capital loans for street vendors.",
    overview:
      "Micro-credit facility of up to ₹50,000 for urban street vendors to resume their livelihoods, with interest subsidy on timely repayment.",
    match: "medium",
    eligibility: [
      { label: "Street vendor with certificate/ID", met: true },
      { label: "Vending on or before 24 March 2020", met: true },
    ],
    documents: ["Aadhaar", "Vending Certificate / ID Card", "Bank Details"],
    resources: { officialPortal: "https://pmsvanidhi.mohua.gov.in" },
    ministry: "Ministry of Housing and Urban Affairs",
  },
  {
    id: "e-shram",
    name: "E-Shram Card",
    category: "Business",
    tagline: "National database and benefits for unorganised workers.",
    overview:
      "Registration of unorganised workers on the e-Shram portal, providing a Universal Account Number and access to social security schemes.",
    match: "high",
    eligibility: [
      { label: "Unorganised worker aged 16–59", met: true },
      { label: "Not a member of EPFO/ESIC", met: true },
    ],
    documents: ["Aadhaar", "Mobile Linked to Aadhaar", "Bank Account"],
    resources: { officialPortal: "https://eshram.gov.in" },
    ministry: "Ministry of Labour & Employment",
  },
  {
    id: "apy",
    name: "Atal Pension Yojana",
    category: "Senior Citizens",
    tagline: "Guaranteed monthly pension after age 60.",
    overview:
      "Guaranteed minimum monthly pension of ₹1,000 to ₹5,000 after 60 years of age, based on the contribution and joining age.",
    match: "medium",
    eligibility: [
      { label: "Indian citizen aged 18–40", met: true },
      { label: "Active savings bank account", met: true },
    ],
    documents: ["Aadhaar", "Bank Account", "Mobile Number"],
    resources: { officialPortal: "https://www.npscra.nsdl.co.in/scheme-details.php" },
    ministry: "Ministry of Finance",
  },
  {
    id: "pm-suraksha-bima",
    name: "PM Suraksha Bima Yojana",
    category: "Health",
    tagline: "₹2 lakh accident insurance cover for ₹20 per year.",
    overview:
      "A government-backed accident insurance scheme in India providing coverage for accidental death and full disability.",
    match: "high",
    eligibility: [
      { label: "Indian citizen aged 18–70", met: true },
      { label: "Active savings bank account", met: true },
    ],
    documents: ["Aadhaar", "Bank Account Details"],
    resources: { officialPortal: "https://www.jansuraksha.gov.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "pm-jeevan-jyoti",
    name: "PM Jeevan Jyoti Bima Yojana",
    category: "Health",
    tagline: "₹2 lakh life insurance cover for ₹436 per year.",
    overview:
      "A government-backed life insurance scheme in India offering coverage for death due to any reason.",
    match: "high",
    eligibility: [
      { label: "Indian citizen aged 18–50", met: true },
      { label: "Active savings bank account", met: true },
    ],
    documents: ["Aadhaar", "Bank Account Details"],
    resources: { officialPortal: "https://www.jansuraksha.gov.in" },
    ministry: "Ministry of Finance",
  },
  {
    id: "digital-india",
    name: "Digital India Portal",
    category: "Business",
    tagline: "Access to all central and state digital public services.",
    overview:
      "A single platform enabling citizens to access digital identity verification, documentation storage, and state-level e-governance services.",
    match: "high",
    eligibility: [
      { label: "All Indian citizens eligible", met: true },
    ],
    documents: ["Aadhaar"],
    resources: { officialPortal: "https://www.digitalindia.gov.in" },
    ministry: "Ministry of Electronics & IT",
  },
  {
    id: "digilocker",
    name: "DigiLocker",
    category: "Education",
    tagline: "Digitally store and verify your official documents.",
    overview:
      "A secure cloud-based platform for storage, sharing and verification of documents and certificates issued by various departments.",
    match: "high",
    eligibility: [
      { label: "Indian citizen with Aadhaar-linked mobile", met: true },
    ],
    documents: ["Aadhaar Card", "Mobile Number"],
    resources: { officialPortal: "https://www.digilocker.gov.in" },
    ministry: "Ministry of Electronics & IT",
  },
  {
    id: "pm-garib-kalyan",
    name: "PM Garib Kalyan Anna Yojana",
    category: "Housing",
    tagline: "Free food grains to eligible beneficiaries.",
    overview:
      "Food security welfare scheme providing 5kg free food grains per month to eligible beneficiaries under NFSA.",
    match: "high",
    eligibility: [
      { label: "Listed under National Food Security Act (NFSA)", met: true },
    ],
    documents: ["Aadhaar Card", "Ration Card"],
    resources: { officialPortal: "https://nfsa.gov.in" },
    ministry: "Ministry of Consumer Affairs, Food and Public Distribution",
  },
];

export const getScheme = (id: string) => schemes.find((s) => s.id === id);
