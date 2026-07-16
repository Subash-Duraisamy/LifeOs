import "./LudoCell.css";

function LudoCell({

    cell,

    children,

}){

    return(

        <div

            className={`

                ludo-cell

                ${cell.type}

                ${cell.color || ""}

            `}

        >

            {children}

        </div>

    );

}

export default LudoCell;