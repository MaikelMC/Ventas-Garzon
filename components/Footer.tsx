import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark dark:bg-surface-950 text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo2.jpg" alt="Ventas Garzón" className="h-10 w-10 rounded-full border border-white/20" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary-400 font-bold">Ventas</p>
                <span className="text-lg font-display font-bold">Garzón</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu tienda de confianza para productos de aseo y alimentos de calidad.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">Navegación</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/products" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> Productos
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> Acerca de
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">Soporte</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> Recogida
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:pl-1 transition-all duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full" /> Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">+53 56072398</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors">
                  <Mail size={16} className="text-primary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">thecanaryai14@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors">
                  <MapPin size={16} className="text-primary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">Santiago de Cuba, Cuba</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Ventas Garzón. Creado por{' '}
              <span className="text-primary-400 font-semibold">CanaryAI</span> &mdash;{' '}
              <a href="mailto:thecanaryai14@gmail.com" className="hover:text-primary-300 transition-colors">
                thecanaryai14@gmail.com
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors text-sm">Términos</a>
              <span className="text-gray-700">&bull;</span>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors text-sm">Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
