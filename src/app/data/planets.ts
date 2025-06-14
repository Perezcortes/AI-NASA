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
    name: "Mercury",
    order: 1,
    type: "Terrestrial",
    distanceFromSun: {
      km: "57.9 million km",
      au: "0.39 AU"
    },
    radius: "2,439.7 km",
    mass: "3.3011×10²³ kg",
    gravity: "3.7 m/s²",
    rotationPeriod: "58.6 Earth days",
    orbitalPeriod: "88 Earth days",
    avgTemperature: "167°C",
    moons: [],
    description: "Mercury is the smallest and innermost planet in the Solar System.",
    composition: "Rocky with large iron core",
    discovery: "Known to ancient civilizations",
    notableFeatures: [
      "Largest temperature variations",
      "No atmosphere to speak of",
      "Heavily cratered surface"
    ]
  },
  {
    name: "Venus",
    order: 2,
    type: "Terrestrial",
    distanceFromSun: {
      km: "108.2 million km",
      au: "0.72 AU"
    },
    radius: "6,051.8 km",
    mass: "4.8675×10²⁴ kg",
    gravity: "8.87 m/s²",
    rotationPeriod: "243 Earth days (retrograde)",
    orbitalPeriod: "225 Earth days",
    avgTemperature: "464°C",
    moons: [],
    description: "Venus is the second planet from the Sun and Earth's closest planetary neighbor.",
    composition: "Rocky with thick CO₂ atmosphere",
    discovery: "Known to ancient civilizations",
    notableFeatures: [
      "Hottest planet in Solar System",
      "Surface pressure 92x Earth's",
      "Rotates backwards"
    ]
  },
  // ... otros planetas con estructura similar
];