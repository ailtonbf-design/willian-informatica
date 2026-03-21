import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const slidesData = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034573/aluno-1_1_ljnomo.jpg',
    category: 'Design',
    title: 'Maria Silva',
    desc: 'Concluiu o curso de Design Gráfico com distinção e já atua no mercado criativo.',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-2_1_xa1jai.jpg',
    category: 'Marketing',
    title: 'João Pedro',
    desc: 'Especialista em Marketing Digital formado na William Informática.',
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-4_1_muhg80.jpg',
    category: 'Tecnologia',
    title: 'Ana Costa',
    desc: 'Desenvolvedora Web Front-end, agora a trabalhar numa grande agência de tecnologia.',
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-3_1_hkjn7j.jpg',
    category: 'Gestão',
    title: 'Carlos Santos',
    desc: 'Obteve a Certificação Premium em Gestão de Projetos e alavancou a sua carreira.',
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034573/aluno-1_1_ljnomo.jpg',
    category: 'Programação',
    title: 'Beatriz Lima',
    desc: 'Aluna destaque da turma de Programação Avançada, com projetos inovadores.',
  },
  {
    id: 6,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-2_1_xa1jai.jpg',
    category: 'Dados',
    title: 'Lucas Almeida',
    desc: 'Atua como Cientista de Dados após concluir a nossa formação intensiva.',
  },
  {
    id: 7,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-4_1_muhg80.jpg',
    category: 'UX/UI',
    title: 'Sofia Martins',
    desc: 'Criadora de interfaces premiadas, começou a sua jornada nos nossos laboratórios.',
  },
  {
    id: 8,
    image: 'https://res.cloudinary.com/dapsovbs5/image/upload/v1774034574/aluno-3_1_hkjn7j.jpg',
    category: 'Cloud',
    title: 'Pedro Rocha',
    desc: 'Arquiteto Cloud certificado, responsável por infraestruturas de grande escala.',
  }
];

export default function Carousel3D() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} className="flex justify-center items-center">
            <div className="w-full aspect-square max-w-64 sm:max-w-72 md:max-w-[300px] mx-auto bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]">
              <img
                src={slide.image}
                alt={slide.title}
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
