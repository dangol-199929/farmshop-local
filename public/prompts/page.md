# Page Creation Instructions

## Overview

This IDE is designed to simplify the process of building web pages with the help of AI. Follow these guidelines to efficiently create a new page using the integrated AI tools.

## Steps to Create a New Page

### 1. Setup and Page Initialization

- Ensure you have a clear understanding of the page's layout and structure.
- The basic template of the page should include the following imports:
  ```js
  import axios from "axios";
  import MainLayout from "@/shared/main-layout";
  import Head from "next/head";
  import React from "react";
  import { config } from "@/config";
  import { NextPageWithLayout } from "../_app"; // Adjust this path according to the file's location
  ```
- Use the AI to generate reusable components, such as `Banner`, `Categories`, and `AdBanner`.

### 2. Use AI to Fetch and Display Data

- To retrieve dynamic data from the server, use `axios` to make HTTP requests.
- AI should help you generate API calls based on your configuration. Ensure that you configure API endpoints and headers properly:

  ```js
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });

  return {
    props: response?.data,
  };
  ```

### 3. Create the Page Component

- Create a new directory for the page inside the `src/pages/` or `src/app/` directory, depending on the project structure.
- Inside this directory, create an `index.tsx` file for the page component using functional components and hooks:

  ```tsx
  import React from "react";
  import Head from "next/head";

  function NewPage() {
    return (
      <>
        <Head>
          <title>New Page</title>
        </Head>
        <div>
          <h1>Welcome to the New Page</h1>
        </div>
      </>
    );
  }

  export default NewPage;
  ```

- **Important:** Never add props to the page function. All data fetching and props passing should be handled using Next.js data fetching methods like `getStaticProps`, `getServerSideProps`, or `getInitialProps`.

### 4. Applying Layout Wrappers

- Ensure that every page is wrapped with the appropriate layout component:
  ```js
  NewPage.getLayout = (page) => {
    const configData = page?.props;
    return <MainLayout configData={configData}>{page}</MainLayout>;
  };
  ```

### 5. Debugging and Optimizations

- AI can assist in refactoring code to improve performance and readability, especially for reusable components and API integrations.
- AI can automatically detect inefficiencies in the code and suggest improvements for state management and conditional rendering.

### 6. Best Practices

- Always define prop types for your components.
- Make use of error handling with `axios` to prevent failed API calls from breaking the app:
  ```js
  const response = await axios.get(apiUrl).catch((error) => {
    console.error("API call failed", error);
    return { props: {} };
  });
  ```

### 7. Fetching Data with getServerSideProps

- Place the `getServerSideProps` function at the bottom of the file to fetch dynamic data from the server:

  ```js
  export async function getServerSideProps() {
    const baseUrl = config?.gateway?.apiURL;
    const endPoint1 = config?.gateway?.apiEndPoint1;
    const apiUrl = `${baseUrl}/${endPoint1}/configs`;
    const response: any = await axios
      .get(apiUrl, {
        headers: {
          Accept: "application/json",
          "Api-Key": config.gateway.apiKey,
        },
      })
      .catch((error) => {
        console.error("API call failed", error);
        return { props: {} };
      });

    return {
      props: response?.data,
    };
  }
  ```

## Folder Structure and Naming Conventions

### Top-Level Directory Layout

```
.
├── build                   # Compiled files (alternatively `dist`)
├── docs                    # Documentation files (alternatively `doc`)
├── src                     # Source files (alternatively `lib` or `app`)
├── test                    # Automated tests (alternatively `spec` or `tests`)
├── tools                   # Tools and utilities
├── LICENSE
└── README.md
```

### Source Files

- The actual source files of a software project are usually stored inside the `src` folder. Alternatively, you can put them into the `lib` (if you're developing a library), or into the `app` folder (if your application's source files are not supposed to be compiled).
- When creating new pages, place them inside `src/pages/` or `src/app/` depending on the project structure.
- Always create new page files as `index.tsx` inside a directory named after the page.

### Automated Tests

- Automated tests are usually placed into the `test` or, less commonly, into the `spec` or `tests` folder.
  ```
  .
  ├── ...
  ├── test                    # Test files (alternatively `spec` or `tests`)
  │   ├── benchmarks          # Load and stress tests
  │   ├── integration         # End-to-end, integration tests (alternatively `e2e`)
  │   └── unit                # Unit tests
  └── ...
  ```

### Documentation Files

- Often it is beneficial to include some reference data into the project, such as Rich Text Format (RTF) documentation, which is usually

## Conclusion

This guide is designed to work seamlessly with AI-powered assistance in generating code, managing components, and handling data. By following these instructions, developers can efficiently create pages that are both dynamic and reusable.
