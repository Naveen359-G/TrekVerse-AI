import type { PlanningDestination } from './planning';

type RegionalDestination = PlanningDestination & { originCity: string; image: string; desc: string };

// Named places, curated per origin. Figures are deliberately illustrative INR
// planning assumptions, not quotes, routed distances, verified grades, or access.
function place(
  originCity: string, id: string, name: string, region: string,
  drive: number, hours: number, cost: number, difficulty: string,
  kind: string, desc: string, landscape: 'forest' | 'lake' | 'hills' = 'forest',
): RegionalDestination {
  return {
    id, name, originCity, region, drive, hours, cost, difficulty, kind, desc,
    image: `/images/${landscape === 'forest' ? 'forest-ridge' : landscape === 'lake' ? 'lake-escape' : 'deccan-hills'}.jpg`,
    mood: difficulty === 'Moderate' ? ['bold', 'challenge', 'curious'] : ['quiet', 'reset', 'curious'],
    durationDays: 1, minGroup: 1, maxGroup: 10,
    preparation: ['Confirm official entry rules, opening times and any permits', 'Check local weather; bring suitable footwear and water'],
    hazards: ['Access, terrain grade and current conditions have not been verified', 'Travel and activity estimates are illustrative, not navigation guidance'],
    dataStatus: `Sample estimates from ${originCity} · representative image`,
  };
}

