declare module "dcmjs" {
  export const data: {
    DicomMessage: {
      readFile(arrayBuffer: ArrayBuffer): {
        dict: Record<string, unknown>;
        meta: Record<string, unknown>;
      };
    };
    DicomMetaDictionary: {
      naturalizeDataset(dict: Record<string, unknown>): Record<string, any>;
    };
  };
}
