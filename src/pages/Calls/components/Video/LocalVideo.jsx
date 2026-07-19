import { useEffect } from "react";

function LocalVideo({

    videoRef,

    stream,

    cameraEnabled,

    userName = "You",

}) {

    useEffect(() => {

        if (

            videoRef?.current &&

            stream

        ) {

            videoRef.current.srcObject = stream;

        }

    }, [

        stream,

        videoRef,

    ]);

    return (

        <div className="video-card local-card">

            {

                cameraEnabled ? (

                    <video

                        ref={videoRef}

                        autoPlay

                        playsInline

                        muted

                        className="video-element local-video"

                    />

                ) : (

                    <div className="video-placeholder">

                        <div className="avatar-circle">

                            {

                                userName

                                    ?.charAt(0)

                                    ?.toUpperCase()

                            }

                        </div>

                        <h3>

                            Camera Off

                        </h3>

                    </div>

                )

            }

            <div className="video-name">

                {userName}

            </div>

        </div>

    );

}

export default LocalVideo;