export const regionalDestinations: RegionalDestination[] = [
  place('Kuala Lumpur', 'kl-eco-park', 'KL Forest Eco Park', 'Kuala Lumpur · Malaysia', 5, 1, 650, 'Easy', 'Nature walk', 'An urban forest outing in central Kuala Lumpur; confirm current entry arrangements.'),
  place('Kuala Lumpur', 'kl-frim', 'FRIM Kepong', 'Kepong · Selangor, Malaysia', 25, 2, 1450, 'Easy', 'Forest walk', 'A forest-focused outing near Kepong. Check which paths and activities are open.'),
  place('Kuala Lumpur', 'kl-broga', 'Broga Hill', 'Semenyih · Selangor, Malaysia', 45, 3, 1600, 'Moderate', 'Hill trek', 'A hill-walking idea near Semenyih; verify trail entry and local conditions.', 'hills'),
  place('Kuala Lumpur', 'kl-batu', 'Batu Caves', 'Gombak · Selangor, Malaysia', 15, 2, 1100, 'Moderate', 'Heritage walk', 'A heritage outing with a stair ascent. Follow current site guidance and dress requirements.', 'hills'),
  place('George Town', 'penang-gardens', 'Penang Botanic Gardens', 'George Town · Penang, Malaysia', 8, 1, 700, 'Easy', 'Nature walk', 'A garden and nature outing close to George Town. Verify opening hours.'),
  place('George Town', 'penang-national-park', 'Penang National Park', 'Teluk Bahang · Penang, Malaysia', 25, 2, 1600, 'Moderate', 'Forest trek', 'A coastal forest destination; confirm permits, open trails and local conditions.'),
  place('George Town', 'penang-hill', 'Penang Hill', 'Air Itam · Penang, Malaysia', 10, 2, 1500, 'Moderate', 'Hill walk', 'A hill outing near Air Itam; choose and verify your access method separately.', 'hills'),
  place('Johor Bahru', 'jb-hutan-bandar', 'Hutan Bandar MBJB', 'Johor Bahru · Malaysia', 6, 1, 650, 'Easy', 'Nature walk', 'An urban park outing near central Johor Bahru. Confirm current access.'),
  place('Johor Bahru', 'jb-gunung-pulai', 'Gunung Pulai', 'Kulai · Johor, Malaysia', 40, 3, 1600, 'Moderate', 'Forest trek', 'A forest and hill destination near Kulai; verify trail access and restrictions.'),
  place('Johor Bahru', 'jb-kota-tinggi', 'Kota Tinggi Waterfalls', 'Kota Tinggi · Johor, Malaysia', 60, 4, 1850, 'Easy', 'Waterfall walk', 'A waterfall-area outing; confirm operating status and water-related advisories.'),
  place('Bengaluru', 'blr-nandi', 'Nandi Hills', 'Chikkaballapur · Karnataka', 60, 3, 1450, 'Moderate', 'Hill walk', 'A hill-view outing north of Bengaluru. Check entry and vehicle restrictions.', 'hills'),
  place('Bengaluru', 'blr-savandurga', 'Savandurga', 'Ramanagara · Karnataka', 50, 3, 1600, 'Moderate', 'Rock trek', 'A granite-hill trekking idea; confirm official permits and the permitted route.', 'hills'),
  place('Bengaluru', 'blr-bannerghatta', 'Bannerghatta Biological Park', 'Bengaluru · Karnataka', 25, 2, 1400, 'Easy', 'Nature walk', 'A park-based nature outing south of Bengaluru; verify tickets and open areas.'),
  place('Mumbai', 'mum-sgnp', 'Sanjay Gandhi National Park', 'Borivali · Maharashtra', 30, 3, 1100, 'Easy', 'Forest walk', 'A forest-park outing within Mumbai; confirm gates, tickets and permitted trails.'),
  place('Mumbai', 'mum-karnala', 'Karnala Bird Sanctuary', 'Panvel · Maharashtra', 50, 4, 1750, 'Moderate', 'Forest trek', 'A sanctuary and hill outing near Panvel; verify access and local conditions.'),
  place('Mumbai', 'mum-matheran', 'Matheran', 'Raigad · Maharashtra', 85, 6, 2400, 'Easy', 'Heritage walk', 'A hill-town walking idea; check transport, entry rules and the available day length.', 'hills'),
  place('Pune', 'pune-sinhagad', 'Sinhagad Fort', 'Pune · Maharashtra', 35, 3, 1200, 'Moderate', 'Heritage trek', 'A fort-hill outing southwest of Pune; confirm current road and trail access.', 'hills'),
  place('Pune', 'pune-panshet', 'Panshet Reservoir', 'Pune · Maharashtra', 45, 3, 1400, 'Easy', 'Lake escape', 'A reservoir-area nature break; check legal access and avoid unverified water activities.', 'lake'),
  place('Pune', 'pune-tamhini', 'Tamhini Ghat', 'Western Ghats · Maharashtra', 55, 4, 1700, 'Easy', 'Nature drive', 'A scenic-drive idea west of Pune; check weather, road conditions and legal stopping areas.'),
  place('Delhi', 'delhi-sultanpur', 'Sultanpur National Park', 'Gurugram · Haryana', 45, 3, 1200, 'Easy', 'Nature walk', 'A birding and nature outing from Delhi; verify seasonal opening and access.', 'lake'),
  place('Delhi', 'delhi-asola', 'Asola Bhatti Wildlife Sanctuary', 'Delhi NCR', 25, 2, 1100, 'Easy', 'Nature walk', 'A sanctuary outing in southern Delhi; confirm permissions and allowed visitor areas.'),
  place('Delhi', 'delhi-damdama', 'Damdama Lake', 'Sohna · Haryana', 60, 4, 1750, 'Easy', 'Lake escape', 'A lake-area outing near Sohna; verify access and local water conditions.', 'lake'),
  place('Chennai', 'chennai-guindy', 'Guindy National Park', 'Chennai · Tamil Nadu', 12, 2, 800, 'Easy', 'Nature walk', 'An urban nature outing in Chennai; verify which visitor areas are open.'),
  place('Chennai', 'chennai-pulicat', 'Pulicat Lake', 'Tiruvallur · Tamil Nadu', 60, 4, 1600, 'Easy', 'Lake escape', 'A lagoon-area birding idea north of Chennai; verify permitted access and conditions.', 'lake'),
  place('Chennai', 'chennai-nagalapuram', 'Nagalapuram Hills', 'Tirupati · Andhra Pradesh', 95, 6, 2200, 'Moderate', 'Forest trek', 'A forest-hill trekking idea; official access, permits and local guidance are essential.'),
  place('Singapore', 'sg-macritchie', 'MacRitchie Reservoir Park', 'Central Catchment · Singapore', 12, 2, 1400, 'Easy', 'Nature walk', 'A reservoir-side nature outing; confirm open paths and park advisories.', 'lake'),
  place('Singapore', 'sg-bukit-timah', 'Bukit Timah Nature Reserve', 'Bukit Timah · Singapore', 15, 2, 1500, 'Moderate', 'Forest trek', 'A forest-hill walking idea; check trail closures and official visitor guidance.'),
  place('Singapore', 'sg-pulau-ubin', 'Pulau Ubin', 'Northeastern Islands · Singapore', 30, 4, 2400, 'Easy', 'Nature walk', 'An island nature outing. Check ferry arrangements, park rules and the return connection.'),
];
