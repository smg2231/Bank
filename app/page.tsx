import Login from '@/components/Login';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="homepage">

      <Image
        src="/plush.png"
        alt="Logo"
        width={350}
        height={350}
        className="rounded-full"
      />

      <div className="tagline">
        <p>Secure. Reliable. Simple.</p>
        <p>Join us today!</p>
      </div>
      <Login />
    </div>
  );
}