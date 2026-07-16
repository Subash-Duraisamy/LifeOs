import "./LudoToken.css";

function LudoToken({

    color,

    selected = false,

    disabled = false,

    stackIndex = 0,

    stackCount = 1,

    onClick,

}) {

    function handleClick() {

        if (disabled) return;

        onClick?.();

    }

    let left = 0;
    let top = 0;

    // 1 Token

    if (stackCount === 1) {

        left = 0;
        top = 0;

    }

    // 2 Tokens

    else if (stackCount === 2) {

        const pos = [

            { left: -7, top: 0 },

            { left: 7, top: 0 },

        ];

        left = pos[stackIndex].left;
        top = pos[stackIndex].top;

    }

    // 3 Tokens

    else if (stackCount === 3) {

        const pos = [

            { left: 0, top: -7 },

            { left: -7, top: 7 },

            { left: 7, top: 7 },

        ];

        left = pos[stackIndex].left;
        top = pos[stackIndex].top;

    }

    // 4 Tokens

    else {

        const pos = [

            { left: -7, top: -7 },

            { left: 7, top: -7 },

            { left: -7, top: 7 },

            { left: 7, top: 7 },

        ];

        left = pos[stackIndex].left;
        top = pos[stackIndex].top;

    }

    return (

        <div

            className={`ludo-token ${color}

            ${selected ? " selected" : ""}

            ${disabled ? " disabled" : ""}`}

            style={{

                transform:

                    `translate(${left}px, ${top}px)`,

                zIndex: stackIndex + 1,

            }}

            onClick={handleClick}

        />

    );

}

export default LudoToken;