import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, MessageCircle, Sparkles, ShieldCheck, Award, Users, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function CarreiraPage() {
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
              <span>Carreira & Qualificação Profissional</span>
            </div>

            {/* Headline Principal de Alto Impacto */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight max-w-3xl mx-auto">
              Quer se destacar no mercado de trabalho e{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-sm">
                conquistar as melhores oportunidades?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Conheça nossos cursos profissionalizantes com <strong className="text-white font-bold underline decoration-brand-red decoration-2 underline-offset-4">foco prático, suporte de empregabilidade e certificação reconhecida</strong> para acelerar a sua carreira.
            </p>
          </motion.div>

          {/* Video Section com Smartphone Frame Premium */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-14"
          >
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-semibold tracking-wider uppercase text-center px-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <Play className="w-4 h-4 text-brand-red fill-brand-red shrink-0" />
              <span>Assista a este vídeo e descubra como a nossa formação prepara você para os desafios da era digital.</span>
            </div>
            
            {/* Video Wrapper */}
            <div className="relative w-full max-w-[340px] aspect-[9/16] mx-auto rounded-[32px] overflow-hidden shadow-[0_0_50px_-10px_rgba(227,0,15,0.3)] border-[8px] border-slate-900 bg-slate-950">
              <div className="absolute inset-0 w-full h-full">
                <iframe src="https://player.mediadelivery.net/embed/740813/8f2d1fb4-69d1-4fe4-b00e-bcb1345585a8?autoplay=false&loop=false&muted=true&preload=true&responsive=true" loading="lazy" className="w-full h-full object-cover" style={{ border: 0 }} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowFullScreen={true}></iframe>
              </div>
            </div>
          </motion.div>

          {/* Box de Destaque com Tarja Vermelha Lateral */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-y border-r border-slate-800 border-l-[6px] border-l-brand-red rounded-3xl p-6 sm:p-9 text-center space-y-6 max-w-2xl mx-auto shadow-2xl shadow-slate-950 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 text-brand-red mb-1">
              <Briefcase className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Você passaria hoje em uma entrevista de emprego?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              Faça gratuitamente o nosso Diagnóstico de Empregabilidade e descubra o seu nível de preparação para enfrentar uma entrevista e disputar uma vaga no mercado de trabalho.
            </p>

            {/* Benefícios rápidos em pílulas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300 text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Perguntas reais de entrevista</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Análise do seu currículo</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Seu índice de preparação</span>
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
              href="https://wa.me/5517991879478?text=Olá!%20Assisti%20ao%20vídeo%20do%20William%20e%20gostaria%20de%20agendar%20meu%20diagnóstico%20de%20empregabilidade." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 rounded-2xl text-lg sm:text-xl font-black text-white bg-gradient-to-r from-red-600 via-brand-red to-red-700 hover:from-red-500 hover:to-rose-600 active:scale-98 transition-all duration-300 shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 w-full sm:w-auto hover:scale-105"
            >
              <MessageCircle className="w-7 h-7 fill-white group-hover:rotate-12 transition-transform duration-300" />
              <span>QUERO DESCOBRIR MEU ÍNDICE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline-block" />
            </a>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Diagnóstico presencial e gratuito. Vagas limitadas mediante agendamento.</span>
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
              <span>38 Anos de Credibilidade</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-red" />
              <span>Suporte de Empregabilidade Ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-red" />
              <span>Mais de 70 Opções de Cursos</span>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer Oficial do Site */}
      <Footer />
    </div>
  );
}
