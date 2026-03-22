import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "MRI Viewer",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Upload your MRI scan and get an AI-powered analysis with findings highlighted — in minutes, not weeks.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "mriviewer.app",
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
    fromNoReply: `MRI Viewer <noreply@mriviewer.app>`,
    fromAdmin: `MRI Viewer <hello@mriviewer.app>`,
    supportEmail: "support@mriviewer.app",
  },
  colors: {
    theme: "light",
    main: "#570df8",
  },
  auth: {
    loginUrl: "/auth/login",
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
