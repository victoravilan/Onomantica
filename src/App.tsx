import React, { useState, useEffect, useMemo } from 'react';
import { Search, LoaderCircle, WandSparkles, BookText, Users, Feather, Sword, Gem } from 'lucide-react';
import type { NombreItem } from './types';
import { loadDataset } from './lib/store';
import { normalize } from './lib/diacritics';
import { storyFromConstructed, meaningFromRoots } from './lib/generator';

// --- Funciones de utilidad ---
const parseSections = (significado: string): string[] => {
    // Dividir por doble salto de línea y filtrar secciones vacías
    return significado.split('\n\n').filter(section => section.trim().length > 0);
};

// Funciones para generar contenido específico de cada ventana
const generateOriginContent = (item: NombreItem | null, name: string): string => {
    if (item) {
        const sections = parseSections(item.significado);
        return sections[0] || `El nombre ${name} tiene raíces etimológicas que reflejan características de fortaleza y carácter distintivo.`;
    }

    // Base de datos expandida de orígenes y significados reales
    const nameOrigins: Record<string, string> = {
        'Victor': 'Del latín "victor", que significa "vencedor" o "conquistador". Deriva del verbo "vincere" (vencer), con raíces en el protoindoeuropeo *weik- (separar, conquistar). Este nombre romano clásico evoca triunfo, éxito y superación de obstáculos. En la tradición cristiana, muchos santos llevaron este nombre, simbolizando la victoria del bien sobre el mal.',
        'Isabel': 'Del hebreo "Elisheba" (אֱלִישֶׁבַע), que significa "Dios es mi juramento" o "consagrada a Dios". Compuesto por "El" (Dios) y "sheba" (juramento, siete - número de perfección). En la tradición bíblica, Isabel fue la madre de Juan el Bautista. Este nombre real evoca devoción, compromiso sagrado y nobleza espiritual.',
        'Sofia': 'Del griego "Sophia" (Σοφία), que significa "sabiduría". Deriva del verbo "sophos" (sabio), con conexiones al protoindoeuropeo *seh₂p- (percibir, saber). En la filosofía griega antigua, Sophia representaba la sabiduría divina y el conocimiento supremo. En la tradición cristiana ortodoxa, Santa Sofía simboliza la Sabiduría Divina.',
        'Luis': 'Del germánico "Hlodowig", compuesto por "hlod" (gloria, fama) y "wig" (combate, guerra), significando "guerrero glorioso" o "famoso en la batalla". Evolucionó al francés "Louis" y al español "Luis". Este nombre real por excelencia fue llevado por 18 reyes de Francia.',
        'Ana': 'Del hebreo "Hannah" (חַנָּה), que significa "gracia" o "compasión de Dios". Deriva de la raíz hebrea ḥ-n-n (mostrar favor, ser gracioso). En la tradición bíblica, Ana fue la madre del profeta Samuel, conocida por su fe y devoción.'
    };

    // Si tenemos información específica, usarla
    if (nameOrigins[name]) {
        return nameOrigins[name];
    }

    // Para nombres no catalogados, generar análisis etimológico básico
    const analysis = meaningFromRoots(name);
    return `El nombre ${name} ${analysis.significado} Aunque su etimología específica requiere investigación adicional, este nombre evoca características de personalidad distintivas y sugiere una herencia cultural rica que merece ser explorada más profundamente.`;
};

