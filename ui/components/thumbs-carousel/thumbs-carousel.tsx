"use client";

import { useState } from "react";

import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";
import Swiper, { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper as SwiperCarousel, SwiperSlide } from "swiper/react";

export const ThumbsCarousel = ({
  images = [],
}: {
  images?: Array<{ url: string; id: string | number }>;
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper>();
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  if (!images?.length) return null;

  return (
    <Box position="relative" rounded={2} border p={2}>
      <SwiperCarousel
        spaceBetween={10}
        pagination={false}
        navigation={{ prevEl, nextEl }}
        modules={[FreeMode, Navigation, Thumbs]}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
      >
        {images?.map(({ url, id }) => (
          <SwiperSlide key={id}>
            <Box
              mb={5}
              style={{
                backgroundImage: `url(${url})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                height: 400,
              }}
            ></Box>
          </SwiperSlide>
        ))}
      </SwiperCarousel>

      <Box
        position="absolute"
        style={{ top: 0, left: 0, zIndex: 1 }}
        h={100}
        w={100}
      >
        <Box>
          <Button
            variant="primary"
            rounded="circle"
            ref={(node: any) => setPrevEl(node)}
            p={1}
            style={{ position: "absolute", top: "45%", left: "1rem" }}
          >
            <Box d="flex">
              <MaterialIcon color="white" icon="chevron_left" />
            </Box>
          </Button>
          <Button
            variant="primary"
            rounded="circle"
            ref={(node: any) => setNextEl(node)}
            p={1}
            style={{ position: "absolute", top: "45%", right: "1rem" }}
          >
            <Box d="flex">
              <MaterialIcon color="white" icon="chevron_right" />
            </Box>
          </Button>
        </Box>
      </Box>

      <SwiperCarousel
        freeMode
        threshold={2}
        spaceBetween={10}
        slidesPerView={5}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {images?.map(({ url, id }) => (
          <SwiperSlide key={id}>
            <Box
              rounded={2}
              style={{
                backgroundImage: `url(${url})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: 120,
              }}
            />
          </SwiperSlide>
        ))}
      </SwiperCarousel>
    </Box>
  );
};

export default ThumbsCarousel;
