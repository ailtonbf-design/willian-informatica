import { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { BookOpen, Rocket, ArrowRight, CheckCircle2, Users, Award, Clock, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Code, Briefcase, Palette, Star } from 'lucide-react';

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
            ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, duration, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function App() {
  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-brand-red selection:text-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] md:min-h-[75vh] lg:min-h-[85vh] flex flex-col bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774028444/Willian-2_vkkrov.webp"
            alt="Alunos e profissionais em ambiente premium"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>

        {/* Header */}
        <header className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              William <span className="text-brand-red">Informática</span>
            </span>
          </div>
          <button className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-colors border border-white/20 rounded-full hover:bg-white/10 backdrop-blur-sm">
            Fale Conosco
          </button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 flex-1 flex flex-col justify-center items-start pt-32 md:pt-40 pb-48 md:pb-56">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-full md:max-w-4xl lg:max-w-5xl text-left"
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
            <button className="inline-flex items-center font-semibold text-brand-red group-hover:text-brand-red-hover transition-colors">
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
            <button className="inline-flex items-center font-semibold text-slate-900 group-hover:text-brand-red transition-colors">
              Escola de Vendas <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* DESTAQUE DA SEMANA (Offer Banner) */}
      <section className="bg-brand-red py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-1/2 text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm animate-pulse">
                Oferta por tempo limitado
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 leading-tight">
                Curso destaque da semana
              </h2>
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-yellow-400 mb-4 drop-shadow-sm">
                Auxiliar Administrativo
              </h3>
              <p className="text-red-100 text-lg">
                Quero realizar esse curso com 50% de desconto real e ainda ganhar um Diagnóstico Profissional
              </p>
            </div>

            <div className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20">
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
                  className="w-full bg-slate-900 text-white font-bold text-lg px-6 py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Garantir Desconto
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ESCOLHA SUA ÁREA (Aluno) */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Escolha sua área...</h2>
            <p className="text-slate-600 text-lg">
              Formações completas desenhadas para as demandas reais do mercado atual.
            </p>
          </motion.div>

          {/* Cursos Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {[
              { title: "Tecnologia", desc: "O Mundo pede pessoas mais preparadas para os desafios da era digital.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80", icon: Code },
              { title: "Negócios", desc: "O Mundo dos Negócios exige profissionais completos, preparados para o Sucesso!", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", icon: Briefcase },
              { title: "Design", desc: "Criatividade e técnica para dar vida a projetos incríveis e inovadores.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80", icon: Palette },
            ].map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <course.icon className="w-6 h-6 text-brand-red" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">{course.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{course.desc}</p>
                  <button className="text-brand-red font-medium inline-flex items-center group-hover:text-brand-red-hover transition-colors">
                    Saber mais <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Vantagens Blocks */}
          <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
            >
              <div className="bg-red-50 p-3 rounded-full shrink-0">
                <CheckCircle2 className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-slate-900 mb-2">Vagas de Emprego Atualizadas</h4>
                <p className="text-slate-600">Matricule-se agora e ganhe dois cursos extras.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-7 bg-slate-900 p-8 rounded-2xl shadow-xl flex items-start gap-4"
            >
              <div className="bg-white/10 p-3 rounded-full shrink-0">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-white mb-2">Aluno Empreendedor</h4>
                <p className="text-slate-300">Um diferencial exclusivo para nossos alunos. Aqui você não apenas aprende... você aprende a empreender. Saiba como participar e ter acesso ao programa, desenvolvendo habilidades que vão além da sala de aula.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WP - ESCOLA DE VENDAS (Empresário) */}
      <section className="relative bg-slate-900 pt-32 pb-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774023454/Banner-Willian_vusp0w.webp"
            alt="Banner Escola de Vendas"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-4 py-1.5 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-slate-300 uppercase tracking-widest">Para Empresários</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              WP - Escola de Vendas <br className="hidden md:block" /> e Negócios
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Se tem um negócio próprio ou é profissional liberal e quer escalar as suas vendas com previsibilidade e lucro.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-red hover:bg-brand-red-hover text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Clique e receba gratuitamente os 7 Passos para Escalar
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
                  Liberação de Vagas
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
                <p className="text-slate-600 text-lg mb-6 relative z-10 leading-relaxed">
                  <strong className="text-slate-900">Escola Credenciada com Exclusividade.</strong> O Dr. Augusto Cury também utiliza esta certificação em sua metodologia, atestando o padrão de excelência do nosso ensino.
                </p>
                <a href="#" className="inline-flex items-center font-semibold text-brand-red hover:text-brand-red-hover transition-colors relative z-10">
                  www.certificadopremium.com.br <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Coluna da Direita (Imagem) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-32 h-32 bg-[#E3000F]/10 rounded-full blur-2xl absolute -bottom-6 -right-6 -z-10" />
              <div className="bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
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
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774032713/imagem-2_vr35bs.jpg" 
                  alt="Equipe da escola" 
                  className="w-full h-[500px] object-cover object-center hover:scale-105 transition-transform duration-700 ease-in-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[250px] z-10">
                <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="font-heading font-bold text-slate-900 leading-tight">Mais de 24 anos</p>
                  <p className="text-sm text-slate-500">de Tradição</p>
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
                  Há mais de 24 anos, a William Informática nasceu com um propósito claro: transformar vidas através da educação. Não somos apenas uma escola, mas um verdadeiro centro de qualificação focado em preparar os nossos alunos para as exigências reais do mercado de trabalho.
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
              { number: 24, prefix: "", suffix: "", label: "Anos de História", icon: Clock },
              { number: 8000, prefix: "+", suffix: "", label: "Alunos Formados", icon: Users },
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

          {/* Gallery (Masonry simulation) */}
          <div className="max-w-6xl mx-auto">
            <h3 className="font-heading text-2xl font-bold text-center text-slate-900 mb-10">Nossos Alunos Premium</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80" className="rounded-2xl w-full h-48 object-cover" alt="Aluno" />
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" className="rounded-2xl w-full h-64 object-cover md:-mt-8" alt="Aluno" />
              <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" className="rounded-2xl w-full h-56 object-cover" alt="Aluno" />
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" className="rounded-2xl w-full h-48 object-cover md:mt-8" alt="Aluno" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white block mb-6">
                William <span className="text-brand-red">Informática</span>
              </span>
              <p className="max-w-sm mb-8 leading-relaxed">
                Transformando vidas através da educação tecnológica e empreendedora há mais de duas décadas.
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
                <li><a href="#" className="hover:text-white transition-colors">Escola de Vendas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} William Informática. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
