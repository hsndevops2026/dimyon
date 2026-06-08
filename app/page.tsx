import AnimatedTestimonialsDemo from '@/components/animated-testimonials-demo';
import DiscoverServicesScroll from './components/DiscoverServicesScroll';
import Footer from './components/Footer';
import HeroAnimation from './components/HeroAnimation';
import IsometricShowcase from './components/IsometricShowcase';

export default function Home() {
  return (
    <>
      <main id="home" className="h-screen min-h-screen w-full overflow-hidden">
        <HeroAnimation />
      </main>
      <DiscoverServicesScroll />
      <IsometricShowcase />
      <section id="testimonials" className="relative z-10 isolate dark bg-[#05070a]">
        <AnimatedTestimonialsDemo />
      </section>
      <Footer />
    </>
  );
}
