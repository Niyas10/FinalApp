"use client";

import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css"; // Import Polaris styles
import "./../styles/./globals.css"; // Global styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider
          i18n={{
            Polaris: {
              Common: {
                checkbox: {
                  uncheckAll: "Uncheck all",
                  checkAll: "Check all",
                },
              },
            },
          }}
        >
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
