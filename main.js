window.findUserIP = async () => {
    const response = await fetch('https://api64.ipify.org?format=json').catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();
    const ipv4 = json.ip;

    let elemIpv4 = document.getElementById('ipv4');
    elemIpv4.innerHTML = `Your current IP is ${ipv4}`;
}