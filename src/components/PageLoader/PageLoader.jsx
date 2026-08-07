import Loader from "../Loader/Loader";

export default function PageLoader({ loading, children }) {

    if (loading) {
        return <Loader />;
    }

    return children;

}