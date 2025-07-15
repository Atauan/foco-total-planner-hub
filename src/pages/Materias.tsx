import { useEffect } from "react"
import { Layout } from "@/components/Layout"
import { 
  Calculator, 
  Microscope, 
  Globe, 
  BookOpen, 
  TestTube, 
  Atom, 
  MapPin, 
  Clock, 
  Brain, 
  Users, 
  Newspaper, 
  PenTool, 
  BookText, 
  Palette, 
  Languages, 
  Globe2, 
  FileEdit
} from "lucide-react"

const materiasData = [
  {
    title: "Matemática",
    sections: [
      { name: "Matemática", icon: Calculator },
      { name: "Matemática Básica", icon: Calculator }
    ]
  },
  {
    title: "Ciências da Natureza", 
    sections: [
      { name: "Biologia", icon: Microscope },
      { name: "Física", icon: Atom },
      { name: "Química", icon: TestTube }
    ]
  },
  {
    title: "Ciências Humanas",
    sections: [
      { name: "História", icon: Clock },
      { name: "Geografia", icon: Globe },
      { name: "Filosofia", icon: Brain },
      { name: "Sociologia", icon: Users },
      { name: "Atualidades", icon: Newspaper }
    ]
  },
  {
    title: "Linguagens",
    sections: [
      { name: "Português", icon: BookOpen },
      { name: "Literatura", icon: BookText },
      { name: "Artes", icon: Palette },
      { name: "Inglês", icon: Languages },
      { name: "Espanhol", icon: Globe2 },
      { name: "Redação", icon: FileEdit }
    ]
  }
]

export default function Materias() {
  useEffect(() => {
    // Load Anime.js and trigger animations
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.anime) {
        // Section titles animation
        // @ts-ignore
        window.anime({
          targets: '.animate-section-title',
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutExpo',
          delay: (el: any, i: number) => i * 200
        })

        // Cards fade in animation with scale
        // @ts-ignore
        window.anime({
          targets: '.animate-materia-card',
          translateY: [50, 0],
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 800,
          easing: 'easeOutExpo',
          delay: (el: any, i: number) => 100 + (i * 80)
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-semibold text-black mb-4 tracking-tight">
              Matérias
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Consulte o material de apoio, questões e assuntos de cada disciplina.
            </p>
          </div>

          {/* Subjects Sections */}
          <div className="space-y-16">
            {materiasData.map((categoria, categoriaIndex) => (
              <div key={categoria.title} className="animate-section-title">
                <h2 className="text-2xl font-semibold text-black mb-8 text-center lg:text-left">
                  {categoria.title}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {categoria.sections.map((materia, materiaIndex) => {
                    const IconComponent = materia.icon
                    const globalIndex = categoriaIndex * 10 + materiaIndex
                    
                    return (
                      <div 
                        key={materia.name}
                        className="animate-materia-card group cursor-pointer"
                      >
                        <div className="card-minimal p-6 text-center hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-gray-50">
                          <div className="mb-4 flex justify-center">
                            <IconComponent className="h-8 w-8 text-gray-700 group-hover:text-black transition-colors duration-200" />
                          </div>
                          <h3 className="font-medium text-black text-sm lg:text-base leading-tight">
                            {materia.name}
                          </h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom spacing */}
          <div className="h-16"></div>
        </div>
      </div>
    </Layout>
  )
}