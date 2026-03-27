import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#destaque', label: 'Destaque' },
    { href: '/cursos', label: 'Catálogo de Cursos' },
    { href: '/#treinamento', label: 'Treinamentos' },
    { href: '/#empreendedor', label: 'Aluno Empreendedor' },
    { href: '/#wpescola', label: 'WP Escola' },
    { href: '/#certificado', label: 'Certificado' },
    { href: '/#quemsomos', label: 'Quem Somos' },
  ];

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
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="text-slate-700 hover:text-red-600 font-medium transition-colors text-sm lg:text-base"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <a href="https://wa.me/5517991879478?text=Ol%C3%A1%2C%20quero%20me%20metricular%20na%20William%20Inform%C3%A1tica%21" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 hidden md:block transition-colors">
            Matricule-se
          </a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-red-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-700 hover:text-red-600 font-medium transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="https://wa.me/5517991879478?text=Ol%C3%A1%2C%20quero%20me%20metricular%20na%20William%20Inform%C3%A1tica%21" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors text-center mt-2"
              >
                Matricule-se Agora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
