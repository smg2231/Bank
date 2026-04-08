import LoginPage from '@/components/LoginPage';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="homepage">

      <div className="mb-8">
        <Image
          src="/plush.png"
          alt="Logo"
          width={320}
          height={320}
          className="rounded-full"
        />
      </div>

      <div className="tagline">
        <p>Secure. Reliable. Simple.</p>
        <p>Join us today!</p>
      </div>

      <div className = "mt-8">
        <a href="/login" className="btn">
          <LoginPage />
        </a>
      </div>
    </div>
  );
}