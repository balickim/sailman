import Image from "next/image";
import styles from "./BackgroundImage.module.css";

const BackgroundImage = () => (
  <picture>
    <div className={styles.bgWrap}>
      <Image
        alt="Mountains"
        src="/images/pexels-tony-cowen.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
    </div>
  </picture>
);

export default BackgroundImage;
