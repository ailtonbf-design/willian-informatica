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
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-12 overflow-hidden">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
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
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[EffectCoverflow, Navigation, Autoplay]}
        className="w-full py-12 !overflow-visible"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} style={{ width: '300px', height: '300px' }}>
            <div className="w-full h-full bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]">
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

      {/* Dynamic Text & Custom Navigation */}
      <div className="mt-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start px-4">
        {/* Navigation */}
        <div className="flex flex-col items-center shrink-0 w-full md:w-auto md:pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="w-14 h-14 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none"
              aria-label="Slide anterior"
            >
              <ArrowLeft strokeWidth={1.5} className="w-6 h-6" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="w-14 h-14 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none"
              aria-label="Próximo slide"
            >
              <ArrowRight strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </div>
          <span className="text-slate-500 text-sm mt-4 font-medium">
            {activeIndex + 1}/{slidesData.length}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left transition-all duration-300">
          <div className="text-sm font-bold text-slate-900 mb-3">
            {slidesData[activeIndex].category}
          </div>
          <h3 className="text-3xl md:text-4xl font-light text-slate-900 mb-4 leading-tight">
            {slidesData[activeIndex].title}
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            {slidesData[activeIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}
