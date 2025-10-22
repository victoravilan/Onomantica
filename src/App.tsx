import React, { useState, useEffect, useMemo } from 'react';
import { Search, LoaderCircle, WandSparkles, BookText, Users, Feather, Sword, Gem, Share2, Mail, Download } from 'lucide-react';
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
        'Berna': 'De origen germánico, deriva de "Bern" que significa "oso". Históricamente asociado con la fuerza y protección. También es el nombre de la capital de Suiza, fundada en 1191 por Berthold V de Zähringen, quien según la leyenda le dio el nombre por el primer animal cazado en la zona: un oso. En el contexto religioso, San Bernardo de Claraval (1090-1153) popularizó este nombre en la tradición cristiana. El oso, en las culturas germánicas, simbolizaba la protección maternal y la conexión con los ciclos naturales.',
        
        'Margarita': 'Del latín "margarita" y del griego "margarites" (μαργαρίτης), que significa "perla". Este nombre evoca la belleza preciosa y la pureza. En la naturaleza, también se asocia con la flor margarita (Bellis perennis), símbolo de inocencia y amor puro. Geográficamente, es el nombre de la Isla de Margarita en Venezuela, descubierta por Cristóbal Colón en 1498 y nombrada así por las abundantes perlas encontradas en sus costas. En la tradición cristiana, Santa Margarita de Antioquía es patrona de las parturientas. Las perlas, formadas en las profundidades marinas, simbolizan la sabiduría nacida del sufrimiento transformado en belleza.',
        
        'Rosa': 'Del latín "rosa", directamente relacionado con la flor del mismo nombre. Simboliza la belleza, el amor y la pasión desde tiempos antiguos. En la mitología romana, la rosa estaba consagrada a Venus, diosa del amor. Este nombre evoca los atributos más hermosos de la naturaleza: fragancia, delicadeza y esplendor. Culturalmente, la rosa ha sido símbolo de secreto (sub rosa), amor cortés y devoción mariana en el cristianismo. En el Islam, la rosa representa la belleza divina, mientras que en el hinduismo simboliza el equilibrio. Su etimología se remonta al protoindoeuropeo *h₁reudhós (rojo), conectando el nombre con la pasión y la vitalidad.',
        
        'Victor': 'Del latín "victor", que significa "vencedor" o "conquistador". Deriva del verbo "vincere" (vencer), con raíces en el protoindoeuropeo *weik- (separar, conquistar). Este nombre romano clásico evoca triunfo, éxito y superación de obstáculos. En la tradición cristiana, muchos santos llevaron este nombre, simbolizando la victoria del bien sobre el mal. Su popularidad se extendió por Europa durante el Imperio Romano y resurgió en el siglo XIX. El concepto de victoria en Roma no solo implicaba conquista militar, sino también triunfo moral y espiritual.',
        
        'Luis': 'Del germánico "Hlodowig", compuesto por "hlod" (gloria, fama) y "wig" (combate, guerra), significando "guerrero glorioso" o "famoso en la batalla". Evolucionó al francés "Louis" y al español "Luis". Este nombre real por excelencia fue llevado por 18 reyes de Francia, siendo Luis IX (San Luis) canonizado por la Iglesia Católica. La transformación fonética del germánico al romance ilustra la evolución cultural europea. En la tradición franca, la gloria no se medía solo por victorias, sino por la justicia y protección del pueblo.',
        
        'Sofia': 'Del griego "Sophia" (Σοφία), que significa "sabiduría". Deriva del verbo "sophos" (sabio), con conexiones al protoindoeuropeo *seh₂p- (percibir, saber). En la filosofía griega antigua, Sophia representaba la sabiduría divina y el conocimiento supremo. En la tradición cristiana ortodoxa, Santa Sofía simboliza la Sabiduría Divina. El nombre evoca inteligencia, discernimiento y búsqueda de la verdad. Arquitectónicamente, la Hagia Sophia de Constantinopla fue dedicada a la Sabiduría Divina. En el gnosticismo, Sophia es la emanación divina femenina que conecta lo terrenal con lo celestial.',
        
        'Ana': 'Del hebreo "Hannah" (חַנָּה), que significa "gracia" o "compasión de Dios". Deriva de la raíz hebrea ḥ-n-n (mostrar favor, ser gracioso). En la tradición bíblica, Ana fue la madre del profeta Samuel, conocida por su fe y devoción. Este nombre evoca bondad, misericordia y favor divino. Su simplicidad y universalidad lo han convertido en uno de los nombres más extendidos en culturas cristianas, judías e islámicas. En el Nuevo Testamento, Ana la profetisa reconoció al niño Jesús en el templo. La gracia divina que representa trasciende las barreras culturales y religiosas.',
        
        'Carlos': 'Del germánico "Karl", que significa "hombre libre" o "varón". Deriva del protoindoeuropeo *ǵerh₂- (envejecer, madurar), sugiriendo sabiduría y experiencia. Este nombre evoca libertad, nobleza y liderazgo. Fue popularizado por Carlomagno (Carlos el Grande), emperador del Sacro Imperio Romano Germánico. La palabra "rey" en muchos idiomas eslavos deriva de "Karl", testimoniando su asociación con el poder y la realeza. En la sociedad germánica, ser "libre" implicaba no solo ausencia de servidumbre, sino también responsabilidad hacia la comunidad.',
        
        'Pablo': 'Del latín "Paulus", que significa "pequeño" o "humilde". Deriva del adjetivo latino "paulus" (poco, pequeño), posiblemente relacionado con el protoindoeuropeo *peh₂w- (poco, pequeño). Paradójicamente, este nombre evoca grandeza espiritual y transformación. San Pablo de Tarso, originalmente Saulo, se convirtió en el gran evangelizador del cristianismo. El nombre simboliza la capacidad de cambio, la humildad que conduce a la grandeza y la fuerza en la aparente debilidad. En la filosofía cristiana, la pequeñez se convierte en fortaleza a través de la fe.',
        
        'Isabel': 'Del hebreo "Elisheba" (אֱלִישֶׁבַע), que significa "Dios es mi juramento" o "consagrada a Dios". Compuesto por "El" (Dios) y "sheba" (juramento, siete - número de perfección). En la tradición bíblica, Isabel fue la madre de Juan el Bautista. Este nombre real evoca devoción, compromiso sagrado y nobleza espiritual. Ha sido llevado por numerosas reinas y santas, simbolizando la unión entre poder terrenal y devoción divina. El número siete en la cultura hebrea representa completitud y perfección divina.',
        
        'María': 'Del hebreo "Miryam" (מִרְיָם), posiblemente derivado de "mar" (amargo) o del egipcio "mry" (amada). Algunos eruditos sugieren conexión con "marah" (rebelión) o "mara" (señora). Es el nombre más venerado en el cristianismo por la Virgen María. En el judaísmo, Miriam fue la hermana de Moisés y Aarón, profetisa y líder. Su etimología incierta refleja la antigüedad y complejidad cultural del nombre. Representa maternidad divina, pureza y intercesión.',
        
        'José': 'Del hebreo "Yosef" (יוֹסֵף), que significa "Dios añadirá" o "que Dios multiplique". Deriva del verbo "yasaf" (añadir, aumentar). En el Antiguo Testamento, José fue el hijo predilecto de Jacob, vendido por sus hermanos y convertido en gobernador de Egipto. En el Nuevo Testamento, San José fue el padre adoptivo de Jesús. El nombre simboliza providencia divina, perdón y prosperidad a través de la adversidad. Representa la confianza en que Dios multiplica las bendiciones.',
        
        'Antonio': 'Del latín "Antonius", nombre de una antigua gens romana. Posiblemente deriva del griego "anthos" (flor) o del etrusco. Marco Antonio fue el famoso general romano. San Antonio de Padua y San Antonio Abad son figuras veneradas. El nombre evoca nobleza romana, liderazgo y devoción espiritual. En la tradición cristiana, representa la lucha contra las tentaciones y la búsqueda de la perfección espiritual.',
        
        'Francisco': 'Del latín "Franciscus", que significa "francés" o "hombre libre". Deriva de "Francus" (franco), pueblo germánico conocido por su libertad. San Francisco de Asís (1181-1226) transformó el significado del nombre, asociándolo con pobreza voluntaria, amor a la naturaleza y paz. El nombre evoca libertad espiritual, simplicidad y conexión con la creación. Representa la renuncia a lo material para encontrar la verdadera riqueza espiritual.',
        
        'Manuel': 'Del hebreo "Immanuel" (עִמָּנוּאֵל), que significa "Dios con nosotros". Compuesto por "im" (con), "anu" (nosotros) y "El" (Dios). Es un nombre mesiánico en la tradición judeo-cristiana, profetizado por Isaías. Representa la presencia divina entre los humanos, la esperanza y la salvación. En la cultura hispana, es especialmente venerado como advocación de Cristo. Simboliza la cercanía de lo divino en lo cotidiano.',
        
        'Carmen': 'Del latín "carmen", que significa "canto" o "poema". Deriva del protoindoeuropeo *kan- (cantar). En la tradición cristiana, se asocia con la Virgen del Carmen, patrona de los marineros. El Monte Carmelo en Israel fue hogar de profetas y ermitaños. El nombre evoca música, poesía y contemplación mística. Representa la belleza expresada a través del arte y la devoción espiritual.',
        
        'Teresa': 'Origen incierto, posiblemente del griego "therizo" (cosechar) o "theros" (verano). Algunos sugieren origen ibérico pre-romano. Santa Teresa de Ávila (1515-1582) y Santa Teresa de Lisieux son figuras místicas prominentes. El nombre evoca contemplación, reforma espiritual y unión mística con lo divino. Representa la búsqueda de la perfección interior y la experiencia directa de lo sagrado.',
        
        'Alejandro': 'Del griego "Alexandros" (Ἀλέξανδρος), compuesto por "alexo" (proteger, defender) y "andros" (hombre). Significa "el que protege a los hombres" o "defensor de la humanidad". Alejandro Magno (356-323 a.C.) extendió la cultura helenística hasta la India. El nombre evoca liderazgo, conquista y fusión cultural. Representa la capacidad de unir mundos diferentes bajo una visión común.',
        
        'Javier': 'Del euskera "Etxeberria", que significa "casa nueva". San Francisco Javier (1506-1552) fue misionero jesuita en Asia. El castillo de Javier en Navarra dio origen al apellido. El nombre evoca renovación, misión evangelizadora y apertura a culturas diferentes. Representa la construcción de nuevos hogares espirituales y la expansión de horizontes.',
        
        'Miguel': 'Del hebreo "Mikael" (מִיכָאֵל), que significa "¿quién como Dios?". Es una pregunta retórica que afirma la unicidad divina. En la tradición judeo-cristiana, Miguel es el arcángel guerrero que defiende al pueblo de Dios. El nombre evoca protección divina, justicia y lucha contra el mal. Representa la fuerza espiritual que defiende la verdad y la rectitud.',
        
        'David': 'Del hebreo "Dawid" (דָּוִד), que significa "amado" o "querido". Deriva de la raíz d-w-d (amar). El rey David fue el segundo rey de Israel, músico, poeta y guerrero. Los Salmos se le atribuyen tradicionalmente. El nombre evoca liderazgo inspirado, creatividad artística y devoción a Dios. Representa la unión entre poder temporal y sensibilidad espiritual.',
        
        'Daniel': 'Del hebreo "Daniyyel" (דָּנִיֵּאל), que significa "Dios es mi juez". Compuesto por "dan" (juzgar) y "El" (Dios). El profeta Daniel interpretó sueños en Babilonia y sobrevivió al foso de los leones. El nombre evoca sabiduría, interpretación de misterios y fe inquebrantable. Representa la confianza en la justicia divina y la capacidad de mantener la fe en adversidades.',
        
        'Pedro': 'Del latín "Petrus", que deriva del griego "Petros" (πέτρος), que significa "piedra" o "roca". Jesús dio este nombre a Simón, diciendo "tú eres Pedro, y sobre esta piedra edificaré mi iglesia". El nombre evoca solidez, fundamento y liderazgo espiritual. Representa la firmeza en la fe y la capacidad de ser base para otros.',
        
        'Juan': 'Del hebreo "Yohanan" (יוֹחָנָן), que significa "Dios es misericordioso" o "gracia de Dios". Compuesto por "Yah" (Yahvé) y "hanan" (ser gracioso). Juan el Bautista y Juan el Evangelista son figuras centrales del cristianismo. El nombre evoca misericordia divina, testimonio y amor. Representa la gracia que transforma y la capacidad de dar testimonio de la verdad.',
        
        'Elena': 'Del griego "Helene" (Ἑλένη), posiblemente derivado de "helios" (sol) o "selene" (luna). En la mitología griega, Helena de Troya fue considerada la mujer más bella del mundo. El nombre evoca luminosidad, belleza y magnetismo personal. Representa la capacidad de inspirar y la conexión con los ciclos celestiales.',
        
        'Roberto': 'Del germánico "Hrodebert", compuesto por "hrod" (gloria, fama) y "beraht" (brillante, ilustre). Significa "el que brilla por su gloria" o "famoso por su esplendor". Este nombre evoca liderazgo natural, carisma y la capacidad de destacar por méritos propios. Representa el equilibrio entre ambición noble y humildad.',
        
        'Carmen': 'Del latín "carmen", que significa "canto" o "poema". También se asocia con el Monte Carmelo en Israel, lugar sagrado de contemplación. En la tradición cristiana, la Virgen del Carmen es patrona de los marineros. El nombre evoca arte, espiritualidad y protección divina. Representa la belleza expresada a través de la creatividad.',
        
        'Fernando': 'Del germánico "Ferdinando", compuesto por "fardi" (viaje, expedición) y "nand" (audaz, valiente). Significa "viajero audaz" o "valiente en el camino". Este nombre real español evoca aventura, coraje y exploración. Representa el espíritu pionero y la valentía para emprender nuevos caminos.',
        
        'Lucía': 'Del latín "Lucia", derivado de "lux" (luz). Santa Lucía es patrona de la vista y la luz. El nombre evoca claridad, iluminación espiritual y sabiduría. En las tradiciones nórdicas, Santa Lucía trae luz en la época más oscura del año. Representa la capacidad de guiar a otros y disipar las tinieblas.',
        
        'Andrés': 'Del griego "Andreas" (Ἀνδρέας), derivado de "andros" (hombre, varón). San Andrés fue uno de los doce apóstoles, pescador llamado por Jesús. El nombre evoca masculinidad equilibrada, servicio y dedicación. Representa la fuerza puesta al servicio de ideales superiores.',
        
        'Beatriz': 'Del latín "Beatrix", que significa "la que hace feliz" o "portadora de bendiciones". Deriva de "beatus" (bendito, feliz). Beatriz fue la musa de Dante en la Divina Comedia, símbolo de amor puro y guía espiritual. El nombre evoca alegría, inspiración y elevación del alma.',
        
        'Ricardo': 'Del germánico "Ricohard", compuesto por "ric" (poder, dominio) y "hard" (fuerte, valiente). Significa "gobernante fuerte" o "poderoso y valiente". Ricardo Corazón de León fue un rey cruzado legendario. El nombre evoca liderazgo, determinación y justicia. Representa el poder ejercido con honor.',
        
        'Esperanza': 'Del latín "sperare", que significa "esperar" o "tener esperanza". Es una de las tres virtudes teologales cristianas junto con la fe y la caridad. El nombre evoca optimismo, confianza en el futuro y fortaleza espiritual. Representa la capacidad de mantener la luz interior en tiempos difíciles.',
        
        'Guillermo': 'Del germánico "Willahelm", compuesto por "willa" (voluntad, deseo) y "helm" (yelmo, protección). Significa "protector decidido" o "el que protege con voluntad firme". Guillermo el Conquistador cambió la historia de Inglaterra. El nombre evoca determinación, protección y liderazgo estratégico.',
        
        'Valentina': 'Del latín "Valentinus", derivado de "valens" (fuerte, vigoroso). Santa Valentina fue mártir cristiana. El nombre evoca fortaleza interior, coraje y capacidad de resistencia. Representa la valentía femenina y la determinación para defender los propios valores.',
        
        'Sebastián': 'Del griego "Sebastianos" (Σεβαστιανός), que significa "venerable" o "augusto". Deriva de "sebastos", título de honor equivalente al latín "augustus". San Sebastián fue mártir romano. El nombre evoca dignidad, honor y resistencia ante la adversidad.',
        
        'Cristina': 'Del latín "Christianus", que significa "seguidor de Cristo" o "cristiana". Santa Cristina fue mártir en el siglo III. El nombre evoca fe, devoción y pureza espiritual. Representa la conexión con lo divino y la capacidad de inspirar a otros a través del ejemplo.',
        
        'Rodrigo': 'Del germánico "Hrodric", compuesto por "hrod" (gloria, fama) y "ric" (poder, dominio). Significa "famoso por su poder" o "glorioso gobernante". Rodrigo fue el último rey visigodo de España. El nombre evoca nobleza, liderazgo y legado histórico.'
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
    // Base de personajes históricos por nombre (expandir según necesidad)
    const historicalFigures: Record<string, string> = {
        'Victor': 'Víctor Hugo (1802-1885), escritor francés autor de "Los Miserables" y "El Jorobado de Notre Dame", figura clave del romanticismo literario. Su obra influyó profundamente en la literatura mundial.',
        'Luis': 'Luis XIV de Francia (1638-1715), conocido como el Rey Sol, monarca que llevó a Francia a su máximo esplendor cultural y político durante el siglo XVII.',
        'Sofia': 'Sofía de Grecia (1938-2014), reina consorte de España, reconocida por su labor humanitaria y su papel en la transición democrática española.',
        'Alejandro': 'Alejandro Magno (356-323 a.C.), rey de Macedonia cuyas conquistas crearon uno de los imperios más grandes de la historia antigua, extendiendo la cultura helenística.',
        'Maria': 'María Curie (1867-1934), científica polaca-francesa, primera mujer en ganar un Premio Nobel y única persona en ganar Nobel en dos disciplinas científicas diferentes.',
        'Carlos': 'Carlos Darwin (1809-1882), naturalista británico cuya teoría de la evolución revolucionó la comprensión científica de la vida en la Tierra.',
        'Ana': 'Ana Frank (1929-1945), joven escritora alemana cuyo diario se convirtió en testimonio fundamental sobre el Holocausto y símbolo de esperanza.',
        'Pablo': 'Pablo Picasso (1881-1973), pintor español cofundador del cubismo, una de las figuras más influyentes del arte del siglo XX.',
        'Isabel': 'Isabel la Católica (1451-1504), reina de Castilla cuyo reinado marcó la unificación de España y el descubrimiento de América.',
        'Miguel': 'Miguel de Cervantes (1547-1616), escritor español autor de "Don Quijote de la Mancha", considerada la primera novela moderna.'
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
        9: "Humanitarismo, compasión y finalización. Es el número del idealista y el filántropo. Tiene una visión global y un profundo amor por la humanidad. Su misión es servir desinteresadamente y cerrar ciclos.",
        11: "Intuición, inspiración y iluminación. Es un número maestro que representa la conexión espiritual elevada. Posee una sensibilidad psíquica natural y capacidad visionaria.",
        22: "Construcción en gran escala y manifestación de sueños. Es el 'Maestro Constructor' que puede materializar visiones grandiosas en la realidad física.",
        33: "Maestría espiritual y servicio universal. Representa la compasión elevada y la capacidad de sanar y enseñar a nivel global."
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

// Configuración de las cinco ventanas/tarjetas
const windowConfig = [
    { id: "origen", title: "Origen y Significado", icon: BookText, emoji: "📚" },
    { id: "legado", title: "Legado y Personajes", icon: Users, emoji: "👥" },
    { id: "poetica", title: "Relato Poético", icon: Feather, emoji: "🪶" },
    { id: "epica", title: "Narrativa Épica", icon: Sword, emoji: "⚔️" },
    { id: "numerologia", title: "Numerología", icon: Gem, emoji: "🔢" }
];

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

const NameResults = ({ item, name, onShare }: { 
    item: NombreItem | null, 
    name: string,
    onShare: (name: string, item: NombreItem | null) => void 
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
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/10 via-amber-300/20 to-amber-400/10 blur-xl rounded-lg opacity-50 pointer-events-none"></div>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-400 text-lg mb-6">
                    <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-amber-900/30">{origin}</span>
                    <span className="w-2 h-2 bg-amber-500/50 rounded-full"></span>
                    <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-amber-900/30">{gender}</span>
                </div>
                
                {/* Botón de compartir */}
                <button type="button"
                    onClick={() => onShare(displayName, item)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/30 rounded-full text-amber-200 hover:from-amber-500/30 hover:to-amber-400/30 hover:border-amber-400/50 hover:text-amber-100 transition-all duration-300 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Compartir
                </button>
            </div>

            {/* Las cinco ventanas - SIEMPRE 5 */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {windows.map((window, index) => (
                    <NameWindow
                        key={windowConfig[index].id}
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

const FallbackCard = ({ name, data, story }: { name: string, data: { origen: string, significado: string }, story: { tipo: string, relato: string } }) => (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 transition-all hover:border-slate-600 hover:bg-slate-800">
        <div className="flex justify-between items-start">
            <h3 className="font-serif text-2xl text-amber-300">{name}</h3>
            <span className="flex items-center gap-2 text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
                <WandSparkles className="h-3 w-3" />
                Generado
            </span>
        </div>
        <p className="text-sm text-slate-400 mb-4">{data.origen}</p>
        <p className="mb-4 text-slate-300">{data.significado}</p>
        <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-amber-400/80 mb-2 capitalize">{story.tipo.replace(/a$/, 'a')}</p>
            <p className="text-slate-400 text-sm whitespace-pre-wrap">{story.relato}</p>
        </div>
    </div>
);

function App() {
    const [raw, setRaw] = useState<NombreItem[] | null>(null);
    const [q, setQ] = useState('');
    const [hit, setHit] = useState<NombreItem | null>(null);
    const [fallbackResult, setFallbackResult] = useState<{ name: string, data: any, story: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    
    // Estados para modales
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState<{ name: string, item: NombreItem | null } | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        loadDataset().then(data => {
            setRaw(data);
            setLoading(false);
        });
    }, []);

    const byName = useMemo(() => {
        if (!raw) return new Map<string, NombreItem>();
        const m = new Map<string, NombreItem>();
        for (const r of raw) m.set(normalize(r.nombre), r);
        return m;
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

    const handleShare = (name: string, item: NombreItem | null) => {
        console.log('handleShare called with:', name, item);
        setShareData({ name, item });
        setShareModalOpen(true);
        console.log('Modal should open now');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 flex flex-col items-center relative overflow-hidden">
            {/* Efectos de fondo místicos */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 w-full max-w-3xl mx-auto text-center mt-12 mb-12">
                <div className="relative mb-6">
                    <img src="/img/logo-onomantica.png" alt="Logo de Onomántica" className="w-24 h-24 mx-auto mb-4 filter drop-shadow-lg" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent blur-xl"></div>
                </div>
                <h1 className="font-serif text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent tracking-wider mb-2">
                    Onomántica
                </h1>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4"></div>
                <p className="text-slate-400 text-lg font-light tracking-wide">Descubre la historia y el alma detrás de cada nombre</p>
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
                {fallbackResult && <NameResults item={hit} name={fallbackResult.name} onShare={handleShare} />}
            </div>
            
            {/* Footer con créditos */}
            <Footer />
        </main>
        
        {shareModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-800 rounded-2xl border border-amber-900/30 shadow-2xl max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-serif text-amber-200">Compartir "{shareData?.name}"</h2>
                        <button
                            onClick={() => setShareModalOpen(false)}
                            className="p-2 rounded-full hover:bg-amber-900/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Opciones de compartir */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                const shareUrl = `${window.location.origin}${window.location.pathname}?nombre=${encodeURIComponent(shareData?.name || '')}`;
                                const shareText = `Descubre el significado del nombre "${shareData?.name}" en Onomántica`;
                                const message = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
                                window.open(`https://wa.me/?text=${message}`, '_blank');
                                setShareModalOpen(false);
                            }}
                            className="w-full p-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            Compartir en WhatsApp
                        </button>

                        <button
                            onClick={() => {
                                const shareUrl = `${window.location.origin}${window.location.pathname}?nombre=${encodeURIComponent(shareData?.name || '')}`;
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                                setShareModalOpen(false);
                            }}
                            className="w-full p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Compartir en Facebook
                        </button>

                        <button
                            onClick={() => {
                                const shareUrl = `${window.location.origin}${window.location.pathname}?nombre=${encodeURIComponent(shareData?.name || '')}`;
                                const shareText = `Descubre el significado del nombre "${shareData?.name}" en Onomántica`;
                                const tweet = encodeURIComponent(`${shareText} ${shareUrl}`);
                                window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
                                setShareModalOpen(false);
                            }}
                            className="w-full p-3 bg-sky-600/20 border border-sky-500/30 rounded-xl text-sky-300 hover:bg-sky-500/30 transition-all flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            Compartir en Twitter
                        </button>

                        <button
                            onClick={() => {
                                const windows = generateFiveWindows(shareData?.item || null, shareData?.name || '');
                                const origin = shareData?.item?.origen || 'Origen Mixto';
                                const gender = shareData?.item?.genero === 'M' ? 'Masculino' : shareData?.item?.genero === 'F' ? 'Femenino' : 'Unisex';
                                
                                let content = `ONOMÁNTICA - El poder de tu nombre\n`;
                                content += `==========================================\n\n`;
                                content += `NOMBRE: ${shareData?.name}\n`;
                                content += `ORIGEN: ${origin}\n`;
                                content += `GÉNERO: ${gender}\n\n`;
                                
                                windows.forEach((window, index) => {
                                    content += `${index + 1}. ${window.title.toUpperCase()}\n`;
                                    content += `${'='.repeat(window.title.length + 3)}\n`;
                                    content += `${window.content}\n\n`;
                                });
                                
                                content += `\n--\n`;
                                content += `Generado por Onomántica - El poder de tu nombre\n`;
                                content += `${window.location.origin}\n`;
                                content += `Creado por Victor M.F. Avilan`;
                                
                                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `${shareData?.name}_Onomantica.txt`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                                setShareModalOpen(false);
                            }}
                            className="w-full p-3 bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-3"
                        >
                            <Download className="w-5 h-5" />
                            Descargar resultado completo
                        </button>

                        <button
                            onClick={async () => {
                                const shareUrl = `${window.location.origin}${window.location.pathname}?nombre=${encodeURIComponent(shareData?.name || '')}`;
                                try {
                                    await navigator.clipboard.writeText(shareUrl);
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                } catch (err) {
                                    const textArea = document.createElement('textarea');
                                    textArea.value = shareUrl;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                }
                            }}
                            className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                                copySuccess 
                                    ? 'bg-green-600/20 border-green-500/30 text-green-300' 
                                    : 'bg-purple-600/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                            }`}
                        >
                            {copySuccess ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    ¡Enlace copiado!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copiar enlace
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
    );
}

// Componente Modal base reutilizable
const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => {
    // Cerrar con tecla Escape
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 rounded-2xl border border-amber-900/30 shadow-2xl shadow-black/50 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-amber-900/20">
                    <h2 className="text-2xl font-serif text-amber-200 tracking-wide">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-amber-900/20 transition-colors duration-200 group"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Funciones de compartir
const shareUtils = {
    copyToClipboard: async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },
    
    shareWhatsApp: (text: string, url: string) => {
        const message = encodeURIComponent(`${text}\n\n${url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    },
    
    shareFacebook: (url: string) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    },
    
    shareTwitter: (text: string, url: string) => {
        const tweet = encodeURIComponent(`${text} ${url}`);
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
    },
    
    shareEmail: (subject: string, body: string) => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    },
    
    downloadAsText: (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    generateFullContent: (name: string, item: NombreItem | null): string => {
        const windows = generateFiveWindows(item, name);
        const displayName = item?.nombre || name;
        const origin = item?.origen || 'Origen Mixto';
        const gender = item?.genero === 'M' ? 'Masculino' : item?.genero === 'F' ? 'Femenino' : 'Unisex';
        
        let content = `ONOMÁNTICA - El poder de tu nombre\n`;
        content += `==========================================\n\n`;
        content += `NOMBRE: ${displayName}\n`;
        content += `ORIGEN: ${origin}\n`;
        content += `GÉNERO: ${gender}\n\n`;
        
        windows.forEach((window, index) => {
            content += `${index + 1}. ${window.title.toUpperCase()}\n`;
            content += `${'='.repeat(window.title.length + 3)}\n`;
            content += `${window.content}\n\n`;
        });
        
        content += `\n--\n`;
        content += `Generado por Onomántica - El poder de tu nombre\n`;
        content += `${window.location.origin}\n`;
        content += `Creado por Victor M.F. Avilan`;
        
        return content;
    }
};

// Componente ShareModal
const ShareModal = ({ isOpen, onClose, name, item, copySuccess, setCopySuccess }: {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    item: NombreItem | null;
    copySuccess: boolean;
    setCopySuccess: (success: boolean) => void;
}) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?nombre=${encodeURIComponent(name)}`;
    const shareText = `Descubre el significado del nombre "${name}" en Onomántica - El poder de tu nombre`;

    const handleCopyLink = async () => {
        const success = await shareUtils.copyToClipboard(shareUrl);
        setCopySuccess(success);
        if (success) {
            setTimeout(() => setCopySuccess(false), 3000);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Compartir Resultado">
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-xl font-serif text-amber-200 mb-2">"{name}"</h3>
                    <p className="text-slate-300 text-sm">Comparte este resultado con tus amigos</p>
                </div>

                {/* Botón copiar enlace */}
                <div className="space-y-3">
                    <button
                        onClick={handleCopyLink}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 ${
                            copySuccess 
                                ? 'bg-green-600/20 border-green-500/50 text-green-300' 
                                : 'bg-amber-600/20 border-amber-500/30 text-amber-200 hover:bg-amber-500/30 hover:border-amber-400/50'
                        }`}
                    >
                        {copySuccess ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                ¡Enlace copiado!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copiar enlace
                            </>
                        )}
                    </button>
                </div>

                {/* Botones de redes sociales */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => shareUtils.shareWhatsApp(shareText, shareUrl)}
                        className="p-4 rounded-xl bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        WhatsApp
                    </button>

                    <button
                        onClick={() => shareUtils.shareFacebook(shareUrl)}
                        className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>

                    <button
                        onClick={() => shareUtils.shareTwitter(shareText, shareUrl)}
                        className="p-4 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 hover:bg-sky-500/30 hover:border-sky-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                    </button>

                    <button
                        onClick={() => {
                            const emailSubject = `Significado del nombre "${name}" - Onomántica`;
                            const emailBody = `${shareText}\n\n${shareUrl}\n\nDescubre más nombres en Onomántica - El poder de tu nombre`;
                            shareUtils.shareEmail(emailSubject, emailBody);
                        }}
                        className="p-4 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Mail className="w-5 h-5" />
                        Correo
                    </button>

                    <button
                        onClick={() => {
                            const fullContent = shareUtils.generateFullContent(name, shareData?.item || null);
                            shareUtils.downloadAsText(fullContent, `${name}_Onomantica.txt`);
                        }}
                        className="p-4 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Descargar
                    </button>

                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `Significado del nombre "${name}"`,
                                    text: shareText,
                                    url: shareUrl
                                }).catch(console.error);
                            } else {
                                // Fallback: copiar al portapapeles
                                shareUtils.copyToClipboard(`${shareText}\n${shareUrl}`);
                            }
                        }}
                        className="p-4 rounded-xl bg-slate-600/20 border border-slate-500/30 text-slate-300 hover:bg-slate-500/30 hover:border-slate-400/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        Más opciones
                    </button>
                </div>

                <div className="text-center text-xs text-slate-500">
                    Comparte el poder de los nombres con el mundo
                </div>
            </div>
        </Modal>
    );
};

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
