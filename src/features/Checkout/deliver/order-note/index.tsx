import React, { FC } from 'react';


interface IProps {
    note: string;
    setNote: (arg1: any) => void;
}
const OrderNote: FC<IProps> = ({ note, setNote }) => {
    return (
        <>
            <textarea
                className="textarea w-full rounded-none focus:outline-none border-[1px] p-2 text-sm border-gray-1200 bg-transparent"
                value={note}
                rows={4}
                onChange={(e) => setNote(e.target.value)}
            >
            </textarea>
        </>

    )
}

export default OrderNote