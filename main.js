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
    // if(!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) return;
    const uri = `http://www.geoplugin.net/json.gp?ip=${ip}`;
    const response = await fetch(uri).catch((err) => {
        console.warn(err);
        return;
    });
    const json = await response.json();
    createMap(json.geoplugin_longitude, json.geoplugin_latitude);
}

window.createMap = (longitude, latitude) => {
    console.log(longitude); // 110.5958
    console.log(latitude);  // -7.5331
    const view = new ol.View({
        // center: ol.proj.fromLonLat([longitude, latitude]),
        center: ol.proj.fromLonLat([110.5958, -7.5331]),
        zoom: 12
    });
    const tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    const marker = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    // geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([110.5958, -7.5331]))
                })
            ]
        })
    });
    let map = new ol.Map({
        target: 'map',
        layers: [tile, marker],
        view: view
    });
}