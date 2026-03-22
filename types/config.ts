export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  crisp: {
    id?: string;
    onlyShowOnRoutes?: string[];
  };
  stripe: {
    plans: {
      priceId: string;
      isFeatured?: boolean;
      name: string;
      description?: string;
      price: number;
      priceAnchor?: number;
      features: { name: string }[];
    }[];
  };
  aws?: {
    bucket?: string;
    bucketUrl?: string;
    cdn?: string;
  };
  resend: {
    fromNoReply: string;
    fromAdmin: string;
    supportEmail?: string;
  };
  colors: {
    theme: string;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}
