import "./ButtonCustom.scss";

/**COMMON BUTTON WITH DYNAMIC PROPS */
const ButtonCustom = (props: any) => {
  return (
    <button
      onClick={props?.onClick}
      type={props?.type}
      className={`btn-style ${props.className} ${props.fluid ? "w-100" : ""} ${props.transparent ? "transparent" : ""
        }`}
      disabled={props?.disabled}
    >
      {props.btnIcon && <span><img src={props.btnIcon} alt="icon" className="" /></span>}
      <p> {props.title}</p>
      {props.onlyIcon && <span className="onlyIcon">{props.onlyIcon}</span>}
    </button>
  );
};

export default ButtonCustom;
