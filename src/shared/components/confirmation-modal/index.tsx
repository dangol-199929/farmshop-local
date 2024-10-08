import React from 'react'
import { Props } from './confirmation-modal.props'

const ConfirmationModal: React.FC<Props> = ({
    confirmHeading,
    btnName,
    cancelBtnName,
    children,
    btnFunction,
    cancelFuntion,
    isLoading
}) => {
    return (
        <>
            {/* <input type="checkbox" id={modalType} className="modal-toggle" defaultChecked />
            <div className="modal">
                <div className="rounded-lg modal-box"> */}
            <h3 className="text-lg font-bold">{confirmHeading}</h3>
            {children}
            <div className="flex items-center justify-center md:justify-end gap-[10px]">
                <button
                    onClick={btnFunction}
                    className='px-[30px] py-[11px] uppercase text-sm bg-primary rounded-[30px] text-white font-semibold flex items-center gap-[0.5rem] focus:outline-none focus:border-none'
                    disabled={isLoading}
                >
                    <p>{btnName}</p>
                    {
                        isLoading &&
                        <span
                            className="w-5 h-5 border-4 border-white border-dotted rounded-full border-t-transparent animate-spin"></span>
                    }
                </button>
                <button onClick={cancelFuntion} className="bg-gray-1250 uppercase hover:bg-gray-1150 font-semibold text-sm rounded-[30px] px-[30px] py-[11px]">{cancelBtnName ? cancelBtnName : 'Cancel'}</button>
            </div>
            {/* </div>
                <label onClick={cancelFuntion} className="modal-backdrop" htmlFor={modalType}>{cancelBtnName ? cancelBtnName : 'Cancel'}</label>
            </div> */}
        </>
    )
}

export default ConfirmationModal