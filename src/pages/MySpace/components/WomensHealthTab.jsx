import "./WomenHealthTab.css";

function WomenHealthTab() {

    return (

        <div className="women-health">

            <div className="women-header">

                <h1>🌸 Women's Health</h1>

                <p>
                    Track your menstrual cycle, journal, health insights and buddy.
                </p>

            </div>

            <div className="women-card">

                <h2>Current Status</h2>

                <p>
                    Current phase, cycle day and next period will appear here.
                </p>

            </div>

            <div className="women-card">

                <h2>Cycle Overview</h2>

                <p>
                    Progress and prediction details will appear here.
                </p>

            </div>

            <div className="women-card">

                <h2>Daily Journal</h2>

                <p>
                    Mood, symptoms, flow, sleep, water and notes will be tracked here.
                </p>

            </div>

            <div className="women-card">

                <h2>Cycle History</h2>

                <p>
                    Previous cycles will be shown here.
                </p>

            </div>

            <div className="women-card">

                <h2>Analytics</h2>

                <p>
                    Average cycle, regularity and insights will appear here.
                </p>

            </div>

            <div className="women-card">

                <h2>Buddy</h2>

                <p>
                    Connect with a trusted buddy and manage permissions.
                </p>

            </div>

        </div>

    );

}

export default WomenHealthTab;