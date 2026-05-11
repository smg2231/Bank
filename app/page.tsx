import Image from "next/image";
import Login from "@/components/Login";

export default function Home() {
  return (
    <div className="homepage">

      <Login />

      {/* LEFT IMAGE */}
      <div className="image-wrapper left-wrapper">
        <Image
          src="/OnlineB.jpg"
          alt="Left Image"
          width={300}
          height={440}
          className="left-image"
          priority
        />
      </div>

      {/* RIGHT IMAGE */}
      <div className="image-wrapper right-wrapper">
        <Image
          src="/OnlinePay.jpg"
          alt="Right Image"
          width={300}
          height={440}
          className="right-image"
          priority
        />
      </div>

      {/* CENTER LOGO */}
      <div className="logo-wrapper">
        <Image
          src="/plush.png"
          alt="Logo"
          width={350}
          height={350}
          className="logo-float"
          priority
        />
      </div>

      <div className="tagline">
        <p>Secure. Reliable. Simple.</p>
        <p>Join us today!</p>
      </div>
    </div>
  );
}