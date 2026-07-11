const asset = path => encodeURI(path);

const exhibitionDefinitions = [
  {
    slug: "recoleta-cultural-center", title: "Recoleta Cultural Center", year: 2023, category: "group",
    directory: "group show/1- Recoleta Cultural Center",
    files: [
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay 1.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay 3.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay2.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay4.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay5.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay6.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay7.JPG",
          "Centro Cultural Recoleta_ Breve Historia de la Eternidad_ Paisaje sobre Paisaje  _Alkalay8.JPG"
    ]
  },
  {
    slug: "bienal-sur", title: "Bienal Sur", year: 2023, category: "group",
    directory: "group show/2 bienal sur",
    files: [
          "Bienal Sur _Rompecabezas_the Rock Cycle .jpg",
          "Bienal Sur _Rompecabezas_the Rock Cycle 2.jpg",
          "Bienal Sur _Rompecabezas_the Rock Cycle 3.jpg",
          "Bienal Sur _Rompecabezas_the Rock Cycle 5.jpg",
          "Bienal Sur _Rompecabezas_the Rock Cycle 7.jpg"
    ]
  },
  {
    slug: "hafez-gallery", title: "Hafez Gallery", year: 2024, category: "group",
    directory: "group show/3 Hafez Gallery",
    files: [
          "Hafez gallery_Andrea Alkalay 1.jpg",
          "Hafez gallery_Andrea Alkalay 2.png",
          "Hafez gallery_Andrea Alkalay 3.jpg",
          "Hafez gallery_Andrea Alkalay 4.jpg",
          "Hafez gallery_Andrea Alkalay 5.JPG",
          "Hafez gallery_Andrea Alkalay 6.jpg",
          "Hafez gallery_Andrea Alkalay 7.JPG",
          "Hafez gallery_Andrea Alkalay TAmer House Jedda 2.JPG",
          "Hafez gallery_Andrea Alkalay TAmer House Jeddah 3.JPG",
          "Hafez gallery_Andrea Alkalay TAmer House Jeddah.JPG"
    ]
  },
  {
    slug: "oda-arte", title: "OdA Arte", year: 2023, category: "group",
    directory: "group show/ 4 OdA Arte",
    files: [
          "OdA Arte  Paisajes Desvelados_Curaduria Laura Casanovas_.jpg",
          "OdA Arte  Paisajes Desvelados_Curaduria Laura Casanovas_1.jpg",
          "OdA Arte  Paisajes Desvelados_Curaduria Laura Casanovas_2.jpg",
          "OdA Arte Punto de encuentro_Esteban Pastorino_Andrea Alkalay 2.jpg",
          "OdA Arte Punto de encuentro_Esteban Pastorino_Andrea Alkalay 3.jpeg",
          "OdA Arte Punto de encuentro_Esteban Pastorino_Andrea Alkalay.jpg",
          "OdA Arte galerry-.JPG",
          "OdA Arte_La gran Colgada.JPG",
          "Punto de encuentro_Esteban Pastorino_Andrea Alkalay.jpg"
    ]
  },
  {
    slug: "espacio-dar", title: "Espacio DAR", year: 2025, category: "group",
    directory: "group show/5 Espacio DAR",
    files: [
          "Hall Espacio Dar 1.JPG",
          "Hall Espacio Dar2.JPG",
          "Hall Espacio Dar3.JPG",
          "Hall Espacio Dar4.jpg",
          "Hall Espacio Dar5.jpg"
    ]
  },
  {
    slug: "art-fairs", title: "Art Fairs", year: "2021–2024", category: "group",
    directory: "group show/6 Ferias de ARte",
    files: [
          "BA Photo OdA Arte_Paisaje sobre Paisaje.jpg",
          "Ba Photo 2024 OdA Arte Paisaje sobre Paisaje.jpg",
          "Buenos Aires Photo _ Oda Arte 2029.jpg",
          "Instalation View on BAphoto Art Fair.jpg",
          "Kutho MApa Feria Oda Arte 2024.jpg",
          "MApa Feria_Oda Arte Paisaje sobre Paisaje 2.jpg",
          "Mapa Feria _OdA Arte Rock Cycle.jpg",
          "Patio Bullrich BAPhoto pop Up _ KUTHO OdA Arte 2.jpg",
          "Patio Bullrich BAPhoto pop Up _ KUTHO OdA Arte.jpg",
          "Pinta Miami 21 -Oda Arte .jpg",
          "Pinta Miami 21 -Oda Arte 2.jpg",
          "Pinta Miami 22 -Oda Arte 2.jpg"
    ]
  },
  {
    slug: "palacio-libertad", title: "Palacio Libertad", year: 2019, category: "group",
    directory: "group show/7 Palacio Libertad",
    files: [
          "Andrea Alkalay - Fronteras.jpg",
          "Fronteras_CCK 1.jpg",
          "Fronteras_CCK 2.jpg",
          "Fronteras_CCK 6.jpg",
          "Fronteras_CCK 8.jpg"
    ]
  },
  {
    slug: "museo-larreta", title: "Museo Larreta Buenos Aires", year: 2024, category: "group",
    directory: "group show/8 Museo Larreta Bs As",
    files: [
          "Intervenciones Minimas .JPG",
          "Intervenciones Minimas 4.jpg",
          "Intervenciones Minimas2.JPG",
          "Intervenciones Minimas3.JPG"
    ]
  },
  {
    slug: "unfixed-landscapes-taiwan", title: "Unfixed Landscapes, Wounded Systems", year: 2026, category: "solo",
    directory: "solo show/1 Unfixed Landsacpes",
    files: [
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 1.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 10.JPG",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 11.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 12.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 13.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 14.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 15.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 17.JPG",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 18.JPG",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 2.JPG",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 3.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 4.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 5 .jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 5.JPG",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 7.jpg",
          "Unfixed Landscape_Solo Show taiwan Andrea Alkalay 9.jpg"
    ]
  },
  {
    slug: "park-pecno-slovenia", title: "The Rock Cycle · Park Pečno", year: 2024, category: "solo",
    directory: "solo show/2 Park Pecno Slovenia",
    files: [
          "Park Pecno Gallery_ RockCycle_Slovenia 1  .jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia2.jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia3.jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia4.jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia5.jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia6.jpg",
          "Park Pecno Gallery_ RockCycle_Slovenia7.jpg"
    ]
  },
  {
    slug: "museo-franklin-rawson", title: "Urban Territories · Museo Franklin Rawson", year: 2018, category: "solo",
    directory: "solo show/3 Museo Bellas Artes San Juan",
    files: [
          "IMG_2821.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay 10.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay1.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay10.jpg",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay11.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay3.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay4.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay5.jpg",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay6.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay7.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay8.JPG",
          "Territorios Urbanos_Museo Bellas Artes Franklin Rawson_San Juan_Alkalay9.JPG"
    ]
  },
  {
    slug: "sofitel-recoleta", title: "Retrospective · Sofitel Recoleta", year: 2024, category: "solo",
    directory: "solo show/4 Sofitel Recoleta",
    files: [
          "Sofitel recoleta Alkalay Solo show 1.JPG",
          "Sofitel recoleta Alkalay Solo show 2.JPG",
          "Sofitel recoleta Alkalay Solo show 4.JPG",
          "Sofitel recoleta Alkalay Solo show 5.JPG",
          "Sofitel recoleta Alkalay Solo show 6.JPG",
          "Sofitel recoleta Alkalay Solo show2.JPG",
          "Sofitel recoleta Alkalay Solo show3.JPG",
          "Sofitel recoleta Alkalay Solo show8.JPG",
          "Sofitel recoleta Alkalay2.jpg"
    ]
  },
  {
    slug: "kingdom-photo-awards", title: "The Kingdom Photography Award", year: 2022, category: "solo",
    directory: "solo show/5 The Kingdom Photo Awards",
    files: [
          "Th Kingdom Award_ ARt JAmeer 1.jpg",
          "Th Kingdom Award_ ARt JAmeer 2.jpg",
          "Th Kingdom Award_ ARt JAmeer 3.jpg",
          "Th Kingdom Award_ ARt JAmeer 4.jpg",
          "Th Kingdom Award_ ARt JAmeer 5.jpg",
          "Th Kingdom Award_ ARt JAmeer 6.jpg",
          "Th Kingdom Award_ ARt JAmeer10.jpg",
          "Th Kingdom Award_ ARt JAmeer2.jpg",
          "The Kingdom Photo Award 3.jpg",
          "The Kingdom Photo Award 4.jpg"
    ]
  },
  {
    slug: "mundo-nuevo-gallery", title: "Borders and Territories · Mundo Nuevo Gallery", year: 2019, category: "solo",
    directory: "solo show/6 Mundo Nuevo GAllery",
    files: [
          "CG4A5736.JPG",
          "Fundacion Mundo Nuevo Solo Show .JPG",
          "Fundacion Mundo Nuevo Solo Show10.JPG",
          "Fundacion Mundo Nuevo Solo Show11.JPG",
          "Fundacion Mundo Nuevo Solo Show2.JPG",
          "Fundacion Mundo Nuevo Solo Show3.jpg",
          "Fundacion Mundo Nuevo Solo Show4.jpg",
          "Fundacion Mundo Nuevo Solo Show5.jpg",
          "Fundacion Mundo Nuevo Solo Show6.JPG",
          "Fundacion Mundo Nuevo Solo Show7.JPG",
          "Fundacion Mundo Nuevo Solo Show8.JPG",
          "Fundacion Mundo Nuevo Solo Show9.jpg"
    ]
  },
  {
    slug: "estacion-mapocho-chile", title: "Urban Territories · Estación Mapocho", year: 2018, category: "solo",
    directory: "solo show/7 Estacion Mapocho Chile",
    files: [
          "Territorios urbanos-Cultural Mapocho_Chile_.jpeg",
          "Territorios urbanos-Cultural Mapocho_Chile_1.JPG",
          "Territorios urbanos-Cultural Mapocho_Chile_2.JPG",
          "Territorios urbanos-Cultural Mapocho_Chile_3.JPG",
          "Territorios urbanos-Cultural Mapocho_Chile_4.JPG",
          "Territorios urbanos-Cultural Mapocho_Chile_5.JPG",
          "Territorios urbanos-Cultural Mapocho_Chile_6.jpeg",
          "Territorios urbanos-Cultural Mapocho_Chile_7.jpeg",
          "Territorios urbanos-Cultural Mapocho_Chile_8.jpeg",
          "Territorios urbanos-Cultural Mapocho_Chile_9.jpeg"
    ]
  },
];

const introByCategory = {
  group: 'Selected documentation from this group exhibition, tracing the dialogue between the works, the architecture and the other practices sharing the space.',
  solo: 'Selected documentation from this solo exhibition, following the relationship between the work, its material presence and the architecture of the venue.'
};

export const exhibitionProjects = exhibitionDefinitions.map(definition => {
  const images = definition.files.map((file, index) => ({
    id: `${definition.slug}-${index + 1}`,
    title: `${definition.title} ${String(index + 1).padStart(2, '0')}`,
    series: definition.title,
    year: definition.year,
    technique: 'Exhibition view',
    description: definition.title,
    imageUrl: asset(`/exhibitions2/${definition.directory}/${file}`),
    alt: `${definition.title}, exhibition view ${index + 1}`,
    published: true,
    position: index + 1
  }));
  return {
    slug: definition.slug,
    title: definition.title,
    year: definition.year,
    category: definition.category,
    imageUrl: images[0]?.imageUrl || '',
    intro: introByCategory[definition.category],
    images
  };
});

