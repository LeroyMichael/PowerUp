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
      <div className="max-w-screen-xl lg:w-4/5 w-full">{children}</div>
    </div>
  );
}
