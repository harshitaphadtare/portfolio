
  import { createRoot } from "react-dom/client";
  import App from "./App";
  import "./index.css";

  // Vercel Analytics
  // Install the package locally with: npm install @vercel/analytics
  import { Analytics } from "@vercel/analytics/react";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <Analytics />
    </>
  );
  