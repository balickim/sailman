import Image from "next/image";
import styles from "./BackgroundImage.module.scss";

const BackgroundImage = () => (
  <div>
    <div className={styles.bgWrap}>
      <Image
        alt="Background image"
        src="/images/pexels-tony-cowen.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
    </div>
  </div>
);

export default BackgroundImage;
