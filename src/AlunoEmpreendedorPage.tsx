import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, MessageCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function AlunoEmpreendedorPage() {
  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col justify-between selection:bg-brand-red selection:text-white">
      <Header />

      <main className="flex-grow flex items-center py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header Copy Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            {/* Tag Destaque */}
            <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red uppercase tracking-widest border border-brand-red/20">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              Oportunidade Exclusiva
            </span>

            {/* Headline Principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-3xl mx-auto">
              E se você pudesse estudar e, ao mesmo tempo, <span className="text-brand-red">criar sua própria fonte de renda?</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Conheça o <strong className="text-slate-900 font-semibold">Aluno Empreendedor</strong>, um projeto da William Informática que une formação profissional e oportunidade de geração de renda — sem depender de um emprego com carteira assinada.
            </p>
          </motion.div>

          {/* Video Section */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-12"
          >
            <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase text-center flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-brand-red fill-brand-red" />
              Assista ao vídeo e entenda como funciona o projeto em Bebedouro
            </p>
            
            {/* Video Wrapper (9:16 Vertical Responsive Smartphone Frame) */}
            <div className="relative w-full max-w-[320px] aspect-[9/16] mx-auto rounded-[36px] overflow-hidden bg-slate-950 border-[6px] border-slate-800 shadow-2xl shadow-slate-900/10 group">
              {/* Simulated smartphone notch */}
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 z-20 flex justify-center items-center">
                <div className="w-16 h-1.5 rounded-full bg-slate-900"></div>
              </div>

              {/* Video placeholder */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center" 
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(9, 13, 22, 0.95)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80')` 
                }}
              >
                <button 
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-brand-red text-white shadow-lg shadow-brand-red/50 group-hover:scale-110 group-hover:bg-brand-hoverRed transition-all duration-300 transform" 
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 ml-1 fill-white" />
                </button>
                <span className="mt-4 px-4 text-center text-[10px] tracking-widest text-slate-400 uppercase font-medium group-hover:text-slate-300 transition-colors">
                  Clique para assistir
                </span>
              </div>
            </div>
          </motion.div>

          {/* Informative Box / Destaque Sutil */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 max-w-2xl mx-auto shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-red" />
              Quer saber se você pode participar?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              O ingresso no <span className="text-slate-900 font-semibold">Aluno Empreendedor</span> é feito mediante uma conversa inicial para entender seu perfil e explicar como funciona o projeto.
            </p>
          </motion.div>

          {/* CTA Button & Footer Disclaimer */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center space-y-4"
          >
            <a 
              href="https://wa.me/5517991879478?text=Olá!%20Assisti%20ao%20vídeo%20do%20William%20e%20gostaria%20de%20saber%20se%20posso%20participar%20do%20projeto%20Aluno%20Empreendedor" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full text-base sm:text-lg font-bold text-white bg-brand-red hover:bg-brand-hoverRed active:scale-98 transition-all duration-300 shadow-xl shadow-brand-red/20 w-full sm:w-auto hover:shadow-2xl hover:shadow-brand-red/30 animate-pulse"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              QUERO SABER SE POSSO PARTICIPAR
            </a>
            
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Vagas limitadas. A participação está sujeita à análise de perfil e disponibilidade.
            </p>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
