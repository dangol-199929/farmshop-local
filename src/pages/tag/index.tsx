import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/shared/main-layout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getProductByTagId, getTagList } from "@/services/tag.service";
import EmptyPage from "@/components/emptyPage";
import Card from "@/shared/components/card";
import { ITag } from "@/interface/tag.interface";
import TagSidebar from "@/shared/components/tagSidebar";
import Breadcrumb from "@/shared/components/breadcrumb";
import SortingDropdown from "@/shared/components/sorting-dropdown";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import Pagination from "@/shared/components/pagination";
import { config } from "../../../config";
import axios from "axios";
import { ICartData } from "@/interface/cart.interface";
import { useWishlists } from "@/hooks/wishlist.hooks";

const Tag: NextPageWithLayout = () => {
  const router = useRouter();
  const token = getToken();
  const { id } = router.query; // Access the value of the 'id' query parameter
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [productModalId, setProductModalId] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedPriceValue, setSelectedPriceValue] = useState<string>("");
  const [tagId, setTagId] = useState<number>(0);

  const offer = 1;
  const maxPrice = null;
  const minPrice = null;
  const { data: tags } = useQuery({
    queryKey: ["getTagList"],
    queryFn: getTagList,
  });

  const [title, setTitle] = useState("");

  const handlePageChange = (value: number) => {
    setPageNumber(value);
  };

  const { data: cart } = useQuery<ICartData>(["getCartList"]);

  const { data: tagData, isLoading } = useQuery(
    [
      "getProductByTagId",
      query,
      pageNumber,
      tagId,
      maxPrice,
      minPrice,
      selectedValue,
      selectedPriceValue,
    ],
    () =>
      getProductByTagId(
        query,
        pageNumber,
        tagId,
        maxPrice,
        minPrice,
        selectedValue,
        selectedPriceValue
      )
  );

  const { favList } = useWishlists();

  const updatedData = tagData?.data?.map((item: any) => ({
    ...item,
    isFav:
      favList && favList?.data?.length > 0
        ? favList?.data?.some(
            (favItem: any) => favItem?.product_id === item?.id
          )
        : false,
    favId:
      favList && favList.data.length > 0
        ? favList?.data.find((favItem: any) => favItem.product_id === item.id)
            ?.id
        : 0,
  }));

  //Fetch Product Data
  const handleSortingChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setSelectedValue(value);
      setSelectedPriceValue("");
    } else if (value === "low" || value === "high") {
      setSelectedPriceValue(value);
      setSelectedValue("");
    }
  };

  useEffect(() => {
    if (tags && typeof id === "string") {
      const tag = tags?.data?.find((tag: ITag) => tag.slug === id);
      if (tag) {
        setTitle(tag?.name);
        setTagId(tag?.id);
      }
    }
  }, [tags, id]);

  return (
    <div>
      <Breadcrumb title={title} />
      <div className="container my-[60px]">
        <div className="grid grid-cols-12 md:gap-[30px]">
          <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
            <div className="mb-[20px]">
              {/* <h3 className='right-sidebar-head'>
                Tag
              </h3> */}
              <div>
                <TagSidebar />
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="top-bar flex items-center justify-between bg-slate-150 mt-[60px] my-[20px] p-[10px]">
              <div className="products-count">
                <p className="text-sm font-normal text-gray-750">
                  There are {tagData?.data?.length} products
                </p>
              </div>
              <div className="flex items-center sorting">
                <p className="pr-3 text-sm font-normal text-gray-750">
                  Sort By:
                </p>
                <SortingDropdown sortChange={handleSortingChange} />
              </div>
            </div>
            <section className="my-[60px]">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((index) => (
                    <SkeletonLoadingCard key={`app-skeleton-${index}`} />
                  ))}
                </div>
              ) : (
                <div>
                  {tagData?.data?.length === 0 ? (
                    <EmptyPage />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {updatedData?.map((product: any) => (
                          <Card
                            setProductModalId={setProductModalId}
                            product={product}
                            key={`app-cat-products-${product?.id}`}
                            cartItem={cart?.cartProducts?.find(
                              (item) => item?.product?.id === product?.id
                            )}
                          />
                        ))}
                      </div>
                      {tagData?.meta?.pagination?.total > 15 && (
                        <Pagination
                          totalPages={tagData?.meta?.pagination?.total_pages}
                          currentPage={tagData?.meta?.pagination?.current_page}
                          pageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tag;
Tag.getLayout = (page) => {
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
