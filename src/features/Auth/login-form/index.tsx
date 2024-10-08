import { login } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ILogin } from '../../../interface/login.interface';
import { deleteCookie, setCookie } from 'cookies-next';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import ButtonLoader from '@/shared/components/btn-loading';
import { ICartData, ICartItem } from '@/interface/cart.interface';
import { associateCart, getCartData } from '@/services/cart.service';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import ConfirmationModal from '@/shared/components/confirmation-modal';
import { Input } from '@/shared/components/ui/input';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';

interface LoginFormProps {
  closeModal?: () => void;
  setAssociateCartModal: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeModal, setAssociateCartModal }) => {
  const router = useRouter();
  const token = getToken();
  const queryClient = useQueryClient();
  const { data: cart } = useQuery<ICartData>(["getCartList"]);
  const [showAssociateLoginCartModal, setAssociateLoginCartModal] = useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setCookie('token', data?.data?.accessToken);
      setCookie('isLoggedIn', true)
      // deleteCookie("cart_number")
      showToast(TOAST_TYPES.success, 'You have been successfully logged in.');
      queryClient.invalidateQueries(['getCart'])
      if (cart && cart.cartProducts?.length > 0) {
        const { response: associateCartResponse, error }: any = await associateCart(data?.data?.accessToken, '');
        if (associateCartResponse) {
          queryClient.invalidateQueries(['getCart'])
          queryClient.invalidateQueries(['getCartList'])
          queryClient.invalidateQueries(['getProfile'])
          router.push('/checkout');
          closeModal && closeModal();
        } else {
          closeModal && closeModal();
          setAssociateCartModal(true);
          setAssociateLoginCartModal(true);
        }
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors
      showToast(TOAST_TYPES.error, errors[0]?.detail)

    },
  })
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<ILogin>()

  const loginSubmit: SubmitHandler<ILogin> = (data) => {
    mutation.mutate(data)
  }

  //   useEffect(() => {
  //     const token = getToken();
  //     if (token) {
  //       if (cart && cart.cartProducts?.length > 0) {
  //         associateCart(data?.access_token);
  //         queryClient.invalidateQueries(['getCart'])
  //         router.push('/checkout');
  //         closeModal && closeModal();
  //       } else {
  //         router.push('/');
  //       }
  //     }
  // }, [token])
  const associateCartModal = async (value: string) => {
    const associateCartResponse: any = await associateCart(token, value);
    if (associateCartResponse) {
      queryClient.invalidateQueries(['getCart'])
      queryClient.invalidateQueries(['getCartList'])
      queryClient.invalidateQueries(['getProfile'])
      router.push('/checkout');
      setAssociateCartModal(false);
    } else {
      setAssociateCartModal(false);
    }
  };

  return (
    <>
      <Dialog open={showAssociateLoginCartModal}>
        <DialogContent className='modal-content no-btn'>
          <ConfirmationModal
            confirmHeading="You already have items. Do you want to delete your previous items?"
            modalType="delete_account_modal"
            btnName="Merge"
            cancelBtnName="Remove"
            showModal={showAssociateLoginCartModal}
            btnFunction={() => associateCartModal('false')}
            cancelFuntion={() => associateCartModal('true')}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(loginSubmit)} autoComplete='off'>
        <div className='flex flex-col mb-[20px]'>
          <Input
            type="text"
            autoComplete="off"
            placeholder='Phone Number/Email'
            {...register("account", { required: 'Phone Number Or Email is required' })}
            onBlur={() => trigger('account')}
            className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.account ? 'border-destructive' : 'border-gray-350'}`}
          />
          {
            errors.account &&
            <p className='text-destructive text-xs leading-[24px] mt-1'>{errors.account.message}</p>
          }
        </div>
        <div className='flex flex-col mb-[20px]'>
          <Input
            type="password"
            placeholder='Password'
            autoComplete="off"
            {...register("password", { required: 'Password is required', })}
            onBlur={() => trigger('password')}
            className={`px-3.5 rounded-none text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.password ? 'border-destructive' : 'border-gray-350'}`}
          />
          {
            errors.password &&
            <p className='text-destructive text-xs leading-[24px] mt-1'>{errors.password.message}</p>
          }
        </div>
        <div className='flex items-center justify-between'>
          <button
            disabled={mutation.isLoading}
            type='submit'
            className='submit-btn'
          >
            Login
            {
              mutation.isLoading &&
              <ButtonLoader />
            }
          </button>
          <Link href='/forgot-password' className='text-sm transition-all duration-150 delay-100 text-slate-850 hover:text-primary' aria-label="forget-passsword" >Forgot Password?</Link>
        </div>
      </form>
    </>
  )
}



export default LoginForm;
