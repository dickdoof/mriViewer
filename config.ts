import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "Radiometric AI",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Bringing diagnostic clarity to patients worldwide through advanced medical imaging AI.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "radiometric.ai",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_dev_mri_study"
            : "price_prod_mri_study",
        isFeatured: true,
        name: "Full MRI Analysis",
        description: "One-time payment per study",
        price: 29,
        features: [
          { name: "Full resolution DICOM viewer" },
          { name: "All findings with severity ratings" },
          { name: "Slice-by-slice navigation" },
          { name: "Doctor's letter PDF download" },
          { name: "Permanent secure storage" },
        ],
      },
    ],
  },
  aws: {
    bucket: "mri-studies",
    bucketUrl: "",
    cdn: "",
  },
  resend: {
    fromNoReply: `Radiometric AI <noreply@radiometric.ai>`,
    fromAdmin: `Radiometric AI <hello@radiometric.ai>`,
    supportEmail: "support@radiometric.ai",
  },
  colors: {
    theme: "dark",
    main: "#adc6ff",
  },
  auth: {
    loginUrl: "/auth/login",
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
