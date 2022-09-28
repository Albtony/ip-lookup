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
    const ip = document.getElementById('ipORdomain').value;
    if(!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) return;
    const uri = `http://ipwho.is/${ip}`;
    const response = await fetch(uri).catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();

    let map = document.getElementById('map');
    map.innerHTML = '';
    createMap(json.longitude, json.latitude);

    let info = document.getElementById('ip-info');
    info.innerHTML = '';
    createInfo(info, json);
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

window.createInfo = (info, json) => {
    info.innerHTML += 
        `                            
            <li>
                <div class="String">
                    <span class="key">ip:</span>
                    <span class="value">${json.ip}</span>
                </div>
            </li>
            <li>
                <div class="String">
                    <span class="key">type:</span>
                    <span class="value">${json.type}</span>
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
                                    <span class="value">${json.continent}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">country:</span>
                                    <span class="value">${json.country}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">city:</span>
                                    <span class="value">${json.city}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">postal:</span>
                                    <span class="value">${json.postal}</span>
                                </div>
                            </li>
                            <li>
                                <div class="Number">
                                    <span class="key">longitude:</span>
                                    <span class="value">${json.longitude}</span>
                                </div>
                            </li>
                            <li>
                                <div class="Number">
                                    <span class="key">latitude:</span>
                                    <span class="value">${json.latitude}</span>
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
                                    <span class="value">${json.connection.asn}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">org:</span>
                                    <span class="value">${json.connection.org}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">isp:</span>
                                    <span class="value">${json.connection.isp}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">domain:</span>
                                    <span class="value">${json.connection.domain}</span>
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
                                    <span class="value">${json.timezone.id}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">abbr:</span>
                                    <span class="value">${json.timezone.abbr}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">utc:</span>
                                    <span class="value">${json.timezone.utc}</span>
                                </div>
                            </li>
                            <li>
                                <div class="String">
                                    <span class="key">current_time:</span>
                                    <span class="value">${json.timezone.utc}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        `
}