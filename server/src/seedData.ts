import { Movie, City, Theatre, Show, SnackItem, PromoCode, Review } from './types.js';

export const INITIAL_CITIES: City[] = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', isPopular: true, monumentIcon: '🏛️' },
  { id: 'delhi-ncr', name: 'Delhi-NCR', state: 'Delhi', isPopular: true, monumentIcon: '🕌' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', isPopular: true, monumentIcon: '🏰' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', isPopular: true, monumentIcon: '💎' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', isPopular: true, monumentIcon: '🪁' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', isPopular: true, monumentIcon: '⛰️' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', isPopular: true, monumentIcon: '🌉' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', isPopular: true, monumentIcon: '🛕' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab / Haryana', isPopular: true, monumentIcon: '🌹' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', isPopular: true, monumentIcon: '👑' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', isPopular: false, monumentIcon: '🌊' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', isPopular: false, monumentIcon: '🌴' }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'stree-2',
    slug: 'stree-2-sarkate-ka-aatank',
    title: 'Stree 2: Sarkate Ka Aatank',
    hindiTitle: 'स्त्री २: सरकटे का आतंक',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhefZ_440',
    trailerEmbedId: 'KVnhefZ_440',
    rating: 9.3,
    votesCount: 384500,
    percentageLiked: 95,
    certificate: 'U/A 16+',
    runtimeMinutes: 147,
    runtimeFormatted: '2h 27m',
    releaseDate: '15 Aug 2024',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 2D'],
    genres: ['Comedy', 'Horror', 'Mystery'],
    synopsis: 'The beloved town of Chanderi is haunted once more, this time by a terrifying headless entity named "Sarkata" who is targeting progressive women. Vicky (Rajkummar Rao), Bittu (Aparshakti Khurana), and J.D. (Abhishek Banerjee), guided by Rudra (Pankaj Tripathi), must seek the help of Stree and the mysterious woman (Shraddha Kapoor) to vanquish the darkness.',
    director: 'Amar Kaushik',
    musicDirector: 'Sachin-Jigar',
    producers: 'Dinesh Vijan, Jyoti Deshpande',
    isPopular: true,
    cast: [
      { name: 'Rajkummar Rao', role: 'Actor', character: 'Vicky', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Shraddha Kapoor', role: 'Actress', character: 'The Mysterious Woman', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Pankaj Tripathi', role: 'Actor', character: 'Rudra Bhaiya', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Abhishek Banerjee', role: 'Actor', character: 'Jana', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Aparshakti Khurana', role: 'Actor', character: 'Bittu', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'jawan',
    slug: 'jawan',
    title: 'Jawan',
    hindiTitle: 'जवान',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    trailerEmbedId: 'COv52Qyctws',
    rating: 9.1,
    votesCount: 420800,
    percentageLiked: 93,
    certificate: 'U/A',
    runtimeMinutes: 169,
    runtimeFormatted: '2h 49m',
    releaseDate: '07 Sep 2023',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 2D', '4DX'],
    genres: ['Action', 'Thriller', 'Drama'],
    synopsis: 'A high-octane emotional spectacle tracing the dual lives of Azad Rathore and his father Vikram Rathore. Driven by an unwavering moral code, Azad conducts audacious social justice heists to expose corrupt billionaires and empower the common citizens of India, while facing the cunning arms dealer Kalee Gaikwad.',
    director: 'Atlee',
    musicDirector: 'Anirudh Ravichander',
    producers: 'Gauri Khan',
    isPopular: true,
    cast: [
      { name: 'Shah Rukh Khan', role: 'Actor', character: 'Azad / Vikram Rathore', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nayanthara', role: 'Actress', character: 'Narmada Rai', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vijay Sethupathi', role: 'Actor', character: 'Kalee Gaikwad', imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Special Appearance', character: 'Aishwarya Rathore', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sanya Malhotra', role: 'Actress', character: 'Dr. Eeram', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'fighter',
    slug: 'fighter',
    title: 'Fighter',
    hindiTitle: 'फाइटर',
    posterUrl: 'https://images.unsplash.com/photo-1517976487502-51c36f2f21fe?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e864?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    trailerEmbedId: '6amIq_mP4xM',
    rating: 8.9,
    votesCount: 215400,
    percentageLiked: 91,
    certificate: 'U/A',
    runtimeMinutes: 166,
    runtimeFormatted: '2h 46m',
    releaseDate: '25 Jan 2024',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', '3D', 'IMAX 3D', '4DX'],
    genres: ['Action', 'Aerial Drama', 'Thriller'],
    synopsis: 'India’s premier aerial action thriller follows the elite Air Dragons unit formed by the Indian Air Force to combat terrorist threats. Squadron Leader Shamsher "Patty" Pathania (Hrithik Roshan) and Squadron Leader Minal "Minni" Rathore (Deepika Padukone) must rise above personal trauma to defend their homeland in death-defying dogfights.',
    director: 'Siddharth Anand',
    musicDirector: 'Vishal-Shekhar',
    producers: 'Mamta Anand, Jyoti Deshpande, Ajit Andhare',
    isPopular: true,
    cast: [
      { name: 'Hrithik Roshan', role: 'Actor', character: 'Sq Ldr Shamsher "Patty" Pathania', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Actress', character: 'Sq Ldr Minal "Minni" Rathore', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anil Kapoor', role: 'Actor', character: 'Gp Capt Rakesh "Rocky" Jai Singh', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Karan Singh Grover', role: 'Actor', character: 'Sq Ldr Sartaj "Taj" Gill', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'animal',
    slug: 'animal',
    title: 'Animal',
    hindiTitle: 'एनिमल',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Dydmpfo68DA',
    trailerEmbedId: 'Dydmpfo68DA',
    rating: 8.8,
    votesCount: 398000,
    percentageLiked: 89,
    certificate: 'A',
    runtimeMinutes: 204,
    runtimeFormatted: '3h 24m',
    releaseDate: '01 Dec 2023',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D'],
    genres: ['Action', 'Crime', 'Drama'],
    synopsis: 'A son’s obsessively deep love and unyielding craving for his emotionally distant father’s approval transforms him into a ruthless force of nature. When an assassination attempt is made on industrialist Balbir Singh (Anil Kapoor), Ranvijay (Ranbir Kapoor) unleashes an unrelenting war against Abrar Haque (Bobby Deol).',
    director: 'Sandeep Reddy Vanga',
    musicDirector: 'JAM8, Vishal Mishra, Harshavardhan Rameshwar',
    producers: 'Bhushan Kumar, Pranay Reddy Vanga',
    isPopular: true,
    cast: [
      { name: 'Ranbir Kapoor', role: 'Actor', character: 'Ranvijay Singh / Aziz', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anil Kapoor', role: 'Actor', character: 'Balbir Singh', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Bobby Deol', role: 'Actor', character: 'Abrar Haque', imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rashmika Mandanna', role: 'Actress', character: 'Geetanjali', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Triptii Dimri', role: 'Actress', character: 'Zoya', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: '12th-fail',
    slug: '12th-fail',
    title: '12th Fail',
    hindiTitle: '१२वीं फेल',
    posterUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=we53w13i8_4',
    trailerEmbedId: 'we53w13i8_4',
    rating: 9.6,
    votesCount: 260000,
    percentageLiked: 98,
    certificate: 'U',
    runtimeMinutes: 147,
    runtimeFormatted: '2h 27m',
    releaseDate: '27 Oct 2023',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D'],
    genres: ['Biography', 'Drama'],
    synopsis: 'Based on the incredible real-life triumph of Manoj Kumar Sharma, who hails from the dacoit-infested ravines of Chambal. Failing his 12th board exams due to anti-cheating measures, Manoj moves to Delhi, cleans toilets and works grueling night shifts in flour mills while daring to dream of clearing India’s toughest UPSC exam.',
    director: 'Vidhu Vinod Chopra',
    musicDirector: 'Shantanu Moitra',
    producers: 'Vidhu Vinod Chopra, Yogesh Ishwar',
    isPopular: true,
    cast: [
      { name: 'Vikrant Massey', role: 'Actor', character: 'Manoj Kumar Sharma', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Medha Shankr', role: 'Actress', character: 'Shraddha Joshi', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anant V Joshi', role: 'Actor', character: 'Pritam Pandey', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anshumaan Pushkar', role: 'Actor', character: 'Gauri Bhaiya', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'shaitaan',
    slug: 'shaitaan',
    title: 'Shaitaan',
    hindiTitle: 'शैतान',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=kY3P1rMhQxI',
    trailerEmbedId: 'kY3P1rMhQxI',
    rating: 8.7,
    votesCount: 168000,
    percentageLiked: 88,
    certificate: 'U/A 16+',
    runtimeMinutes: 132,
    runtimeFormatted: '2h 12m',
    releaseDate: '08 Mar 2024',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D'],
    genres: ['Supernatural', 'Thriller', 'Horror'],
    synopsis: 'A loving family’s quiet weekend in the hills turns into a terrifying hostage crisis when an unassuming traveler named Vanraj (R. Madhavan) casts an hypnotic black magic spell on their elder daughter Janhvi. Kabir (Ajay Devgn) and Jyoti must risk everything to rescue their child before midnight.',
    director: 'Vikas Bahl',
    musicDirector: 'Amit Trivedi',
    producers: 'Ajay Devgn, Jyoti Deshpande, Kumar Mangat Pathak',
    isPopular: false,
    cast: [
      { name: 'Ajay Devgn', role: 'Actor', character: 'Kabir Rishi', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'R. Madhavan', role: 'Actor', character: 'Vanraj Kashyap', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jyotika', role: 'Actress', character: 'Jyoti Rishi', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Janki Bodiwala', role: 'Actress', character: 'Janhvi Rishi', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'bhool-bhulaiyaa-3',
    slug: 'bhool-bhulaiyaa-3',
    title: 'Bhool Bhulaiyaa 3',
    hindiTitle: 'भूल भुलैया ३',
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=b4wHw2-6k9o',
    trailerEmbedId: 'b4wHw2-6k9o',
    rating: 8.6,
    votesCount: 154000,
    percentageLiked: 87,
    certificate: 'U/A',
    runtimeMinutes: 158,
    runtimeFormatted: '2h 38m',
    releaseDate: '01 Nov 2024',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 2D'],
    genres: ['Comedy', 'Horror', 'Mystery'],
    synopsis: 'Ruhaan aka Rooh Baba (Kartik Aaryan) travels to the historic palace of Raktaghat for another high-paying ghostbusting assignment. However, his theatrical illusions face real spiritual horror when he is confronted by not one, but two formidable vengeful spirits claiming to be Manjulika.',
    director: 'Anees Bazmee',
    musicDirector: 'Pritam, Tanishk Bagchi',
    producers: 'Bhushan Kumar, Krishan Kumar',
    isPopular: true,
    cast: [
      { name: 'Kartik Aaryan', role: 'Actor', character: 'Rooh Baba / Ruhaan', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vidya Balan', role: 'Actress', character: 'Manjulika', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Madhuri Dixit', role: 'Actress', character: 'Mandira', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Triptii Dimri', role: 'Actress', character: 'Meera', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'singham-again',
    slug: 'singham-again',
    title: 'Singham Again',
    hindiTitle: 'सिंघम अगेन',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=0w5uYvF_sQE',
    trailerEmbedId: '0w5uYvF_sQE',
    rating: 8.8,
    votesCount: 221000,
    percentageLiked: 90,
    certificate: 'U/A 16+',
    runtimeMinutes: 144,
    runtimeFormatted: '2h 24m',
    releaseDate: '01 Nov 2024',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 2D', '4DX'],
    genres: ['Action', 'Crime', 'Thriller'],
    synopsis: 'DCP Bajirao Singham (Ajay Devgn) spearheads the largest mission of the Rohit Shetty Cop Universe when his wife Avni is kidnapped by transnational terrorist Danger Lanka (Arjun Kapoor). Joined by Sooryavanshi (Akshay Kumar), Simmba (Ranveer Singh), and Shakti Shetty (Deepika Padukone), Singham leads a thunderous strike across borders.',
    director: 'Rohit Shetty',
    musicDirector: 'Ravi Basrur, Thaman S',
    producers: 'Rohit Shetty, Ajay Devgn, Jyoti Deshpande',
    isPopular: true,
    cast: [
      { name: 'Ajay Devgn', role: 'Actor', character: 'Bajirao Singham', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kareena Kapoor Khan', role: 'Actress', character: 'Avni Kamat', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ranveer Singh', role: 'Actor', character: 'Sangram "Simmba" Bhalerao', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80' },
      { name: 'Akshay Kumar', role: 'Actor', character: 'Veer Sooryavanshi', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Actress', character: 'SP Shakti Shetty', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'brahmastra-1',
    slug: 'brahmastra-part-one-shiva',
    title: 'Brahmāstra: Part One – Shiva',
    hindiTitle: 'ब्रह्मास्त्र: पहला भाग – शिवा',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=BUjXzrgntDc',
    trailerEmbedId: 'BUjXzrgntDc',
    rating: 8.5,
    votesCount: 312000,
    percentageLiked: 86,
    certificate: 'U/A',
    runtimeMinutes: 167,
    runtimeFormatted: '2h 47m',
    releaseDate: '09 Sep 2022',
    status: 'now_showing',
    languages: ['Hindi'],
    formats: ['2D', '3D', 'IMAX 3D'],
    genres: ['Fantasy', 'Action', 'Adventure'],
    synopsis: 'Set in contemporary India, Shiva, a DJ with an innate fire immunity, uncovers ancient celestial weapons named Astras guarded by the secret society Brahmānsh. As dark forces led by Junoon hunt the pieces of the supreme Astra, Shiva must awaken his inner agnyastra to protect the cosmos.',
    director: 'Ayan Mukerji',
    musicDirector: 'Pritam',
    producers: 'Karan Johar, Apoorva Mehta, Namit Malhotra',
    isPopular: false,
    cast: [
      { name: 'Ranbir Kapoor', role: 'Actor', character: 'Shiva', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Alia Bhatt', role: 'Actress', character: 'Isha', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Amitabh Bachchan', role: 'Actor', character: 'Guru Arvind', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mouni Roy', role: 'Actress', character: 'Junoon', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'chhaava',
    slug: 'chhaava',
    title: 'Chhaava',
    hindiTitle: 'छावा',
    posterUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=7u3QpW0L7-Y',
    trailerEmbedId: '7u3QpW0L7-Y',
    rating: 9.5,
    votesCount: 89000,
    percentageLiked: 96,
    certificate: 'U/A 16+',
    runtimeMinutes: 160,
    runtimeFormatted: '2h 40m',
    releaseDate: '06 Dec 2026',
    status: 'coming_soon',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 2D'],
    genres: ['Historical', 'Action', 'Biography'],
    synopsis: 'The majestic historical chronicle of the lionheart warrior Chhatrapati Sambhaji Maharaj, the eldest son of Chhatrapati Shivaji Maharaj. Against crushing odds and constant betrayal, Sambhaji valiantly protected Swarajya and repelled the massive armies of Mughal Emperor Aurangzeb.',
    director: 'Laxman Utekar',
    musicDirector: 'A.R. Rahman',
    producers: 'Dinesh Vijan',
    interestedCount: 312500,
    cast: [
      { name: 'Vicky Kaushal', role: 'Actor', character: 'Chhatrapati Sambhaji Maharaj', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rashmika Mandanna', role: 'Actress', character: 'Yesubai Bhonsale', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Akshaye Khanna', role: 'Actor', character: 'Emperor Aurangzeb', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ashutosh Rana', role: 'Actor', character: 'Hambirrao Mohite', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'war-2',
    slug: 'war-2',
    title: 'War 2',
    hindiTitle: 'वॉर २',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=700&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=tQ0mzXRk-oM',
    trailerEmbedId: 'tQ0mzXRk-oM',
    rating: 9.4,
    votesCount: 65000,
    percentageLiked: 95,
    certificate: 'U/A',
    runtimeMinutes: 155,
    runtimeFormatted: '2h 35m',
    releaseDate: '14 Aug 2027',
    status: 'coming_soon',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX 3D', '4DX'],
    genres: ['Action', 'Spy Thriller', 'Adventure'],
    synopsis: 'Major Kabir Dhaliwal (Hrithik Roshan) returns in the most anticipated chapter of the YRF Spy Universe. Confronting a formidable international assassin played by Jr. NTR, Kabir enters high-velocity confrontations across Tokyo, Spain, and Mumbai with world security hanging in the balance.',
    director: 'Ayan Mukerji',
    musicDirector: 'Pritam',
    producers: 'Aditya Chopra',
    interestedCount: 428000,
    cast: [
      { name: 'Hrithik Roshan', role: 'Actor', character: 'Major Kabir Dhaliwal', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jr. NTR', role: 'Actor', character: 'Vikram', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kiara Advani', role: 'Actress', character: 'Agent Tara', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ]
  }
];

export const INITIAL_THEATRES: Theatre[] = [
  // Mumbai
  {
    id: 'th-mum-pvr-palladium',
    name: 'PVR: Phoenix Palladium, Lower Parel',
    chain: 'PVR',
    cityId: 'mumbai',
    location: 'Lower Parel, Mumbai',
    address: 'Level 3, High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel, Mumbai 400013',
    amenities: ['Recliner', 'Dolby Atmos', 'M-Ticket', 'Food Court', 'Wheelchair Friendly', 'Valet Parking'],
    cancellationAvailable: true
  },
  {
    id: 'th-mum-inox-inorbit',
    name: 'INOX: Megaplex Inorbit Mall, Malad',
    chain: 'INOX',
    cityId: 'mumbai',
    location: 'Malad West, Mumbai',
    address: 'Inorbit Mall, Link Road, Malad West, Mumbai 400064',
    amenities: ['IMAX', '4DX', 'M-Ticket', 'Gourmet Food', 'Wheelchair Friendly'],
    cancellationAvailable: true
  },
  {
    id: 'th-mum-cinepolis-viviana',
    name: 'Cinépolis: Viviana Mall, Thane',
    chain: 'Cinepolis',
    cityId: 'mumbai',
    location: 'Thane West, Mumbai',
    address: 'Eastern Express Hwy, Near Cadbury Junction, Thane West 400606',
    amenities: ['VIP Recliner', '4DX', 'M-Ticket', 'Food & Beverages'],
    cancellationAvailable: false
  },
  {
    id: 'th-mum-miraj-wadala',
    name: 'Miraj Cinemas: IMAX Wadala',
    chain: 'Miraj',
    cityId: 'mumbai',
    location: 'Wadala East, Mumbai',
    address: 'Anik Wadala Link Rd, Bhakti Park, Wadala East, Mumbai 400037',
    amenities: ['IMAX Laser', 'Dolby Atmos', 'M-Ticket', 'Parking'],
    cancellationAvailable: true
  },

  // Delhi-NCR
  {
    id: 'th-del-pvr-directors-cut',
    name: "PVR Director's Cut: Ambience Mall",
    chain: 'PVR',
    cityId: 'delhi-ncr',
    location: 'Gurugram, Delhi-NCR',
    address: '3rd Floor, Ambience Mall, NH-8, Gurugram, Haryana 122002',
    amenities: ['Ultra Luxury Recliner', 'Butler Service', 'Dolby Atmos', 'M-Ticket'],
    cancellationAvailable: true
  },
  {
    id: 'th-del-pvr-plaza',
    name: 'PVR: Plaza Cinema, Connaught Place',
    chain: 'PVR',
    cityId: 'delhi-ncr',
    location: 'Connaught Place, New Delhi',
    address: 'H-Block, Connaught Circus, CP, New Delhi 110001',
    amenities: ['Heritage Cinema', 'Dolby 7.1', 'M-Ticket', 'Food Court'],
    cancellationAvailable: true
  },
  {
    id: 'th-del-cinepolis-dlf',
    name: 'Cinépolis: DLF Avenue, Saket',
    chain: 'Cinepolis',
    cityId: 'delhi-ncr',
    location: 'Saket, New Delhi',
    address: 'Press Enclave Road, Saket District Centre, New Delhi 110017',
    amenities: ['Macro XE Screen', 'Recliner', 'M-Ticket', 'Gourmet Bar'],
    cancellationAvailable: false
  },

  // Bengaluru
  {
    id: 'th-blr-pvr-vega',
    name: 'PVR: Vega City, Bannerghatta Road',
    chain: 'PVR',
    cityId: 'bengaluru',
    location: 'Bannerghatta Rd, Bengaluru',
    address: 'Vega City Mall, Srinivas Nagar, Bannerghatta Main Rd, Bengaluru 560076',
    amenities: ['Superplex', 'IMAX', '4DX', 'M-Ticket', 'Food Court'],
    cancellationAvailable: true
  },
  {
    id: 'th-blr-inox-forum',
    name: 'INOX: Forum South Bangalore, Kanakapura',
    chain: 'INOX',
    cityId: 'bengaluru',
    location: 'Kanakapura Road, Bengaluru',
    address: 'Konanakunte Cross Metro Station, Kanakapura Rd, Bengaluru 560062',
    amenities: ['Insignia Recliners', 'Dolby Atmos', 'M-Ticket', 'Valet'],
    cancellationAvailable: true
  },

  // Hyderabad
  {
    id: 'th-hyd-amb-cinemas',
    name: 'AMB Cinemas: Gachibowli (Mahesh Babu)',
    chain: 'Independent',
    cityId: 'hyderabad',
    location: 'Gachibowli, Hyderabad',
    address: 'Sarath City Capital Mall, Gachibowli - Miyapur Rd, Hyderabad 500084',
    amenities: ['VIP Lounge', 'Barco Laser Flagship', 'Dolby Atmos', 'M-Ticket'],
    cancellationAvailable: true
  },
  {
    id: 'th-hyd-pvr-galleria',
    name: 'PVR: Next Galleria Mall, Panjagutta',
    chain: 'PVR',
    cityId: 'hyderabad',
    location: 'Panjagutta, Hyderabad',
    address: 'Next Galleria Mall, Nagarjuna Circle, Panjagutta, Hyderabad 500082',
    amenities: ['4DX', 'Dolby Atmos', 'M-Ticket', 'Food Court'],
    cancellationAvailable: true
  },

  // Pune
  {
    id: 'th-pune-pvr-phoenix',
    name: 'PVR: Phoenix Marketcity, Viman Nagar',
    chain: 'PVR',
    cityId: 'pune',
    location: 'Viman Nagar, Pune',
    address: 'Phoenix Marketcity, Viman Nagar Rd, Pune 411014',
    amenities: ['IMAX', '4DX', 'Gold Class Recliners', 'M-Ticket'],
    cancellationAvailable: true
  },

  // Ahmedabad
  {
    id: 'th-amd-cinepolis-alpha',
    name: 'Cinépolis: Alpha One Mall, Vastrapur',
    chain: 'Cinepolis',
    cityId: 'ahmedabad',
    location: 'Vastrapur, Ahmedabad',
    address: 'Ahmedabad One Mall, Vastrapur, Ahmedabad 380054',
    amenities: ['Dolby Atmos', 'Recliner', 'M-Ticket', 'Food Court'],
    cancellationAvailable: true
  }
];

export const INITIAL_SNACKS: SnackItem[] = [
  {
    id: 'snack-cheese-popcorn',
    name: 'Cinebook Cheese Popcorn (Tub)',
    description: 'Crispy popped gourmet corn dusted with rich savory cheese seasoning.',
    price: 290,
    category: 'Popcorn',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-salted-popcorn',
    name: 'Classic Golden Salted Popcorn (Jumbo)',
    description: 'Freshly popped warm theater butter & Himalayan salt popcorn.',
    price: 240,
    category: 'Popcorn',
    imageUrl: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-caramel-popcorn',
    name: 'Artisanal Caramel Crunch Popcorn',
    description: 'Glazed in authentic crunchy brown butter caramel coating.',
    price: 320,
    category: 'Popcorn',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-nachos-salsa',
    name: 'Mexican Nachos with Warm Cheese & Salsa',
    description: 'Crispy stone-ground tortilla chips with jalapeño cheese dip and zesty salsa.',
    price: 260,
    category: 'Quick Bites',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-samosa-duo',
    name: 'Punjabi Paneer Samosa Duo + Mint Chutney',
    description: 'Crispy flaky pastry stuffed with spiced potatoes, green peas and paneer.',
    price: 190,
    category: 'Quick Bites',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-pepsi-500',
    name: 'Chilled Pepsi Fountain 500ml',
    description: 'Ice-cold bubbly refreshing cola in a cinema collector cup.',
    price: 130,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-coke-zero',
    name: 'Coca-Cola Zero Sugar 500ml',
    description: 'Crisp bold cola taste with zero sugar and zero calories.',
    price: 130,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  },
  {
    id: 'snack-blockbuster-combo',
    name: 'Blockbuster Duo Combo',
    description: '1 Large Cheese Popcorn + 2 Chilled Pepsi (500ml) + 1 Warm Nachos Plate. Best value!',
    price: 580,
    category: 'Combos',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80',
    isVeg: true
  }
];

export const INITIAL_PROMOS: PromoCode[] = [
  {
    code: 'CINEBOOK100',
    discountType: 'flat',
    value: 100,
    minAmount: 350,
    description: 'Flat ₹100 off on ticket bookings above ₹350'
  },
  {
    code: 'BOLLYWOOD50',
    discountType: 'flat',
    value: 50,
    minAmount: 200,
    description: 'Flat ₹50 off on any Hindi movie ticket'
  },
  {
    code: 'CINEVIP20',
    discountType: 'percentage',
    value: 20,
    minAmount: 400,
    maxDiscount: 150,
    description: '20% off up to ₹150 for Cinebook VIP members'
  },
  {
    code: 'ICICIBOGO',
    discountType: 'flat',
    value: 180,
    minAmount: 500,
    description: 'ICICI Bank Cardholder Special: Flat ₹180 off'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    movieId: 'stree-2',
    userName: 'Aakash Verma',
    rating: 10,
    title: 'Absolute Masterpiece of Horror-Comedy!',
    comment: 'Pankaj Tripathi and Rajkummar Rao delivered comedic gold. The headless monster lore and Sarkata CGI were actually terrifying! A complete family blockbuster.',
    date: '16 Aug 2024',
    likes: 1420,
    tags: ['Super Comedy', 'Great Acting', 'Blockbuster', 'Family Entertainer']
  },
  {
    id: 'rev-2',
    movieId: 'stree-2',
    userName: 'Rhea Sengupta',
    rating: 9,
    title: 'Shraddha Kapoor steals every scene she is in',
    comment: 'The mid-credit scenes and universe crossovers gave me chills. The music by Sachin Jigar rocks in IMAX. Do not miss this on big screens!',
    date: '17 Aug 2024',
    likes: 980,
    tags: ['Mindblowing', 'Visual Treat']
  },
  {
    id: 'rev-3',
    movieId: 'jawan',
    userName: 'Mohammad Farhan',
    rating: 10,
    title: 'King Khan redefines Indian Commercial Cinema!',
    comment: 'Shah Rukh Khan’s screen presence as Vikram Rathore is pure goosebumps. Anirudh’s background score elevates every single slow-motion moment to absolute euphoria.',
    date: '08 Sep 2023',
    likes: 3100,
    tags: ['Mass Action', 'SRK Magic', 'Goosebumps', 'Unreal BGM']
  },
  {
    id: 'rev-4',
    movieId: '12th-fail',
    userName: 'Pooja Hegde (Fan)',
    rating: 10,
    title: 'Tears in my eyes! Every student must watch this.',
    comment: 'Vikrant Massey lived the soul of Manoj Sharma. The film will rekindle your hunger to never give up no matter how dark the road seems. #Restart!',
    date: '29 Oct 2023',
    likes: 2450,
    tags: ['Inspiring', 'Pure Cinema', 'Masterpiece']
  }
];
