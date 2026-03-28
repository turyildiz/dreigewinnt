import { SideNavBar } from "@/components/layout/SideNavBar";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1440px] w-full mx-auto flex flex-1">
      <SideNavBar />
      <div className="flex-1 lg:ml-72 flex flex-col pt-20">
        {children}
      </div>
    </div>
  );
}
