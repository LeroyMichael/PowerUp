import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale",
  description: "",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="w-100 flex justify-center">
      <div className="max-w-screen-xl md:w-3/4 w-full">{children}</div>
    </div>
  );
}
