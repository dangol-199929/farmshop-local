import { Search } from "lucide-react";
import React from "react";

import CustomImage from "@/features/custom-image";
import { useHeaderFunctions } from "@/hooks/header.hook";
import { Button } from "@/shared/components/ui/button";

function SearchBar() {
  const {
    searchValue,
    selectedType,
    handleInputChange,
    handleKeyPress,
    handleTypeChange,
    dropdownOpen,
    suggestData,
    selectedSuggestionIndex,
    handleScroll,
    redirectDetailPage,
    dropdownRef,
    handleSearch,
  } = useHeaderFunctions();

  return (
    <>
      <div className=" grow relative">
        <input
          type="text"
          placeholder="Search Product Here"
          className="bg-transparent !outline-none focus:outline-none grow w-full focus:border-[1px] focus:border-primary bg-[#F9F9FA] border border-[#EDEDED] rounded-2xl h-[48px] ps-4 pe-10 transition-all duration-300"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <Button
          variant="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:text-primary"
          onClick={handleSearch}
        >
          <Search className=" w-5 h-5" />
        </Button>

        {dropdownOpen &&
          searchValue.length > 0 &&
          suggestData?.pages[0]?.data.length > 0 && (
            <div ref={dropdownRef}>
              <ul
                className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded top-full max-h-[335px] overflow-y-auto"
                onScroll={handleScroll}
              >
                {suggestData &&
                  suggestData.pages?.map((group: any, index: number) => (
                    <React.Fragment key={index}>
                      {group?.data?.map((prev: any, _i: number) => (
                        <li
                          key={_i}
                          className={`p-2 cursor-pointer text-sm hover:bg-gray-100 ${
                            _i === selectedSuggestionIndex ? "bg-gray-1500" : ""
                          }`}
                        >
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => redirectDetailPage(prev?.title)}
                          >
                            <CustomImage
                              src={prev?.image}
                              width={30}
                              height={20}
                              alt={`image-${_i}`}
                              className="object-contain aspect-square"
                            />
                            <span className="ps-2">{prev.title}</span>
                          </div>
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
              </ul>
            </div>
          )}
      </div>
    </>
  );
}

export default SearchBar;
