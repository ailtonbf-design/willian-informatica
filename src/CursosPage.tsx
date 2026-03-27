import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Clock, Info, Send } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Curso {
  id: string;
  nome: string;
  categoria: string;
  cargaHoraria: string;
  descricao: string;
  imagem: string;
}

const mockData: Curso[] = [
  { id: '1', nome: 'Auxiliar Administrativo', categoria: 'Administrativo', cargaHoraria: '40 hora(s)', descricao: 'Aprenda as rotinas essenciais de um escritório moderno, desde organização de documentos até atendimento ao cliente.', imagem: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop' },
  { id: '2', nome: 'Excel Avançado', categoria: 'Informática e Tecnologia', cargaHoraria: '20 hora(s)', descricao: 'Domine fórmulas complexas, tabelas dinâmicas e macros para se tornar um especialista em planilhas.', imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop' },
  { id: '3', nome: 'Inglês para Negócios', categoria: 'Idiomas', cargaHoraria: '60 hora(s)', descricao: 'Desenvolva fluência em situações corporativas, reuniões e apresentações internacionais.', imagem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop' },
  { id: '4', nome: 'Marketing Digital', categoria: 'Diversas Áreas', cargaHoraria: '30 hora(s)', descricao: 'Estratégias de redes sociais, tráfego pago e branding para escalar resultados online.', imagem: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=100&h=100&fit=crop' },
  { id: '5', nome: 'Preparatório Concursos', categoria: 'Preparatórios', cargaHoraria: '100 hora(s)', descricao: 'Foco total nas matérias mais cobradas em editais públicos de nível médio e superior.', imagem: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=100&h=100&fit=crop' },
];

const categorias = ['Todos', 'Administrativo', 'Idiomas', 'Informática e Tecnologia', 'Diversas Áreas', 'Preparatórios'];

export default function CursosPage() {
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [cursoDetalhe, setCursoDetalhe] = useState<Curso | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Form state
  const [prospectoNome, setProspectoNome] = useState('');
  const [prospectoWhatsapp, setProspectoWhatsapp] = useState('');
  const [alunoEmpreendedorNome, setAlunoEmpreendedorNome] = useState('');
  const [alunoEmpreendedorWhatsapp, setAlunoEmpreendedorWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cursosFiltrados = useMemo(() => {
    if (filtroAtivo === 'Todos') return mockData;
    return mockData.filter(c => c.categoria === filtroAtivo);
  }, [filtroAtivo]);

  const toggleSelecao = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinalizar = () => {
    if (selecionados.length === 0) {
      alert('Por favor, selecione pelo menos um curso.');
      return;
    }
    setIsContactModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const inscricaoRef = collection(db, 'inscricoes_aluno_empreendedor');
      await addDoc(inscricaoRef, {
        prospecto: { nome: prospectoNome, whatsapp: prospectoWhatsapp },
        alunoEmpreendedor: { nome: alunoEmpreendedorNome, whatsapp: alunoEmpreendedorWhatsapp },
        cursosIds: selecionados,
        cursosNomes: mockData.filter(c => selecionados.includes(c.id)).map(c => c.nome),
        createdAt: serverTimestamp(),
        data: new Date().toLocaleDateString('pt-BR')
      });
      
      alert('Inscrição realizada com sucesso! Entraremos em contato em breve.');
      setIsContactModalOpen(false);
      setSelecionados([]);
      setProspectoNome('');
      setProspectoWhatsapp('');
      setAlunoEmpreendedorNome('');
      setAlunoEmpreendedorWhatsapp('');
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      alert("Ocorreu um erro ao processar sua inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Banner Responsivo */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-stretch overflow-hidden bg-slate-900">
          {/* Background Images */}
          <div className="absolute inset-0 z-0">
            {/* Mobile Background */}
            <div 
              className="block md:hidden w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dapsovbs5/image/upload/v1774640856/Banner-William-Mobile_vhgiy3.webp')" }}
            />
            {/* Desktop Background */}
            <div 
              className="hidden md:block w-full h-full bg-cover bg-right bg-no-repeat"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dapsovbs5/image/upload/v1774640856/Banner-Cursos-Willian_pkkw3z.webp')" }}
            />
          </div>

          <div className="container mx-auto px-6 pt-10 md:pt-0 relative z-10 flex flex-col justify-start md:justify-center">
            <div className="text-center md:text-left md:max-w-2xl lg:max-w-3xl md:px-24">
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-orange-400 font-serif italic text-lg md:text-2xl mb-3 tracking-wide drop-shadow-md"
              >
                Portal de Cursos William Informática
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-2xl md:text-5xl lg:text-6xl font-black leading-tight uppercase tracking-tighter drop-shadow-lg"
              >
                MAIS DE 50 CURSOS <br className="hidden md:block" />
                NAS MELHORES ÁREAS <br className="hidden md:block" />
                DO MERCADO DE TRABALHO
              </motion.h1>
              
              {/* Espaçador Mobile para não cobrir as pessoas na base da imagem */}
              <div className="h-64 md:hidden"></div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          {/* Título Secundário */}
          <div className="text-center mb-12">
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Selecione um ou mais cursos para se inscrever no programa Aluno Empreendedor.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroAtivo(cat)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  filtroAtivo === cat 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tabela de Cursos */}
          <div className="max-w-6xl mx-auto space-y-4 mb-16">
            {cursosFiltrados.map(curso => {
              const isSelected = selecionados.includes(curso.id);
              return (
                <motion.div
                  key={curso.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl p-4 md:p-6 shadow-sm border-2 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6 ${
                    isSelected ? 'border-green-500 bg-green-50/30' : 'border-transparent hover:border-slate-200'
                  }`}
                  onClick={() => toggleSelecao(curso.id)}
                >
                  {/* Check Area */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'
                  }`}>
                    <Check className="w-6 h-6" />
                  </div>

                  {/* Course Image */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img 
                      src={curso.imagem} 
                      alt={curso.nome} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow text-center md:text-left">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCursoDetalhe(curso); }}
                      className="text-xl font-bold text-slate-900 hover:text-red-600 transition-colors text-left"
                    >
                      {curso.nome}
                    </button>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                      <span className="bg-slate-100 text-slate-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {curso.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCursoDetalhe(curso); }}
                      className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Detalhes
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Formulário / Botão Finalizar */}
          <div className="max-w-6xl mx-auto flex justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md text-center">
              <p className="text-slate-500 mb-6 font-medium">
                {selecionados.length} curso(s) selecionado(s)
              </p>
              <button
                onClick={handleFinalizar}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-900/20"
              >
                Finalizar Seleção
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL DETALHES DO CURSO */}
      <AnimatePresence>
        {cursoDetalhe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2 block">Detalhes do Curso</span>
                    <h3 className="text-3xl font-extrabold text-slate-900">{cursoDetalhe.nome}</h3>
                  </div>
                  <button onClick={() => setCursoDetalhe(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Sobre o curso:</h4>
                    <p className="text-slate-600 leading-relaxed">{cursoDetalhe.descricao}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Categoria</p>
                      <p className="font-bold text-slate-800">{cursoDetalhe.categoria}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Carga Horária</p>
                      <p className="font-bold text-slate-800">{cursoDetalhe.cargaHoraria}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!selecionados.includes(cursoDetalhe.id)) {
                      toggleSelecao(cursoDetalhe.id);
                    }
                    setCursoDetalhe(null);
                  }}
                  className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Selecionar este curso
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONTATO / FINALIZAÇÃO */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Finalizar Inscrição</h3>
                  <button onClick={() => setIsContactModalOpen(false)} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-slate-400">Programa Aluno Empreendedor - William Informática</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 border-b pb-2">Dados do Prospecto</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                      <input 
                        type="text" required value={prospectoNome} onChange={e => setProspectoNome(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                      <input 
                        type="tel" required value={prospectoWhatsapp} onChange={e => setProspectoWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 border-b pb-2">Aluno Empreendedor</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
                      <input 
                        type="text" required value={alunoEmpreendedorNome} onChange={e => setAlunoEmpreendedorNome(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Seu WhatsApp</label>
                      <input 
                        type="tel" required value={alunoEmpreendedorWhatsapp} onChange={e => setAlunoEmpreendedorWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600">
                    <span className="font-bold">Cursos selecionados:</span> {selecionados.length}
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processando...' : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Inscrição
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
