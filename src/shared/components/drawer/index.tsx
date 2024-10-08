import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useHeaderFunctions } from "@/hooks/header.hook";
import BarsIcon from "@/shared/icons/common/BarsIcon";
import LocationIcon from "@/shared/icons/common/LocationIcon";
import CaretDownIcon from "@/shared/icons/common/CaretDownIcon";
import UserIcon from "@/shared/icons/common/UserIcon";
import { Heart, Power, Tag, User } from "lucide-react";
import ConfirmationModal from "../confirmation-modal";
import SearchBar from "@/shared/main-layout/header/SearchBar";
import { INavCategories, IWareHouse } from "@/interface/home.interface";
import { ICartItem } from "@/interface/cart.interface";
import { useWishlists } from "@/hooks/wishlist.hooks";

interface IOptionProps {
  categories: INavCategories[];
  cart: ICartItem | any;
}

const Drawer = ({ categories, cart }: IOptionProps) => {
  const {
    showModal,
    setShowModal,
    showWarehouseAlertModal,
    warehouseName,
    changeWarehouse,
    handleWarehouseChange,
    handleWarehouseCancel,
    logoutHandler,
    token,
    changeRoute,

    config,
    logoutMutation,
  } = useHeaderFunctions();
  const { favList } = useWishlists();

  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);

  return (
    <div className="flex md:hidden">
      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <SheetTrigger
          className="bg-[#F9F9FA] hover:bg-gray-100 transition-all duration-300 text-[#414042] hover:text-primary border border-[#EDEDED] hover:border-primary p-[9px] h-[48px] w-[48px] rounded-2xl"
          asChild={true}
          onClick={() => setOpenDrawer(true)}
        >
          <BarsIcon className="shrink-0 text-[#414042]" />
        </SheetTrigger>

        <SheetContent side={"left"} className="w-64 p-4 side-drawer">
          <div className="px-4 py-2 mb-3 text-sm rounded-2xl bg-primary">
            {config?.data?.warehouses &&
            config?.data?.warehouses?.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`m-1 cursor-pointer min-w-[80px] whitespace-nowrap focus:outline-none text-white text-xs font-medium flex gap-1 items-center`}
                >
                  <LocationIcon />
                  City: <span className="capitalize">{warehouseName}</span>
                  <CaretDownIcon className="max-w-[10px] h-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="rounded-2xl min-w-[223px] p-0 ms-4 mt-2"
                >
                  {config?.data?.warehouses?.map((warehouse: IWareHouse) => (
                    <DropdownMenuItem
                      key={warehouse?.id}
                      className={`cursor-pointer rounded-none py-3 px-3 capitalize text-black hover:!bg-[#f5faff] hover:!text-black ${
                        warehouseName === warehouse?.name
                          ? "bg-[#ebf5ff] font-semibold"
                          : "!bg-transparent font-normal"
                      }`}
                      onClick={() => changeWarehouse(warehouse)}
                    >
                      <span>{warehouse?.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <p className="flex gap-1 justify-start items-center text-center text-white">
                <LocationIcon />
                City:
                {config?.data?.warehouses[0]?.name}
              </p>
            )}
          </div>

          <SearchBar />
          <div className="max-h-[calc(100vh-88px)] overflow-y-scroll pb-[40px] mt-2">
            <div className="!bg-transparent block p-1">
              <Button
                variant="list"
                onClick={() => changeRoute("/")}
                aria-label="home"
                size="sm"
                className="w-full justify-start mb-2"
              >
                Home
              </Button>
              <Accordion type="single" collapsible className="w-full">
                {categories?.map((option) => (
                  <React.Fragment key={option?.id}>
                    {option?.subCategories.length > 0 ? (
                      <AccordionItem
                        value={`item-${option?.id}`}
                        className="border-0"
                      >
                        <AccordionTrigger className="p-1 text-sm border-b hover:no-underline border-b-primary">
                          <p
                            className="font-normal "
                            onClick={() =>
                              changeRoute(`/categories/${option?.slug}`)
                            }
                          >
                            {option?.name}
                          </p>
                        </AccordionTrigger>
                        <AccordionContent className="drawer-accordion-content">
                          {option?.subCategories.map((subItem, index) => (
                            <Button
                              key={index}
                              size="sm"
                              className="w-full rounded-md justify-start"
                              variant={"list"}
                              onClick={() =>
                                changeRoute(`/categories/${subItem?.slug}`)
                              }
                              aria-label="plant-consultant"
                            >
                              {subItem?.name}
                            </Button>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <Button
                        variant="list"
                        onClick={() =>
                          changeRoute(`/categories/${option?.slug}`)
                        }
                        size="sm"
                        className="w-full rounded-md justify-start mb-2"
                        aria-label="our outlets"
                      >
                        {option?.name}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </Accordion>
              <div className="mt-6">
                <p className="mb-2 text-lg font-bold">My Account</p>

                <div className="flex flex-col gap-2">
                  {token ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => changeRoute("/account/profile")}
                      >
                        <User size={16} className="mr-2" />
                        View Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => changeRoute("/wishlist")}
                        aria-label="wishlist"
                      >
                        <Heart size={16} className="mr-2" />
                        Wishlist ({favList ? favList?.data?.length : 0})
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 mb-2">
                      <UserIcon className="text-black" />
                      <div className="flex items-center gap-1 leading-[33px]">
                        <Button
                          variant="ghost"
                          onClick={() => changeRoute("/login")}
                          aria-label="login"
                        >
                          Login
                        </Button>
                        <span>/</span>
                        <Button
                          variant="ghost"
                          onClick={() => changeRoute("/register")}
                          aria-label="sign-up"
                        >
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => changeRoute("/offer")}
                    aria-label="offer"
                  >
                    <Tag size={16} className="mr-2" />
                    Offer
                  </Button>
                  <Dialog open={showModal} onOpenChange={setShowModal}>
                    {token && (
                      <DialogTrigger className="w-full">
                        <Button variant="ghost" className="w-full">
                          <Power size={16} className="mr-2" />
                          Logout
                        </Button>
                      </DialogTrigger>
                    )}
                    <DialogContent>
                      <ConfirmationModal
                        confirmHeading="Are you sure you want to logout?"
                        modalType="logout_modal"
                        btnName="Logout"
                        showModal={showModal}
                        btnFunction={logoutHandler}
                        cancelFuntion={() => setShowModal(false)}
                        isLoading={logoutMutation.isLoading}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Warehouse Alert Modal */}
      <Dialog
        open={showWarehouseAlertModal}
        onOpenChange={handleWarehouseCancel}
      >
        <DialogContent className="modal-content">
          <ConfirmationModal
            confirmHeading="Changing warehouse will clear your data. Do you want to continue?"
            modalType="delete_account_modal"
            btnName="Confirm"
            cancelBtnName="Cancel"
            showModal={showWarehouseAlertModal}
            btnFunction={handleWarehouseChange}
            cancelFuntion={handleWarehouseCancel}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drawer;
