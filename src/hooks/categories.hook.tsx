import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategory } from "../services/product.service";
import { useConfig as useConfigStores } from "../store/config";
import { ICartData } from "../interface/cart.interface";
import { getTagList } from "../services/tag.service";
import { getToken } from "../shared/utils/cookies-utils/cookies.utils";
import { useWishlists } from "./wishlist.hooks";

const useCategoryDetails = () => {
  const router = useRouter();
  const { slug } = router.query;
  const token = getToken();
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [setFiltered, setSetFiltered] = useState(false);
  const [productData, setProductData] = useState(null);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedPriceValue, setSelectedPriceValue] = useState<string>("");
  const [productModalId, setProductModalId] = useState<string>("");
  const [enableFilter, setEnableFilter] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const { data: cart } = useQuery<ICartData>(["getCartList"]);
  const { data: tags } = useQuery({
    queryKey: ["getTagList"],
    queryFn: getTagList,
  });
  const { configData } = useConfigStores();

  const { favList } = useWishlists();

  const minimumPrice = Number(configData?.data?.minimumPrice);
  const maximumPrice = Number(configData?.data?.pageData["max-price"]);
  const isMinimumValid = !isNaN(minimumPrice) && isFinite(minimumPrice);
  const isMaximumValid = !isNaN(maximumPrice) && isFinite(maximumPrice);
  const initialValue = [
    isMinimumValid ? minimumPrice : 0,
    isMaximumValid ? maximumPrice : 3000,
  ];
  const [value, setValue] = useState(initialValue);

  const handleFilterButtonClick = async () => {
    setSetFiltered(true);
    setEnableFilter(!enableFilter);
  };

  const handleSortingChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setSelectedValue(value);
      setSelectedPriceValue("");
    } else if (value === "low" || value === "high") {
      setSelectedPriceValue(value);
      setSelectedValue("");
    }
  };

  const { data: initialProductData, isLoading } = useQuery(
    [
      "getProductByCategoryId",
      slug,
      pageNumber,
      enableFilter,
      selectedValue,
      selectedPriceValue,
    ],
    async () => {
      const response = await getProductByCategory(
        query,
        pageNumber,
        slug,
        value[0],
        value[1],
        selectedValue,
        selectedPriceValue
      );
      return response;
    },
    {
      retry: false,
      onError: (error: any) => {
        if (error?.status === 404) {
          router.push("/page-not-found");
        }
      },
    }
  );

  const updatedData = initialProductData?.data?.map((item: any) => ({
    ...item,
    isFav:
      favList && favList?.data?.length > 0
        ? favList?.data?.some(
            (favItem: any) => favItem?.product_id === item?.id
          )
        : false,
    favId:
      favList && favList?.data?.length > 0
        ? favList?.data.find((favItem: any) => favItem.product_id === item?.id)
            ?.id
        : 0,
  }));

  const handlePageChange = (value: number) => {
    setPageNumber(value);
  };

  useEffect(() => {
    if (initialProductData) {
      setProductData(initialProductData);
    }
  }, [initialProductData]);

  useEffect(() => {
    const product = initialProductData?.data?.find(
      (item: any) => item.restaurantSlug === slug
    );
    const category = initialProductData?.data?.find(
      (item: any) => item.categorySlug === slug
    );

    if (product) {
      setCategoryName(product.restaurantName);
    } else {
      setCategoryName(category?.categoryName);
    }
  }, [initialProductData]);

  useEffect(() => {
    if (!setFiltered) {
      setProductData(initialProductData);
    }
  }, [setFiltered, initialProductData]);

  useEffect(() => {
    handlePageChange(1);
  }, [slug]);

  return {
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
  };
};

export default useCategoryDetails;
