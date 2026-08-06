import "./SummaryCards.css";

import {
    ArrowDownCircle,
    ArrowUpCircle,
    PiggyBank,
    Wallet,
    TrendingUp,
    Percent,
} from "lucide-react";

function SummaryCards({ transactions }) {

    const income = transactions
        .filter(item => item.type === "income")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = transactions
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const saving = transactions
        .filter(item => item.type === "saving")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const balance = income - expense - saving;

    const savingsRate =
        income > 0
            ? ((saving / income) * 100).toFixed(1)
            : 0;

    const expenseRate =
        income > 0
            ? ((expense / income) * 100).toFixed(1)
            : 0;

    const cards = [

        {
            title: "Income",
            value: income,
            icon: ArrowDownCircle,
            color: "#22c55e",
        },

        {
            title: "Expenses",
            value: expense,
            icon: ArrowUpCircle,
            color: "#ef4444",
        },

        {
            title: "Savings",
            value: saving,
            icon: PiggyBank,
            color: "#f59e0b",
        },

        {
            title: "Available Balance",
            value: balance,
            icon: Wallet,
            color: "#2563eb",
        },

        {
            title: "Savings Rate",
            value: savingsRate + "%",
            icon: TrendingUp,
            color: "#7c3aed",
        },

        {
            title: "Expense Rate",
            value: expenseRate + "%",
            icon: Percent,
            color: "#ec4899",
        },

    ];

    return (

        <div className="summary-grid">

            {

                cards.map(card => {

                    const Icon = card.icon;

                    return (

                        <div
                            className="summary-card"
                            key={card.title}
                        >

                            <div
                                className="summary-icon"
                                style={{
                                    background: card.color
                                }}
                            >

                                <Icon size={24} />

                            </div>

                            <div>

                                <p>

                                    {card.title}

                                </p>

                                <h2>

                                    {

                                        typeof card.value === "number"

                                            ? `₹${card.value.toLocaleString()}`

                                            : card.value

                                    }

                                </h2>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}

export default SummaryCards;