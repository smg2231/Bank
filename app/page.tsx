import Image from "next/image";

export default function Home() {
  return (
    <div className="homepage">

      {/* LEFT IMAGE */}
      <Image
        src="/OnlineB.jpg"
        alt="Left Image"
        width={300}
        height={440}
        className="left-image"
        priority
      />

      {/* RIGHT IMAGE */}
      <Image
        src="/OnlinePay.jpg"
        alt="Right Image"
        width={300}
        height={440}
        className="right-image"
        priority
      />

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