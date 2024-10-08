import { Open_Sans } from 'next/font/google';
import React, { useCallback, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Grid } from 'swiper'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import LatestBlogCard from './latest-blog-card';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/services/blog.service';
import { IBlog } from '@/interface/blog.interface';

const openSans = Open_Sans({ subsets: ["latin"] });

const LatestBlogs = () => {
    const { data: blogs } = useQuery<IBlog>(['getBlogs'], getBlogs)
    const [swiperRef, setSwiperRef] = useState<SwiperClass>();
    const [nextDisable, setNextDisable] = useState<boolean>(false)
    const [prevDisable, setPrevDisable] = useState<boolean>(false)

    //handling prev and next of swiper category
    const handlePrevious = useCallback(() => {
        setNextDisable(false)
        if (swiperRef) {
            swiperRef?.slidePrev();
        }
    }, [swiperRef]);

    const handleNext = useCallback(() => {
        setPrevDisable(false)
        if (swiperRef) {
            swiperRef?.slideNext();
        }
    }, [swiperRef]);

    return (
        <>
            <div className='flex items-center justify-between mb-[30px]'>
                <div className='md:text-center md:flex-grow'>
                    <h2 className={`${openSans.className} mb-3.5 text-2xl font-semibold capitalize text-slate-850 md:text-center`}>Latest Blogs</h2>
                    <p className='text-gray-450 text-sm font-normal leading-[18px] mt-[10px]'>Get an inside look at our stories, inspirations, and ideas</p>
                </div>
                {
                    blogs?.data?.length! > 0 && (
                        <div className='!static productSwiper-navigation '>
                            <button
                                disabled={prevDisable}
                                onClick={handlePrevious}
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                disabled={nextDisable}
                                onClick={handleNext}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )
                }
            </div>
            <Swiper
                slidesPerView={3}
                grid={{
                    rows: 1,
                    fill: "row",
                }}
                pagination={false}
                spaceBetween={20}
                modules={[Grid]}
                className="productSwiper"
                onSwiper={setSwiperRef}
                onBeforeInit={() => setPrevDisable(true)}
                onReachBeginning={() => setPrevDisable(true)}
                onReachEnd={() => setNextDisable(true)}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        grid: {
                            rows: 1,
                            fill: "row"
                        },
                        on: {
                            beforeInit: () => {
                                setPrevDisable(true);
                            },
                            reachBeginning: () => {
                                setPrevDisable(true);
                            },
                            reachEnd: () => {
                                setNextDisable(true);
                            }
                        }
                    },
                    768: {
                        slidesPerView: 2,
                        grid: {
                            rows: 1,
                            fill: "row"
                        },
                        spaceBetween: 20,
                        on: {
                            beforeInit: () => {
                                setPrevDisable(true);
                            },
                            reachBeginning: () => {
                                setPrevDisable(true);
                            },
                            reachEnd: () => {
                                setNextDisable(true);
                            }
                        }
                    },
                    1050: {
                        slidesPerView: 3,
                        grid: {
                            rows: 1,
                            fill: "row"
                        },
                        spaceBetween: 20,
                        on: {
                            beforeInit: () => {
                                setPrevDisable(true);
                            },
                            reachBeginning: () => {
                                setPrevDisable(true);
                            },
                            reachEnd: () => {
                                setNextDisable(true);
                            }
                        }
                    }
                }}
            >
                {blogs?.data?.map((blog, index: number) => (
                    <SwiperSlide key={`app-categories-${index}`}>
                        <LatestBlogCard blog={blog} />
                    </SwiperSlide>
                ))}
            </Swiper >
        </>
    )
}

export default LatestBlogs