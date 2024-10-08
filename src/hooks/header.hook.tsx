import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getConfig, getNavCategories } from "@/services/home.service";
import { getProfile } from "@/services/profile.service";
import { getSuggestionResults } from "@/services/search.service";
import { flushCart, getCartData } from "@/services/cart.service";
import { logout } from "@/services/auth.service";
import { deleteCookie, getCookie } from "cookies-next";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { setAuthorizationHeader } from "@/axios/axiosInstance";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { LocalKeys } from "@/shared/enum";
import { getWareId } from "@/shared/utils/local-storage-utils";
import { useDebounce } from "@/hooks/useDebounce.hooks";
import { useCart as useCartStore } from "@/store/cart";
import { useConfig as useConfigStores } from "@/store/config";
import { useWareHouse as useWareHouseStore } from "@/store/warehouse";
import { useProfile as useProfileStore } from "@/store/profile";
import { INavCategoryMain, IWareHouse } from "@/interface/home.interface";
import { IConfig } from "@/interface/config.interface";
import { ICartData } from "@/interface/cart.interface";
// import { ICartData, IWareHouse, IConfig, INavCategoryMain } from '@/interface'

export const useHeaderFunctions = () => {
  const router = useRouter();
  const { pathname } = router;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = getToken();
  const loggedIn = getCookie("isLoggedIn");
  const queryClient = useQueryClient();

  const { setConfigData, configData } = useConfigStores();
  const { coupon, setCoupon, setCouponData } = useCartStore();
  const { warehouseId, setWareHouseId } = useWareHouseStore();
  const { profileData, setProfileData } = useProfileStore();

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("product");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [logIn, setLogIn] = useState<boolean>(false);
  const [warehouseChange, setWarehouseChange] = useState<boolean>(false);
  const [warehouseName, setWarehouseName] = useState<string>("");
  const [showWarehouseAlertModal, setShowWarehouseAlertModal] =
    useState<boolean>(false);
  const debounceSearch = useDebounce(searchValue, 300);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const changeRoute = (route: string) => {
    router.push(route);
  };

  const { data: cart } = useQuery<any>(["getCart", logIn], () =>
    getCartData({ coupon })
  );
  const { data: config } = useQuery<IConfig>({
    queryKey: ["getConfig"],
    queryFn: getConfig,
  });

  const { data: navCategories } = useQuery<INavCategoryMain>({
    queryKey: ["getNavCategories"],
    queryFn: getNavCategories,
  });

  const { data: profile } = useQuery({
    queryKey: ["getProfile", token],
    queryFn: getProfile,
    enabled: !!token,
    onSuccess: (data) => {
      setProfileData(data?.data);
    },
    onError: async (error: any) => {
      const errors = error?.response?.data?.error;
      if (
        errors?.code === 401 &&
        errors?.detail === "Unauthenticated" &&
        errors?.title === "Unauthenticated"
      ) {
        deleteCookie("token");
        deleteCookie("isLoggedIn");
        deleteCookie("cart_number");
        deleteCookie("cart_id");
        queryClient.invalidateQueries(["getCart"]);
        queryClient.invalidateQueries(["getCartList"]);
        await setAuthorizationHeader();
        showToast(
          TOAST_TYPES.error,
          "Your session has expired. Please login again to continue."
        );
        router.push("/");
      }
    },
  });

  const warehouse = config?.data?.warehouses?.find(
    (item: IWareHouse) =>
      (item?.id).toString() === localStorage?.getItem(LocalKeys.WAREHOUSE_ID)!
  );

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      deleteCookie("token");
      deleteCookie("isLoggedIn");
      deleteCookie("cart_number");
      deleteCookie("cart_id");
      await setAuthorizationHeader();
      queryClient.invalidateQueries(["getCart"]);
      queryClient.invalidateQueries(["getCartList"]);
      showToast(TOAST_TYPES.success, "Logged out successfully");
      router.push("/");
      setShowModal(false);
    },
  });

  const logoutHandler = () => {
    logoutMutation.mutate();
    router.push("/");
  };

  const {
    data: suggestData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["suggest", selectedType || "", debounceSearch],
    () => getSuggestionResults(selectedType || "", searchValue || ""),
    {
      enabled: searchValue?.length > 0 ? true : false,
    }
  );

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleScroll = (event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    const scrolledToBottom = scrollHeight - scrollTop === clientHeight;

    if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
      handleLoadMore();
    }
  };

  const handleTypeChange = (text: string) => {
    setSelectedType(text);
  };

  const handleInputChange = (event: any) => {
    setDropdownOpen(true);
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    const query = {
      type: selectedType,
      keyword: searchValue,
    };
    setDropdownOpen(false);
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const triggerSearch = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const redirectDetailPage = (title: string) => {
    const query = {
      type: selectedType,
      keyword: title,
    };
    setSearchValue(title);
    setDropdownOpen(false);
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const { data: cartFlush } = useQuery<ICartData>(
    ["getCartFlush", warehouseChange],
    flushCart,
    {
      enabled: warehouseChange,
    }
  );

  const changeWarehouse = (warehouse: IWareHouse) => {
    const id: any = warehouse?.id;
    const name: string = warehouse?.name;
    setWareHouseId(id);
    setWarehouseName(name);
    if (cart && cart?.numberOfCartProducts > 0) {
      setShowWarehouseAlertModal(true);
    } else {
      setWarehouseChange(true);
      localStorage.setItem(LocalKeys.WAREHOUSE_ID, id);
      queryClient.invalidateQueries(["getCart"]);
      queryClient.invalidateQueries(["getCartList"]);
      queryClient.invalidateQueries(["getHomeData"]);
      queryClient.invalidateQueries(["getNavCategories"]);
      queryClient.invalidateQueries(["getCategoriesList"]);
      if (token) {
        queryClient.invalidateQueries(["wishlistProducts"]);
      }
      router.push("/");
    }
  };

  const handleWarehouseChange = () => {
    setWarehouseChange(true);
    setWareHouseId(warehouseId);
    setWarehouseName(warehouseName);
    localStorage.setItem(LocalKeys.WAREHOUSE_ID, warehouseId);
    setShowWarehouseAlertModal(false);
    queryClient.invalidateQueries(["getCart"]);
    queryClient.invalidateQueries(["getCartList"]);
    queryClient.invalidateQueries(["getHomeData"]);
    queryClient.invalidateQueries(["getNavCategories"]);
    queryClient.invalidateQueries(["getCategoriesList"]);
    if (token) {
      queryClient.invalidateQueries(["wishlistProducts"]);
    }
    router.push("/");
  };

  const handleWarehouseCancel = () => {
    const name: string | any = warehouse?.name;
    const id: string | any = getWareId();
    setWareHouseId(id);
    setWarehouseName(name);
    setShowWarehouseAlertModal(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedSuggestionIndex > 0) {
        setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (selectedSuggestionIndex < suggestData?.pages[0]?.data.length - 1) {
        setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
      }
    } else if (e.key === "Enter") {
      setSelectedSuggestionIndex(-1);
      if (selectedSuggestionIndex >= 0) {
        const selectedSuggestion =
          suggestData?.pages[0]?.data[selectedSuggestionIndex];
        redirectDetailPage(selectedSuggestion?.title);
      } else {
        triggerSearch(e);
      }
    }
  };

  useEffect(() => {
    if (config) {
      setConfigData(config);
    }
  }, [config]);

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchValue("");
    }
  }, [pathname]);

  useEffect(() => {
    if ((window && localStorage && localStorage.getItem("coupon")) || coupon) {
      setCoupon((localStorage.getItem("coupon") as string) || coupon);
    }
  }, [coupon]);

  useEffect(() => {
    if (loggedIn !== undefined) {
      setLogIn(true);
    } else {
      setLogIn(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (warehouse) {
      setWarehouseName(warehouse?.name);
    }
  }, [warehouse]);

  useEffect(() => {
    if (cart && cart?.numberOfCartProducts === 0 && warehouseChange) {
      setWarehouseChange(false);
      queryClient.invalidateQueries(["getCart"]);
      queryClient.invalidateQueries(["getCartList"]);
      queryClient.invalidateQueries(["getHomeData"]);
      queryClient.invalidateQueries(["getNavCategories"]);
      queryClient.invalidateQueries(["getCategoriesList"]);
      router?.push("/");
    }
  }, [cart, warehouseChange]);

  return {
    searchValue,
    setSearchValue,
    selectedType,
    setSelectedType,
    showModal,
    setShowModal,
    logIn,
    setLogIn,
    warehouseChange,
    setWarehouseChange,
    warehouseName,
    setWarehouseName,
    showWarehouseAlertModal,
    setShowWarehouseAlertModal,
    debounceSearch,
    dropdownOpen,
    setDropdownOpen,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    cart,
    config,
    navCategories,
    profile,
    warehouse,
    logoutMutation,
    logoutHandler,
    suggestData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    handleScroll,
    handleTypeChange,
    handleInputChange,
    handleSearch,
    triggerSearch,
    redirectDetailPage,
    cartFlush,
    changeWarehouse,
    handleWarehouseChange,
    handleWarehouseCancel,
    handleKeyPress,
    dropdownRef,
    token,
    loggedIn,
    changeRoute,
  };
};
