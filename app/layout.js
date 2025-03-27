import './globals.css'
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="forhtml">
      <link rel="icon" href="assets/favicon.png"/>
      <title>QuickCampaign.io</title>
      <body className="forbody">
        {children}
      </body>
    </html>
  );
}
