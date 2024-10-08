import { ChevronDown, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { useHeaderFunctions } from "@/hooks/header.hook";
import ConfirmationModal from "@/shared/components/confirmation-modal";
import { Button } from "@/shared/components/ui/button";
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

const AccountDropdown = () => {
  const router = useRouter();
  const {
    showModal,
    setShowModal,
    profile,
    logoutMutation,
    logoutHandler,
    token,
  } = useHeaderFunctions();

  return (
    <div>
      {token && profile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="hidden md:flex items-center gap-2 justify-center rounded-2xl"
            >
              <UserCircleIcon size={22} />
              <p className="max-w-[90px] whitespace-nowrap truncate">
                {profile?.data?.firstName}
              </p>
              <ChevronDown size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/account/profile")}>
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/checkout")}>
              Checkout
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger>
                  <button onClick={() => setShowModal(true)}>
                    <span className={` hidden md:block`}>Logout</span>
                  </button>
                </DialogTrigger>
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={"/login"}>
          <Button className="rounded-2xl" size="lg" variant="secondary">
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AccountDropdown;