const generateLegacyContent = (name: string): string => {
    // Base de personajes históricos por nombre
    const historicalFigures: Record<string, string> = {
        'Victor': 'Víctor Hugo (1802-1885), escritor francés autor de "Los Miserables" y "El Jorobado de Notre Dame", figura clave del romanticismo literario. Su obra influyó profundamente en la literatura mundial.',
        'Luis': 'Luis XIV de Francia (1638-1715), conocido como el Rey Sol, monarca que llevó a Francia a su máximo esplendor cultural y político durante el siglo XVII.',
        'Sofia': 'Sofía de Grecia (1938-2014), reina consorte de España, reconocida por su labor humanitaria y su papel en la transición democrática española.',
        'Isabel': 'Isabel la Católica (1451-1504), reina de Castilla cuyo reinado marcó la unificación de España y el descubrimiento de América.',
        'Ana': 'Ana Frank (1929-1945), joven escritora alemana cuyo diario se convirtió en testimonio fundamental sobre el Holocausto y símbolo de esperanza.'
    };

    return historicalFigures[name] || `A lo largo de la historia, quienes han llevado el nombre ${name} se han distinguido por su capacidad de liderazgo y su contribución significativa a sus comunidades. Este nombre ha sido portado por figuras que han dejado huella en diversos campos del conocimiento y la cultura.`;
};

const generatePoeticContent = (name: string): string => {
    const poeticTemplates = [
        `En el susurro del viento se escucha ${name}, como eco de promesas antiguas. Su sonido despierta memorias de jardines donde florecen los sueños más puros, y cada sílaba es una llave que abre puertas hacia mundos de infinita belleza.`,
        `${name} danza en el aire como luz dorada, tejiendo historias entre las estrellas. Su esencia abraza la tierra con ternura de madre, y en su nombre se refugian las esperanzas de quienes buscan la verdad en el silencio.`,
        `Como río que fluye hacia el mar, ${name} lleva consigo la sabiduría de las montañas y la serenidad de los valles. En su pronunciación se encuentra la música que calma tormentas y enciende hogueras de inspiración.`,
        `${name} es palabra que florece en labios de poetas, semilla de versos que germinan en corazones sensibles. Su melodía despierta al alba y arrulla a la noche, siendo puente entre lo terrenal y lo divino.`
    ];

    const randomTemplate = poeticTemplates[Math.floor(Math.random() * poeticTemplates.length)];
    return randomTemplate;
};

const generateEpicContent = (name: string): string => {
    const epicTemplates = [
        `En tiempos remotos, cuando los dioses aún caminaban entre mortales, ${name} emergió como guardián de antiguos secretos. Su valor resonaba en campos de batalla donde el honor se forjaba con acero y determinación, escribiendo leyendas que perdurarían por milenios.`,
        `Las crónicas hablan de ${name} como figura que desafió destinos escritos en piedra. Con sabiduría de sabios y coraje de guerreros, transformó adversidades en victorias, convirtiéndose en faro de esperanza para generaciones venideras.`,
        `En el gran tapiz de la historia, ${name} tejió hilos de oro con sus hazañas. Su nombre se pronunciaba en palacios y aldeas por igual, símbolo de justicia inquebrantable y visión que trascendía las limitaciones de su época.`,
        `Cuando las sombras amenazaban con devorar la luz, ${name} se alzó como centinela de la verdad. Su legado perdura en cada acto de valentía, en cada decisión justa, recordándonos que la grandeza reside en el servicio a otros.`
    ];

    const randomTemplate = epicTemplates[Math.floor(Math.random() * epicTemplates.length)];
    return randomTemplate;
};

