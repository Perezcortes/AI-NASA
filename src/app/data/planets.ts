export interface Planet {
  name: string;
  order: number;
  type: string;
  distanceFromSun: {
    km: string;
    au: string;
  };
  radius: string;
  mass: string;
  gravity: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  avgTemperature: string;
  moons: Moon[];
  description: string;
  composition: string;
  discovery: string;
  notableFeatures: string[];
}

export interface Moon {
  name: string;
  discovered: string;
  diameter: string;
  facts: string;
}

export const planets: Planet[] = [
  {
    name: "Mercurio",
    order: 1,
    type: "Terrestre",
    distanceFromSun: {
      km: "57.9 millones de km",
      au: "0.39 UA"
    },
    radius: "2,439.7 km",
    mass: "3.3011×10²³ kg",
    gravity: "3.7 m/s²",
    rotationPeriod: "58.6 días terrestres",
    orbitalPeriod: "88 días terrestres",
    avgTemperature: "167°C",
    moons: [],
    description: "Mercurio es el planeta más pequeño y el más cercano al Sol en el Sistema Solar.",
    composition: "Rocoso con un gran núcleo de hierro",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Mayores variaciones de temperatura",
      "Prácticamente sin atmósfera",
      "Superficie llena de cráteres"
    ]
  },
  {
    name: "Venus",
    order: 2,
    type: "Terrestre",
    distanceFromSun: {
      km: "108.2 millones de km",
      au: "0.72 UA"
    },
    radius: "6,051.8 km",
    mass: "4.8675×10²⁴ kg",
    gravity: "8.87 m/s²",
    rotationPeriod: "243 días terrestres (retrógrado)",
    orbitalPeriod: "225 días terrestres",
    avgTemperature: "464°C",
    moons: [],
    description: "Venus es el segundo planeta desde el Sol y el más cercano a la Tierra en tamaño y masa.",
    composition: "Rocoso con una atmósfera densa de CO₂",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Planeta más caliente del Sistema Solar",
      "Presión superficial 92 veces la de la Tierra",
      "Rotación retrógrada (gira al revés)"
    ]
  },
  {
    name: "Tierra",
    order: 3,
    type: "Terrestre",
    distanceFromSun: {
      km: "149.6 millones de km",
      au: "1 UA"
    },
    radius: "6,371 km",
    mass: "5.9722×10²⁴ kg",
    gravity: "9.81 m/s²",
    rotationPeriod: "24 horas",
    orbitalPeriod: "365.25 días",
    avgTemperature: "15°C",
    moons: [
      {
        name: "Luna",
        discovered: "Prehistoria",
        diameter: "3,474.8 km",
        facts: "Único satélite natural de la Tierra; responsable de las mareas y la estabilidad axial."
      }
    ],
    description: "Nuestro hogar y el único planeta conocido que alberga vida en el universo.",
    composition: "Rocoso con una atmósfera rica en nitrógeno y oxígeno",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Presencia de agua líquida",
      "Campo magnético protector",
      "Diversidad biológica única"
    ]
  },
  {
    name: "Marte",
    order: 4,
    type: "Terrestre",
    distanceFromSun: {
      km: "227.9 millones de km",
      au: "1.52 UA"
    },
    radius: "3,389.5 km",
    mass: "6.4171×10²³ kg",
    gravity: "3.71 m/s²",
    rotationPeriod: "24.6 horas",
    orbitalPeriod: "687 días terrestres",
    avgTemperature: "-63°C",
    moons: [
      {
        name: "Fobos",
        discovered: "1877 por Asaph Hall",
        diameter: "22.4 km",
        facts: "Se acerca lentamente a Marte y eventualmente chocará con él o se desintegrará."
      },
      {
        name: "Deimos",
        discovered: "1877 por Asaph Hall",
        diameter: "12.4 km",
        facts: "Pequeño y más alejado; puede escapar de la órbita de Marte en el futuro."
      }
    ],
    description: "Marte, el planeta rojo, es el objetivo principal en la búsqueda de vida extraterrestre.",
    composition: "Rocoso con atmósfera delgada de CO₂",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Monte Olimpo (el volcán más alto del sistema solar)",
      "Valles Marineris (cañón más grande conocido)",
      "Posibles rastros de agua líquida subterránea"
    ]
  },
  {
    name: "Júpiter",
    order: 5,
    type: "Gaseoso",
    distanceFromSun: {
      km: "778.5 millones de km",
      au: "5.20 UA"
    },
    radius: "69,911 km",
    mass: "1.8982×10²⁷ kg",
    gravity: "24.79 m/s²",
    rotationPeriod: "9.9 horas",
    orbitalPeriod: "11.9 años terrestres",
    avgTemperature: "-108°C",
    moons: [
      {
        name: "Ío",
        discovered: "1610 por Galileo Galilei",
        diameter: "3,643.2 km",
        facts: "Cuerpo con mayor actividad volcánica del sistema solar"
      },
      {
        name: "Europa",
        discovered: "1610 por Galileo Galilei",
        diameter: "3,121.6 km",
        facts: "Océano subsuperficial de agua líquida bajo su corteza helada"
      },
      {
        name: "Ganimedes",
        discovered: "1610 por Galileo Galilei",
        diameter: "5,268.2 km",
        facts: "Luna más grande del sistema solar (mayor que Mercurio)"
      },
      {
        name: "Calisto",
        discovered: "1610 por Galileo Galilei",
        diameter: "4,820.6 km",
        facts: "Superficie antigua con más cráteres del sistema solar"
      }
    ],
    description: "Júpiter, el gigante gaseoso, es el planeta más masivo del sistema solar.",
    composition: "Principalmente hidrógeno y helio (similar a una estrella fallida)",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Gran Mancha Roja (tormenta anticiclónica gigante)",
      "Sistema de anillos tenues",
      "Campo magnético 14 veces más fuerte que el terrestre"
    ]
  },
  {
    name: "Saturno",
    order: 6,
    type: "Gaseoso",
    distanceFromSun: {
      km: "1,429 millones de km",
      au: "9.58 UA"
    },
    radius: "58,232 km",
    mass: "5.6834×10²⁶ kg",
    gravity: "10.44 m/s²",
    rotationPeriod: "10.7 horas",
    orbitalPeriod: "29.45 años terrestres",
    avgTemperature: "-140°C",
    moons: [
      {
        name: "Titán",
        discovered: "1655 por Christiaan Huygens",
        diameter: "5,151.8 km",
        facts: "Única luna con atmósfera densa y cuerpos líquidos estables en su superficie"
      },
      {
        name: "Encélado",
        discovered: "1789 por William Herschel",
        diameter: "504.2 km",
        facts: "Géiseres de agua que sugieren un océano global subterráneo"
      }
    ],
    description: "Saturno es famoso por su impresionante sistema de anillos visibles desde la Tierra.",
    composition: "Principalmente hidrógeno y helio (el planeta menos denso)",
    discovery: "Conocido desde la antigüedad",
    notableFeatures: [
      "Sistema de anillos complejo (principalmente hielo de agua)",
      "82 lunas confirmadas",
      "Polo norte con patrón hexagonal único"
    ]
  },
  {
    name: "Urano",
    order: 7,
    type: "Gigante helado",
    distanceFromSun: {
      km: "2,871 millones de km",
      au: "19.22 UA"
    },
    radius: "25,362 km",
    mass: "8.6810×10²⁵ kg",
    gravity: "8.69 m/s²",
    rotationPeriod: "17.2 horas (rotación retrógrada)",
    orbitalPeriod: "84 años terrestres",
    avgTemperature: "-195°C",
    moons: [
      {
        name: "Titania",
        discovered: "1787 por William Herschel",
        diameter: "1,577.8 km",
        facts: "Luna más grande de Urano con cañones gigantescos"
      },
      {
        name: "Oberón",
        discovered: "1787 por William Herschel",
        diameter: "1,522.8 km",
        facts: "Superficie antigua con materiales oscuros en sus cráteres"
      }
    ],
    description: "Urano es único por su rotación lateral extrema, como si rodara alrededor del Sol.",
    composition: "Hielos de agua, metano y amoníaco sobre un núcleo rocoso",
    discovery: "1781 por William Herschel",
    notableFeatures: [
      "Eje de rotación inclinado 98° (gira de lado)",
      "Atmósfera más fría del sistema solar",
      "13 anillos oscuros y estrechos"
    ]
  },
  {
    name: "Neptuno",
    order: 8,
    type: "Gigante helado",
    distanceFromSun: {
      km: "4,498 millones de km",
      au: "30.07 UA"
    },
    radius: "24,622 km",
    mass: "1.0243×10²⁶ kg",
    gravity: "11.15 m/s²",
    rotationPeriod: "16.1 horas",
    orbitalPeriod: "164.8 años terrestres",
    avgTemperature: "-200°C",
    moons: [
      {
        name: "Tritón",
        discovered: "1846 por William Lassell",
        diameter: "2,706.8 km",
        facts: "Única luna grande con órbita retrógrada (probablemente capturada)"
      }
    ],
    description: "Neptuno es el planeta más ventoso con las velocidades de viento más altas medidas.",
    composition: "Similar a Urano pero con mayor actividad atmosférica",
    discovery: "1846 por Johann Galle (predicho matemáticamente por Urbain Le Verrier)",
    notableFeatures: [
      "Vientos supersónicos (hasta 2,100 km/h)",
      "Gran Mancha Oscura (sistema de tormentas gigantes)",
      "Tritón: geológicamente activo con géiseres de nitrógeno"
    ]
  }
];