"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const BreadcrumbPwr = () => {
  const paths: string[] = usePathname().split("/").slice(1);
  const pathName = (path: string) => {
    return path.replace("-", " ");
  };
  return (
    <>
      <Breadcrumb className="hidden md:flex capitalize">
        <BreadcrumbList>
          {paths.includes("dashboard") ? (
            <></>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
              <ChevronRight></ChevronRight>
            </BreadcrumbItem>
          )}
          {paths.map((path, index) => {
            return (
              <BreadcrumbItem key={path}>
                {index === paths.length - 1 ? (
                  <BreadcrumbPage>{pathName(path)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={"/" + path}>{pathName(path)}</Link>
                  </BreadcrumbLink>
                )}

                {index !== paths.length - 1 && <ChevronRight />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbPwr;
