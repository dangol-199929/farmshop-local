import { useHeaderFunctions } from "@/hooks/header.hook";
import WebNavigationOptions from "@/shared/components/header/web-navigation-options";

import HeaderMenu from "./HeaderMenu";

const Header = () => {
  const { navCategories } = useHeaderFunctions();

  return (
    <>
      <HeaderMenu />
      <WebNavigationOptions categories={navCategories?.data!} />
    </>
  );
};

export default Header;
