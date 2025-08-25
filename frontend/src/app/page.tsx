"use client";

import Button from '@/components/button';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/start');
  }

  const handleAboutClick = () => {
    router.push('/about');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Image 
        src="/logo.png"  
        alt="Logo"  
        width={200}  
        height={200}  
      />

      {/* Title */}
      <h1 className="text-white text-3xl font-bold mt-4 mb-12 tracking-wider">
        Wumpus World
      </h1>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4">
        <Button 
          text="START" 
          onClick={handleStartClick}
        />
        <Button 
          text="ABOUT" 
          onClick={handleAboutClick}
        />
      </div>
    </div>
  );
}