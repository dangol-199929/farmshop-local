import React from "react";
import Slider from "react-slider";

import EmptyPage from "@/components/emptyPage";
import useCategoryDetails from "@/hooks/categories.hook";
import Card from "@/shared/components/card";
// import CategorySidebar from "@/features/Category/categorySidebar";
import Pagination from "@/shared/components/pagination";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import SortingDropdown from "@/shared/components/sorting-dropdown";
// import TagSidebar from "@/shared/components/tagSidebar";
import { useConfig as useConfigStores } from "@/store/config";
import TagSidebar from "@/shared/components/tagSidebar";
import CategorySidebar from "./categorySidebar";

const CategoryPage = () => {
  const {
    query,
    setQuery,
    pageNumber,
    setPageNumber,
    setFiltered,
    setSetFiltered,
    productData,
    setProductData,
    selectedValue,
    setSelectedValue,
    selectedPriceValue,
    setSelectedPriceValue,
    productModalId,
    setProductModalId,
    enableFilter,
    setEnableFilter,
    categoryName,
    setCategoryName,
    cart,
    tags,
    favList,
    minimumPrice,
    maximumPrice,
    isMinimumValid,
    isMaximumValid,
    initialValue,
    value,
    setValue,
    handleFilterButtonClick,
    handleSortingChange,
    initialProductData,
    isLoading,
    updatedData,
    handlePageChange,
  } = useCategoryDetails();
  const { configData } = useConfigStores();
  return (
    <div className="container my-[60px]">
      <div className="grid grid-cols-12 md:gap-[30px]">
        <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
          <div className="mb-[20px] mt-[40px] md:mt-0">
            <h3 className="right-sidebar-head">Filter By</h3>
            <div>
              <h4 className="text-slate-850 font-semibold font-base mb-3.5">
                Categories
              </h4>
              <CategorySidebar />
            </div>
            <div className="mt-3.5">
              <h4 className="mb-4 font-semibold text-slate-850 font-base">
                Price
              </h4>
              <p className="text-sm leading-6 text-slate-850  mb-[20px] pricevalue">
                {configData?.data?.currency} {value[0]} -{" "}
                {configData?.data?.currency} {value[1]}
              </p>
              <div>
                <div>
                  <Slider
                    className="slider"
                    onChange={setValue}
                    value={value}
                    min={minimumPrice}
                    max={maximumPrice}
                  />
                </div>

                <button
                  className="bg-primary hover:opacity-80 w-full font-bold px-[22px] py-[13px] rounded-[50px] text-white text-lg uppercase tracking-[1px] leading-[1] mt-[30px]"
                  onClick={handleFilterButtonClick}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div>
            <TagSidebar />
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <div className="flex flex-col sm:flex-row px-[30px] py-[10px] mb-[30px] bg-slate-150">
            <div className="flex-1 flex items-center mb-4 sm:mb-0 gap-[15px]">
              <p className="text-gray-750 text-sm leading-[20px]">
                There Are {initialProductData?.data?.length} Products.
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <p className="text-gray-750 text-sm leading-[20px] p-2">
                Sort By:
              </p>
              <SortingDropdown sortChange={handleSortingChange} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((index) => (
                  <SkeletonLoadingCard key={`app-skeleton-${index}`} />
                ))}
              </div>
            ) : initialProductData?.data?.length === 0 ? (
              <EmptyPage />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 xxs:grid-cols-2 lg:grid-cols-3">
                  {updatedData?.map((product: any, index: any) => (
                    <Card
                      setProductModalId={setProductModalId}
                      product={product}
                      key={`app-cat-products-${product?.id}`}
                      cartItem={cart?.cartProducts.find(
                        (item) => item?.product?.id === product?.id
                      )}
                    />
                  ))}
                </div>
                {initialProductData?.meta?.pagination?.total > 16 && (
                  <Pagination
                    totalPages={
                      initialProductData?.meta?.pagination?.total_pages
                    }
                    currentPage={
                      initialProductData?.meta?.pagination?.current_page
                    }
                    pageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
