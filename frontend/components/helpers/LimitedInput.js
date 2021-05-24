import styles from '@components/helpers/LimitedInput.module.scss';

const LimitedInput = ({ type, value, onChange, limit }) => {
  const percent = Math.floor((value.length / limit) * 100, 2);

  const loaderStyles = {
    position: 'absolute',
    display: value.length === 0 ? 'none' : 'block',
    borderColor: percent <= 70 ? 'orange' : 'red',
    width: `${percent}%`,
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={limit}
        className="form-control"
      />
      <span className={styles.loader} style={loaderStyles}></span>
    </div>
  );
};

export default LimitedInput;
