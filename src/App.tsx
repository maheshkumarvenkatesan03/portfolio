import { About } from './components/About'
import { Achievements } from './components/Achievements'
import { Arsenal } from './components/Arsenal'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Playground } from './components/playground'
import { Work } from './components/Work'

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <main id="main">
        <About />
        <Experience />
        <Arsenal />
        <Work />
        <Achievements />
        <Playground />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
