import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase",
  description: "",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full p-4">
        {children}
      </div>
    </div>
  );
}
