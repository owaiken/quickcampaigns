// import "./globals.css"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="assets/favicon.png"/>
      <title>QuickCampaign.io</title>
      <body>
        {children}
      </body>
    </html>
  );
}
