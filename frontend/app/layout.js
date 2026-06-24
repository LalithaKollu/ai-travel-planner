import "./globals.css";

export const metadata = {
  title: "AI Travel Planner",
  description: "Generate personalized travel itineraries with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