const calculateNumerology = (name: string): { number: number, meaning: string } => {
    // Tabla de conversión numerológica
    const letterValues: Record<string, number> = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
        'Á': 1, 'É': 5, 'Í': 9, 'Ó': 6, 'Ú': 3, 'Ñ': 5
    };

    // Calcular suma de letras
    let sum = 0;
    for (const char of name.toUpperCase()) {
        if (letterValues[char]) {
            sum += letterValues[char];
        }
    }

    // Reducir a un solo dígito (excepto 11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    // Significados numerológicos
    const meanings: Record<number, string> = {
        1: "Liderazgo, independencia y originalidad. Representa el pionero, aquel que abre caminos con una energía y determinación únicas. Su reto es aprender a colaborar sin perder su individualidad.",
        2: "Cooperación, diplomacia y sensibilidad. Es el número del mediador y el pacificador. Tiene un don natural para trabajar en equipo y crear armonía. Su lección es confiar en su intuición.",
        3: "Creatividad, comunicación y expresión. Representa el artista y el comunicador nato. Posee un carisma natural y capacidad para inspirar a otros. Su desafío es mantener el enfoque.",
        4: "Estructura, orden y pragmatismo. Representa la estabilidad y el trabajo duro. Es el número del constructor, que crea bases sólidas y valora la disciplina. Su poder es la constancia y la fiabilidad.",
        5: "Libertad, aventura y cambio. Es el número del viajero y el explorador del espíritu. Ama la variedad y se adapta con facilidad a nuevas situaciones. Su lección es usar su libertad con responsabilidad.",
        6: "Responsabilidad, cuidado y servicio. Representa el cuidador y el sanador natural. Tiene una fuerte conexión con la familia y la comunidad. Su misión es nutrir y proteger a otros.",
        7: "Espiritualidad, introspección y sabiduría. Es el número del místico y el investigador. Busca la verdad profunda y tiene una conexión especial con lo espiritual. Su reto es no aislarse del mundo.",
        8: "Poder, ambición y materialización. Representa el éxito material y la autoridad. Es el número del estratega, que sabe manifestar sus visiones en el mundo real. Su reto es equilibrar lo material con lo espiritual.",
        9: "Humanitarismo, compasión y finalización. Es el número del idealista y el filántropo. Tiene una visión global y un profundo amor por la humanidad. Su misión es servir desinteresadamente y cerrar ciclos."
    };

    return {
        number: sum,
        meaning: meanings[sum] || "Número con vibración especial que combina múltiples influencias numerológicas."
    };
};

// Función principal para generar las 5 ventanas
const generateFiveWindows = (item: NombreItem | null, name: string): { title: string, content: string, icon: React.ElementType, emoji: string }[] => {
    const numerology = calculateNumerology(name);

    return [
        {
            title: "Origen y Significado",
            content: generateOriginContent(item, name),
            icon: BookText,
            emoji: "📚"
        },
        {
            title: "Legado y Personajes",
            content: generateLegacyContent(name),
            icon: Users,
            emoji: "👥"
        },
        {
            title: "Relato Poético",
            content: generatePoeticContent(name),
            icon: Feather,
            emoji: "🪶"
        },
        {
            title: "Narrativa Épica",
            content: generateEpicContent(name),
            icon: Sword,
            emoji: "⚔️"
        },
        {
            title: "Numerología",
            content: `El nombre ${name} resuena con la vibración del número ${numerology.number}. ${numerology.meaning}`,
            icon: Gem,
            emoji: "🔢"
        }
    ];
};

