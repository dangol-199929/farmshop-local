import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWishlists } from "@/services/wishlist.service";
import Card from "@/shared/components/card";
import { useEffect, useState } from "react";
import Breadcrumb from "@/shared/components/breadcrumb";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import Head from "next/head";
import { ICartData } from "@/interface/cart.interface";
import Pagination from "@/shared/components/pagination";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import EmptyFavorite from "@/shared/components/empty-content/empty-favorite";
import { config } from "../../../config";
import axios from "axios";
import { useWishlists } from "@/hooks/wishlist.hooks";

const Wishlist: NextPageWithLayout = () => {
  const token = getToken();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [productModalId, setProductModalId] = useState<string>("");

  const perPage = 15;

  const { data: wishlist, isLoading } = useQuery(
    ["getWishlists", pageNumber, perPage],
    () =>
      getWishlists(pageNumber, perPage).then((response) => {
        return response;
      })
  );
  const { data: cart } = useQuery<ICartData>(["getCartList"]);

  const { favList } = useWishlists();

  const updatedData = wishlist?.data?.map((item: any) => ({
    ...item,
    product: {
      ...item.product,
      isFav:
        favList && favList?.data?.length > 0
          ? favList?.data?.some(
              (favItem: any) => favItem?.product_id === item?.product?.id
            )
          : false,
      favId:
        favList && favList.data.length > 0
          ? favList?.data.find(
              (favItem: any) => favItem.product_id === item?.product?.id
            )?.id
          : 0,
    },
  }));

  /**
   * For page num change
   */
  const handlePageChange = (value: number) => {
    setPageNumber(value);
  };

  useEffect(() => {
    if (pageNumber > 1 && wishlist?.meta?.pagination?.count === 0) {
      setPageNumber(pageNumber - 1);
      queryClient.invalidateQueries(["getWishlists"]);
    }
  }, [wishlist, pageNumber]);

  return (
    <div>
      <Head>
        <title>Wishlist</title>
      </Head>
      {wishlist?.data?.length === 0 ? (
        <EmptyFavorite />
      ) : (
        <>
          <Breadcrumb title="Wishlist" />
          <div className="wishlist-page">
            <div className="container">
              {isLoading ? (
                <div className="grid my-[60px] grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <SkeletonLoadingCard key={`app-skeleton-${index}`} />
                  ))}
                </div>
              ) : (
                <>
                  <section className="my-[60px]">
                    <div>
                      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {updatedData?.map((favProduct: any, index: any) => (
                          <Card
                            setProductModalId={setProductModalId}
                            product={favProduct?.product}
                            key={`app-cat-products-${favProduct?.id}`}
                            cartItem={cart?.cartProducts?.find(
                              (item) =>
                                item?.product?.id === favProduct?.product?.id
                            )}
                          />
                        ))}
                      </div>
                      {wishlist?.meta?.pagination?.total > 15 && (
                        <Pagination
                          currentPage={wishlist?.meta?.pagination?.current_page}
                          pageChange={handlePageChange}
                          totalPages={wishlist?.meta?.pagination?.total_pages}
                        />
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
Wishlist.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });
  return {
    props: response?.data,
  };
}
