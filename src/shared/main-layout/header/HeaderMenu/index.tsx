import { useHeaderFunctions } from "@/hooks/header.hook";
import CartDropdown from "@/shared/components/cartDropdown";
import Drawer from "@/shared/components/drawer";

import AccountDropdown from "../AccountDropdown";
import OfferButton from "../OfferButton";
import SearchBar from "../SearchBar";
import WishlistButton from "../WhishlistButton";
import HeaderLogo from "../HeaderLogo";

export default function HeaderMenu() {
  const { cart, navCategories } = useHeaderFunctions();
  return (
    <header className="bg-white shadow-sm md:static sticky top-0 md:z-[unset] z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <HeaderLogo />
        </div>

        <div className="flex justify-end items-center gap-2 md:gap-4 grow max-w-[80%] lg:max-w-[70%]">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <WishlistButton />
          <OfferButton />
          <CartDropdown />
          <AccountDropdown />
          <Drawer cart={cart} categories={navCategories?.data!} />
        </div>
      </div>
    </header>
  );
}
