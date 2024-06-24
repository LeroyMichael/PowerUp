import { SearchInput } from "@/components/atoms/search-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, List, Menu } from "lucide-react";
import React from "react";

const SaleMobilePage = () => {
  return (
    <div className="min-h-[89vh] ">
      {/* Header */}
      <div className="grid gap-4">
        <Card>
          <CardHeader className="grid grid-cols-2 gap-4 items-center text-center">
            <div>
              <CardTitle>Rp420.000</CardTitle>
              {/* <div className="text-xs text-muted-foreground"></div> */}
            </div>
            <div>
              <CardTitle className="mt-0">+25 items</CardTitle>
            </div>
          </CardHeader>
        </Card>
        {/* Content */}
        <div>
          <Card>
            <CardHeader className="px-4 pt-5">
              <CardTitle>Select Products</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <ScrollArea className=" h-[49vh] w-full rounded-md ">
                <div className="grid grid-cols-2 gap-2">
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                  <Card className="">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        Ayam dada pack 2kg
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rp100,000
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3">
                      <Button className="h-7 w-full">+</Button>
                    </CardFooter>
                  </Card>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <div className="px-4 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-4">
        <SearchInput className="col-span-10" placeholder="Search item" />
        <Button className="col-span-2">
          <ArrowRight color="#ffffff" />
        </Button>
      </div>
    </div>
  );
};

export default SaleMobilePage;
