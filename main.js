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