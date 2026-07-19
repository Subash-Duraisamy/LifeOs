import ParticipantCard from "./ParticipantCard";

function ParticipantsList({

    participants = [],

    speakingUsers = [],

    onParticipantClick,

}) {

    if (participants.length === 0) {

        return (

            <div className="participants-empty">

                <h3>

                    No Participants

                </h3>

            </div>

        );

    }

    return (

        <div className="participants-grid">

            {

                participants.map((participant) => (

                    <ParticipantCard

                        key={participant.id}

                        participant={participant}

                        isSpeaking={

                            speakingUsers.includes(

                                participant.id

                            )

                        }

                        isMuted={

                            participant.isMuted

                        }

                        cameraEnabled={

                            participant.cameraEnabled

                        }

                        isHost={

                            participant.isHost

                        }

                        onClick={() =>

                            onParticipantClick?.(

                                participant

                            )

                        }

                    />

                ))

            }

        </div>

    );

}

export default ParticipantsList;