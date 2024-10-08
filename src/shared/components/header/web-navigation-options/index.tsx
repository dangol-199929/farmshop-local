import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import BarsIcon from "@/shared/icons/common/BarsIcon";
import CaretDownIcon from "@/shared/icons/common/CaretDownIcon";
import CategorySubItem from "../../category-sub-component/side-dropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import CategoryMobAccordion from "../../category-sub-component/mob-accordion";
import OfferIcon from "@/shared/icons/common/OfferIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "../../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { INavCategories } from "@/interface/home.interface";

interface IOptionProps {
  categories: INavCategories[];
}

const WebNavigationOptions = ({ categories }: IOptionProps) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const changeRoute = (link: string) => {
    router.push(link);
    setDropdownOpen(false);
  };
  return (
    <div
      className={`category-shadow md:sticky top-0 md:z-70 z-10 bg-white border-t`}
    >
      <div className="container flex items-center justify-center">
        <NavigationMenu className="block w-full max-w-full md:flex md:max-w-max md:flex-grow-1">
          <NavigationMenuList className="block md:flex">
            <NavigationMenuItem className="hidden w-full md:block">
              <NavigationMenu className="justify-center gap-10">
                <NavigationMenuList className="gap-9">
                  <NavigationMenuItem
                    onClick={() => router.push("/")}
                    className={`!bg-white  border-0 cursor-pointer hover:text-primary text-gray-550 font-bold capitalize py-3 px-2 ${
                      router?.pathname === "/" && "text-primary nav-active"
                    }`}
                  >
                    Home
                  </NavigationMenuItem>

                  {categories &&
                    categories?.slice(0, 5).map((option) => (
                      <React.Fragment key={option?.id}>
                        {option?.subCategories.length > 0 ? (
                          <NavigationMenuItem>
                            <NavigationMenu className="m-0">
                              <NavigationMenuList className="m-0">
                                <NavigationMenuTrigger
                                  onClick={() =>
                                    router.push(`/categories/${option?.slug}`)
                                  }
                                  className={`font-bold gap-1 p-0 bg-transparent items-center border-0 cursor-pointer text-gray-550 hover:bg-transparent hover:text-primary`}
                                >
                                  {option?.name}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="min-w-[250px]">
                                  {option?.subCategories.map(
                                    (subItem, index) => (
                                      <NavigationMenuLink
                                        className="py-1"
                                        key={index}
                                      >
                                        <Link
                                          href={`/categories/${subItem?.slug}`}
                                          className="py-2.5 block border-b w-full px-5 hover:!pl-7 focus:!bg-transparent hover:text-primary transition-all"
                                        >
                                          {subItem?.name}
                                        </Link>
                                      </NavigationMenuLink>
                                    )
                                  )}
                                </NavigationMenuContent>
                              </NavigationMenuList>
                            </NavigationMenu>
                          </NavigationMenuItem>
                        ) : (
                          <NavigationMenuItem
                            onClick={() =>
                              router.push(`/categories/${option?.slug}`)
                            }
                            className={`!bg-white border-0  cursor-pointer text-gray-550 hover:text-primary  py-3 px-2 font-bold capitalize ${
                              router?.asPath ===
                                `/categories/${option?.slug}` &&
                              "text-primary nav-active"
                            }`}
                          >
                            {option?.name}
                          </NavigationMenuItem>
                        )}
                      </React.Fragment>
                    ))}
                  {categories && categories?.length > 5 && (
                    <NavigationMenuItem>
                      <NavigationMenu className="m-0">
                        <NavigationMenuList className="m-0">
                          <NavigationMenuTrigger
                            className={`font-bold gap-1 p-0 bg-transparent items-center border-0 cursor-pointer text-gray-550 hover:bg-transparent hover:text-primary ${
                              (router?.pathname ===
                                "/page/plant-consultation" ||
                                router?.pathname === "/page/gift-a-plant") &&
                              "text-primary"
                            }`}
                          >
                            See More
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="min-w-[250px]">
                            {categories
                              ?.slice(5, categories?.length)
                              .map((option, index) => (
                                <NavigationMenuLink
                                  className="py-1"
                                  key={index}
                                >
                                  <Link
                                    href={`/categories/${option?.slug}`}
                                    className="py-2.5 block border-b w-full px-5 hover:!pl-7 focus:!bg-transparent hover:text-primary transition-all"
                                  >
                                    {option?.name}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default WebNavigationOptions;
