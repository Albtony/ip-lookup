window.main = async () => {
    const ipv4 = await getUserIP();
    const data = await getIPdata(ipv4);

    let elemIpv4 = document.getElementById('ipv4');
    elemIpv4.innerHTML = `Your current IP is ${ipv4}`;

    createResult(data);
}

window.searchIpOrDomain = async () => {
    const input = document.getElementById('ipORdomain').value.trim();
    const regexURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    const regexIpv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    let ip;

    if(regexURL.test(input)) {
        const response = await fetch(`https://dns.google/resolve?name=${input}`);
        const json = await response.json();
        if(json.Answer) ip = json.Answer[0].data;
        else ip = null;
    } else if(regexIpv4.test(input)) {
        ip = input;
    } else {
        createTemporaryPopup('Please check your input', '#ff3e3e', 5);
        return;
    }

    if(!ip) {
        createTemporaryPopup('no result was found', '#ff3e3e', 5);
        return;
    }

    const data = await getIPdata(ip);
    createResult(data);
}

window.getUserIP = async () => {
    const response = await fetch('https://api64.ipify.org?format=json').catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();
    const ipv4 = json.ip;
    return ipv4;
}

window.getIPdata = async (ip) => {
    if(!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) return;
    const uri = `http://ipwho.is/${ip}`;
    const response = await fetch(uri).catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();
    return json;
}

window.createResult = (data) => {
    let map = document.getElementById('map');
    map.innerHTML = '';
    createMap(data.longitude, data.latitude);

    let info = document.getElementById('ip-info');
    info.innerHTML = '';
    createInfo(info, data);
}

window.createMap = (longitude, latitude) => {
    const coordinate = [parseFloat(longitude), parseFloat(latitude)];
    const view = new ol.View({
        center: ol.proj.fromLonLat(coordinate),
        zoom: 13
    });
    const tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    const marker = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinate))
                })
            ]
        })
    });
    const map = new ol.Map({
        target: 'map',
        layers: [tile, marker],
        view: view
    });
}

window.createTemporaryPopup = async (message, color, duration) => {
    let popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.backgroundColor = color;
    popup.innerHTML = message;

    document.body.appendChild(popup);
    await waitFor(duration * 1000);
    popup.style.opacity = 0;
    await waitFor(3 * 100);
    popup.remove();
}

window.createInfo = (info, data) => {
    info.innerHTML += 
        `                            
            <li>
                <div class="String">
                    <span class="key">ip:</span>
                    <span class="value">${data.ip}</span>
                </div>
            </li>
            <li>
                <div class="String">
                    <span class="key">type:</span>
                    <span class="value">${data.type}</span>
                </div>
            </li>
            <li>
                <input id="location" class="toggle" type="checkbox">
                <label for="location" class="collapsible-toggle">location:</label>
                <div class="collapsible-content">
                    <div class="content-inner">
                        <ul>
                            <li>
                                <div class="String">
                                    <span class="key">continent:</span>
                                    <span class="value">${data.continent}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">country:</span>
                                    <span class="value">${data.country}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">city:</span>
                                    <span class="value">${data.city}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">postal:</span>
                                    <span class="value">${data.postal}</span>
                                </div>
                            </li>
                            <li>
                                <div class="Number">
                                    <span class="key">longitude:</span>
                                    <span class="value">${data.longitude}</span>
                                </div>
                            </li>
                            <li>
                                <div class="Number">
                                    <span class="key">latitude:</span>
                                    <span class="value">${data.latitude}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
            <li>
                <input id="connection" class="toggle" type="checkbox">
                <label for="connection" class="collapsible-toggle">connection:</label>
                <div class="collapsible-content">
                    <div class="content-inner">
                        <ul>
                            <li>
                                <div class="Number">
                                    <span class="key">asn:</span>
                                    <span class="value">${data.connection.asn}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">org:</span>
                                    <span class="value">${data.connection.org}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">isp:</span>
                                    <span class="value">${data.connection.isp}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">domain:</span>
                                    <span class="value">${data.connection.domain}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
            <li>
                <input id="timezone" class="toggle" type="checkbox">
                <label for="timezone" class="collapsible-toggle">timezone:</label>
                <div class="collapsible-content">
                    <div class="content-inner">
                        <ul>
                            <li>
                                <div class="String">
                                    <span class="key">id:</span>
                                    <span class="value">${data.timezone.id}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">abbr:</span>
                                    <span class="value">${data.timezone.abbr}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">utc:</span>
                                    <span class="value">${data.timezone.utc}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">current_time:</span>
                                    <span class="value">${data.timezone.utc}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        `
}

window.waitFor = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}