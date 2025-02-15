declare global {
  namespace App {
    interface Locals {
      user?: {
        id?: number;
        username?: string;
        roles: string[];
        token: string;
      };
    }
    
    interface PageData {
      user: {
        authenticated: boolean;
        username?: string;
        roles: string[];
      };
    }
  }
}

declare module '@superforms/sveltekit' {
  import type { z } from 'zod';

  export interface SuperValidated<T extends z.ZodType> {
    data: z.infer<T>;
    errors: Record<string, string[]>;
    touched: Set<string>;
  }

  export function superForm<T extends z.ZodType>(
    form: SuperValidated<T>,
    options?: {
      validators?: T;
      onSubmit?: (event: { formData: FormData; form: SuperValidated<T> }) => Promise<boolean | void>;
    }
  ): {
    form: writable<z.infer<T>>;
    errors: writable<Record<string, string[]>>;
    enhance: (node: HTMLFormElement) => void;
  };
}

export {};
