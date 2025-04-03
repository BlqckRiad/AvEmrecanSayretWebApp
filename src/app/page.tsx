'use client';

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import LatestBlogs from "@/components/LatestBlogs";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Services />
        
        {/* Uzmanlık alanlarından sonra son blogları ekle */}
        <LatestBlogs />
      </main>
      <Footer />
    </>
  );
}
