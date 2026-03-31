import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Clock, Info, Send } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';

interface Curso {
  id: string;
  nome: string;
  categoria: string;
  cargaHoraria: string;
  descricao: string;
  imagem: string;
}

const categorias = ['Todas', 'Informática e Tecnologia', 'Administrativo', 'Idiomas', 'Preparatórios', 'Diversas Áreas'];

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [cursoDetalhe, setCursoDetalhe] = useState<Curso | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [prospectoNome, setProspectoNome] = useState('');
  const [prospectoWhatsapp, setProspectoWhatsapp] = useState('');
  const [alunoEmpreendedorNome, setAlunoEmpreendedorNome] = useState('');
  const [alunoEmpreendedorWhatsapp, setAlunoEmpreendedorWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cursosRef = collection(db, 'cursos');
    const q = query(cursosRef, where('ativo', '==', true), orderBy('nome', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cursosData = snapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
        categoria: doc.data().categoria,
        cargaHoraria: doc.data().carga_horaria,
        descricao: doc.data().descricao,
        imagem: doc.data().imagem_url
      })) as Curso[];
      
      setCursos(cursosData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar cursos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cursosFiltrados = useMemo(() => {
    if (filtroAtivo === 'Todas') return cursos;
    return cursos.filter(c => c.categoria === filtroAtivo);
  }, [filtroAtivo, cursos]);

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
      const selectedCursosNomes = cursos.filter(c => selecionados.includes(c.id)).map(c => c.nome);
      
      const leadRef = collection(db, 'leads_empreendedor');
      await addDoc(leadRef, {
        nome_prospecto: prospectoNome,
        whatsapp_prospecto: prospectoWhatsapp,
        nome_empreendedor: alunoEmpreendedorNome,
        whatsapp_empreendedor: alunoEmpreendedorWhatsapp,
        cursos_info: selectedCursosNomes,
        data_cadastro: serverTimestamp(),
        status: 'Pendente'
      });
      
      alert('Inscrição enviada com sucesso!');
      
      // WhatsApp redirect
      const message = `Nova Inscrição recebida no site! Prospecto: ${prospectoNome}, Indicado por: ${alunoEmpreendedorNome}.`;
      const whatsappUrl = `https://wa.me/5517991879478?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Reset form and close modal
      setIsContactModalOpen(false);
      setSelecionados([]);
      setProspectoNome('');
      setProspectoWhatsapp('');
      setAlunoEmpreendedorNome('');
      setAlunoEmpreendedorWhatsapp('');
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      alert("Ocorreu um erro ao processar sua inscrição. Verifique sua conexão e tente novamente.");
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

          <div className="container mx-auto px-6 pt-10 md:pt-0 relative z-10 flex flex-col justify-start md:justify-center items-center md:items-start">
            <div className="text-center md:text-left md:max-w-4xl md:pl-6 lg:pl-10">
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
                className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1] uppercase tracking-tighter drop-shadow-lg"
              >
                <span className="block md:inline">MAIS DE 50 CURSOS</span> <br className="hidden md:block" />
                <span className="block md:inline">NAS MELHORES ÁREAS</span> <br className="hidden md:block" />
                <span className="block md:inline">DO MERCADO DE TRABALHO</span>
              </motion.h1>
              
              {/* Espaçador Mobile para não cobrir as pessoas na base da imagem */}
              <div className="h-64 md:hidden"></div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          {/* Título Secundário */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Aluno Empreendedor</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-4">
              Um diferencial exclusivo para nossos alunos. Aqui você não apenas aprende...você aprende a empreender.
            </p>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Selecione um ou mais cursos para se inscrever no programa Aluno Empreendedor.
            </p>
          </div>

          {/* Instrução UX */}
          <p className="text-[10px] text-gray-400 mb-4 text-center uppercase tracking-widest">
            Clique no nome do curso para ver mais detalhes
          </p>

          {/* Filtros Desktop */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mb-12">
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

          {/* Filtro Mobile (Dropdown) */}
          <div className="block md:hidden w-full mb-6">
            <select
              value={filtroAtivo}
              onChange={(e) => setFiltroAtivo(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-red-600 outline-none shadow-sm"
            >
              <option value="Todas">Filtrar categoria...</option>
              {categorias.filter(c => c !== 'Todas').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Lista de Cursos */}
          <div className="max-w-4xl mx-auto mb-16">
            {cursosFiltrados.map(curso => {
              const isSelected = selecionados.includes(curso.id);
              return (
                <motion.div
                  key={curso.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-row items-center gap-3 p-3 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Elemento 1: A Caixa de Seleção (OBRIGATÓRIO) */}
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelecao(curso.id)}
                    className="w-5 h-5 cursor-pointer accent-red-600 shrink-0"
                  />

                  {/* Elemento 2: A Imagem */}
                  <div 
                    className="w-12 h-12 min-w-[48px] rounded overflow-hidden cursor-pointer shrink-0"
                    onClick={() => setCursoDetalhe(curso)}
                  >
                    <img 
                      src={curso.imagem} 
                      alt={curso.nome} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Elemento 3: O Nome do Curso (Linha Única) */}
                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => setCursoDetalhe(curso)}
                      className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {curso.nome}
                    </h4>
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
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-start mb-6 shrink-0">
                  <div>
                    <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2 block">Detalhes do Curso</span>
                    <h3 className="text-3xl font-extrabold text-slate-900">{cursoDetalhe.nome}</h3>
                  </div>
                  <button onClick={() => setCursoDetalhe(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Categoria</p>
                      <p className="font-bold text-slate-800">{cursoDetalhe.categoria}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Carga Horária</p>
                      <p className="font-bold text-slate-800">{cursoDetalhe.cargaHoraria}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Conteúdo do curso:</h4>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{cursoDetalhe.descricao}</p>
                  </div>
                </div>

                <div className="pt-6 shrink-0">
                  <button 
                    onClick={() => {
                      if (!selecionados.includes(cursoDetalhe.id)) {
                        toggleSelecao(cursoDetalhe.id);
                      }
                      setCursoDetalhe(null);
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Selecionar este curso
                  </button>
                </div>
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
