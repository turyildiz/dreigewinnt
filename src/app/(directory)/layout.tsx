import { Suspense } from "react";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { MobileFilterBar } from "@/components/layout/MobileFilterBar";
import { Footer } from "@/components/layout/Footer";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1440px] w-full mx-auto flex flex-1 overflow-x-hidden">
      <Suspense>
        <SideNavBar />
      </Suspense>
      <div className="flex-1 min-w-0 lg:ml-72 flex flex-col pt-20">
        <Suspense>
          <MobileFilterBar />
        </Suspense>
        {children}
        <Footer />
      </div>
    </div>
  );
}