// --- Componentes de Tarjetas ---
const NameWindow = ({ title, content, icon: Icon, emoji, nombre }: {
    title: string,
    content: string,
    icon: React.ElementType,
    emoji: string,
    nombre: string
}) => (
    <div className="group relative bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-amber-900/20 transition-all duration-500 hover:border-amber-600/40 hover:shadow-lg hover:shadow-amber-900/10 hover:scale-[1.02]">
        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-amber-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full border border-amber-500/30 group-hover:border-amber-400/50 transition-colors duration-300">
                    <span className="text-2xl filter drop-shadow-sm">{emoji}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-serif text-xl text-amber-200 group-hover:text-amber-100 transition-colors duration-300 tracking-wide">{title}</h3>
                    <p className="text-xs text-amber-600/70 font-medium tracking-wider uppercase">{nombre}</p>
                </div>
            </div>

            <div className="relative">
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-light tracking-wide text-justify first-letter:text-3xl first-letter:font-serif first-letter:text-amber-300 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                    {content}
                </p>

                {/* Decoración sutil en la esquina */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </div>
    </div>
);

const NameResults = ({ item, name }: {
    item: NombreItem | null,
    name: string
}) => {
    // Generar siempre las 5 ventanas usando la función generateFiveWindows
    const windows = generateFiveWindows(item, name);

    // Determinar información del encabezado
    const displayName = item?.nombre || name;
    const origin = item?.origen || 'Origen Mixto';
    const gender = item?.genero === 'M' ? 'Masculino' : item?.genero === 'F' ? 'Femenino' : 'Unisex';

    return (
        <div className="w-full space-y-6">
            {/* Encabezado del nombre */}
            <div className="text-center mb-12">
                <div className="relative inline-block">
                    <h2 className="font-serif text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent mb-4 tracking-wide">
                        {displayName}
                    </h2>
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/10 via-amber-300/20 to-amber-400/10 blur-xl rounded-lg opacity-50"></div>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-400 text-lg mb-6">
                    <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-amber-900/30">{origin}</span>
                    <span className="w-2 h-2 bg-amber-500/50 rounded-full"></span>
                    <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-amber-900/30">{gender}</span>
                </div>
            </div>

            {/* Las cinco ventanas - SIEMPRE 5 */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {windows.map((window, index) => (
                    <NameWindow
                        key={index}
                        title={window.title}
                        content={window.content}
                        icon={window.icon}
                        emoji={window.emoji}
                        nombre={displayName}
                    />
                ))}
            </div>
        </div>
    );
};

function App() {
    const [raw, setRaw] = useState<NombreItem[] | null>(null);
    const [q, setQ] = useState('');
    const [hit, setHit] = useState<NombreItem | null>(null);
    const [fallbackResult, setFallbackResult] = useState<{ name: string, data: any, story: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        loadDataset().then(data => {
            setRaw(data);
            setLoading(false);
        });
    }, []);

    const byName = useMemo(() => {
        if (!raw) return new Map();
        const map = new Map<string, NombreItem>();
        for (const item of raw) {
            const key = normalize(item.nombre);
            map.set(key, item);
        }
        return map;
    }, [raw]);

    const handleSearch = (query: string) => {
        const name = query.trim();
        setSearched(true);
        if (!name) {
            setHit(null);
            setFallbackResult(null);
            return;
        }

        const key = normalize(name);
        const known = byName.get(key);

        // Siempre usar NameResults para mostrar las 5 ventanas
        setHit(known || null);
        setFallbackResult({ name, data: null, story: null });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 flex flex-col items-center relative overflow-hidden">
            {/* Efectos de fondo místicos */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-3xl mx-auto text-center mt-12 mb-12">
                <div className="mb-8">
                    <h1 className="font-serif text-6xl sm:text-7xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent mb-4 tracking-wide">
                        ONOMÁNTICA
                    </h1>
                    <p className="text-slate-300 text-xl sm:text-2xl font-light tracking-wide">
                        El poder de tu nombre
                    </p>
                </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSearch(q); }} className="relative w-full max-w-md mb-12">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Busca un nombre..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full pl-6 pr-14 py-4 bg-slate-800/60 backdrop-blur-sm border border-amber-900/30 rounded-full focus:ring-2 focus:ring-amber-400/50 focus:border-amber-500/50 focus:outline-none transition-all duration-300 text-slate-200 placeholder-slate-500 font-light tracking-wide"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-amber-600/20 hover:bg-amber-500/30 focus:bg-amber-500/30 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                        aria-label="Buscar nombre"
                    >
                        <Search className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-transparent to-amber-600/5 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            </form>

            {loading && (
                <div className="flex items-center gap-2 text-slate-500">
                    <LoaderCircle className="animate-spin h-5 w-5" />
                    <span>Cargando conocimiento...</span>
                </div>
            )}

            {!loading && searched && !hit && !fallbackResult && q && (
                <p className="text-slate-500">No se encontraron resultados para "{q}".</p>
            )}

            <div className="w-full max-w-6xl mx-auto">
                {fallbackResult && <NameResults item={hit} name={fallbackResult.name} />}
            </div>

            {/* Footer con créditos */}
            <Footer />
        </main>
    );
}

// Componente Footer con créditos
const Footer = () => (
    <footer className="mt-16 py-6 border-t border-amber-900/20">
        <div className="text-center">
            <p className="text-amber-600/70 text-sm font-light tracking-wide">
                Creado por Victor M.F. Avilan
            </p>
        </div>
    </footer>
);

export default App;