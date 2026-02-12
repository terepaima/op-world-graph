'use client';
import { MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'motion/react';
import { INavLink } from '../../types/types';
import { navlinks } from '../../data/navlinks';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onNavigate = (href: string) => {
    setIsOpen(false);
    if (router) router.push(href);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link onClick={() => onNavigate('/#')} href="/#" className="transition">
          <Image
            className="h-8.5 w-auto"
            src="/logo.png"
            alt="logo"
            width={40}
            height={24}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          {navlinks.map((link: INavLink) => (
            <Link
              onClick={() => onNavigate(link.href)}
              key={link.name}
              href={link.href}
              className="hover:text-green-500 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button onClick={() => setIsOpen(true)} className="md:hidden">
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </motion.nav>

      <div
        className={`fixed inset-0 z-[45] bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {navlinks.map((link: INavLink) => (
          <Link
            onClick={() => onNavigate(link.href)}
            key={link.name}
            href={link.href}
            onNavigate={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={() => setIsOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
