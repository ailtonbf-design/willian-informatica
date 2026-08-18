import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star, Quote, Award, Users, MessageSquare, ArrowRight, X } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface Testimonial {
  id: string;
  nome: string;
  curso: string;
  texto: string;
  vimeoId: string;
  avatarUrl?: string;
  thumbnailUrl?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 'default-1',
    nome: 'Ana Silva',
    curso: 'Informática & Marketing Digital',
    texto: 'O curso mudou completamente minha visão profissional. Hoje tenho minha própria agência de marketing e aplico tudo o que aprendi em sala de aula!',
    vimeoId: '1001248035', // Exemplo de ID do Vimeo
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
  },
  {
    id: 'default-2',
    nome: 'Carlos Santos',
    curso: 'Programação Web e Sistemas',
    texto: 'A didática dos professores é sensacional. Entrei sem saber nada de código e, antes mesmo de concluir meu curso, já fui contratado como programador júnior.',
    vimeoId: '952871143',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600'
  },
  {
    id: 'default-3',
    nome: 'Mariana Costa',
    curso: 'Aluno Empreendedor',
    texto: 'Participar do Aluno Empreendedor me deu as ferramentas ideais para planejar meu próprio negócio de assistência técnica. Hoje sou dona da minha própria loja!',
    vimeoId: '347119293',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'
  },
  {
    id: 'default-4',
    nome: 'Felipe Oliveira',
    curso: 'Certificado Premium Avançado',
    texto: 'O suporte individualizado e a credibilidade do certificado premium da William Informática foram essenciais para minha promoção na empresa onde trabalho.',
    vimeoId: '259228018',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600'
  }
];

export default function DepoimentosPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Escuta a coleção de depoimentos no Firestore
    const depoimentosRef = collection(db, 'depoimentos');
    const q = query(depoimentosRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          curso: doc.data().curso,
          texto: doc.data().texto,
          vimeoId: doc.data().vimeoId,
          avatarUrl: doc.data().avatarUrl,
          thumbnailUrl: doc.data().thumbnailUrl,
        })) as Testimonial[];
        setTestimonials(data);
      } else {
        setTestimonials(defaultTestimonials);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar depoimentos do Firestore:", error);
      setTestimonials(defaultTestimonials);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col selection:bg-brand-red selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="relative bg-slate-900 py-24 md:py-32 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600"
            alt="Alunos e histórias de sucesso"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/50" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-bold uppercase tracking-wider text-sm bg-red-500/10 px-4 py-2 rounded-full inline-block mb-4">
              Histórias de Sucesso
            </span>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Veja o depoimento de alunos que transformaram suas carreiras, aprenderam do zero absoluto, conquistaram vagas de emprego ou abriram seus próprios negócios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white border-b border-slate-100 shadow-sm relative z-10 -mt-10 max-w-6xl mx-auto w-full rounded-2xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-4 flex flex-col items-center">
            <div className="p-3 bg-red-50 rounded-xl mb-4 text-brand-red">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-1">38 Anos</h3>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">De Credibilidade</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="p-3 bg-red-50 rounded-xl mb-4 text-brand-red">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-1">+20 Mil</h3>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Alunos Formados</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="p-3 bg-red-50 rounded-xl mb-4 text-brand-red">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-1">100% Real</h3>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Depoimentos Verificados</p>
          </div>
        </div>
      </section>

      {/* GRID DE DEPOIMENTOS */}
      <section className="py-20 container mx-auto px-6 max-w-7xl flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium animate-pulse">Carregando depoimentos inspiradores...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Video Preview Card */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setActiveVideoId(t.vimeoId)}>
                  <img
                    src={t.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={`Depoimento de ${t.nome}`}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Decorative Play Button */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg group-hover:scale-110 group-hover:bg-red-700 transition-all duration-300">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Testimonial Quote Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <div className="relative mb-6">
                      <Quote className="absolute -top-4 -left-4 w-10 h-10 text-red-100 -z-0" />
                      <p className="text-slate-600 italic relative z-10 leading-relaxed text-base md:text-lg">
                        "{t.texto}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-6">
                    <img
                      src={t.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.nome)}&background=fca5a5&color=b91c1c&bold=true`}
                      alt={t.nome}
                      className="w-14 h-14 rounded-full object-cover border-2 border-red-500/10 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{t.nome}</h3>
                      <p className="text-sm font-semibold text-red-600">{t.curso}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-20 text-white border-t border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Quer fazer parte do nosso próximo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                grupo de vencedores?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Dê o primeiro passo para o seu futuro profissional de sucesso. Fale com um dos nossos consultores e encontre o treinamento ideal para você.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://wa.me/5517991879478?text=Ol%C3%A1%2C%20quero%20conhecer%20os%20cursos%20da%20William%20Inform%C3%A1tica%20e%20ser%20o%20pr%C3%B3ximo%20aluno%20de%20sucesso%21"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5"
              >
                Matricular-se Agora <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/cursos"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full border border-white/20 transition-all text-center text-lg hover:-translate-y-0.5"
              >
                Conhecer Cursos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeVideoId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setActiveVideoId(null)}></div>
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-950 w-full max-w-5xl rounded-3xl shadow-2xl border border-white/10 relative z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-slate-300 hover:text-white transition-colors"
                aria-label="Fechar vídeo"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Vimeo Iframe Container */}
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://player.vimeo.com/video/${activeVideoId}?autoplay=1&byline=0&portrait=0&title=0`}
                  title="Depoimento Aluno"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
