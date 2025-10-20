import img from '../components/../assets/house.jpg';
import img1 from '../components/../assets/property-2.jpg';
import hero from '../assets/hero-house.jpg';
import prop1 from '../assets/property-1.jpg';
import prop2 from '../assets/property-2.jpg';
import prop3 from '../assets/property-3.jpg';

export const services = [
  {
    id: 1,
    title: 'SALLE DE BAINS',
    images: [
      { src: img, title: 'Salle de bains moderne' },
      { src: prop1, title: 'Salle de bains avec douche italienne' },
      { src: prop2, title: 'Salle de bains rénovée' },
      { src: prop3, title: 'Salle de bains - carrelage' },
    ],
    category: 'interieurs',
  },
  {
    id: 2,
    title: 'CONSTRUIRE',
    images: [
      { src: hero, title: 'Construction - ossature bois' },
      { src: img, title: 'Extension maison' },
      { src: prop1, title: 'Garage indépendant' },
      { src: prop2, title: 'Agrandissement séjour' },
    ],
    category: 'constructions',
  },
  {
    id: 3,
    title: 'ABRIS DE JARDIN',
    images: [
      { src: prop1, title: 'Abris de jardin bois' },
      { src: prop2, title: 'Abris - toiture zinc' },
      { src: prop3, title: 'Abris avec terrasse' },
      { src: img, title: 'Abris isolé' },
    ],
    category: 'exterieurs',
  },
  {
    id: 4,
    title: 'RAVALEMENT',
    images: [
      { src: prop2, title: 'Ravalement - façade claire' },
      { src: prop3, title: 'Ravalement - enduit traditionnel' },
      { src: img, title: 'Rénovation façade' },
      { src: hero, title: 'Nettoyage et traitement' },
    ],
    category: 'exterieurs',
  },
];

export default services;
