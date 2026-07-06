export const projects = [
  { slug: 'unfixed-landscapes', title: 'Unfixed Landscapes' },
  { slug: 'the-rock-cycle', title: 'The Rock Cycle' },
  { slug: 'unearth', title: 'Unearth / ongoing' },
  { slug: 'landscape-on-landscape', title: 'Landscape on Landscape' },
  { slug: 'kutho', title: 'Kutho' },
  { slug: 'brief-shape', title: 'Brief Shape' },
  { slug: 'urban-territories', title: 'Urban Territories' },
  { slug: 'borders', title: 'Borders' },
  { slug: 'about-india', title: 'About India' },
  { slug: 'uncertain-nature-book', title: 'Uncertain Nature Book' }
];

export const findProject = slug => projects.find(project => project.slug === slug);
