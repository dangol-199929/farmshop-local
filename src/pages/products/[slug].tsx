import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "@/shared/main-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProductsFromSlug,
  getRelatedProductsFromId,
} from "@/services/product.service";
import Breadcrumb from "@/shared/components/breadcrumb";
import Link from "next/link";
import { ICartData, ICreateCartItem } from "@/interface/cart.interface";
import { ICartProduct } from "@/interface/product.interface";
import ButtonLoader from "@/shared/components/btn-loading";
import Head from "next/head";
import { addToCart, getCartProduct } from "@/services/cart.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import SkeletonImage from "@/shared/components/skeleton/image";
import CardHeartIcon from "@/shared/icons/common/CardHeartIcon";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { useWishlists } from "@/hooks/wishlist.hooks";
import SkeletonDescription from "@/shared/components/skeleton/description";
import { ITag } from "@/interface/tag.interface";
import RelatedProducts from "@/features/Product/related-products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import { useCart as useCartStore } from "@/store/cart";
import { useConfig as useConfigStores } from "@/store/config";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { config } from "../../../config";
import axios from "axios";
import CustomImage from "@/features/custom-image";

const ProductSlug = () => {
  const router = useRouter();
  const { slug } = router.query;
  const queryClient = useQueryClient();
  const { coupon } = useCartStore();
  const token = getToken();

  const {
    addFavMutation,
    removeFavMutation,
    addLoading,
    removeLoading,
    favList,
  } = useWishlists();

  const { data: cartData } = useQuery<ICartData>(
    ["getCartList"],
    getCartProduct
  );

  //States
  const [moreInfoContent, setMoreInfoContent] = useState<string>("");
  const [taxMessage, setTaxMessage] = useState<string>("");
  const { configData } = useConfigStores();
  const [itemCartDetail, setItemCartDetail] = useState<ICartProduct>();
  const [value, setValue] = useState<number>(1);

  //for swiper carousel
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const {
    data: productData,
    isLoading,
    isError: productDataError,
  } = useQuery(
    ["getProductsFromSlug", slug],
    async () => {
      if (slug) {
        const response = await getProductsFromSlug(slug);
        const productId = response?.data?.id;
        return { response, productId };
      }
    },
    {
      retry: false,
      /**
       * If product slug is not found redirect to page not found
       */
      onError: (error: any) => {
        if (error?.status === 404) {
          router.push("/page-not-found");
        }
      },
    }
  );

  //For SKU
  const [selectedSizeId, setSelectedSizeId] = useState<number>(0);
  const unitPriceArray = productData?.response?.data?.variants || [];
  const filteredUnitPrice = selectedSizeId
    ? unitPriceArray.filter((sizeObj: any) => sizeObj.size === selectedSizeId)
    : unitPriceArray;

  const { data: relatedProducts, isLoading: relatedProductsLoading } = useQuery(
    ["getRelatedProductsFromId", productData?.productId],
    async () => {
      if (productData?.productId) {
        const response = await getRelatedProductsFromId(productData?.productId);
        return response;
      }
    }
  );

  const handleCartAction = () => {
    const payload: ICreateCartItem = {
      note: "",
      variant_id: selectedPrice?.id,
      quantity: value,
    };
    mutation.mutate(payload);
  };

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      if (selectedCartItems && updateCart) {
        showToast(TOAST_TYPES.success, "Product Updated Successfully");
      } else {
        showToast(TOAST_TYPES.success, "Item Added To Cart Successfully");
      }
      queryClient.invalidateQueries(["getCartList"]);
      queryClient.invalidateQueries(["getCart"]);
      if (coupon) {
        queryClient.invalidateQueries(["addCoupon"]);
      }
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message);
    },
  });

  /*
   ** Add product in favourite list
   */
  const addToFav = (id: number) => {
    addFavMutation.mutate(id);
  };

  /*
   ** Remove product from favourite list
   */
  const removeFromFav = (id: number) => {
    removeFavMutation.mutate(id);
  };

  /**
   * to check if the product is in fav list or not
   */
  const isFavGen = () => {
    if (favList && favList?.data?.length > 0) {
      const isfavResult = favList?.data?.some(
        (favItem: any) => favItem?.product_id === productData?.productId
      );
      return isfavResult;
    }
  };

  /**
   * To generate the fav id in order to implement remove from fav
   */
  const genFavId = () => {
    if (favList && favList?.data?.length > 0) {
      const favId = favList?.data.find(
        (favItem: any) => favItem.product_id === productData?.productId
      );
      return favId?.id || 0;
    }
  };
  const favId = genFavId(); //setting generated fav id.

  //for SKU multiple
  //For checking if the selected size and the mapped pricec are equal to show the change in price
  const selectedPrice = productData?.response?.data?.variants?.find(
    (price: any) => price?.id === selectedSizeId
  );

  //to display image according to the changed size.

  /**
   * Here the wepbImage is filtered according to unit_price_id or if the unit_price id is null,
   * Then it is sorted to show the image having id null in the last place of the loop.
   */
  const selectedImg = productData?.response?.data?.webpImages
    ? productData?.response?.data?.webpImages
        .filter(
          (img: any) =>
            selectedSizeId === img.unit_price_id || !img.unit_price_id
        )
        .sort((a: any, b: any) => (a.unit_price_id < b.unit_price_id ? 1 : -1))
    : productData?.response?.data?.images
        .filter(
          (img: any) =>
            selectedSizeId === img.unit_price_id || !img.unit_price_id
        )
        .sort((a: any, b: any) => (a.unit_price_id < b.unit_price_id ? 1 : -1));

  const updateCart = cartData?.cartProducts?.find(
    (cartItem: any) => JSON.parse(cartItem?.selectedUnit?.id) === selectedSizeId
  )
    ? true
    : false;

  //checking stock for each product/sku element
  const stock: any = productData?.response?.data?.variants?.find(
    (price: any) => price?.id === selectedSizeId
  )?.stock;
  const selectedCartItems: ICartProduct | undefined =
    cartData?.cartProducts?.find(
      (cart: any) => JSON.parse(cart?.selectedUnit?.id) === selectedSizeId
    );

  /**
   * Effects
   */
  useEffect(() => {
    if (cartData) {
      cartData?.cartProducts?.map((item: any) => {
        if (slug === item?.product?.slug) {
          setItemCartDetail(item);
        }
      });
    }
  }, [slug, cartData]);

  useEffect(() => {
    if (productData) {
      setMoreInfoContent(productData?.response?.data?.description || "");
      const message = productData?.response?.data?.taxable
        ? "Including Tax"
        : "Excluding Tax";
      setTaxMessage(message);
    }
  }, [productData]);

  useEffect(() => {
    if (productData) {
      setSelectedSizeId(productData?.response?.data?.variants[0]?.id);
    }
  }, [productData]);

  useEffect(() => {
    if (updateCart) {
      setValue(selectedCartItems?.quantity!);
    } else {
      setValue(1);
    }
  }, [selectedCartItems, selectedSizeId]);

  /*
   * To display toast if stock limit reached
   */
  useEffect(() => {
    if (value === stock) {
      showToast(TOAST_TYPES.warning, "Stock limit reached");
    }
  }, [value]);

  return (
    <>
      {
        <>
          <Head>
            <title>{productData?.response?.data?.name}</title>
          </Head>
          <Breadcrumb title={productData?.response?.data?.name} />
          <section className="my-[60px]">
            <div className="container">
              <div className="grid grid-cols-12 gap-0 md:gap-[35px]">
                <div className="col-span-12 md:col-span-5">
                  {isLoading ? (
                    <SkeletonImage />
                  ) : productData?.response?.data?.variants.length > 1 &&
                    selectedImg ? (
                    <>
                      <Swiper
                        spaceBetween={10}
                        thumbs={
                          thumbsSwiper
                            ? {
                                swiper:
                                  thumbsSwiper && !thumbsSwiper.destroyed
                                    ? thumbsSwiper
                                    : null,
                              }
                            : undefined
                        }
                        modules={[Thumbs]}
                        className="mySwiper2"
                      >
                        {selectedImg?.map((img: any, index: number) => (
                          <SwiperSlide key={index}>
                            <CustomImage
                              alt="Product Image"
                              src={img?.imageName}
                              className="w-full m-auto"
                              width={330}
                              height={330}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        watchSlidesProgress={true}
                        modules={[Thumbs, Navigation]}
                        className="mt-3 mySwiper thumbSwiper"
                        navigation={
                          productData?.response?.data?.images?.length > 3
                        }
                      >
                        {selectedImg?.map((img: any, index: number) => (
                          <SwiperSlide key={index}>
                            <CustomImage
                              alt="Product Image"
                              className="m-auto cursor-pointer"
                              src={img?.imageName}
                              width={90}
                              height={90}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </>
                  ) : (
                    <>
                      <Swiper
                        spaceBetween={10}
                        thumbs={
                          thumbsSwiper
                            ? {
                                swiper:
                                  thumbsSwiper && !thumbsSwiper.destroyed
                                    ? thumbsSwiper
                                    : null,
                              }
                            : undefined
                        }
                        modules={[Thumbs]}
                        className="mySwiper2"
                      >
                        {productData?.response?.data?.images?.map(
                          (img: any, index: number) => (
                            <SwiperSlide key={index}>
                              <CustomImage
                                alt="Product Image"
                                src={img?.imageName}
                                className="w-full m-auto"
                                width={330}
                                height={330}
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        watchSlidesProgress={true}
                        modules={[Thumbs, Navigation]}
                        className="mt-3 mySwiper thumbSwiper"
                        navigation={
                          productData?.response?.data?.images?.length > 3
                        }
                      >
                        {filteredUnitPrice?.length > 1
                          ? filteredUnitPrice.map(
                              (sizeObj: any, index: number) => (
                                <SwiperSlide key={index}>
                                  <CustomImage
                                    className="cursor-pointer"
                                    alt="Product image"
                                    src={sizeObj?.image?.imageName}
                                    width={90}
                                    height={90}
                                  />
                                </SwiperSlide>
                              )
                            )
                          : productData?.response?.data?.images?.map(
                              (img: any, index: number) => (
                                <SwiperSlide key={index}>
                                  <CustomImage
                                    className="m-auto cursor-pointer"
                                    alt="Product Image"
                                    src={img?.imageName}
                                    width={90}
                                    height={90}
                                  />
                                </SwiperSlide>
                              )
                            )}
                      </Swiper>
                    </>
                  )}
                </div>
                <div className="col-span-12 md:col-span-7">
                  {isLoading ? (
                    <SkeletonDescription />
                  ) : (
                    <>
                      <h2 className="mt-3 mb-6 text-2xl font-semibold md:mt-0 text-slate-850">
                        {productData?.response?.data?.name}
                      </h2>
                      {configData?.data?.checkStock && (
                        <p className="mb-2 text-sm font-bold text-slate-850">
                          Availability:{" "}
                          {selectedPrice?.stock === 0 ? (
                            <span className="font-semibold text-orange-100">
                              Out Of Stock
                            </span>
                          ) : (
                            <span className="font-semibold text-primary">
                              In Stock
                            </span>
                          )}
                        </p>
                      )}

                      <p className="flex items-center gap-3 mb-2 text-sm font-bold text-slate-850">
                        Category:
                        <Link
                          href={`/categories/${productData?.response?.data?.categorySlug}`}
                          aria-label="category-title"
                          className="mb-0 text-primary hover:text-orange-450"
                        >
                          <span className="font-normal">
                            {productData?.response?.data?.restaurantName}
                          </span>
                        </Link>
                      </p>
                      {productData?.response?.data?.tags?.length > 0 && (
                        <p className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-850">
                          Tags:
                          {productData?.response?.data?.tags?.map(
                            (prev: ITag, index: number) => (
                              <>
                                <Link
                                  href={`/tag?id=${prev?.slug}`}
                                  aria-label="tag-title"
                                  className="mb-0 capitalize transition-all text-primary hover:text-orange-450"
                                  key={`tag-${index}`}
                                >
                                  <span className="font-normal">
                                    {prev?.name}
                                  </span>
                                  {index <
                                    productData?.response?.data?.tags.length -
                                      1 && ","}
                                </Link>
                              </>
                            )
                          )}
                        </p>
                      )}
                      <ul className="flex my-5">
                        {selectedPrice && selectedPrice?.hasOffer ? (
                          <>
                            <li className="mr-1 text-base font-bold text-primary">
                              {configData?.data?.currency}
                              <span className="ml-1">
                                {selectedPrice?.newPrice * value}
                              </span>
                            </li>

                            <li className="mr-1 text-base font-bold line-through text-gray-1450">
                              {configData?.data?.currency}{" "}
                              <span>{selectedPrice?.oldPrice * value}</span>
                            </li>
                          </>
                        ) : (
                          <li className="mr-1 text-base font-bold text-primary">
                            {configData?.data?.currency}
                            <span className="ml-1">
                              {selectedPrice?.sellingPrice * value}
                            </span>
                          </li>
                        )}
                        <li className="text-base font-bold text-primary ">
                          ({" "}
                          <span
                            dangerouslySetInnerHTML={{ __html: taxMessage }}
                          />
                          )
                        </li>
                      </ul>

                      <p
                        dangerouslySetInnerHTML={{
                          __html: selectedPrice?.description,
                        }}
                      />

                      {unitPriceArray.length > 1 && (
                        <div className="mt-3">
                          <p className="mb-3 text-lg font-bold text-slate-850">
                            Size
                          </p>
                          <Select
                            value={selectedSizeId}
                            onValueChange={(e: any) => setSelectedSizeId(e)}
                          >
                            <SelectTrigger className="h-auto p-2 border-primary w-fit">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[999]">
                              {unitPriceArray?.map(
                                (size: any, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={size?.id}
                                    className="focus:bg-primary focus:text-white"
                                  >
                                    {size?.title}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {/* <select name="" id=""
                              value={selectedSizeId}
                              onChange={(e) => setSelectedSizeId(JSON.parse(e.target.value))}
                              className='px-3 py-1 w-auto focus:outline-none text-lg border rounded-[4px] border-primary text-slate-850'>
                              {
                                unitPriceArray?.map((size: any) => (
                                  <option key={size?.id} value={size?.id}><p>{size?.title}</p></option>
                                ))
                              }
                            </select> */}
                        </div>
                      )}
                      <div className="w-100 flex my-[30px]">
                        <div className="h-[48px] flex items-center border border-solid border-gray-950 overflow-hidden relative text-gray-250">
                          <button
                            onClick={() => {
                              setValue(value - 1);
                            }}
                            disabled={value === 1 ? true : false}
                            className="w-6 h-12 text-sm font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                          >
                            -
                          </button>
                          <Input
                            type="text"
                            name="qtybutton"
                            className="p-0 border-0 flex-grow w-[30px] text-sm text-center h-auto md:h-[48px] focus-visible:border-none focus-visible:outline focus:outline-none selection:bg-transparent"
                            readOnly
                            value={value}
                          />
                          <button
                            onClick={() => {
                              setValue(value + 1);
                            }}
                            disabled={value === stock ? true : false}
                            className="w-6 h-12 text-sm font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                          >
                            +
                          </button>
                        </div>
                        <div>
                          {selectedCartItems && updateCart ? (
                            <Button
                              type="button"
                              onClick={handleCartAction}
                              disabled={
                                mutation.isLoading || selectedPrice?.stock === 0
                              }
                              className={`${
                                mutation.isLoading && "opacity-70 "
                              } disabled:cursor-not-allowed flex items-center gap-4 relative px-[30px] md:px-[55px] font-bold uppercase rounded-[30px] bg-primary text-white ml-2.5 h-[48px] text-sm hover:bg-orange-100 hover:text-white`}
                            >
                              + Update To Cart
                              {mutation.isLoading && <ButtonLoader />}
                            </Button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleCartAction}
                              disabled={
                                mutation.isLoading || selectedPrice?.stock === 0
                              }
                              className={`${
                                mutation.isLoading && "opacity-70 "
                              } disabled:cursor-not-allowed flex items-center gap-4 relative px-[30px] md:px-[55px] font-bold uppercase rounded-[30px] bg-primary text-white ml-2.5 h-[48px] text-sm hover:bg-orange-100 hover:text-white`}
                            >
                              + Add To Cart
                              {mutation.isLoading && <ButtonLoader />}
                            </button>
                          )}
                        </div>
                      </div>
                      {token &&
                        (isFavGen() ? (
                          <button
                            onClick={() =>
                              removeFromFav(productData?.productId)
                            }
                            className="flex items-center gap-3 font-normal"
                          >
                            {removeLoading ? (
                              <ButtonLoader className="!border-primary" />
                            ) : (
                              <>
                                <CardHeartIcon className="stroke-[#E5002B] fill-[#E5002B]" />
                                Remove from wishlist
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => addToFav(productData?.productId)}
                            className="flex items-center gap-3 font-normal"
                          >
                            {addLoading ? (
                              <ButtonLoader className="!border-primary" />
                            ) : (
                              <>
                                <CardHeartIcon />
                                Add to wishlist
                              </>
                            )}
                          </button>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {moreInfoContent !== "" && (
            <div className="mb-[60px]">
              <div className="container">
                <a
                  data-toggle="tab"
                  className="active relative flex justify-center uppercase pb-3 text-lg font-bold text-center after:h-[2px] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:transition-all after:duration-300 after:ease-linear after:bg-primary text-slate-850 after:w-[250px] after:text-center after:m-auto"
                >
                  Product Description
                </a>
                <div className="px-8 py-10 overflow-hidden text-base leading-6 text-left bg-white border border-gray-200 tab-content">
                  <div id="productDetail" className="tab-pane active">
                    <div className="product-anotherinfo-wrapper">
                      <div className="text-justify description__text">
                        <p
                          dangerouslySetInnerHTML={{ __html: moreInfoContent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts && relatedProducts?.data.length !== 0 && (
            <RelatedProducts
              relatedProductsLoading={relatedProductsLoading}
              favList={favList}
              relatedProducts={relatedProducts?.data}
              cart={cartData}
            />
          )}
        </>
      }
    </>
  );
};

export default ProductSlug;
ProductSlug.getLayout = (page: any) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps(context: any) {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const configApiUrl = `${baseUrl}/${endPoint1}/configs`;
  const configResponse: any = await axios.get(configApiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });
  return {
    props: configResponse?.data,
  };
}
