declare module "vlitejs" {
  interface VliteOptions {
    provider?: string;
    options?: {
      autoplay?: boolean;
      muted?: boolean;
      controls?: boolean;
      loop?: boolean;
      fullscreen?: boolean;
      playsinline?: boolean;
      providerParams?: Record<string, unknown>;
      [key: string]: unknown;
    };
    plugins?: string[];
    onReady?: (player: unknown) => void;
  }

  class Vlitejs {
    constructor(element: HTMLElement | string, options?: VliteOptions);
    static registerProvider(id: string, provider: unknown): void;
    static registerPlugin(id: string, plugin: unknown): void;
    destroy(): void;
  }

  export default Vlitejs;
}
