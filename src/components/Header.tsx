import React from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-28 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/">
            <img 
              src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774207958/WhatsApp_Image_2026-03-21_at_19.02.03_1_ohotur.jpg" 
              alt="William Informática" 
              className="h-[58px] md:h-[90px] w-auto object-contain mix-blend-multiply" 
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <a href="/#treinamento" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Cursos</a>
          <a href="/#empreendedor" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Aluno Empreendedor</a>
          <a href="/#treinamento" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Vagas de Emprego</a>
          <a href="/#quemsomos" className="text-slate-700 hover:text-red-600 font-medium transition-colors">Quem Somos</a>
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <a href="https://wa.me/5517991879478?text=Ol%C3%A1%2C%20quero%20me%20metricular%20na%20William%20Inform%C3%A1tica%21" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 hidden md:block transition-colors">
            Matricule-se
          </a>
          <button className="md:hidden p-2 text-slate-700 hover:text-red-600 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
