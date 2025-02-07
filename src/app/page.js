import { Inter } from 'next/font/google';
import HomePage from "@/Components/Home/HomePage";
import styles from './page.module.css';
import './globals.css';

// Import Inter font
const inter = Inter({
  subsets: ['latin']
});

export default function Home() {
  return (
    <div className={`${styles['marathon']} ${inter.className}`}>
      
      <HomePage />
    </div>
  );
}
