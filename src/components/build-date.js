import * as React from "react"

function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
}
const BuildDate = () => {
    const currentDate = getDate();

    return (<span>{currentDate}</span>)
}

export default BuildDate;
