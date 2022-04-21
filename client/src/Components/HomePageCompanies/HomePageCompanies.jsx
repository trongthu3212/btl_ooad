import { useState, useEffect } from "react";

function HomePageCompanies() {
    const [indexCompanies, setIndexCompanies] = useState(0);

    const listCompanies = [
        "chevron-alt.svg",
        "philips-alt.svg",
        "logitech-alt.svg",
        "overstock-alt.svg",
        "instacart-alt.svg",
        "barkbox-alt.svg",
        "wisetech-global-alt.svg",
        "microsoft-alt.svg",
        "intercom-alt.svg",
        "siemens-alt.svg",
        "bloomberg-alt.svg",
        "verizon-media-alt.svg",
    ];

    function handleClickSite(indexSite) {
        setIndexCompanies(indexSite);
    }

    useEffect(() => {
        const interval = setInterval(function () {
            setIndexCompanies((prevIndex) =>
                prevIndex + 1 === 3 ? 0 : prevIndex + 1
            );
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="companies-used">
            <div className="companies-used__heading">
                Thousands of organizations around the globe use Stack Overflow
                for Teams
            </div>
            <div className="companies-used__logos">
                <img
                    src={`https://cdn.sstatic.net/Img/product/teams/logos/${
                        listCompanies[indexCompanies * 4]
                    }`}
                ></img>
                <img
                    src={`https://cdn.sstatic.net/Img/product/teams/logos/${
                        listCompanies[indexCompanies * 4 + 1]
                    }`}
                ></img>
                <img
                    src={`https://cdn.sstatic.net/Img/product/teams/logos/${
                        listCompanies[indexCompanies * 4 + 2]
                    }`}
                ></img>
                <img
                    src={`https://cdn.sstatic.net/Img/product/teams/logos/${
                        listCompanies[indexCompanies * 4 + 3]
                    }`}
                ></img>
            </div>
            <div className="companies-used__nav">
                <span
                    onClick={() => handleClickSite(0)}
                    style={
                        indexCompanies === 0 ? { backgroundColor: "black" } : {}
                    }
                ></span>
                <span
                    onClick={() => handleClickSite(1)}
                    style={
                        indexCompanies === 1 ? { backgroundColor: "black" } : {}
                    }
                ></span>
                <span
                    onClick={() => handleClickSite(2)}
                    style={
                        indexCompanies === 2 ? { backgroundColor: "black" } : {}
                    }
                ></span>
            </div>
        </div>
    );
}

export default HomePageCompanies;
