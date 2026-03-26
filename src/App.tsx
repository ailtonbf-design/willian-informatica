import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { BookOpen, Rocket, ArrowRight, CheckCircle2, Users, Award, Clock, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Code, Briefcase, Palette, Star, Target, Menu, X } from 'lucide-react';
import Carousel3D from './components/Carousel3D';
import { AdminPanel } from './components/AdminPanel';
import { db } from './firebase';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

function CountUpAnimation({
  value,
  prefix = "",
  suffix = "",
  duration = 2
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = `${prefix}${Math.floor(latest).toLocaleString('pt-BR')}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, duration, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function App() {
  const [modalAtivo, setModalAtivo] = useState<'carreira' | 'negocio' | 'vagas' | null>(null);
  
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadCategory, setLeadCategory] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadsRef = collection(db, 'leads');
      await addDoc(leadsRef, {
        nome: leadName,
        whatsapp: leadWhatsapp,
        categoria: leadCategory,
        status: 'Novo',
        createdAt: serverTimestamp()
      });
      alert(`Sucesso! Seus dados foram enviados. Entraremos em contato em breve.`);
      setIsLeadModalOpen(false);
      setLeadName('');
      setLeadWhatsapp('');
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      alert("Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.");
    }
  };

  const cursosCarreira = [
    { nome: 'Operador de Tecnologia', imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&h=150&fit=crop' },
    { nome: 'Excel Avançado', imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop' },
    { nome: 'Power BI', imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop' },
    { nome: 'Marketing Digital', imagem: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=150&h=150&fit=crop' },
    { nome: 'Assistente de Recursos Humanos', imagem: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=150&h=150&fit=crop' },
    { nome: 'Departamento Pessoal', imagem: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop' },
    { nome: 'Rotinas Administrativas', imagem: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&h=150&fit=crop' },
    { nome: 'Assistente Contábil', imagem: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop' },
    { nome: 'Design Gráfico', imagem: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=150&h=150&fit=crop' },
    { nome: 'Edição de Vídeos', imagem: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=150&h=150&fit=crop' },
    { nome: 'Games', imagem: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=150&h=150&fit=crop' },
    { nome: 'Web Design', imagem: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150&h=150&fit=crop' },
    { nome: 'Programação', imagem: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop' },
    { nome: 'Evolução Pessoal e Profissional', imagem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop' }
  ];

  const cursosNegocio = [
    { nome: 'Vendas', imagem: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop' },
    { nome: 'Oratória', imagem: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&h=150&fit=crop' },
    { nome: 'Liderança', imagem: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop' },
    { nome: 'Controle de Tempo', imagem: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150&h=150&fit=crop' },
    { nome: 'Controle Financeiro Pessoal', imagem: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150&h=150&fit=crop' },
    { nome: 'Trabalho em Equipe', imagem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop' },
    { nome: 'Inteligência Artificial', imagem: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop' },
    { nome: 'Gestão de Pessoas', imagem: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&h=150&fit=crop' }
  ];

  const [cursoDestaque, setCursoDestaque] = useState({
    titulo: "Auxiliar Administrativo",
    descricao: "Domine as rotinas do escritório e seja o profissional que as empresas procuram.",
    imagemUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80"
  });

  const [vagasList, setVagasList] = useState<{ id: string; titulo: string; descricao: string; }[]>([]);

  useEffect(() => {
    const docRef = doc(db, 'configuracoes', 'cursoDestaque');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCursoDestaque(prev => ({
          titulo: data.titulo || prev.titulo,
          descricao: data.descricao || prev.descricao,
          imagemUrl: data.imagemUrl || prev.imagemUrl
        }));
      }
    });

    const vagasRef = doc(db, 'configuracoes', 'vagas');
    const unsubscribeVagas = onSnapshot(vagasRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lista) {
          setVagasList(data.lista);
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeVagas();
    };
  }, []);

  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname === '/admin';

  if (isAdminRoute) {
    return <AdminPanel />;
  }

  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-brand-red selection:text-white">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-28 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774207958/WhatsApp_Image_2026-03-21_at_19.02.03_1_ohotur.jpg" 
              alt="William Informática" 
              className="h-[58px] md:h-[90px] w-auto object-contain mix-blend-multiply" 
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#cursos" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Cursos</a>
            <a href="#aluno-empreendedor" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Aluno Empreendedor</a>
            <a href="#vagas" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Vagas de Emprego</a>
            <a href="#quem-somos" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Quem Somos</a>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 hidden md:block transition-colors">
              Matricule-se
            </button>
            <button className="md:hidden p-2 text-slate-700 hover:text-red-600 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] md:min-h-[75vh] lg:min-h-[85vh] flex flex-col bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774045137/Design_sem_nome_wb65oe.webp"
            alt="Alunos e profissionais em ambiente premium"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 flex-1 flex flex-col justify-center items-start pt-32 md:pt-40 pb-48 md:pb-56">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-full md:max-w-4xl lg:max-w-5xl text-left md:pl-12 lg:pl-20"
          >
            <motion.h1 variants={fadeInUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              <span className="block">Onde você aprende</span>
              <span className="block text-brand-red">e aprende a empreender.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
              Formação profissional de excelência para quem busca destaque no mercado de trabalho ou quer escalar o seu próprio negócio.
            </motion.p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[120px]">
            <path fill="#f8fafc" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* FLOATING CARDS (Autosegmentação) */}
      <section className="relative z-20 container mx-auto px-6 -mt-32 md:-mt-40 mb-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-2xl shadow-slate-900/10 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group"
          >
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors duration-300">
              <BookOpen className="w-7 h-7 text-brand-red group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Para minha Carreira</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Quero qualificar-me para o mercado de trabalho com cursos práticos e atualizados.
            </p>
            <button 
              onClick={() => setModalAtivo('carreira')}
              className="inline-flex items-center font-semibold text-brand-red group-hover:text-brand-red-hover transition-colors"
            >
              Ver Cursos <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-2xl shadow-slate-900/10 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
              <Rocket className="w-7 h-7 text-slate-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Para meu Negócio</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Quero escalar as vendas da minha empresa com estratégias validadas de mercado.
            </p>
            <button 
              onClick={() => setModalAtivo('negocio')}
              className="inline-flex items-center font-semibold text-slate-900 group-hover:text-brand-red transition-colors"
            >
              WP Escola de Vendas & Negócios <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* DESTAQUE DA SEMANA (Offer Banner) */}
      <section className="bg-red-800 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
              <h2 className="text-4xl font-bold text-white mb-10">
                Curso destaque da semana
              </h2>
              
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 mt-4 shadow-2xl w-full">
                
                {/* O Selo Flutuante (Floating Badge) */}
                <div className="absolute -top-6 right-6 md:-top-8 md:right-8 bg-white px-4 py-2 md:py-3 rounded-2xl shadow-xl border border-white/40">
                  <img 
                    src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774029343/logop_btmd14.png" 
                    alt="Certificado Premium" 
                    className="h-8 md:h-10 w-auto object-contain" 
                  />
                </div>

                {/* O Conteúdo do Curso */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-4 md:pt-0 text-center md:text-left">
                  {/* Imagem do Curso */}
                  <img 
                    src={cursoDestaque.imagemUrl}
                    alt={`Curso ${cursoDestaque.titulo}`}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border border-white/10 flex-shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Textos do Curso */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{cursoDestaque.titulo}</h3>
                    <p className="text-red-50 leading-relaxed text-sm md:text-base">
                      {cursoDestaque.descricao}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="mb-6 md:mb-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="mb-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full shadow-sm">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold tracking-wide uppercase text-sm">Diagnóstico Profissional</span>
                </div>
                <h2 className="text-xl md:text-2xl text-white font-medium leading-snug">
                  Quero <span className="text-yellow-400 font-bold">50% de desconto</span> nesse curso com <span className="text-yellow-400 font-bold">Certificação Premium</span> e ainda garantir o meu <span className="text-yellow-400 font-bold">Diagnóstico de Perfil Profissional 100% grátis</span>
                </h2>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20">
                <form className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="text"
                      placeholder="Seu Nome"
                      className="w-full flex-1 min-w-0 bg-white rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                    <input
                      type="tel"
                      placeholder="Seu WhatsApp"
                      className="w-full flex-1 min-w-0 bg-white rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full bg-slate-900 text-white font-bold px-6 py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 text-sm md:text-base whitespace-normal md:whitespace-nowrap text-center"
                  >
                    Garantir Desconto + Diagnóstico
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ESCOLHA SUA ÁREA (Aluno) */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          {/* Vagas de Emprego Atualizadas - Promessa + Bônus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-stretch mb-16 max-w-6xl mx-auto"
          >
            {/* Lado Esquerdo (A Promessa de Empregabilidade) */}
            <div className="w-full md:w-3/5 flex flex-col justify-center items-start text-left">
              <h3 className="text-3xl font-bold text-slate-900">Vagas de Emprego</h3>
              <p className="text-gray-600 text-lg mt-4 mb-8">
                Cadastre-se e receba 02 treinamentos - 100% grátis, que podem garantir sua vaga no mercado de trabalho!
              </p>
              <button 
                onClick={() => setModalAtivo('vagas')}
                className="bg-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-slate-800 transition"
              >
                Ver vagas de emprego
              </button>
            </div>

            {/* Lado Direito (O Bônus de Matrícula) */}
            <div className="w-full md:w-2/5 bg-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-inner flex flex-col justify-center">
              <h3 className="text-white text-xl font-bold mb-4">Treinamentos Grátis</h3>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span><span className="font-bold">Empregabilidade</span> - Como aumentar em 50x suas chances de conseguir um trabalho</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span><span className="font-bold">Currículo Profissional</span> - Técnicas para elaboração de currículos</span>
                </li>
              </ul>
              <button 
                onClick={() => { setLeadCategory('Treinamento Grátis'); setIsLeadModalOpen(true); }}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-900/20"
              >
                Quero me cadastrar
              </button>
            </div>
          </motion.div>

          {/* Novo Banner Aluno Empreendedor */}
          <div className="flex flex-col md:flex-row bg-gray-200 rounded-3xl overflow-hidden shadow-lg border border-gray-200 mt-16 max-w-6xl mx-auto">
            {/* Lado Esquerdo (Sólido - Textos e Botão) */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gray-200 relative z-10">
              <h3 className="text-slate-900 font-bold text-3xl md:text-4xl">Aluno Empreendedor</h3>
              <p className="text-gray-600 mt-4">Um diferencial exclusivo para nossos alunos. Aqui você não apenas aprende... você aprende a empreender. Saiba como participar e ter acesso ao programa, desenvolvendo habilidades que vão além da sala de aula.</p>
              <button 
                onClick={() => { setLeadCategory('Aluno Empreendedor'); setIsLeadModalOpen(true); }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 font-bold w-fit mt-8 transition-colors"
              >
                Quero me inscrever
              </button>
            </div>
            
            {/* Lado Direito (A Imagem com o Fade Restrito) */}
            <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774310749/teste_1_w0k9op.webp" 
                alt="Aluno Empreendedor" 
                className="absolute inset-0 w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0 left-0 w-full h-24 md:h-full md:w-40 bg-gradient-to-b md:bg-gradient-to-r from-gray-200 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* WP ESCOLA DE VENDAS & NEGÓCIOS (Empresário) */}
      <section className="relative bg-slate-900 pt-32 pb-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774023454/Banner-Willian_vusp0w.webp"
            alt="Banner WP Escola de Vendas & Negócios"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/70" />
        </div>

        {/* Top Wave Divider for Dark Section */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[120px]">
            <path fill="#f8fafc" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              WP Escola de Vendas <br className="hidden md:block" /> & Negócios
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              <span className="font-bold text-white">Empresário ou Profissional Liberal</span><br />
              Aprenda como escalar suas Vendas com previsibilidade e LUCRO.<br /><br />
              <span className="text-white font-medium">Cadastre-se e receba gratuitamente os 7 passos para escalar suas Vendas</span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => { setLeadCategory('WP Escola de Negócios'); setIsLeadModalOpen(true); }}
              className="bg-brand-red hover:bg-brand-red-hover text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Quero me cadastrar
            </motion.button>
          </div>
        </div>
      </section>

      {/* AUTORIDADE E CERTIFICAÇÃO */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Coluna da Esquerda (Texto) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-8 text-left">
                <span className="inline-block text-brand-red font-bold uppercase tracking-wider text-sm mb-3">
                  VAGAS LIBERADAS
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Formação Profissional com Certificação Premium
                </h2>
              </div>
              
              <div className="bg-white shadow-xl border border-slate-100 rounded-3xl p-8 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <img 
                  src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774029343/logop_btmd14.png" 
                  alt="Logo Certificado Premium" 
                  className="h-16 mb-6 object-contain relative z-10" 
                />
                <p className="text-slate-700 mb-4 relative z-10 leading-relaxed">
                  William Informática é a única Escola de Bebedouro Credenciada com Exclusividade ao Certificado Premium.
                </p>
                <p className="text-slate-700 mb-6 relative z-10 leading-relaxed">
                  Dr. Augusto Cury também utiliza esta certificação em sua metodologia, atestando o padrão de excelência do nosso ensino.
                </p>
                <a href="#" className="inline-flex items-center font-semibold text-brand-red hover:text-brand-red-hover transition-colors relative z-10">
                  www.certificadopremium.com.br <ArrowRight className="ml-2 w-4 h-4" />
                </a>

                {/* Nova Oferta CTA */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mt-6 relative z-10">
                  <p className="text-red-900 font-medium text-sm mb-3">
                    Cadastre-se e receba gratuitamente um treinamento de Evolução Pessoal e Profissional.
                  </p>
                  <button 
                    onClick={() => { setLeadCategory('Certificado Premium'); setIsLeadModalOpen(true); }}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-5 rounded-full w-full transition-colors"
                  >
                    Quero meu treinamento grátis
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Coluna da Direita (Imagem) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Elementos Gráficos de Fundo */}
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-brand-red/20 -z-10" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] opacity-40 -z-10" />
              <div className="absolute top-1/4 -left-8 w-6 h-6 bg-brand-red rounded-sm rotate-12 opacity-80 -z-10 animate-pulse" />
              <div className="w-32 h-32 bg-[#E3000F]/10 rounded-full blur-2xl absolute -bottom-6 -right-6 -z-10" />
              
              <div className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out relative z-10">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774031802/Augusto_Cury_lgg4xk.webp" 
                    alt="Certificação Premium Augusto Cury" 
                    className="w-full aspect-[4/3] hover:scale-105 transition-transform duration-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Coluna da Esquerda (Imagem Criativa) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              {/* Elementos Gráficos de Fundo */}
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-slate-100 rounded-full -z-10" />
              <svg className="absolute -bottom-12 -left-12 w-48 h-48 text-brand-red opacity-60 -z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M 20,100 Q 60,20 100,100 T 180,100" />
                <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M 20,120 Q 60,40 100,120 T 180,120" />
              </svg>
              <div className="absolute top-1/3 -right-12 w-24 h-24 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:12px_12px] opacity-50 -z-10" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl z-10">
                <img 
                  src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774032713/imagem-2_vr35bs.jpg" 
                  alt="Equipe da escola" 
                  className="w-full h-[500px] object-cover object-center hover:scale-105 transition-transform duration-700 ease-in-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[250px] z-20">
                <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="font-heading font-bold text-slate-900 leading-tight">38 anos</p>
                  <p className="text-sm text-slate-500">de História</p>
                </div>
              </div>
            </motion.div>

            {/* Coluna da Direita (Texto) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                Quem Somos
              </h2>
              
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-8">
                <p>
                  Com 38 anos de história e mais de 20.000 alunos formados, a William Informática nasceu com um propósito claro: transformar vidas através da educação. Não somos apenas uma escola, mas um verdadeiro centro de qualificação focado em preparar os nossos alunos para as exigências reais do mercado de trabalho.
                </p>
                <p>
                  Unimos a excelência técnica a uma visão inovadora de negócios. Acreditamos que, em qualquer etapa da vida, o importante é crescer. Aqui, você adquire as ferramentas certas para conquistar a sua vaga de emprego ou para escalar o seu próprio negócio.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Metodologia de ensino exclusiva",
                  "Professores altamente qualificados",
                  "Foco no mercado de trabalho"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NUMBERS & GALLERY */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          {/* Numbers Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
            {[
              { number: 38, prefix: "", suffix: "", label: "Anos de História", icon: Clock },
              { number: 20000, prefix: "+", suffix: "", label: "Alunos Formados", icon: Users },
              { number: 100, prefix: "", suffix: "%", label: "Certificação de Excelência", icon: Award },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <stat.icon className="w-8 h-8 text-brand-red" />
                </div>
                <div className="font-heading text-5xl font-extrabold text-slate-900 mb-2">
                  <CountUpAnimation value={stat.number} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Gallery (Carousel 3D) */}
          <div className="max-w-6xl mx-auto">
            <h3 className="font-heading text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">Nossos Alunos Premium</h3>
            <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">Conheça algumas das histórias de sucesso de quem passou pela nossa instituição e transformou a sua carreira.</p>
            <Carousel3D />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774208363/Design_sem_nome_acqxgq.webp" 
                alt="William Informática" 
                className="h-[77px] md:h-[83px] w-auto object-contain mb-6" 
              />
              <p className="max-w-sm mb-8 leading-relaxed">
                Transformando vidas através da educação tecnológica e empreendedora há mais de três décadas.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                  <span>Av. Principal, 1000 - Centro<br/>Cidade - Estado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-red shrink-0" />
                  <span>(00) 0000-0000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-red shrink-0" />
                  <span>contato@williaminformatica.com.br</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Links Rápidos</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nossos Cursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WP Escola de Vendas & Negócios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} William Informática. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5517991879478?text=Ol%C3%A1%21%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20cursos."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Fale conosco no WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Fale com a gente!
        </span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
      {/* MODAL DE CURSOS E VAGAS */}
      {modalAtivo && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setModalAtivo(null)}
          ></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {modalAtivo === 'vagas' && <Briefcase className="w-6 h-6 text-brand-red" />}
                {modalAtivo === 'carreira' ? 'Cursos para Carreira' : modalAtivo === 'negocio' ? 'Cursos Meu Negócio' : 'Painel de Vagas'}
              </h3>
              <button 
                onClick={() => setModalAtivo(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Cursos ou Vagas (Scroll) */}
            <div className="overflow-y-auto flex-1 p-2">
              {modalAtivo === 'vagas' ? (
                vagasList.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No momento não temos vagas abertas. Volte em breve!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {vagasList.map((vaga) => (
                      <div key={vaga.id} className="p-5 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                        <h4 className="text-lg font-bold text-slate-800">{vaga.titulo}</h4>
                        <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">{vaga.descricao}</p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                (modalAtivo === 'carreira' ? cursosCarreira : cursosNegocio).map((curso, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <img 
                      src={curso.imagem} 
                      alt={curso.nome} 
                      className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-slate-800 font-medium">{curso.nome}</span>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé (Ação Fixo) */}
            {modalAtivo !== 'vagas' && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <a 
                  href="https://wa.me/5517992451458" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Falar com Consultor
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* LEAD CAPTURE MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsLeadModalOpen(false)}
          ></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Cadastro</h2>
                <p className="text-slate-500 text-sm mt-1">{leadCategory}</p>
              </div>
              <button 
                onClick={() => setIsLeadModalOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body / Form */}
            <div className="p-6">
              <p className="text-slate-600 mb-6 text-sm">
                Preencha seus dados abaixo para liberar o seu acesso imediato.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input type="hidden" name="categoria" value={leadCategory} />
                
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    id="nome" 
                    required 
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-1">
                    WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    id="whatsapp" 
                    required 
                    value={leadWhatsapp}
                    onChange={(e) => setLeadWhatsapp(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-lg shadow-slate-900/20"
                >
                  Quero Garantir Minha Vaga
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
