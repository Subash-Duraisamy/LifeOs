import "./LudoToken.css";

function LudoToken({

    color,

    selected = false,

    disabled = false,

    onClick,

}) {

    function handleClick() {

        if (disabled) {

            return;

        }

        if (onClick) {

            onClick();

        }

    }

    return (

        <div

            className={

                `ludo-token ${color} ${

                    selected ? "selected" : ""

                } ${

                    disabled ? "disabled" : ""

                }`

            }

            onClick={handleClick}

        />

    );

}

export default LudoToken;