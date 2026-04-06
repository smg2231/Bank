import LoginPage from "@/components/LoginPage";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans text-center">
      {/* Logo front and center */}
      <div className="mb-8">
        <Image
          src="/plush.png"
          alt="Logo"
          width={320}
          height={320}
          className="rounded-full"
          priority
        />
      </div>

      {/* Tagline / content */}
      <div className="flex flex-col gap-2">
        <p>Secure. Reliable. Simple.</p>
        <p>Join us today!</p>
      </div>
       <article>
              <header>
                <h2>Login</h2>
              </header>
              {/*Updated: pass redirect info */}
              <LoginPage />
            </article>
    </div>
  );
}