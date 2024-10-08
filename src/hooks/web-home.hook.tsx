import { useQuery } from "@tanstack/react-query";
import {
  getBannerPopup,
  getCategoriesList,
  getHomeData,
} from "@/services/home.service";
// import { IHome, IAdBanner, IAppCategories } from "@/interface/home.interface";

export function useHomeData() {
  const {
    data: home,
    isInitialLoading: homeLoading,
    isInitialLoading,
  } = useQuery<any>({
    queryKey: ["getHomeData"],
    queryFn: getHomeData,
  });

  const { data: categories, isInitialLoading: loadingCategories } = useQuery({
    queryKey: ["getCategoriesList"],
    queryFn: getCategoriesList,
  });

  const { data: bannerPopupData, isLoading: bannerPopupLoading } = useQuery(
    ["getBannerPopup"],
    getBannerPopup
  );

  return {
    home,
    homeLoading,
    categories,
    loadingCategories,
    bannerPopupData,
    bannerPopupLoading,
    isInitialLoading,
  };
}
