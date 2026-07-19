import { useEffect } from "react";

function RemoteVideo({

    videoRef,

    stream,

    participantName = "Remote User",

    connected = false,

    cameraEnabled = true,

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

        <div className="video-card remote-card">

            {

                connected ? (

                    cameraEnabled ? (

                        <video

                            ref={videoRef}

                            autoPlay

                            playsInline

                            className="video-element remote-video"

                        />

                    ) : (

                        <div className="video-placeholder">

                            <div className="avatar-circle">

                                {

                                    participantName

                                        ?.charAt(0)

                                        ?.toUpperCase()

                                }

                            </div>

                            <h3>

                                Camera Off

                            </h3>

                        </div>

                    )

                ) : (

                    <div className="video-placeholder">

                        <div className="waiting-animation">

                            ⏳

                        </div>

                        <h3>

                            Waiting for participant...

                        </h3>

                    </div>

                )

            }

            <div className="video-name">

                {participantName}

            </div>

        </div>

    );

}

export default RemoteVideo;