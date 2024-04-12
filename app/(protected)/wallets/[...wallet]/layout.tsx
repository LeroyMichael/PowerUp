import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="w-100 flex justify-center">
      <div className="max-w-screen-xl">{children}</div>
    </div>
  );
}
