import Image from "next/image";
import styles from "./BackgroundImage.module.scss";

const BackgroundImage = () => (
  <>
    <div className={styles.bgWrap}>
      <Image
        alt="Background image"
        src="/images/pexels-tony-cowen.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={true}
      />
    </div>
  </>
);

export default BackgroundImage;
