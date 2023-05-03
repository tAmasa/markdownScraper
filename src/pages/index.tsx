// import Image from 'next/image'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <h1 className="text-3xl font-bold underline">
//       Hello world!
//     </h1>
//   )
// }

import type { NextPage } from 'next';
import UrlScraper from '../components/urlScraper';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-10">
        <UrlScraper />
</main>
</div>
);
};

export default Home;
