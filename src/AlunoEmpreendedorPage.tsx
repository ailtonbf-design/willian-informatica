import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, MessageCircle, Sparkles, ShieldCheck, Award, Users, MapPin, ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function AlunoEmpreendedorPage() {
  return (
    <div className="font-sans text-slate-100 bg-[#0B1120] min-h-screen flex flex-col justify-between selection:bg-brand-red selection:text-white relative overflow-hidden">
      
      {/* Ambient background glow & grid overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-brand-red/20 via-brand-red/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10" />

      {/* Header Oficial */}
      <Header />

      <main className="flex-grow py-12 md:py-20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header Copy Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            {/* Tag Destaque com efeito Glassmorphism */}
            <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 text-red-400 uppercase tracking-widest border border-red-500/30 shadow-lg shadow-red-950/40 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Projeto Exclusivo em Bebedouro</span>
            </div>

            {/* Headline Principal de Alto Impacto */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight max-w-3xl mx-auto">
              E se você pudesse estudar e, ao mesmo tempo,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-sm">
                criar sua própria fonte de renda?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Conheça o <strong className="text-white font-bold underline decoration-brand-red decoration-2 underline-offset-4">Aluno Empreendedor</strong>, um projeto da <strong className="text-white font-semibold">William Informática</strong> que une formação profissional e oportunidade de geração de renda — sem depender de um emprego com carteira assinada.
            </p>
          </motion.div>

          {/* Video Section com Smartphone Frame Premium */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-14"
          >
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <Play className="w-4 h-4 text-brand-red fill-brand-red" />
              <span>Assista ao vídeo e entenda como funciona o projeto em Bebedouro</span>
            </div>
            
            {/* Video Wrapper (9:16 Smartphone Frame com Glow) */}
            <div className="relative w-full max-w-[330px] aspect-[9/16] mx-auto rounded-[40px] overflow-hidden bg-slate-950 border-[7px] border-slate-800 shadow-[0_0_50px_-10px_rgba(227,0,15,0.3)] group transition-transform duration-300 hover:scale-[1.01]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-slate-900/90 z-20 flex justify-center items-center backdrop-blur-sm">
                <div className="w-20 h-2.5 rounded-full bg-slate-950 flex items-center justify-end px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Video placeholder com Capa & Play Button */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center" 
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, rgba(11, 17, 32, 0.5), rgba(11, 17, 32, 0.95)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80')` 
                }}
              >
                {/* Botão de Play com Animação */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 rounded-full bg-brand-red/30 animate-ping" />
                  <button 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-brand-red to-rose-600 text-white shadow-2xl shadow-brand-red/60 group-hover:scale-110 group-hover:brightness-110 transition-all duration-300 transform" 
                    aria-label="Assistir vídeo"
                  >
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 ml-1 fill-white" />
                  </button>
                </div>
                
                <span className="mt-5 px-4 text-center text-xs tracking-widest text-slate-300 uppercase font-semibold group-hover:text-white transition-colors bg-slate-950/60 py-1.5 px-3 rounded-full border border-white/10 backdrop-blur-sm">
                  Toque para assistir
                </span>
              </div>
            </div>
          </motion.div>

          {/* Box de Destaque com Visual Forte e Constraste */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-9 text-center space-y-6 max-w-2xl mx-auto shadow-2xl shadow-slate-950 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Linha vermelha no topo do card */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 text-brand-red mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quer saber se você pode participar?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              O ingresso no <span className="text-white font-bold">Aluno Empreendedor</span> é feito mediante uma conversa inicial para entender seu perfil e explicar como funciona o projeto.
            </p>

            {/* Benefícios rápidos em pílulas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300 text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sem taxa de inscrição</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Capacitação prática</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Presencial em Bebedouro</span>
              </div>
            </div>
          </motion.div>

          {/* Botão de WhatsApp de Alta Conversão */}
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
              className="group inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 rounded-2xl text-lg sm:text-xl font-black text-white bg-gradient-to-r from-red-600 via-brand-red to-red-700 hover:from-red-500 hover:to-rose-600 active:scale-98 transition-all duration-300 shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 w-full sm:w-auto hover:scale-105"
            >
              <MessageCircle className="w-7 h-7 fill-white group-hover:rotate-12 transition-transform duration-300" />
              <span>QUERO SABER SE POSSO PARTICIPAR</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline-block" />
            </a>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Vagas limitadas. A participação está sujeita à análise de perfil e disponibilidade.</span>
            </div>
          </motion.div>

          {/* Faixa de Autoridade / Selo de Confiança */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 pt-10 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 text-center text-slate-400 text-xs sm:text-sm font-semibold"
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-red" />
              <span>38 Anos de Tradição</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-red" />
              <span>+20.000 Alunos Formados</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-red" />
              <span>Metodologia Comprovada</span>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer Oficial do Site */}
      <Footer />
    </div>
  );
}
