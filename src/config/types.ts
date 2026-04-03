export interface ConfigMeta {
  name: string;
  author?: string;
  description?: string;
  tier: "official" | "community";
}

export interface Config {
  id: string;
  meta: ConfigMeta;
  filePath: string;
  content: string;
}
