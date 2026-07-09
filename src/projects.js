export const projects = [
  {
    slug: 'unfixed-landscapes',
    title: 'Unfixed Landscapes',
    intro: 'A field of wounded surfaces, suspended forms and repaired territories. The series observes landscape as something unstable: marked by pressure, memory and the fragile gestures that attempt to hold it together. Images, folds and material tensions appear as traces of systems that have been altered but not silenced. Each work proposes a pause before the damaged view, asking how a landscape can remain open while carrying the evidence of fracture.'
  },
  {
    slug: 'the-rock-cycle',
    title: 'The Rock Cycle',
    intro: 'Stone, textile and photographic trace move through states of rupture and restoration. The project follows matter as it shifts between geology, body and memory, revealing transformation as a slow and tactile event. Rock is treated not as a fixed object but as a living archive of pressure, time and repair. The images hold that cycle in suspension, between erosion and reconstruction, between what breaks and what continues.'
  },
  {
    slug: 'unearth',
    title: 'Unearth / ongoing',
    intro: 'An ongoing search through buried images, materials and gestures. Unearth looks at what returns to the surface: fragments, residues and quiet signs that insist on being seen again. The work moves through discovery rather than conclusion, gathering what appears partially covered, interrupted or displaced. It is a slow excavation of visual memory, where each image suggests that the ground still contains unfinished narratives.'
  },
  {
    slug: 'landscape-on-landscape',
    title: 'Landscape on Landscape',
    intro: 'Layers of image and place overlap until the view becomes a constructed terrain. The work treats landscape as an accumulation of surfaces, where each mark changes the way the next one is read. Photographic fragments, drawn gestures and spatial references build a field that feels both observed and invented. The series asks how a place is transformed when another image is placed over it, and what remains visible underneath.'
  },
  {
    slug: 'kutho',
    title: 'Kutho',
    intro: 'Kutho gathers fragments of territory, architecture and mineral memory into a restrained visual archive. The images move between document and abstraction, following the quiet charge of place. Surfaces appear as records of passage, weather and touch, while the sequence keeps a deliberate distance from direct narration. The project holds the sensation of a site that can be read through texture as much as through form.'
  },
  {
    slug: 'brief-shape',
    title: 'Brief Shape',
    intro: 'A study of temporary forms and delicate arrangements. Brief Shape attends to small tensions in material, shadow and balance, allowing each image to hold a moment before it shifts. The work is built around fragile decisions: a fold, a lean, a line, a weight. What appears modest becomes a way of measuring attention, turning brief gestures into structures that feel precise, quiet and unstable.'
  },
  {
    slug: 'urban-territories',
    title: 'Urban Territories',
    intro: 'Urban Territories reads the city through edges, surfaces and traces of use. The series looks for the landscape inside built space, where movement and memory leave subtle marks. Walls, thresholds and urban fragments become evidence of how bodies pass through places and slowly alter them. The work approaches the city as a layered terrain, shaped by time, repetition and unnoticed details.'
  },
  {
    slug: 'borders',
    title: 'Borders',
    intro: 'Borders considers limits as porous and unstable lines. Through image, texture and composition, the work explores thresholds between land and body, interior and exterior, separation and contact. The series does not treat the border as a closed edge, but as a zone where meanings overlap and resist definition. Each image holds a tension between distance and proximity, asking what is protected, crossed or exposed.'
  },
  {
    slug: 'about-india',
    title: 'About India',
    intro: 'A visual travel through color, texture and ritual presence. About India gathers impressions of place without closing them into a single story, letting fragments remain vivid and open. The images attend to surfaces, gestures and atmospheres encountered in movement, allowing detail to carry the weight of memory. Rather than describing a destination, the project keeps the experience partial, sensory and alive.'
  },
  {
    slug: 'uncertain-nature-book',
    title: 'Uncertain Nature Book',
    intro: 'A book-form meditation on natural systems that refuse fixed reading. Images, sequences and pauses build a fragile archive of uncertainty, where landscape appears as both evidence and question. The project uses the rhythm of pages to slow down perception, letting fragments accumulate without settling into certainty. Nature becomes less a stable subject than a shifting language of signs, absences and quiet disturbances.'
  }
];

export const findProject = slug => projects.find(project => project.slug === slug);
