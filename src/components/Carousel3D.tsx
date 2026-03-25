import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const defaultSlides = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034573/aluno-1_1_ljnomo.jpg',
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-2_1_xa1jai.jpg',
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-4_1_muhg80.jpg',
  }
];

export default function Carousel3D() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [slides, setSlides] = useState<{id: string, url: string}[]>(defaultSlides);

  useEffect(() => {
    const docRef = doc(db, 'configuracoes', 'carrossel');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lista && data.lista.length > 0) {
          setSlides(data.lista);
        } else {
          setSlides(defaultSlides);
        }
      } else {
        setSlides(defaultSlides);
      }
    }, (error) => {
      console.error("Erro ao carregar fotos do carrossel:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-12 overflow-hidden">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        coverflowEffect={{
          rotate: 45,
          stretch: -20,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={setSwiperInstance}
        modules={[EffectCoverflow, Navigation, Autoplay]}
        className="w-full py-12 !overflow-visible"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="flex justify-center items-center">
            <div className="w-full aspect-square max-w-64 sm:max-w-72 md:max-w-[300px] mx-auto bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]">
              <img
                src={slide.url}
                alt="Aluno com certificado"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="mt-8 flex justify-center items-center gap-4 px-4">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="w-14 h-14 flex items-center justify-center rounded-full border border-brand-red text-brand-red hover:bg-brand-red/10 transition-all duration-300 focus:outline-none"
          aria-label="Slide anterior"
        >
          <ArrowLeft strokeWidth={1.5} className="w-6 h-6" />
        </button>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="w-14 h-14 flex items-center justify-center rounded-full border border-brand-red text-brand-red hover:bg-brand-red/10 transition-all duration-300 focus:outline-none"
          aria-label="Próximo slide"
        >
          <ArrowRight strokeWidth={1.5} className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
