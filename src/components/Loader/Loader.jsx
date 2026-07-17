import "./Loader.css";

export default function Loader() {

    return (

        <div className="loader">

            <svg
                className="ecg"
                viewBox="0 0 1200 180"
            >

                <defs>

                    <filter id="glow">

                        <feGaussianBlur stdDeviation="4" result="blur"/>

                        <feMerge>

                            <feMergeNode in="blur"/>

                            <feMergeNode in="SourceGraphic"/>

                        </feMerge>

                    </filter>

                </defs>

                <path

                    className="ecg-line"

                    filter="url(#glow)"

                    d="
                    M0 90
                    L150 90
                    L190 90
                    L220 40
                    L250 150
                    L280 20
                    L320 160
                    L360 55
                    L400 110
                    L430 90
                    L1200 90
                    "

                />

            </svg>

        </div>

    );

}