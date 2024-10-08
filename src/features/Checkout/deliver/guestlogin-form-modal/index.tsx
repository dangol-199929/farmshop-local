import GuestLoginForm from '@/features/Auth/guest-login-form';
import React, { FC, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';


interface IProps {
  setAssociateCartModal: (arg0: boolean) => void
  setShowLoginModal: (arg0: boolean | any) => void
}
const GuestLoginModal = ({ setShowLoginModal, setAssociateCartModal }: IProps) => {

  const toggleLoginModal = () => {
    setShowLoginModal((prev: any) => !prev);
  };
  return (
    <>
      {/* <input type="checkbox" id="new" className="modal-toggle" defaultChecked />
      <div className="modal"> */}
      <div className='flex items-center justify-between'>
        <h3 className="text-lg font-bold">Login</h3>
      </div>
      <GuestLoginForm closeModal={toggleLoginModal} setAssociateCartModal={setAssociateCartModal} />
      {/* </div> */}
    </>

  )
}

export default GuestLoginModal