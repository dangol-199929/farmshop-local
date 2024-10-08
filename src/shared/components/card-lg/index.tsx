import React from "react";
import { Props } from "./card-lg.props";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchIcon from "@/shared/icons/common/SearchIcon";
import TrashIcon from "@/shared/icons/common/TrashIcon";
import { useConfig as useConfigStores } from "@/store/config";
import CustomImage from "@/features/custom-image";

const CardLg: React.FC<Props> = ({
  type,
  title,
  price,
  image,
  link,
  availability,
  desc,
}) => {
  const [value, setValue] = useState<number>(1);
  const [addItem, setAddItem] = useState<boolean>(false);
  const { configData } = useConfigStores();
  const addItemNum = (value: number) => {
    const addedItem = value + 1;
    setValue(addedItem);
  };
  const subItemNum = (value: number) => {
    if (value === 1) {
      setAddItem(false);
    } else {
      const subItem = value - 1;
      setValue(subItem);
    }
  };
  return (
    <div className="relative card plant-card ">
      <Link
        href={link}
        className="absolute top-0 bottom-0 left-0 right-0 z-[1]"
        aria-label={`blog-custom-${title}`}
      />
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-4">
          <div className="w-full md:max-w-[259px] relative">
            <Link href={link} aria-label={`blog-${link}-0`}>
              <figure>
                <CustomImage
                  src={image}
                  alt="Plant"
                  className="w-full h-auto"
                  width={100}
                  height={0}
                />
              </figure>
            </Link>
            <div className="plant-card_preview-icon">
              <Link
                href={link}
                className="flex items-center justify-center"
                aria-label={`1-${title}-search`}
              >
                <SearchIcon className="max-w-[15px] h-auto" />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="card-body px-[15px] py-[20px] gap-[10px]">
            <p className="text-xs uppercase text-gray-450">{type}</p>
            <h2 className="text-base card-title plant-card-title">{title}</h2>
            <p className="text-base font-semibold text-primary">
              {configData?.data?.currency} {price}
            </p>
            <div className="my-[30px]">
              <p className="desc">{desc}</p>
              <Link
                href={link}
                className="text-slate-850 font-bold text-sm leading-[1] transition-all delay-100 duration-150 hover:text-primary z-[1] relative"
                aria-label={`reac-more`}
              >
                Read More
              </Link>
            </div>
            <p className="text-sm text-gray-650 leading-[1] mb-[30px]">
              Availability:{" "}
              <span className="font-bold text-primary">{availability}</span>
            </p>

            <div className="flex justify-start relative z-[3]">
              {!addItem && (
                <button
                  className="btn btn-primary btn-outline p-2 h-auto !min-h-0 text-xs leading-auto"
                  onClick={() => setAddItem(true)}
                >
                  Add to Cart
                </button>
              )}
              {addItem && (
                <div className="flex items-center gap-3 px-3 border rounded rounded-lg border-primary">
                  <button
                    className="text-primary py-1 text-sm w-[14px]"
                    onClick={() => subItemNum(value)}
                  >
                    {value === 1 ? (
                      <TrashIcon className="max-w-[14px] h-auto" />
                    ) : (
                      "-"
                    )}
                  </button>
                  <input
                    title="Quantity"
                    type="text"
                    className="text-center max-w-[35px] h-full font-bold text-sm border-0 focus:outline-0 text-primary"
                    value={value}
                    readOnly
                    maxLength={3}
                  />
                  <button
                    className="text-primary py-1 w-[14px]"
                    onClick={() => addItemNum(value)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* <div className='plant-card_cartBtn'>
                <Link href={'/'} className='font-bold underline uppercase bg-white text-slate-850 underline-offset-4 hover:textprimary'>Add to Cart</Link>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default CardLg;
