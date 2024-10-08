import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";

import { useHeaderFunctions } from "@/hooks/header.hook";
import ConfirmationModal from "@/shared/components/confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import CaretDownIcon from "@/shared/icons/common/CaretDownIcon";
import { useConfig as useConfigStores } from "@/store/config";

function HeaderTop() {
  const router = useRouter();
  const {
    showModal,
    setShowModal,
    warehouseName,
    showWarehouseAlertModal,
    config,
    profile,
    warehouse,
    logoutMutation,
    logoutHandler,
    changeWarehouse,
    handleWarehouseChange,
    handleWarehouseCancel,
    token,
  } = useHeaderFunctions();

  const { configData } = useConfigStores();

  return (
    <header>
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
            btnFunction={() => handleWarehouseChange()}
            cancelFuntion={handleWarehouseCancel}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
      <div className="z-10 bg-black">
        <div className="container mx-auto">
          <div className="flex items-center justify-between bg-black min-h-[48px] text-[12px] flex-wrap flex-col sm:flex-row px-2">
            <div className="flex items-center">
              <p className="p-2 pb-1 font-semibold text-white md:p-0">
                Welcome to {configData?.data?.title} !
              </p>
              <p className="hidden mx-1 text-white md:block">|</p>
              <div className="items-center hidden h-auto gap-1 p-0 text-xs font-semibold text-white no-underline capitalize md:flex text-md min-h-fit">
                <p>City:</p>
                {config?.data?.warehouses &&
                config?.data?.warehouses?.length > 1 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={` m-1 cursor-pointer min-w-[80px] whitespace-nowrap focus:outline-none text-white text-xs font-medium flex gap-1 items-center`}
                    >
                      <span className="capitalize">{warehouseName}</span>
                      <CaretDownIcon className="max-w-[10px] h-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-sm min-w-[110px] p-0"
                    >
                      {config?.data?.warehouses?.map((warehouse: any) => (
                        <DropdownMenuItem
                          key={warehouse?.id}
                          className={`cursor-pointer rounded-none capitalize py-2.5 text-black hover:!bg-[#f5faff] hover:!text-black ${
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
                  <p>{warehouse?.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center ">
              <FaUser className="w-[13px] h-auto text-white me-2" />
              {token && profile ? (
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="flex transition-all items-center gap-2 text-xs cursor-pointer text-white py-1 m-1 px-0 capitalize bg-transparent border-0 hover:bg-transparent hover:transform hover:scale-[1.1] focus:border-0 focus:outline-none focus-visible:border-0 focus-visible:outline-none">
                      {profile?.data?.firstName}
                      <FaChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="p-0 rounded-none min-w-[150px]"
                    >
                      <DropdownMenuItem
                        onClick={() => router.push("/account/profile")}
                        className="mx-5 text-xs text-gray-850 transition-all cursor-pointer focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold border-b hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                      >
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/checkout")}
                        className="mx-5 text-xs text-gray-850 transition-all cursor-pointer focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold border-b hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                      >
                        Checkout
                      </DropdownMenuItem>
                      <DialogTrigger>
                        <DropdownMenuItem className="!border-b-0  transition-all font-semibold text-xs text-gray-850 cursor-pointer focus:bg-none focus:text-primary py-3 px-0 text-center hover:transform hover:scale-[1.05] hover:!px-0 mx-5">
                          Logout
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              ) : (
                <div className="flex items-center my-2 md:my-0">
                  <Link
                    href={"/login"}
                    className=" transition-all capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                  >
                    Login
                  </Link>
                  <p className="mx-1 text-white">|</p>
                  <Link
                    href={"/register"}
                    className=" transition-all capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderTop;
