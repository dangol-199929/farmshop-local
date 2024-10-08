import { IOutlets } from '@/interface/checkout.interface'
import { getOutletAddress } from '@/services/checkout.service'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

interface IPickupAddress {
    outletId: number,
    setOutletId: (val: number) => void,
    handleOutletNext: () => void
}

const PickupAddress = ({
    outletId,
    setOutletId,
    handleOutletNext
}: IPickupAddress) => {

    const { data: outlets } = useQuery<IOutlets[]>(['getOutlets'], getOutletAddress)
    return (
        <>
            <RadioGroup>
                {outlets?.map((outlet: any) => (
                    <div className="flex items-center pb-2 mb-2 space-x-2" key={outlet.id}>
                        <RadioGroupItem
                            onClick={() => setOutletId(outlet?.id)}
                            checked={outletId === outlet?.id}
                            value={outlet?.id}
                            id={outlet?.id}
                        />
                        <Label htmlFor={outlet?.id} className="flex items-center cursor-pointer">
                            <span className="capitalize">{outlet?.name}</span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            <div className='text-end '>
                <Button
                    onClick={handleOutletNext}
                    disabled={outletId === 0}
                    className='disabled:opacity-50 bg-primary text-white disabled:cursor-not-allowed disabled:pointer-events-auto font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850'>Next</Button>
            </div>
        </>
    )
}

export default PickupAddress