import dynamic from "next/dynamic";

function HomePage() {
  const Map = dynamic(() => import("../components/map/Map"), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });
  return <Map />;
}

export default HomePage;
