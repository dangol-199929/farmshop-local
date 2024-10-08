import React, { useEffect, useState } from 'react'
import { addMinutes, format } from "date-fns"
import { Controller, useForm } from 'react-hook-form'

import { cn } from "@/shared/utils/utils"
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Calendar } from '@/shared/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'

import { useProfile as useProfileStore } from '@/store/profile'

import { handleKeyDownAlphabet, handleKeyDownNumber } from '@/shared/utils/form-validation-utils'

interface IPickupOption {
    pickupSelected: string
    setPickupSelected: (value: string) => void,
    pickupData: any,
    setPickupData: ({ }: any) => void,
    handlePickupNext: () => void
}

interface IPickupForm {
    date: Date | undefined,
    time: string | undefined,
    name: string,
    phoneNumber: string
}

const PickupOption = ({ pickupSelected, setPickupSelected, pickupData, setPickupData, handlePickupNext }: IPickupOption) => {
    const { profileData } = useProfileStore()
    const [optionChanged, setOptionChanged] = useState<boolean>(false)


    const { register, handleSubmit, control, formState: { errors }, trigger, reset } = useForm<IPickupForm>({
        defaultValues: {
            date: undefined,
            time: '',
            name: '',
            phoneNumber: '',
        }
    })

    const changeOption = (value: string) => {
        setOptionChanged(true)
        setPickupSelected(value)
    }

    const handleNext = (data: IPickupForm) => {
        setPickupData(data)
        handlePickupNext()
    }



    //Restting field when the user clicks on 'others' radio
    useEffect(() => {
        const currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + 40);
        const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`

        if (optionChanged && pickupSelected === 'other') {
            reset({
                name: '',
                phoneNumber: '',
                time: formattedTime,
                date: new Date()
            })
        } else if (optionChanged && pickupSelected === 'self') {
            reset({
                name: `${profileData?.firstName} ${profileData?.lastName}`,
                phoneNumber: profileData?.mobileNumber,
                date: new Date(),
                time: formattedTime
            })
        } else {
            reset({
                name: pickupData?.name ? pickupData?.name : `${profileData?.firstName} ${profileData?.lastName}`,
                phoneNumber: pickupData?.phoneNumber ? pickupData?.phoneNumber : profileData?.mobileNumber,
                date: pickupData?.date ? pickupData?.date : new Date(),
                time: pickupData?.time ? pickupData?.time : formattedTime
            })
        }
    }, [optionChanged, pickupSelected])

    return (
        <>
            <div className='mb-6'>
                <p className='text-base'>Pickup Options</p>
                <RadioGroup defaultValue={pickupSelected} className='flex items-center gap-6 mt-4'>
                    <div className="flex items-center pb-2 mb-2 space-x-2">
                        <RadioGroupItem
                            onClick={(e: any) => changeOption(e.target.value)}
                            value={'self'}
                            id={'self'}
                        />
                        <Label htmlFor={'self'} className="flex items-center cursor-pointer">
                            <span className="capitalize">Self</span>
                        </Label>
                    </div>
                    <div className="flex items-center pb-2 mb-2 space-x-2">
                        <RadioGroupItem
                            onClick={(e: any) => changeOption(e.target.value)}
                            value={'other'}
                            id={'other'}
                        />
                        <Label htmlFor={'other'} className="flex items-center cursor-pointer">
                            <span className="capitalize">Others</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            {/* <Form {''}>
 
            </Form> */}
            <form onSubmit={handleSubmit(handleNext)} className="grid grid-cols-12 gap-0 md:gap-4">
                {/* Date */}
                <div className="flex flex-col col-span-12 md:col-span-6 mb-[15px]">
                    <label className="mb-2 label">
                        <span className="label-text">Date<span className="asterick-icon text-orange-100 ml-[3px] text-sm">*</span></span>
                    </label>

                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: 'Date is required.' }}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        className={cn(
                                            "w-full rounded-none border border-gray-350 text-sm h-[45px] justify-start text-left font-normal",
                                            errors?.date && 'border-destructive'
                                        )}
                                    >
                                        {field?.value ? format(field?.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date: any) => {
                                            field.onChange(date)
                                            trigger("date")
                                        }}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {
                        errors?.date &&
                        <p className="text-destructive text-xs leading-[24px] mt-1">{errors?.date?.message}</p>
                    }

                </div>

                {/* Time */}
                <div className="flex flex-col col-span-12 md:col-span-6 mb-[15px]">
                    <label className="mb-2 label">
                        <span className="label-text">Time<span className="asterick-icon text-orange-100 ml-[3px] text-sm">*</span></span>
                    </label>
                    <Input
                        type="time"
                        placeholder="Enter Your Name"
                        maxLength={20}
                        {...register("time", { required: "Time is required." })}
                        className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.time ? 'border-destructive' : 'border-gray-350'}`}
                    />
                    <p className='mt-1 text-xs text-gray-250'>Note: 40 minutes is added from current time.</p>
                    {
                        errors?.time &&
                        <p className='text-destructive text-xs leading-[24px] mt-1'>{errors.time.message}</p>
                    }
                </div>

                {/* Name */}
                <div className="flex flex-col col-span-12 md:col-span-6 mb-[15px]">
                    <label className="mb-2 label">
                        <span className="label-text">Name<span className="asterick-icon text-orange-100 ml-[3px] text-sm">*</span></span>
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter Your Name"
                        maxLength={20}
                        readOnly={pickupSelected === 'self'}
                        onKeyUp={() => trigger("name")}
                        onKeyDown={handleKeyDownAlphabet}
                        className={`px-3.5 rounded-none read-only:bg-gray-350  text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.name ? 'border-destructive' : 'border-gray-350'}`}
                        {...register("name", {
                            required: 'Name is required',
                            pattern: {
                                value: /^[A-Za-z ]+$/,
                                message: "Only alphabetical characters are allowed",
                            },
                        })}
                    />
                    {
                        errors.name &&
                        <p className='text-destructive text-xs leading-[24px] mt-1'>{errors.name.message}</p>
                    }
                </div>

                {/* Phone NUmber */}
                <div className="flex flex-col col-span-12 md:col-span-6 mb-[15px]">
                    <label className="mb-2 label">
                        <span className="label-text">Phone Number<span className="asterick-icon text-orange-100 ml-[3px] text-sm">*</span></span>
                    </label>
                    <Input
                        type="text"
                        {...register("phoneNumber",
                            {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^9\d*$/,
                                    message: "Incorrect phone number format",
                                },
                                validate: (value) => {
                                    if (value.length < 10) {
                                        return "Phone number must be exactly 10 digits";
                                    }
                                },
                            })}
                        readOnly={pickupSelected === 'self'}
                        pattern="^[1-9]\d*$"
                        maxLength={10}
                        inputMode='numeric'
                        onKeyUp={() => trigger('phoneNumber')}
                        onKeyDown={handleKeyDownNumber}
                        placeholder='Enter Your Phone Number'
                        className={`px-3.5 rounded-none read-only:bg-gray-350  text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.phoneNumber ? 'border-destructive' : 'border-gray-350'}`}
                    />
                    {
                        errors.phoneNumber &&
                        <p className='text-destructive text-xs leading-[24px] mt-1'>{errors.phoneNumber.message}</p>
                    }
                </div>
                <div className='col-span-12 text-end '>
                    <Button type='submit' className='disabled:opacity-50 bg-primary text-white disabled:cursor-not-allowed disabled:pointer-events-auto font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850'>Next</Button>
                </div>
            </form>
        </>
    )
}

export default PickupOption