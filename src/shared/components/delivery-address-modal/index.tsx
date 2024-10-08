import { IDeliveryAddress } from '@/interface/delivery-address.interface';
import { addDeliverAddress, getDeliverAddress, updateDeliveryAddressByAddressId } from '@/services/delivery-address.service';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { handleKeyDownAlphabet, handleKeyDownNumber } from '@/shared/utils/form-validation-utils';
import { showToast, TOAST_TYPES } from '@/shared/utils/toast-utils/toast.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ButtonLoader from '../btn-loading';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

const LeafletMap = dynamic(() => import('@/shared/components/leaflet'), {
  ssr: false,
});

interface IProps {
  formData: IDeliveryAddress;
  setFormData: (arg1: any) => void;
  setShowModal: (arg2: any) => void;
  setIsEditing: (arg3: any) => void;
  isEditing: boolean;

}

const DeliveryAddressModal: React.FC<IProps> = ({
  formData,
  setFormData,
  setShowModal,
  setIsEditing,
  isEditing }) => {
  const queryClient = useQueryClient();
  const [addressSaved, setAddressSaved] = useState(false);
  const token = getToken();
  const handleMarkerClick = (lat: any, lng: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      lat,
      lng,
    }));
  };

  const { data: deliveryAddressData, refetch: getDeliveryAddress } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token
  });

  const fetchDeliveryAddress = async () => {
    await getDeliveryAddress();
  };

  const updateAddressMutation = useMutation({
    mutationFn: updateDeliveryAddressByAddressId,
    onSuccess: () => {
      setShowModal(false);
      showToast(TOAST_TYPES.success, 'Delivery Address Updated Successfully.');
      fetchDeliveryAddress();
      setAddressSaved(false);
      reset();
      queryClient.invalidateQueries(["getDeliverAddress", token]);
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors
      errors.map((err: any) => {
        setShowModal(true);
        showToast(TOAST_TYPES.error, err.detail);
        setAddressSaved(false);
      })
    }
  })

  const addDeliverAddressMutation = useMutation({
    mutationFn: addDeliverAddress,
    onSuccess: () => {
      setShowModal(false);
      showToast(TOAST_TYPES.success, 'Delivery Address Added Successfully.');
      queryClient.invalidateQueries(["getDeliverAddress", token]);
      getDeliveryAddress();
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors
      errors.map((err: any) => {
        setShowModal(true);
        showToast(TOAST_TYPES.error, err.detail);
        setAddressSaved(false);
      })
    }
  })
  const { register, handleSubmit, control, formState: { errors }, trigger, reset } = useForm<IDeliveryAddress>()

  const addressSubmit: SubmitHandler<IDeliveryAddress> = (data: any) => {
    if (formData.lat === 0 || formData.lng === 0) {
      showToast(TOAST_TYPES.error, 'Please select a location');
      setAddressSaved(false);
      return;
    }
    setAddressSaved(true);
    const payload = {
      ...data,
      default: data?.default,
      mobile_number: data?.mobile_number || '',
      lat: formData?.lat,
      lng: formData?.lng
    }
    if (isEditing) {
      updateAddressMutation.mutate(payload);

    } else {
      addDeliverAddressMutation.mutate(payload);
    }
  }


  useEffect(() => {
    if (formData && isEditing) {
      reset({
        lat: formData.lat !== undefined ? formData.lat : 27.7172,
        lng: formData.lng !== undefined ? formData.lng : 85.3240,
        title: `${formData?.title}`,
        name: formData.name || '',
        mobile_number: formData?.mobile_number,
        default: formData?.default,
        id: formData?.id,
      })
    }
  }, [isEditing, formData])



  return (
    <>
      <div className="left-0 flex items-start justify-between w-full px-8 pt-8 pb-2 border-b border-gray-300">
        <div>
          <h3 className="text-lg font-medium">
            SET DELIVERY LOCATION
          </h3>
          <p className="text-sm text-primary">
            {" "}
            Drag the map to pin point your delivery location{" "}
          </p>
        </div>
      </div>

      <form className='p-4 max-h-[calc(100vh-310px)] overflow-scroll' onSubmit={handleSubmit(addressSubmit)}>
        <div className="h-[280px] mb-3">
          <LeafletMap
            lat={formData.lat || 27.7172}
            long={formData.lng || 85.3240}
            onChange={handleMarkerClick}
          />
        </div>
        <div className='flex flex-col mb-[20px]'>
          <label
            htmlFor="addresstitle"
            className="block mb-2 text-sm"
          >
            {" "}
            Address Title <span className="text-orange-100">*</span>
          </label>

          <Input
            {...register("title", {
              required: 'Address title is required',
              pattern: {
                value: /^[A-Za-z ]+$/,
                message: "Only alphabetical characters are allowed",
              },
            })}
            onKeyUp={() => trigger("title")}
            onKeyDown={handleKeyDownAlphabet}
            type="text"
            placeholder="Address Title"
            className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors?.title ? 'border-destructive' : 'border-gray-350'}`}
            onBlur={() => trigger("title")}
          />
          {
            errors?.title &&
            <p className="text-destructive text-xs leading-[24px] mt-1">{errors?.title?.message}</p>
          }
        </div>

        <div className='flex flex-col mb-[20px]'>
          <label
            htmlFor="fullname"
            className="block mb-2 text-sm"
          >
            {" "}
            Full Name
          </label>

          <Input
            {...register("name", {
              pattern: {
                value: /^[A-Za-z ]+$/,
                message: "Only alphabetical characters are allowed",
              },
            })}
            onKeyUp={() => trigger("name")}
            onKeyDown={handleKeyDownAlphabet}
            type="text"
            placeholder="Full Name"
            className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors?.name ? 'border-destructive' : 'border-gray-350'}`}
            onBlur={() => trigger("name")}
          />
          {
            errors?.name &&
            <p className="text-destructive text-xs leading-[24px] mt-1">{errors?.name?.message}</p>
          }
        </div>
        <div className='flex flex-col mb-[20px]'>
          <label
            htmlFor="number"
            className="block mb-2 text-sm"
          >
            {" "}
            Phone number
          </label>


          <Input
            type="text"
            {...register("mobile_number",
              {
                pattern: {
                  value: /^9\d*$/,
                  message: "Incorrect phone number format",
                },
                validate: (value) => {
                  if (value !== undefined && value?.length < 10 && value !== '') {
                    return "Phone number must be exactly 10 digits";
                  }
                },
              })}
            onKeyUp={() => trigger('mobile_number')}
            pattern="^[1-9]\d*$"
            maxLength={10}
            inputMode='numeric'
            placeholder='Enter Your Phone Number'
            onKeyDown={handleKeyDownNumber}
            className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.mobile_number ? 'border-destructive' : 'border-gray-350'}`}
          />
          {
            errors?.mobile_number &&
            <p className="text-destructive text-xs leading-[24px] mt-1">{errors?.mobile_number?.message}</p>
          }
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Controller
            name='default'
            control={control}
            render={({ field }) => (
              <Checkbox
                id="check"
                checked={field?.value}
                onCheckedChange={(e: boolean) => {
                  field.onChange(e);
                }}
              />
            )}
          />
          <label htmlFor="check" className="text-sm">
            Set As Default
          </label>
        </div>

        <div className="flex gap-4 mt-2">
          <Button
            type='button'
            onClick={() => setShowModal(false)}
            className="bg-destructive text-white rounded-[30px] px-[30px] py-[11px]"

          >
            Cancel
          </Button>
          {isEditing ? (
            <Button
              disabled={updateAddressMutation?.isLoading}
              type="submit"
              className="bg-gray-1250 text-slate-850 hover:bg-gray-1150 rounded-[30px] px-[30px] py-[11px]">
              Update
              {
                updateAddressMutation?.isLoading &&
                <ButtonLoader className='!border-primary ml-2' />
              }
            </Button>
          ) : (
            <Button type="submit" className="bg-gray-1250 text-slate-850 hover:bg-gray-1150 rounded-[30px] px-[30px] py-[11px]" disabled={addressSaved}>
              Save
              {
                addressSaved &&
                <ButtonLoader className='!border-primary ml-2' />
              }
            </Button>
          )}
        </div>
      </form>
    </>
  )
}

export default DeliveryAddressModal