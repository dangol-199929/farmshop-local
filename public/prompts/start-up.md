# Initial Steps for Setting Up a New Next.js Project

## 1. Create Necessary Interfaces

- Define TypeScript interfaces as needed for your project. For example, create a `types` directory in `src` and add your interfaces in this directory, e.g., `src/types/index.ts`:
  ```typescript
  // src/types/index.ts
  export interface ExampleInterface {
    id: number;
    name: string;
  }
  ```

## 2. Create `image-config.ts`

- Create a configuration file for image imports in the root directory:
  ```typescript
  // image-config.ts
  export const imageConfig = {
    domains: ["example.com"],
    formats: ["image/avif", "image/webp"],
    FallBackImg: "/images/fallback.svg",
  };
  ```

## 3. Create a Layout (Header and Footer)

- Create a layout component using the header and footer components:

  ```typescript
  // src/features/layout/index.tsx
  import React from "react";
  import { HeaderComponent } from "../header";
  import { FooterComponent } from "../footer";

  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div>
        <HeaderComponent />
        <main>{children}</main>
        <FooterComponent />
      </div>
    );
  };

  export default Layout;
  ```

## 4. Implement the Layout

- Wrap your application with the layout component in `src/pages/_app.tsx`:

  ```typescript
  // src/pages/_app.tsx
  import "@/styles/globals.css";
  import type { AppProps } from "next/app";
  import Layout from "features/layout";

  function MyApp({ Component, pageProps }: AppProps) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  export default MyApp;
  ```

## 5. Create Components

- Create directories and files for components in `src/features/FOLDERNAME`:

  ```typescript
  // src/features/FOLDERNAME/index.tsx
  import React from "react";

  const ExampleComponent: React.FC = () => {
    return <div>Example Component</div>;
  };

  export default ExampleComponent;
  ```

## 6. Use Absolute Imports

- Configure absolute imports by adding the following to `tsconfig.json`:
  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "src",
      "paths": {
        "@/*": ["./src/*"],
        "@/public/*": ["./public/*"],
        "components/*": ["./src/components/*"],
        "features/*": ["./src/features/*"],
        "pages/*": ["./src/pages/*"],
        "styles/*": ["./src/styles/*"],
        "@/types/*": ["./src/types/*"],
        "@/utils/*": ["./src/utils/*"]
      }
    }
  }
  ```

## 7. Create `axiosInstance.ts`

- Create an Axios instance for API calls in `src/axios`:

  ```typescript
  // src/axios/axiosInstance.ts
  import axios from "axios";

  const axiosInstance = axios.create({
    baseURL: "https://api.example.com",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
  });

  export default axiosInstance;
  ```

## 8. Create Hook Folder

- Create a directory for custom hooks in `src/hooks`.

## 9. Create Services

- Create a directory for services in `src/services` and add your service implementations, e.g., `src/services/exampleService.ts`:

  ```typescript
  // src/services/exampleService.ts
  import axiosInstance from "@/axios/axiosInstance";

  export const getExampleData = async () => {
    const response = await axiosInstance.get("/example");
    return response.data;
  };
  ```

## 10. Create 404 and 401 Pages

- Create a 404 page in `src/pages/404.tsx`:

  ```typescript
  // src/pages/404.tsx
  import React from "react";

  const Custom404: React.FC = () => {
    return <h1>404 - Page Not Found</h1>;
  };

  export default Custom404;
  ```

- Create a 401 page in `src/pages/401.tsx`:

  ```typescript
  // src/pages/401.tsx
  import React from "react";

  const Custom401: React.FC = () => {
    return <h1>401 - Unauthorized</h1>;
  };

  export default Custom401;
  ```

## 11. Create CustomImage Component

- Create a `CustomImage` component in `src/features/custom-image/index.tsx`:

  ```typescript
  // src/features/custom-image/index.tsx
  import { FallBackImg } from "@/shared/lib/image-config";
  import Image from "next/image";
  import { useEffect, useState } from "react";

  const CustomImage = ({ alt, src, ...props }: any) => {
    const [error, setError] = useState<any>(null);

    useEffect(() => {
      setError(null);
    }, [src]);

    return (
      <Image
        alt={alt || "image"}
        onError={setError}
        src={error ? FallBackImg : src}
        {...props}
      />
    );
  };

  export default CustomImage;
  ```

By following these steps, you will have a well-structured Next.js project with TypeScript, a layout, components, pages, and necessary configurations. Ensure that all components are created inside the `features` folder for better organization.
