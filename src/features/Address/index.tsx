import { IDeliveryAddress } from "@/interface/delivery-address.interface";
import {
  deleteDeliverAddressById,
  getDeliverAddress,
} from "@/services/delivery-address.service";
import ButtonLoader from "@/shared/components/btn-loading";
import DeliveryAddressModal from "@/shared/components/delivery-address-modal";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import NewAddressIcon from "@/shared/icons/common/NewAddressIcon";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { showToast, TOAST_TYPES } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PencilLine, Trash2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface IProps {
  setShowModal: (arg2: any) => void;
  showModal: boolean;
  setShowCreateModal: (arg2: any) => void;
  showCreateModal: boolean;
  formData: IDeliveryAddress;
  setFormData: (arg1: any) => void;
  setIsEditing: (arg0: boolean) => void;
  isEditing: boolean;
}

const Address: React.FC<IProps> = ({
  setShowModal,
  showModal,
  formData,
  setFormData,
  setIsEditing,
  isEditing,
  setShowCreateModal,
  showCreateModal,
}) => {
  const queryClient = useQueryClient();
  const token = getToken();
  const [deliveryAddressId, setDeliveryAddressId] = useState<string>("");
  const { data: deliveryAddressData } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token,
  });

  const handleAddNew = () => {
    // Reset the form data when adding a new address
    setFormData({
      address: "",
      mobile_number: "",
      name: "",
      default: false,
      lat: 0,
      lng: 0,
      title: "",
    });
    // Set isEditing to false when adding
    setIsEditing(false);
    // Show the modal for adding
    setShowCreateModal(true);
  };

  //Edit the delivery address list
  const handleEdit = (addressId: any) => {
    // For finfing  address object with the specified ID
    const addressData = deliveryAddressData.find(
      (address: any) => address.id === addressId
    );
    if (addressData) {
      setFormData({
        ...formData,
        id: addressData?.id,
        title: addressData?.title,
        name: addressData?.name,
        mobile_number: addressData?.mobileNumber,
        lat: addressData?.lat,
        lng: addressData?.lng,
        default: addressData?.isDefault,
      });
      // Set isEditing to true when editing
      setIsEditing(true);
      // Show the modal for editing
      setShowModal(true);
    }
  };

  const deleteAdddressMutation = useMutation({
    mutationFn: deleteDeliverAddressById,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, "Delivery Address has been deleted");
      queryClient.invalidateQueries(["getDeliverAddress"]);
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      showToast(TOAST_TYPES.error, errors[0]?.message);
    },
  });

  //Delete Address
  const handleDeleteAddress = async (id: any) => {
    setDeliveryAddressId(id);
    deleteAdddressMutation.mutate(id);
  };

  return (
    <>
      {deliveryAddressData?.length < 3 ? (
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-grey-500 min-h-[170px]">
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger
              onClick={handleAddNew}
              className="flex flex-col items-center justify-center w-full h-full gap-3 text-center hover:bg-gray-200"
            >
              <NewAddressIcon />
              <span className="text-center">Add New Location</span>
            </DialogTrigger>
            <DialogContent className="px-0 pt-0">
              <DeliveryAddressModal
                formData={formData}
                setFormData={setFormData}
                setShowModal={setShowCreateModal}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
      {deliveryAddressData?.map((deliveryAddressContent: any, index: any) => (
        <div
          className={`col-span-12 sm:col-span-6 lg:col-span-4 border boder-grey-500 min-h-[170px] p-4 ${
            deliveryAddressContent.isDefault ? "border-primary" : ""
          }`}
          key={deliveryAddressContent.id}
        >
          <h5 className="mb-2 font-medium">{deliveryAddressContent?.title}</h5>
          <p className="mb-1 text-sm">{deliveryAddressContent?.name}</p>
          <h5 className="mb-1 text-sm ">
            {deliveryAddressContent?.detail?.formatted_address}
          </h5>
          {deliveryAddressContent?.mobileNumber && (
            <p className="mb-1 text-sm font-medium">
              Phone: {deliveryAddressContent?.mobileNumber}
            </p>
          )}

          <div className="flex gap-6">
            <Button
              disabled={
                deliveryAddressContent?.id === deliveryAddressId &&
                deleteAdddressMutation.isLoading
              }
              variant="icon"
              onClick={() => handleDeleteAddress(deliveryAddressContent?.id)}
            >
              {deliveryAddressContent?.id === deliveryAddressId &&
              deleteAdddressMutation.isLoading ? (
                <Loader2 size={16} className="animate-spin me-1" />
              ) : (
                <Trash2 size={16} className="me-1" />
              )}
              Remove
            </Button>
            <Button
              onClick={() => handleEdit(deliveryAddressContent?.id)}
              variant="icon"
            >
              <PencilLine size={16} className="me-1" />
              Edit
            </Button>
          </div>
        </div>
      ))}

      {/* Edit Modal open */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="px-0 pt-0">
          <DeliveryAddressModal
            formData={formData}
            setFormData={setFormData}
            setShowModal={setShowModal}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Address;
