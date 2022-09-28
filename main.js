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

window.findIPInfo = async () => {
    const ip = document.getElementById('addressInput').values;
    if(!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) return;
    const uri = `http://www.geoplugin.net/json.gp?ip=${ip}`;
    const response = await fetch(uri).catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();
}