/*
 * South West Big Data Hack/Reduce, 16 Feb 2013
 * Interactive overlay of Bristol area electorial wards
 *
 * Simon Price, http://simonprice.info
*/

// proj4js does not include EPSG:27700 projection used by OS, so we define here
Proj4js.defs["EPSG:27700"] = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000+y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs";

var map;

function init() {
    var map_currentFeature;

    // transform from OS data
    var fromProjection = new OpenLayers.Projection("EPSG:27700");
    // to Spherical Mercator Projection (as used by Open Street Maps baselayer)
    var toProjection = new OpenLayers.Projection("EPSG:900913");

    map = new OpenLayers.Map('openlayers-map', {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.KeyboardDefaults()
        ]
    });
    map.fractionalZoom = true;

    var osmLayer = new OpenLayers.Layer.OSM();

    var selStyle = new OpenLayers.Style({
        strokeWidth: 0,
        fillColor: "#ffdd58",
        fillOpacity: 0.6
    });
    var defStyle = new OpenLayers.Style({
        strokeColor: "#666666",
        strokeWidth: 1,
        fillColor: "${getFillColor}",
        fillOpacity: 0.2
    }, {
        context: {
            getFillColor: function(feature) {
return "#c6ff59"; //hardwire colour for now
/*
                var id = feature.attributes.NAME;
                var foo = lookup some sort of "temperature" (0..9) using id as key
                if (foo == undefined) {
                    return "#ffffff";
                }
                var val = foo.temperature;
                var max = 9;
                var colours = [
                    "#c6ff59",
                    "#cdfa00",
                    "#ffdd58",
                    "#ffc94c",
                    "#ffb13e",
                    "#ff8939",
                    "#ff5f00",
                    "#fd5b33",
                    "#db403e",
                    "#d93f3f"
                ];
                val = Math.max(0, val);
                val = Math.min(val, max);
                return colours[val];
*/
            }
        }
    });
    var myStyleMap = new OpenLayers.StyleMap({
        "default": defStyle,
        "select": selStyle
    });
    wards = new OpenLayers.Layer.Vector("Vector Layer", {
         extractAttributes: true, 
         styleMap: myStyleMap
    });

    map.addLayers([osmLayer, wards]);

    var fmt = new OpenLayers.Format.GeoJSON({
        'internalProjection': map.baseLayer.projection,
        'externalProjection': fromProjection
    });

    for(var i=0; i<os_wards.features.length; i++) {
        // strip off " Ward" from end of place name
        os_wards.features[i].properties.NAME = os_wards.features[i].properties.NAME.replace(/\sWard$/i, '');
        // create a polygon from JSON feature serialisation returned by OS Open Data
        var feature = fmt.read(os_wards.features[i]);
        if (feature) {
            wards.addFeatures(feature, fmt);
        } else {
            alert('null feature - ' + id);
            break;
        }
    }

    var map_selectionControl = new OpenLayers.Control.SelectFeature(
        wards,
        {
            clickout: false, toggle: false,
            multiple: false, hover: true,
            box: false
        }
    )
    map.addControl(map_selectionControl);
    map_selectionControl.activate();
    
    wards.events.on({
        "click": function(evt) {
            if (map_currentFeature == undefined) {
                return;
            }
            if (map_currentFeature != undefined) {
                alert("CLICK... " + map_currentFeature.attributes.NAME);
            }
        },
        "featureselected": function(e) {
            if (e.feature.attributes.NAME != undefined) {
                $('openlayers-info').innerHTML = e.feature.attributes.NAME;
                map_currentFeature = e.feature;
            }
        },
        "featureunselected": function(e) {
            map_currentFeature = undefined;
        }
    });

    // centre map on Bristol area
    var map_centre = new OpenLayers.Geometry.Point(359185.8, 171959.2); 
    map_centre.transform(fromProjection, toProjection);
    map.setCenter(new OpenLayers.LonLat(map_centre.x, map_centre.y), 11);

}

var os_wards = {
    "IPR": "OS Open Data. Open Govenment Licence for public sector information. Contains Ordnance Survey data © Crown copyright and database right 2013.",
    "type": "FeatureCollection",
    "crs": {
        "type": "EPSG",
        "properties": {
            "code": 27700
        }
    },
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [374858, 163456],
                        [375133.9, 163421.6],
                        [375139, 163072.6],
                        [375319.2, 162845.7],
                        [375855.5, 163118.9],
                        [376211, 162665.2],
                        [376577.6, 162726.6],
                        [376664.9, 163079.5],
                        [376851.8, 164035.5],
                        [376185.9, 164072.7],
                        [375646.6, 164714.2],
                        [375368.8, 164706.6],
                        [375335.7, 164293],
                        [374811.5, 164420.1],
                        [374117.8, 165002],
                        [373758.2, 164506.5],
                        [374333.3, 163990.2],
                        [374999.1, 164026.6],
                        [374858, 163456]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001971",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 499,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 300.902,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "375881.9 163833.6",
            "NAME": "Widcombe Ward",
            "BOUNDING_BOX": "373758.2 162665.2 376851.8 165002.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [374171.3, 161826.8],
                        [374746.3, 161866],
                        [375139, 163072.6],
                        [375133.9, 163421.6],
                        [374858, 163456],
                        [374999.1, 164026.6],
                        [374333.3, 163990.2],
                        [373906.6, 163088.7],
                        [373714.6, 162395.7],
                        [374171.3, 161826.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001952",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 501,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 206.377,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "374426.8 162919.8",
            "NAME": "Lyncombe Ward",
            "BOUNDING_BOX": "373714.6 161826.8 375139.0 164026.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [375937.6, 161645.8],
                        [376563.4, 161990.8],
                        [376993.9, 162779.7],
                        [377935.7, 162790.5],
                        [378051.3, 163275.4],
                        [377751.9, 163597.1],
                        [377380.8, 163083],
                        [376945, 163302.5],
                        [376664.9, 163079.5],
                        [376577.6, 162726.6],
                        [376211, 162665.2],
                        [375855.5, 163118.9],
                        [375319.2, 162845.7],
                        [375139, 163072.6],
                        [374746.3, 161866],
                        [375937.6, 161645.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001943",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 503,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 273.203,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "375949.8 162621.5",
            "NAME": "Combe Down Ward",
            "BOUNDING_BOX": "374746.3 161645.8 378051.3 163597.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [374043.4, 161368.6],
                        [374171.3, 161826.8],
                        [373714.6, 162395.7],
                        [373906.6, 163088.7],
                        [373471.6, 163298.4],
                        [373126.3, 163062.9],
                        [372456.3, 162866],
                        [372695.1, 162609.3],
                        [372995.6, 162834.7],
                        [373460.8, 161461.1],
                        [374043.4, 161368.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001957",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 508,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 129.929,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "373313.8 162543.0",
            "NAME": "Odd Down Ward",
            "BOUNDING_BOX": "372456.3 161368.6 374171.3 163298.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [367676.8, 159846.5],
                        [365529.1, 159698.4],
                        [365391.2, 158781.1],
                        [365243.4, 158419.8],
                        [365758.6, 158038.3],
                        [365634.1, 157663.7],
                        [365871.7, 157457.9],
                        [367039.3, 157811.2],
                        [367255.9, 157601.8],
                        [367930.1, 158523.5],
                        [367676.8, 159846.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001965",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 529,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 470.923,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366622.0 158652.2",
            "NAME": "Timsbury Ward",
            "BOUNDING_BOX": "365243.4 157457.9 367930.1 159846.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [360912.6, 159396.7],
                        [360170.4, 159214.1],
                        [360294.3, 158394.3],
                        [359808.2, 157891.2],
                        [359032.9, 158465.1],
                        [356592.9, 159008.5],
                        [356660, 158710.7],
                        [354379.7, 156001.4],
                        [355563, 155271.4],
                        [355584.8, 154543.3],
                        [356507.5, 153890.5],
                        [356530.2, 154213.4],
                        [357345.3, 154069],
                        [358232.4, 154599.9],
                        [358616.2, 154971.7],
                        [358578.6, 155397.7],
                        [359494.1, 154917],
                        [361208.6, 156097.2],
                        [361854.9, 156831.6],
                        [362419.1, 157167.2],
                        [362620, 156954],
                        [362874.9, 157501.9],
                        [363262.6, 157473.9],
                        [362612.9, 158551.8],
                        [362352.3, 158235.6],
                        [360912.6, 159396.7]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001953",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 538,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2587.433,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358304.8 156643.6",
            "NAME": "Mendip Ward",
            "BOUNDING_BOX": "354379.7 153890.5 363262.6 159396.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [368042.7, 168728.5],
                        [367436.4, 168651.2],
                        [366648.1, 169284.8],
                        [365821.3, 168930.1],
                        [365634.9, 168451],
                        [365596.6, 167043],
                        [365428.7, 165990.6],
                        [366744.8, 165798.3],
                        [366485, 166536.5],
                        [366782.4, 166511.7],
                        [367066.3, 167672.6],
                        [367803.1, 168009.1],
                        [368042.7, 168728.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001946",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 568,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 485.765,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366735.7 167865.0",
            "NAME": "Keynsham East Ward",
            "BOUNDING_BOX": "365428.7 165798.3 368042.7 169284.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366744.8, 165798.3],
                        [367332.3, 165517.9],
                        [367470.1, 165946.7],
                        [368187.7, 165968.7],
                        [368729.5, 166384.9],
                        [369026.2, 166056.4],
                        [369285.3, 166371.5],
                        [368719.3, 167134],
                        [369611.8, 168334],
                        [369088.7, 168924.1],
                        [368042.7, 168728.5],
                        [367803.1, 168009.1],
                        [367066.3, 167672.6],
                        [366782.4, 166511.7],
                        [366485, 166536.5],
                        [366744.8, 165798.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001963",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 569,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 556.009,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "368048.4 167347.0",
            "NAME": "Saltford Ward",
            "BOUNDING_BOX": "366485.0 165517.9 369611.8 168924.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [372526, 163892.6],
                        [373017.7, 164263.6],
                        [372910.2, 164777.4],
                        [371877.1, 165471],
                        [371274.5, 164286.7],
                        [371746.3, 163898.8],
                        [372253.4, 164101],
                        [372526, 163892.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001966",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 571,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 154.502,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372202.9 164681.8",
            "NAME": "Twerton Ward",
            "BOUNDING_BOX": "371274.5 163892.6 373017.7 165471.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [372456.3, 162866],
                        [373126.3, 163062.9],
                        [373106.7, 163410.7],
                        [373017.7, 164263.6],
                        [372526, 163892.6],
                        [372253.4, 164101],
                        [371746.3, 163898.8],
                        [371643.5, 163378.7],
                        [372307.1, 163332.5],
                        [372097.6, 163058.3],
                        [372456.3, 162866]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001964",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 573,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 134.885,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372385.5 163564.8",
            "NAME": "Southdown Ward",
            "BOUNDING_BOX": "371643.5 162866.0 373126.3 164263.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [375231.5, 166242.8],
                        [375655.9, 166643.5],
                        [375915.2, 166140.6],
                        [376258.4, 166380.1],
                        [376462.6, 166149.9],
                        [377316.7, 166768.4],
                        [377489.8, 167262],
                        [376420.2, 167297.4],
                        [375701.5, 166911.3],
                        [375065.7, 167221.8],
                        [374707.1, 166955],
                        [375231.5, 166242.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001950",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 578,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 174.149,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "376064.7 166719.0",
            "NAME": "Lambridge Ward",
            "BOUNDING_BOX": "374707.1 166140.6 377489.8 167297.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [374811.5, 164420.1],
                        [374657.9, 165512.1],
                        [374403.7, 165748.4],
                        [373885.1, 165614],
                        [373126.4, 166002.9],
                        [373062.2, 164809.6],
                        [373681.3, 165126.7],
                        [374117.8, 165002],
                        [374811.5, 164420.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001949",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 584,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 129.644,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "373892.0 165211.5",
            "NAME": "Kingsmead Ward",
            "BOUNDING_BOX": "373062.2 164420.1 374811.5 166002.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [375639.6, 165357],
                        [375129.7, 165654.3],
                        [374657.9, 165512.1],
                        [374811.5, 164420.1],
                        [375335.7, 164293],
                        [375368.8, 164706.6],
                        [375646.6, 164714.2],
                        [375639.6, 165357]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001935",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 585,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 95.333,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "375152.3 164989.3",
            "NAME": "Abbey Ward",
            "BOUNDING_BOX": "374657.9 164293.0 375646.6 165654.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [373106.7, 163410.7],
                        [373758.2, 164506.5],
                        [374117.8, 165002],
                        [373681.3, 165126.7],
                        [373062.2, 164809.6],
                        [372910.2, 164777.4],
                        [373017.7, 164263.6],
                        [373106.7, 163410.7]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001969",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 587,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 93.747,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "373514.0 164568.4",
            "NAME": "Westmoreland Ward",
            "BOUNDING_BOX": "372910.2 163410.7 374117.8 165126.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [373126.3, 163062.9],
                        [373471.6, 163298.4],
                        [373906.6, 163088.7],
                        [374333.3, 163990.2],
                        [373758.2, 164506.5],
                        [373106.7, 163410.7],
                        [373126.3, 163062.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001958",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 588,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 96.188,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "373720.0 163810.5",
            "NAME": "Oldfield Ward",
            "BOUNDING_BOX": "373106.7 163062.9 374333.3 164506.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [376664.9, 163079.5],
                        [376945, 163302.5],
                        [377380.8, 163083],
                        [377751.9, 163597.1],
                        [378051.3, 163275.4],
                        [377996, 164246.3],
                        [377592.2, 164856.7],
                        [376559.8, 164676],
                        [376811.4, 165433.3],
                        [376275, 165956],
                        [375639.6, 165357],
                        [375646.6, 164714.2],
                        [376185.9, 164072.7],
                        [376851.8, 164035.5],
                        [376664.9, 163079.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001939",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 589,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 327.731,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "376814.1 164517.8",
            "NAME": "Bathwick Ward",
            "BOUNDING_BOX": "375639.6 163079.5 378051.3 165956.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [373885.1, 165614],
                        [374403.7, 165748.4],
                        [374657.9, 165512.1],
                        [375129.7, 165654.3],
                        [375231.5, 166242.8],
                        [374707.1, 166955],
                        [374155.8, 167344],
                        [374536.4, 167756.1],
                        [374298.3, 168020.8],
                        [373770, 168080.5],
                        [373162.3, 167583.5],
                        [373732.9, 166847.4],
                        [373503.6, 166286.3],
                        [373893.3, 166359],
                        [373885.1, 165614]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001951",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 590,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 280.241,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "374196.9 166504.9",
            "NAME": "Lansdown Ward",
            "BOUNDING_BOX": "373162.3 165512.1 375231.5 168080.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [375639.6, 165357],
                        [376275, 165956],
                        [376462.6, 166149.9],
                        [376258.4, 166380.1],
                        [375915.2, 166140.6],
                        [375655.9, 166643.5],
                        [375231.5, 166242.8],
                        [375129.7, 165654.3],
                        [375639.6, 165357]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001967",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 592,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 86.932,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "375753.7 166000.3",
            "NAME": "Walcot Ward",
            "BOUNDING_BOX": "375129.7 165357.0 376462.6 166643.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [372414, 166426],
                        [373126.4, 166002.9],
                        [373885.1, 165614],
                        [373893.3, 166359],
                        [373503.6, 166286.3],
                        [373732.9, 166847.4],
                        [373162.3, 167583.5],
                        [372845.6, 167371.5],
                        [372049.4, 167571.8],
                        [372414, 166426]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001970",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 593,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 197.379,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372971.3 166775.3",
            "NAME": "Weston Ward",
            "BOUNDING_BOX": "372049.4 165614.0 373893.3 167583.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [371877.1, 165471],
                        [372910.2, 164777.4],
                        [373062.2, 164809.6],
                        [373126.4, 166002.9],
                        [372414, 166426],
                        [372252.5, 166156.8],
                        [371718.4, 166378],
                        [371456.3, 166047.3],
                        [371877.1, 165471]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001956",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 595,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 186.412,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372443.2 165601.7",
            "NAME": "Newbridge Ward",
            "BOUNDING_BOX": "371456.3 164777.4 373126.4 166426.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [365034.6, 167992],
                        [364520.8, 167999.7],
                        [364038.9, 167444.2],
                        [363936.7, 166958],
                        [364316.9, 166691],
                        [365596.6, 167043],
                        [365634.9, 168451],
                        [364945.7, 168312.6],
                        [365034.6, 167992]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001948",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 625,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 199.359,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "364879.9 167571.0",
            "NAME": "Keynsham South Ward",
            "BOUNDING_BOX": "363936.7 166691.0 365634.9 168451.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362304.2, 167738.6],
                        [362924.5, 168450.3],
                        [362979.3, 168935.5],
                        [362002.8, 169979.5],
                        [361282.3, 169846.4],
                        [361280.6, 170199.1],
                        [360894.9, 169952.2],
                        [361231.7, 168172.1],
                        [362304.2, 167738.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002002",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 627,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 304.803,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361937.1 168927.2",
            "NAME": "Stockwood Ward",
            "BOUNDING_BOX": "360894.9 167738.6 362979.3 170199.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358568.1, 170107.5],
                        [359111.3, 170774.6],
                        [359729.3, 170898.3],
                        [360666.4, 171686.5],
                        [360258.9, 171743.1],
                        [359780.6, 172287.9],
                        [359716.6, 171940.1],
                        [358406.7, 171105.4],
                        [358335.7, 170327.3],
                        [358568.1, 170107.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002006",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 628,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 186.995,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359318.4 171197.7",
            "NAME": "Windmill Hill Ward",
            "BOUNDING_BOX": "358335.7 170107.5 360666.4 172287.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362979.3, 168935.5],
                        [363295.4, 169274],
                        [363153.9, 169500.7],
                        [363719.5, 169811.3],
                        [361693.4, 170716.5],
                        [362100.9, 172185],
                        [361330.7, 172442.9],
                        [361131.5, 171951.2],
                        [360258.9, 171743.1],
                        [360666.4, 171686.5],
                        [361280.6, 170199.1],
                        [361282.3, 169846.4],
                        [362002.8, 169979.5],
                        [362979.3, 168935.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001978",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 631,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 329.849,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361416.4 170689.2",
            "NAME": "Brislington West Ward",
            "BOUNDING_BOX": "360258.9 168935.5 363719.5 172442.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [365263.1, 172650.4],
                        [366594.5, 173463.9],
                        [366590, 173539.3],
                        [364517.3, 173911.9],
                        [364072.8, 173092],
                        [365263.1, 172650.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002075",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 635,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 207.01,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "365235.4 173281.2",
            "NAME": "Woodstock Ward",
            "BOUNDING_BOX": "364072.8 172650.4 366594.5 173911.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [370020.6, 175753.3],
                        [368310, 175560.3],
                        [367593.3, 175943.1],
                        [367271.6, 175722.8],
                        [367024.4, 175392.9],
                        [366219.3, 175284.9],
                        [366197.4, 174642.2],
                        [366590, 173539.3],
                        [366594.5, 173463.9],
                        [366865.5, 173258.2],
                        [366746.1, 172684.1],
                        [367126.9, 172628],
                        [367678.2, 172930.6],
                        [368018.2, 172595.8],
                        [368653, 172625.6],
                        [368877.8, 172847.6],
                        [368328.8, 173721.5],
                        [369711.8, 174247.2],
                        [370020.6, 175753.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002068",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 637,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 822.385,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "368023.2 174269.5",
            "NAME": "Siston Ward",
            "BOUNDING_BOX": "366197.4 172595.8 370020.6 175943.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [364599.7, 175000],
                        [365262.6, 175098.8],
                        [365654.8, 176164],
                        [364658.6, 176375.7],
                        [364325, 175993.1],
                        [364317.6, 175958.5],
                        [364599.7, 175000]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002069",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 641,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 127.605,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "364986.2 175681.8",
            "NAME": "Staple Hill Ward",
            "BOUNDING_BOX": "364317.6 175000.0 365654.8 176375.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357239.8, 175798.1],
                        [357302.9, 177062.2],
                        [358189.8, 177261.6],
                        [358445, 177580.9],
                        [358303.4, 177990.3],
                        [357396.4, 177623.5],
                        [357351.5, 178335.4],
                        [357400.3, 178587.1],
                        [356753.9, 178112.8],
                        [355832.7, 178101.7],
                        [355801.1, 177239.3],
                        [356421.8, 176294.2],
                        [357239.8, 175798.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002004",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 674,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 353.35,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357123.1 177126.3",
            "NAME": "Westbury-on-Trym Ward",
            "BOUNDING_BOX": "355801.1 175798.1 358445.0 178587.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358893.6, 174628.7],
                        [359463.2, 175087.4],
                        [358497.7, 175461.4],
                        [358368.1, 176134.7],
                        [357696.3, 175374.4],
                        [357286.5, 175319.3],
                        [357344, 174907.3],
                        [358893.6, 174628.7]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001997",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 676,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 153.514,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358374.8 175410.8",
            "NAME": "Redland Ward",
            "BOUNDING_BOX": "357286.5 174628.7 359463.2 176134.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357809.9, 173848.7],
                        [359074.5, 174246.5],
                        [358893.6, 174628.7],
                        [357344, 174907.3],
                        [357809.9, 173848.7]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001982",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 678,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 114.823,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358294.6 174378.0",
            "NAME": "Cotham Ward",
            "BOUNDING_BOX": "357344.0 173848.7 359074.5 174907.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [360258.9, 171743.1],
                        [361131.5, 171951.2],
                        [361330.7, 172442.9],
                        [361736, 172702.2],
                        [361591.7, 172710],
                        [361222.3, 172692.5],
                        [360652.9, 174591.5],
                        [359372, 173505.2],
                        [359512.5, 172823],
                        [359008.3, 172911.8],
                        [359013.5, 172019.3],
                        [359780.6, 172287.9],
                        [360258.9, 171743.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001995",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 679,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 412.661,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "360372.2 173061.8",
            "NAME": "Lawrence Hill Ward",
            "BOUNDING_BOX": "359008.3 171743.1 361736.0 174591.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361736, 172702.2],
                        [362101, 172991.1],
                        [362414.6, 173375],
                        [363004.2, 173190.9],
                        [363031.1, 173442.8],
                        [363569.8, 173435.5],
                        [363350.4, 174345.4],
                        [362476.5, 174234.3],
                        [361808.8, 174012],
                        [361562.8, 173787.2],
                        [361591.7, 172710],
                        [361736, 172702.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001999",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 681,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 188.347,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "362559.2 173523.8",
            "NAME": "St. George West Ward",
            "BOUNDING_BOX": "361562.8 172702.2 363569.8 174345.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362653.6, 173008.2],
                        [362874.9, 172175.6],
                        [363803.1, 172442.8],
                        [364072.8, 173092],
                        [364517.3, 173911.9],
                        [364470.8, 174370.7],
                        [363350.4, 174345.4],
                        [363569.8, 173435.5],
                        [363031.1, 173442.8],
                        [363004.2, 173190.9],
                        [362414.6, 173375],
                        [362101, 172991.1],
                        [362653.6, 173008.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001998",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 683,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 230.592,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "363592.0 173273.2",
            "NAME": "St. George East Ward",
            "BOUNDING_BOX": "362101.0 172175.6 364517.3 174370.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362869, 175446.5],
                        [364317.6, 175958.5],
                        [364325, 175993.1],
                        [364217.7, 176371.7],
                        [364618.1, 176906.2],
                        [364283.3, 177340.2],
                        [363476.5, 177211],
                        [363003.8, 177669.4],
                        [361994.1, 176845],
                        [362030.2, 176263.6],
                        [362928.9, 175886],
                        [362869, 175446.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001986",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 696,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 332.161,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "363184.6 176558.0",
            "NAME": "Frome Vale Ward",
            "BOUNDING_BOX": "361994.1 175446.5 364618.1 177669.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362476.5, 174234.3],
                        [363350.4, 174345.4],
                        [364470.8, 174370.7],
                        [364599.7, 175000],
                        [364317.6, 175958.5],
                        [362869, 175446.5],
                        [362274.8, 174851.4],
                        [362476.5, 174234.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001991",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 697,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 271.334,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "363545.4 175096.4",
            "NAME": "Hillfields Ward",
            "BOUNDING_BOX": "362274.8 174234.3 364599.7 175958.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [360997.3, 174934.6],
                        [360652.9, 174591.5],
                        [361222.3, 172692.5],
                        [361591.7, 172710],
                        [361562.8, 173787.2],
                        [361808.8, 174012],
                        [361888.2, 174617.2],
                        [361471.7, 174501.8],
                        [360997.3, 174934.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001983",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 701,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 147.056,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361270.6 173690.0",
            "NAME": "Easton Ward",
            "BOUNDING_BOX": "360652.9 172692.5 361888.2 174934.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361541.3, 177228.9],
                        [361592, 177635.8],
                        [360888.3, 177548.6],
                        [360713.5, 177909.4],
                        [360438.9, 178012.1],
                        [359672.7, 176772],
                        [360084.9, 175344.8],
                        [360652.9, 174591.5],
                        [360997.3, 174934.6],
                        [361269.3, 176216.7],
                        [361994.1, 176845],
                        [363003.8, 177669.4],
                        [361801, 177176.5],
                        [361541.3, 177228.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001996",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 703,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 427.473,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "360588.0 176301.8",
            "NAME": "Lockleaze Ward",
            "BOUNDING_BOX": "359672.7 174591.5 363003.8 178012.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [372240.9, 183047.2],
                        [372322.3, 182352.1],
                        [371961.4, 182271.7],
                        [371689, 181581.7],
                        [371517.4, 180924],
                        [372596.9, 181534.7],
                        [372701.1, 181038.8],
                        [373154.6, 181241.2],
                        [373054.8, 181643],
                        [373744.6, 181713.5],
                        [373249.4, 182676.5],
                        [373926.5, 182815.8],
                        [373481.5, 184970.3],
                        [373208, 185094.4],
                        [372226.1, 184516],
                        [372240.9, 183047.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002050",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 717,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 517.604,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372721.9 182928.1",
            "NAME": "Chipping Sodbury Ward",
            "BOUNDING_BOX": "371517.4 180924.0 373926.5 185094.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358756.1, 179771.6],
                        [356317.8, 179608.6],
                        [355183.4, 179448.2],
                        [355832.7, 178101.7],
                        [356753.9, 178112.8],
                        [357400.3, 178587.1],
                        [357351.5, 178335.4],
                        [358756.1, 179771.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001988",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 739,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 347.028,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "356684.8 178936.7",
            "NAME": "Henbury Ward",
            "BOUNDING_BOX": "355183.4 178101.7 358756.1 179771.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359783.1, 179992.2],
                        [358756.1, 179771.6],
                        [357351.5, 178335.4],
                        [357396.4, 177623.5],
                        [358303.4, 177990.3],
                        [358445, 177580.9],
                        [359303, 178452.6],
                        [359066, 179138.6],
                        [359641.3, 179504.3],
                        [359783.1, 179992.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002000",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 740,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 277,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358567.3 178641.9",
            "NAME": "Southmead Ward",
            "BOUNDING_BOX": "357351.5 177580.9 359783.1 179992.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358445, 177580.9],
                        [358189.8, 177261.6],
                        [359025.5, 176649.6],
                        [359378.6, 176334.6],
                        [359672.7, 176772],
                        [360438.9, 178012.1],
                        [359271.7, 178197.4],
                        [359303, 178452.6],
                        [358445, 177580.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001992",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 742,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 239.338,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359314.3 177291.3",
            "NAME": "Horfield Ward",
            "BOUNDING_BOX": "358189.8 176334.6 360438.9 178452.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359463.2, 175087.4],
                        [359812, 175483.7],
                        [360084.9, 175344.8],
                        [359672.7, 176772],
                        [359378.6, 176334.6],
                        [359025.5, 176649.6],
                        [358368.1, 176134.7],
                        [358497.7, 175461.4],
                        [359463.2, 175087.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001975",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 744,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 176.456,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359161.8 175929.7",
            "NAME": "Bishopston Ward",
            "BOUNDING_BOX": "358368.1 175087.4 360084.9 176772.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359054.6, 173603.2],
                        [359372, 173505.2],
                        [360652.9, 174591.5],
                        [360084.9, 175344.8],
                        [359812, 175483.7],
                        [359463.2, 175087.4],
                        [358893.6, 174628.7],
                        [359074.5, 174246.5],
                        [359054.6, 173603.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001972",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 747,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 177.66,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359773.3 174642.6",
            "NAME": "Ashley Ward",
            "BOUNDING_BOX": "358893.6 173505.2 360652.9 175483.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [356287.4, 171354],
                        [356696.5, 171489],
                        [356966.5, 171032.5],
                        [358272, 171555.1],
                        [358406.7, 171105.4],
                        [359716.6, 171940.1],
                        [359780.6, 172287.9],
                        [359013.5, 172019.3],
                        [357006.3, 172039.3],
                        [356646.4, 172533.3],
                        [356558.1, 172563],
                        [356522.8, 172151.3],
                        [355958.1, 172042.8],
                        [355607.7, 171466.6],
                        [356287.4, 171354]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002001",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 751,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 268.771,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357651.2 171797.8",
            "NAME": "Southville Ward",
            "BOUNDING_BOX": "355607.7 171032.5 359780.6 172563.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358188, 168042.9],
                        [357634.9, 167092.1],
                        [359041.1, 166666.8],
                        [359609.1, 167034.6],
                        [360390.8, 166859],
                        [360615.7, 167297.2],
                        [360392.9, 167708.7],
                        [358814.2, 168516.5],
                        [358764.1, 168481.4],
                        [358736.8, 168127.7],
                        [358188, 168042.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002005",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 757,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 292.727,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359190.9 167591.7",
            "NAME": "Whitchurch Park Ward",
            "BOUNDING_BOX": "357634.9 166666.8 360615.7 168516.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [360615.7, 167297.2],
                        [361231.7, 168172.1],
                        [360894.9, 169952.2],
                        [360217, 169686.5],
                        [358814.2, 168516.5],
                        [360392.9, 167708.7],
                        [360615.7, 167297.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001989",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 761,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 352.276,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "360045.0 168624.7",
            "NAME": "Hengrove Ward",
            "BOUNDING_BOX": "358814.2 167297.2 361231.7 169952.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359848.8, 169730.8],
                        [360217, 169686.5],
                        [360894.9, 169952.2],
                        [361280.6, 170199.1],
                        [360666.4, 171686.5],
                        [359729.3, 170898.3],
                        [359848.8, 169730.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001994",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 763,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 193.023,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "360504.9 170675.0",
            "NAME": "Knowle Ward",
            "BOUNDING_BOX": "359729.3 169686.5 361280.6 171686.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359013.5, 172019.3],
                        [359008.3, 172911.8],
                        [359512.5, 172823],
                        [359372, 173505.2],
                        [359054.6, 173603.2],
                        [359074.5, 174246.5],
                        [357809.9, 173848.7],
                        [357717.4, 172868.4],
                        [357826.4, 172581.7],
                        [357317.2, 172279.3],
                        [356646.4, 172533.3],
                        [357006.3, 172039.3],
                        [359013.5, 172019.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001979",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 766,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 296.734,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358079.4 172981.0",
            "NAME": "Cabot Ward",
            "BOUNDING_BOX": "356646.4 172019.3 359512.5 174246.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357382.5, 173516.6],
                        [357012.2, 174308],
                        [356199.1, 173371.7],
                        [356558.1, 172563],
                        [356646.4, 172533.3],
                        [357317.2, 172279.3],
                        [357826.4, 172581.7],
                        [357717.4, 172868.4],
                        [357144.5, 173368.6],
                        [357382.5, 173516.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001980",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 769,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 170.729,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357012.8 173350.7",
            "NAME": "Clifton Ward",
            "BOUNDING_BOX": "356199.1 172279.3 357826.4 174308.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [354231.5, 167799.6],
                        [354662.3, 167927.9],
                        [354758, 168392.9],
                        [355205.5, 168179.5],
                        [356118.2, 169227.1],
                        [355799.5, 169547.3],
                        [356023.1, 170024.4],
                        [356287.4, 171354],
                        [355607.7, 171466.6],
                        [355958.1, 172042.8],
                        [355424.1, 172384.3],
                        [355798.2, 172710],
                        [355255.4, 173093.9],
                        [353521.2, 171886.6],
                        [353433.9, 172644.9],
                        [352364.1, 173232.6],
                        [352522.5, 173822.2],
                        [352192.4, 174573.7],
                        [351830.5, 174213],
                        [350999.3, 174270.6],
                        [350874.8, 173700.5],
                        [351246.6, 172775.6],
                        [350071.5, 172762.3],
                        [350312.6, 173621.9],
                        [349368.5, 174121.3],
                        [348023.2, 173569.4],
                        [347961.3, 172691.8],
                        [347058.8, 171595.6],
                        [347136.7, 171307.3],
                        [347950.6, 171483.2],
                        [348133.6, 171262.1],
                        [348757.5, 170360.8],
                        [349327.9, 170592.3],
                        [350735, 169992.8],
                        [350960.8, 170472.8],
                        [351391.1, 169732.1],
                        [352115.6, 169665.6],
                        [352178.3, 168961.7],
                        [354255.6, 169283.4],
                        [354619.3, 168628.6],
                        [354231.5, 167799.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002040",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 770,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2985.248,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "352220.0 171186.7",
            "NAME": "Wraxall and Long Ashton Ward",
            "BOUNDING_BOX": "347058.8 167799.6 356287.4 174573.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358117.5, 166274.9],
                        [359238, 166398.5],
                        [359041.1, 166666.8],
                        [357634.9, 167092.1],
                        [356760.9, 167387.9],
                        [356239.5, 167198],
                        [355896.6, 167742.1],
                        [356373.1, 168743.1],
                        [356118.2, 169227.1],
                        [355205.5, 168179.5],
                        [354758, 168392.9],
                        [354662.3, 167927.9],
                        [354231.5, 167799.6],
                        [353798.1, 166238.7],
                        [352609.3, 166320.3],
                        [351943.5, 166045.8],
                        [351649.1, 166260.3],
                        [351313.1, 165542.7],
                        [351783.2, 164763.2],
                        [352106.1, 164792.8],
                        [352771.3, 162559.3],
                        [353534.5, 162625.6],
                        [353223.7, 161856],
                        [352884.6, 161826.6],
                        [352978.3, 161163.2],
                        [353364, 161046.6],
                        [353140.3, 160704],
                        [352947.3, 160952.1],
                        [352973.3, 160538.2],
                        [354047.6, 160485],
                        [354742.5, 160864.1],
                        [354856.4, 163521.7],
                        [355243.6, 164206.3],
                        [355578, 164263],
                        [355644, 163992.7],
                        [356244.7, 164206.4],
                        [355917.8, 164508.4],
                        [356437.4, 164795],
                        [356129.2, 165100.8],
                        [356469.7, 165530.3],
                        [357024.3, 164896.3],
                        [357473.2, 164924.7],
                        [356767.5, 165780.8],
                        [357306.5, 165988.3],
                        [357337.3, 165700.3],
                        [357808.4, 165925.9],
                        [358129.9, 165704.3],
                        [358117.5, 166274.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008608",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 774,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2437.806,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "354051.5 164856.0",
            "NAME": "Winford Ward",
            "BOUNDING_BOX": "351313.1 160485.0 359238.0 169227.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [346280.5, 162256.4],
                        [346378.6, 160787.7],
                        [347409.9, 160730.8],
                        [347464.5, 160085.1],
                        [347568.6, 160598.6],
                        [347700.4, 160253.2],
                        [348002.8, 160574.1],
                        [348216.8, 160131.3],
                        [348296.4, 161192.2],
                        [348548.4, 160855.8],
                        [348395.2, 161363.2],
                        [348569.8, 161160.8],
                        [349108.3, 161520.1],
                        [350000, 160748.8],
                        [349887.8, 160163.5],
                        [350784.7, 160095.5],
                        [351058.1, 160729.1],
                        [351698.5, 160818],
                        [352008.4, 161387.9],
                        [351989.9, 162202.1],
                        [351590.8, 162827.6],
                        [351783.2, 164763.2],
                        [351313.1, 165542.7],
                        [349907.1, 165974.8],
                        [349194, 166571.2],
                        [347303.3, 166086.9],
                        [347204.8, 164672.2],
                        [347185.8, 164376.2],
                        [345963.2, 164355.4],
                        [345606.4, 162818.6],
                        [346280.5, 162256.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008609",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 776,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2829.263,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "348682.6 163328.2",
            "NAME": "Wrington Ward",
            "BOUNDING_BOX": "345606.4 160085.1 352008.4 166571.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [342302.6, 160084.3],
                        [343529, 159669],
                        [343903.7, 158870.2],
                        [346813.8, 158441.9],
                        [347501.6, 158654],
                        [347556.4, 158122.5],
                        [349356.9, 157820.9],
                        [349858.7, 158294.4],
                        [350138.5, 157765.9],
                        [351530.7, 157679],
                        [351670.4, 157895],
                        [352219.6, 159253.8],
                        [350784.7, 160095.5],
                        [349887.8, 160163.5],
                        [350000, 160748.8],
                        [349108.3, 161520.1],
                        [348569.8, 161160.8],
                        [348395.2, 161363.2],
                        [348548.4, 160855.8],
                        [348296.4, 161192.2],
                        [348216.8, 160131.3],
                        [348002.8, 160574.1],
                        [347700.4, 160253.2],
                        [347568.6, 160598.6],
                        [347464.5, 160085.1],
                        [347409.9, 160730.8],
                        [346378.6, 160787.7],
                        [346280.5, 162256.4],
                        [345606.4, 162818.6],
                        [345392.5, 162905.7],
                        [344929.8, 161433.8],
                        [343851.5, 160594.8],
                        [343297.5, 160507.8],
                        [342661.2, 161316.1],
                        [341724.8, 161845.2],
                        [342302.6, 160084.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002009",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 778,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2371.062,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "344840.7 160292.3",
            "NAME": "Blagdon and Churchill Ward",
            "BOUNDING_BOX": "341724.8 157679.0 352219.6 162905.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [333419.1, 157997.2],
                        [333395.3, 157698.5],
                        [332745.8, 157968.1],
                        [331384.3, 157437.4],
                        [330762.7, 156850.8],
                        [330771.5, 156408.2],
                        [331131.8, 155986.8],
                        [332094.7, 155698.5],
                        [332864.9, 155858.3],
                        [332980.7, 156592.1],
                        [333299, 156616.5],
                        [334815.8, 156405.1],
                        [336424.3, 155343.1],
                        [336651.7, 155361],
                        [336816.6, 156216.4],
                        [336634.3, 157972.2],
                        [336344.7, 158209.5],
                        [337679.3, 158309.4],
                        [337399.5, 158730.9],
                        [337835.7, 159461.5],
                        [337798.7, 160022.9],
                        [336822.3, 161550.6],
                        [336409, 161320.1],
                        [336338.8, 161558.7],
                        [335204.3, 161004.1],
                        [335349.2, 159991.7],
                        [333785.8, 159203.1],
                        [334006.6, 158825.1],
                        [333588.9, 158768.9],
                        [333663.8, 158455.6],
                        [333771.7, 157993.9],
                        [333419.1, 157997.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008603",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 782,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2015.632,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "335625.1 158450.9",
            "NAME": "Hutton and Locking Ward",
            "BOUNDING_BOX": "330762.7 155343.1 337835.7 161558.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [332731.5, 159405.5],
                        [332388.4, 160404.5],
                        [329354.7, 160574.7],
                        [329059.9, 159817],
                        [330736.8, 158597.9],
                        [331384.3, 157437.4],
                        [332745.8, 157968.1],
                        [333395.3, 157698.5],
                        [333419.1, 157997.2],
                        [333771.7, 157993.9],
                        [333663.8, 158455.6],
                        [332579.4, 158465.2],
                        [332301, 159156.8],
                        [332731.5, 159405.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008605",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 786,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 769.125,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "331415.8 158954.4",
            "NAME": "Weston-Super-Mare Clarence and Uphill Ward",
            "BOUNDING_BOX": "329059.9 157437.4 333771.7 160574.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [332301, 159156.8],
                        [332579.4, 158465.2],
                        [333663.8, 158455.6],
                        [333588.9, 158768.9],
                        [333544.5, 159851.9],
                        [333917.7, 160307.4],
                        [333181.5, 160567.6],
                        [333303.3, 161099.8],
                        [332739.3, 161078.6],
                        [332305.4, 160935.9],
                        [332388.4, 160404.5],
                        [332731.5, 159405.5],
                        [332301, 159156.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002036",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 787,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 272.669,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "333109.3 159776.5",
            "NAME": "Weston-Super-Mare South Ward",
            "BOUNDING_BOX": "332301.0 158455.6 333917.7 161099.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [336409, 161320.1],
                        [336822.3, 161550.6],
                        [337117.7, 161758.9],
                        [337737.5, 161417.7],
                        [337797.5, 162510.5],
                        [337363.4, 162349.5],
                        [336926.9, 162732.7],
                        [336691.1, 163069.1],
                        [336020.3, 163164.7],
                        [335909.5, 162766.1],
                        [335660.2, 162803.5],
                        [335817.3, 162495.6],
                        [334789.3, 161981.2],
                        [334958.5, 161620.7],
                        [335982, 161966.3],
                        [336338.8, 161558.7],
                        [336409, 161320.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002037",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 793,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 296.345,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "336547.0 162242.4",
            "NAME": "Weston-Super-Mare South Worle Ward",
            "BOUNDING_BOX": "334789.3 161320.1 337797.5 163164.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [336634.3, 157972.2],
                        [336816.6, 156216.4],
                        [336651.7, 155361],
                        [336424.3, 155343.1],
                        [337540.4, 154991.9],
                        [338411.5, 156766.5],
                        [338944.6, 156025.8],
                        [339588.8, 156256.5],
                        [340616, 155940.8],
                        [342211.7, 156059.8],
                        [343610.9, 156123.6],
                        [343494.6, 157157.5],
                        [343818.3, 157254.6],
                        [343796.6, 157618.3],
                        [343096.6, 158090.1],
                        [343053.7, 158903.8],
                        [343903.7, 158870.2],
                        [343529, 159669],
                        [342302.6, 160084.3],
                        [341724.8, 161845.2],
                        [341597.2, 161995.7],
                        [340192.8, 162505],
                        [339935.3, 162955.1],
                        [339530.7, 162784.6],
                        [339337.9, 163085.1],
                        [338928.3, 162769.4],
                        [338079.3, 163756.4],
                        [337652.2, 163742.5],
                        [337479.3, 164095.1],
                        [337001.9, 163953.2],
                        [336926.9, 162732.7],
                        [337363.4, 162349.5],
                        [337797.5, 162510.5],
                        [337737.5, 161417.7],
                        [337117.7, 161758.9],
                        [336822.3, 161550.6],
                        [337798.7, 160022.9],
                        [337835.7, 159461.5],
                        [337399.5, 158730.9],
                        [337679.3, 158309.4],
                        [336344.7, 158209.5],
                        [336634.3, 157972.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008602",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 794,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3939.727,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "340124.2 159358.4",
            "NAME": "Banwell and Winscombe Ward",
            "BOUNDING_BOX": "336344.7 154991.9 343903.7 164095.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [341724.8, 161845.2],
                        [342661.2, 161316.1],
                        [343297.5, 160507.8],
                        [343851.5, 160594.8],
                        [344929.8, 161433.8],
                        [345392.5, 162905.7],
                        [345606.4, 162818.6],
                        [345963.2, 164355.4],
                        [347185.8, 164376.2],
                        [347204.8, 164672.2],
                        [344790.1, 165114.3],
                        [341656.2, 164774.5],
                        [341597.2, 161995.7],
                        [341724.8, 161845.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002017",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 797,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1550.655,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "344401.0 163047.2",
            "NAME": "Congresbury Ward",
            "BOUNDING_BOX": "341597.2 160507.8 347204.8 165114.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [335801.9, 163359.6],
                        [336020.3, 163164.7],
                        [336691.1, 163069.1],
                        [336926.9, 162732.7],
                        [337001.9, 163953.2],
                        [336620.3, 164385.4],
                        [336125.2, 163991.1],
                        [335133.1, 164081.3],
                        [335124.4, 163485.6],
                        [335535.8, 163038.4],
                        [335801.9, 163359.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008607",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 799,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 193.091,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "336051.6 163559.0",
            "NAME": "Weston-Super-Mare North Worle Ward",
            "BOUNDING_BOX": "335124.4 162732.7 337001.9 164385.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [332388.4, 160404.5],
                        [332305.4, 160935.9],
                        [332739.3, 161078.6],
                        [332846.5, 161668],
                        [330180.9, 161753.8],
                        [329354.7, 160574.7],
                        [332388.4, 160404.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002031",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 802,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 334.901,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "331223.8 161079.2",
            "NAME": "Weston-Super-Mare Central Ward",
            "BOUNDING_BOX": "329354.7 160404.5 332846.5 161753.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [323220.2, 160516.3],
                        [323517.4, 160733.7],
                        [322959.5, 160864.7],
                        [322959.2, 160864.6],
                        [322409.3, 160644.9],
                        [323220.2, 160516.3]
                    ]
                ],
                [
                    [
                        [332846.5, 161668],
                        [333906.4, 161936.1],
                        [333508.6, 162744.1],
                        [332602.4, 162646.9],
                        [332876, 163174.8],
                        [331142.5, 163762.8],
                        [330296.2, 162661.6],
                        [330350.2, 162204.9],
                        [330694.5, 162435.9],
                        [330180.9, 161753.8],
                        [332846.5, 161668]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002038",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 803,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 513.832,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "331487.7 162715.4",
            "NAME": "Weston-Super-Mare West Ward",
            "BOUNDING_BOX": "322409.3 160516.3 333906.4 163762.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [340129.3, 168923.2],
                        [339573.9, 168379.2],
                        [339136.7, 168855.8],
                        [338366.2, 168509.6],
                        [338344.9, 168883],
                        [337644.8, 169085.5],
                        [336459.9, 167241],
                        [336559.5, 166630.5],
                        [338939.6, 165522.6],
                        [338998.6, 164786.9],
                        [339435, 165209.5],
                        [340486.3, 164989.2],
                        [340933.8, 165286.1],
                        [341656.2, 164774.5],
                        [344790.1, 165114.3],
                        [347204.8, 164672.2],
                        [347303.3, 166086.9],
                        [345331.7, 167860.5],
                        [344033.8, 168534.7],
                        [343970.1, 169307.9],
                        [343347.1, 169741.2],
                        [341458.2, 170036.8],
                        [340685.2, 169863.2],
                        [340271.1, 169129.5],
                        [340392.4, 168813.9],
                        [340129.3, 168923.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002042",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 807,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3717.285,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "341213.5 167354.5",
            "NAME": "Yatton Ward",
            "BOUNDING_BOX": "336459.9 164672.2 347303.3 170036.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [347303.3, 166086.9],
                        [349194, 166571.2],
                        [349907.1, 165974.8],
                        [351313.1, 165542.7],
                        [351649.1, 166260.3],
                        [351943.5, 166045.8],
                        [352609.3, 166320.3],
                        [353798.1, 166238.7],
                        [354231.5, 167799.6],
                        [354619.3, 168628.6],
                        [354255.6, 169283.4],
                        [352178.3, 168961.7],
                        [352115.6, 169665.6],
                        [351391.1, 169732.1],
                        [350960.8, 170472.8],
                        [350735, 169992.8],
                        [349327.9, 170592.3],
                        [348757.5, 170360.8],
                        [348083.3, 169574.1],
                        [347516.2, 169417.6],
                        [347118.5, 168700.4],
                        [346357.8, 168777],
                        [346152.5, 168200.2],
                        [345331.7, 167860.5],
                        [347303.3, 166086.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008601",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 810,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2790.66,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "350094.3 168067.5",
            "NAME": "Backwell Ward",
            "BOUNDING_BOX": "345331.7 165542.7 354619.3 170592.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [347118.5, 168700.4],
                        [347516.2, 169417.6],
                        [348083.3, 169574.1],
                        [348757.5, 170360.8],
                        [348133.6, 171262.1],
                        [347382, 170754.8],
                        [347142, 170083],
                        [346616.9, 170163],
                        [346628.2, 169461.6],
                        [347118.5, 168700.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002022",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 813,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 248.329,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "347526.0 169981.3",
            "NAME": "Nailsea East Ward",
            "BOUNDING_BOX": "346616.9 168700.4 348757.5 171262.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [343970.1, 169307.9],
                        [344033.8, 168534.7],
                        [345331.7, 167860.5],
                        [346152.5, 168200.2],
                        [346357.8, 168777],
                        [347118.5, 168700.4],
                        [346628.2, 169461.6],
                        [346616.9, 170163],
                        [347142, 170083],
                        [347382, 170754.8],
                        [348133.6, 171262.1],
                        [347950.6, 171483.2],
                        [347136.7, 171307.3],
                        [347058.8, 171595.6],
                        [343323.6, 170454],
                        [343347.1, 169741.2],
                        [343970.1, 169307.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002023",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 815,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 946.772,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "344995.0 169728.0",
            "NAME": "Nailsea North and West Ward",
            "BOUNDING_BOX": "343323.6 167860.5 348133.6 171595.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [343347.1, 169741.2],
                        [343323.6, 170454],
                        [343174.1, 172090.5],
                        [343930.1, 172326],
                        [343762.5, 172720.5],
                        [341937.7, 172443.6],
                        [341660.3, 172734.8],
                        [341844.8, 173114.6],
                        [341604, 173037.4],
                        [341343, 172260],
                        [341543.8, 171722.6],
                        [341175.5, 171599.6],
                        [340851.3, 171311.5],
                        [341397.2, 170805],
                        [341795.2, 170674.9],
                        [341458.2, 170036.8],
                        [343347.1, 169741.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002011",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 818,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 548.077,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "342390.7 171201.6",
            "NAME": "Clevedon East Ward",
            "BOUNDING_BOX": "340851.3 169741.2 343930.1 173114.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [340685.2, 169863.2],
                        [341458.2, 170036.8],
                        [341795.2, 170674.9],
                        [341397.2, 170805],
                        [340839.9, 170661],
                        [340685.2, 169863.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002013",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 820,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 61.21,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "341195.9 170334.1",
            "NAME": "Clevedon South Ward",
            "BOUNDING_BOX": "340685.2 169863.2 341795.2 170805.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [339719.7, 170872],
                        [340296.6, 171081],
                        [340238.8, 171404],
                        [340851.3, 171311.5],
                        [341175.5, 171599.6],
                        [340402.2, 172082.5],
                        [340632.2, 172650.6],
                        [339903.5, 172104.4],
                        [339685.4, 171409.6],
                        [339719.7, 170872]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002012",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 821,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 102.154,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "340356.2 171761.3",
            "NAME": "Clevedon North Ward",
            "BOUNDING_BOX": "339685.4 170872.0 341175.5 172650.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [340296.6, 171081],
                        [339719.7, 170872],
                        [339685.4, 171409.6],
                        [338358.3, 170247.9],
                        [337644.8, 169085.5],
                        [338344.9, 168883],
                        [338366.2, 168509.6],
                        [339136.7, 168855.8],
                        [339113.5, 169405.6],
                        [339818.1, 169649.8],
                        [340089.5, 170538.5],
                        [340296.6, 171081]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002015",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 822,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 320.741,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "338970.7 169782.6",
            "NAME": "Clevedon West Ward",
            "BOUNDING_BOX": "337644.8 168509.6 340296.6 171409.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [340089.5, 170538.5],
                        [340839.9, 170661],
                        [341397.2, 170805],
                        [340851.3, 171311.5],
                        [340238.8, 171404],
                        [340296.6, 171081],
                        [340089.5, 170538.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002010",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 823,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 60.052,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "340736.4 170971.3",
            "NAME": "Clevedon Central Ward",
            "BOUNDING_BOX": "340089.5 170538.5 341397.2 171404.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [341175.5, 171599.6],
                        [341543.8, 171722.6],
                        [341343, 172260],
                        [341604, 173037.4],
                        [341297, 173481.2],
                        [340632.2, 172650.6],
                        [340402.2, 172082.5],
                        [341175.5, 171599.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002014",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 824,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 141.942,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "341003.1 172410.6",
            "NAME": "Clevedon Walton Ward",
            "BOUNDING_BOX": "340402.2 171599.6 341604.0 173481.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [347108.3, 174831],
                        [347768.5, 175235.2],
                        [347434.1, 175585.9],
                        [347862.4, 175743.2],
                        [347775.5, 177166.7],
                        [346742.6, 176115.8],
                        [346654.2, 175295.4],
                        [347108.3, 174831]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002027",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 835,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 168.597,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "347258.3 175781.7",
            "NAME": "Portishead East Ward",
            "BOUNDING_BOX": "346654.2 174831.0 347862.4 177166.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [345304.5, 175108],
                        [345922.6, 174142.8],
                        [347108.3, 174831],
                        [346654.2, 175295.4],
                        [346742.6, 176115.8],
                        [346205.3, 176475.9],
                        [345692.8, 176060.2],
                        [345949.6, 175556.8],
                        [345409.2, 175205.1],
                        [345304.5, 175108]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002029",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 837,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 210.665,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "346206.4 175391.3",
            "NAME": "Portishead South and North Weston Ward",
            "BOUNDING_BOX": "345304.5 174142.8 347108.3 176475.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [345409.2, 175205.1],
                        [345949.6, 175556.8],
                        [345692.8, 176060.2],
                        [346205.3, 176475.9],
                        [346358.6, 176654.3],
                        [344656.5, 176029],
                        [345409.2, 175205.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002030",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 841,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 101.195,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "345507.6 175805.4",
            "NAME": "Portishead West Ward",
            "BOUNDING_BOX": "344656.5 175205.1 346358.6 176654.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [346742.6, 176115.8],
                        [347775.5, 177166.7],
                        [347942.3, 177380],
                        [347564, 177505.7],
                        [347108.9, 177402.3],
                        [346781.3, 176580.3],
                        [346358.6, 176654.3],
                        [346205.3, 176475.9],
                        [346742.6, 176115.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002025",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 842,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 95.958,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "347073.8 176883.5",
            "NAME": "Portishead Central Ward",
            "BOUNDING_BOX": "346205.3 176115.8 347942.3 177505.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [353945.5, 177239.9],
                        [354279.5, 177525.6],
                        [353471, 178457.3],
                        [354853.3, 179539.7],
                        [354900.6, 180399.9],
                        [353995, 181612.4],
                        [354064.7, 182219.5],
                        [353370.1, 183052.8],
                        [351862.8, 180622.8],
                        [351418.1, 180650.4],
                        [346842.6, 180935.8],
                        [346352.9, 180964.9],
                        [345884.6, 180997.5],
                        [345058.5, 180421.7],
                        [345022.4, 180397.2],
                        [322349.7, 164637.9],
                        [322301.7, 164542.7],
                        [322959.2, 160864.6],
                        [322959.5, 160864.7],
                        [338358.3, 170247.9],
                        [339685.4, 171409.6],
                        [339903.5, 172104.4],
                        [340632.2, 172650.6],
                        [341297, 173481.2],
                        [343220.4, 175246.4],
                        [344044.6, 176244.4],
                        [346326.6, 177564.2],
                        [347564, 177505.7],
                        [347942.3, 177380],
                        [349333.5, 177361.6],
                        [349028.3, 177372.2],
                        [349608.3, 177969.5],
                        [349385.1, 178395.2],
                        [349602.2, 178109.3],
                        [350043.2, 178317.5],
                        [352190.9, 176511.4],
                        [352554.7, 175948.1],
                        [353655.5, 176019.1],
                        [354072.2, 176627.1],
                        [353945.5, 177239.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001973",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 843,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 14104.534,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "336369.9 171958.7",
            "NAME": "Avonmouth Ward",
            "BOUNDING_BOX": "322301.7 160864.6 354900.6 183052.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [354072.2, 176627.1],
                        [354774.7, 175785.5],
                        [355801.1, 177239.3],
                        [355832.7, 178101.7],
                        [355183.4, 179448.2],
                        [354853.3, 179539.7],
                        [353471, 178457.3],
                        [354279.5, 177525.6],
                        [353945.5, 177239.9],
                        [354072.2, 176627.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001993",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 872,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 501.449,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "354651.8 177657.3",
            "NAME": "Kingsweston Ward",
            "BOUNDING_BOX": "353471.0 175785.5 355832.7 179539.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [363295.4, 169274],
                        [362979.3, 168935.5],
                        [362924.5, 168450.3],
                        [363426.5, 168223.7],
                        [364123.1, 168674],
                        [363766.8, 167546],
                        [364038.9, 167444.2],
                        [364520.8, 167999.7],
                        [365034.6, 167992],
                        [364945.7, 168312.6],
                        [365634.9, 168451],
                        [365821.3, 168930.1],
                        [366137.6, 169832.7],
                        [365735.4, 170161.7],
                        [364776.9, 169637.5],
                        [364607.9, 170099.2],
                        [363512.3, 170773.7],
                        [363719.5, 169811.3],
                        [363153.9, 169500.7],
                        [363295.4, 169274]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001947",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 878,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 529.166,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "364512.6 169109.0",
            "NAME": "Keynsham North Ward",
            "BOUNDING_BOX": "362924.5 167444.2 366137.6 170773.7"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [344656.5, 176029],
                        [346358.6, 176654.3],
                        [346781.3, 176580.3],
                        [347108.9, 177402.3],
                        [347564, 177505.7],
                        [346326.6, 177564.2],
                        [344044.6, 176244.4],
                        [344656.5, 176029]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002026",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 883,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 211.743,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "345933.4 176796.6",
            "NAME": "Portishead Coast Ward",
            "BOUNDING_BOX": "344044.6 176029.0 347564.0 177564.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [343762.5, 172720.5],
                        [343930.1, 172326],
                        [343174.1, 172090.5],
                        [343323.6, 170454],
                        [347058.8, 171595.6],
                        [347961.3, 172691.8],
                        [348023.2, 173569.4],
                        [349368.5, 174121.3],
                        [350312.6, 173621.9],
                        [350071.5, 172762.3],
                        [351246.6, 172775.6],
                        [350874.8, 173700.5],
                        [350999.3, 174270.6],
                        [350927.4, 175685.9],
                        [349950.9, 176743.3],
                        [350037.3, 177096.5],
                        [349333.5, 177361.6],
                        [347942.3, 177380],
                        [347775.5, 177166.7],
                        [347862.4, 175743.2],
                        [347434.1, 175585.9],
                        [347768.5, 175235.2],
                        [347108.3, 174831],
                        [345922.6, 174142.8],
                        [345304.5, 175108],
                        [344460.5, 174983.2],
                        [344073, 175250.9],
                        [343732.7, 174984.1],
                        [343220.4, 175246.4],
                        [341297, 173481.2],
                        [341604, 173037.4],
                        [341844.8, 173114.6],
                        [341660.3, 172734.8],
                        [341937.7, 172443.6],
                        [343762.5, 172720.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002019",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25506,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3092.114,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "345321.2 173917.0",
            "NAME": "Gordano Ward",
            "BOUNDING_BOX": "341297.0 170454.0 351246.6 177380.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [352190.9, 176511.4],
                        [350043.2, 178317.5],
                        [349602.2, 178109.3],
                        [349385.1, 178395.2],
                        [349608.3, 177969.5],
                        [349028.3, 177372.2],
                        [349333.5, 177361.6],
                        [350037.3, 177096.5],
                        [349950.9, 176743.3],
                        [350927.4, 175685.9],
                        [350999.3, 174270.6],
                        [351830.5, 174213],
                        [352192.4, 174573.7],
                        [352522.5, 173822.2],
                        [352364.1, 173232.6],
                        [353433.9, 172644.9],
                        [353521.2, 171886.6],
                        [355255.4, 173093.9],
                        [355798.2, 172710],
                        [355424.1, 172384.3],
                        [355958.1, 172042.8],
                        [356522.8, 172151.3],
                        [356558.1, 172563],
                        [356199.1, 173371.7],
                        [356053, 174359.9],
                        [354874.8, 175165.1],
                        [354774.7, 175785.5],
                        [354072.2, 176627.1],
                        [353655.5, 176019.1],
                        [353583.1, 175170.8],
                        [353221.5, 174850.2],
                        [353264.2, 175338.3],
                        [352747.6, 175099],
                        [352986.6, 174627.1],
                        [352623.1, 174094.6],
                        [352411.5, 174532],
                        [352653, 175006],
                        [351904.1, 175804.4],
                        [352190.9, 176511.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002018",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25507,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1645.18,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "351740.8 175140.9",
            "NAME": "Easton-in-Gordano Ward",
            "BOUNDING_BOX": "349028.3 171886.6 356558.1 178395.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [351418.1, 180650.4],
                        [351862.8, 180622.8],
                        [353370.1, 183052.8],
                        [354064.7, 182219.5],
                        [353995, 181612.4],
                        [355689.5, 182522.6],
                        [356538.6, 183337.5],
                        [356871.8, 184176.9],
                        [357382.6, 183976.9],
                        [358654.8, 185386.3],
                        [357989.8, 185497.6],
                        [357272.2, 184950.1],
                        [356528.6, 185743.9],
                        [355882.2, 185817.9],
                        [356176.2, 186429.2],
                        [357515.8, 187282.6],
                        [357287, 187731.6],
                        [356873, 187532.9],
                        [356641.1, 187848.1],
                        [356420.7, 187495.2],
                        [356026.5, 187518.4],
                        [356200.7, 188068.2],
                        [354829.4, 189132.6],
                        [353957.4, 188574.9],
                        [353600, 188307.7],
                        [353133.3, 188057.7],
                        [351575.8, 187325.1],
                        [350839.4, 185880.6],
                        [351990.7, 185919.1],
                        [351500.9, 185298.4],
                        [351452.4, 184649],
                        [351977.1, 184980.4],
                        [353029.6, 184788.6],
                        [352528, 184093.4],
                        [352926, 184128.4],
                        [351489.5, 183281.3],
                        [351701.3, 183046.2],
                        [352161.6, 183490],
                        [351418.1, 180650.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002065",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25509,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3141.583,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "354747.1 185548.2",
            "NAME": "Pilning and Severn Beach Ward",
            "BOUNDING_BOX": "350839.4 180622.8 358654.8 189132.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [356239.5, 167198],
                        [356760.9, 167387.9],
                        [357164, 169013.7],
                        [358078.6, 169852.9],
                        [358070.3, 170206.8],
                        [357567.5, 170503.1],
                        [356023.1, 170024.4],
                        [355799.5, 169547.3],
                        [356118.2, 169227.1],
                        [356373.1, 168743.1],
                        [355896.6, 167742.1],
                        [356239.5, 167198]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001976",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25510,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 356.318,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "356939.1 169207.4",
            "NAME": "Bishopsworth Ward",
            "BOUNDING_BOX": "355799.5 167198.0 358078.6 170503.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [356053, 174359.9],
                        [356199.1, 173371.7],
                        [357012.2, 174308],
                        [357344, 174907.3],
                        [357286.5, 175319.3],
                        [357239.8, 175798.1],
                        [356421.8, 176294.2],
                        [355801.1, 177239.3],
                        [354774.7, 175785.5],
                        [354874.8, 175165.1],
                        [356053, 174359.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002003",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25511,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 484.989,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "356059.3 175581.5",
            "NAME": "Stoke Bishop Ward",
            "BOUNDING_BOX": "354774.7 173371.7 357344.0 177239.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [353365.2, 157116.4],
                        [353916.3, 156591.4],
                        [353611.7, 156136.5],
                        [354379.7, 156001.4],
                        [356660, 158710.7],
                        [356592.9, 159008.5],
                        [359032.9, 158465.1],
                        [359808.2, 157891.2],
                        [360294.3, 158394.3],
                        [360170.4, 159214.1],
                        [360912.6, 159396.7],
                        [361472.5, 160471.7],
                        [361035.3, 160952.6],
                        [360230.2, 161177.9],
                        [359892.1, 160813.4],
                        [359259.6, 160936.5],
                        [359348.8, 160541.2],
                        [358125, 160507.2],
                        [357026.9, 161262.5],
                        [356874.5, 160591.3],
                        [355714.9, 160242.8],
                        [355660.4, 159532],
                        [355149.4, 159173.5],
                        [354665.3, 159727.6],
                        [354595, 159484.8],
                        [353656.4, 159469],
                        [354047.6, 160485],
                        [352973.3, 160538.2],
                        [352947.3, 160952.1],
                        [353140.3, 160704],
                        [353364, 161046.6],
                        [352978.3, 161163.2],
                        [352884.6, 161826.6],
                        [353223.7, 161856],
                        [353534.5, 162625.6],
                        [352771.3, 162559.3],
                        [352106.1, 164792.8],
                        [351783.2, 164763.2],
                        [351590.8, 162827.6],
                        [351989.9, 162202.1],
                        [352008.4, 161387.9],
                        [351698.5, 160818],
                        [351058.1, 160729.1],
                        [350784.7, 160095.5],
                        [352219.6, 159253.8],
                        [351670.4, 157895],
                        [353365.2, 157116.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001941",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25512,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2865.784,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358831.0 160397.1",
            "NAME": "Chew Valley South Ward",
            "BOUNDING_BOX": "350784.7 156001.4 361472.5 164792.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [355917.8, 164508.4],
                        [356244.7, 164206.4],
                        [355644, 163992.7],
                        [355578, 164263],
                        [355243.6, 164206.3],
                        [354856.4, 163521.7],
                        [354742.5, 160864.1],
                        [354047.6, 160485],
                        [353656.4, 159469],
                        [354595, 159484.8],
                        [354665.3, 159727.6],
                        [355149.4, 159173.5],
                        [355660.4, 159532],
                        [355714.9, 160242.8],
                        [356874.5, 160591.3],
                        [357026.9, 161262.5],
                        [358125, 160507.2],
                        [359348.8, 160541.2],
                        [359259.6, 160936.5],
                        [359892.1, 160813.4],
                        [360230.2, 161177.9],
                        [358601.6, 163258.9],
                        [359388.7, 163432.8],
                        [359176.3, 163646.4],
                        [360869, 164484],
                        [361307.4, 164770.6],
                        [361664.4, 166261.9],
                        [360728, 167012.4],
                        [360568.1, 166693.1],
                        [359238, 166398.5],
                        [358117.5, 166274.9],
                        [358129.9, 165704.3],
                        [357808.4, 165925.9],
                        [357337.3, 165700.3],
                        [357306.5, 165988.3],
                        [356767.5, 165780.8],
                        [357473.2, 164924.7],
                        [357024.3, 164896.3],
                        [356469.7, 165530.3],
                        [356129.2, 165100.8],
                        [356437.4, 164795],
                        [355917.8, 164508.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001940",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25513,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2894.584,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357660.4 163340.9",
            "NAME": "Chew Valley North Ward",
            "BOUNDING_BOX": "353656.4 159173.5 361664.4 167012.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357634.9, 167092.1],
                        [358188, 168042.9],
                        [358736.8, 168127.7],
                        [358764.1, 168481.4],
                        [358114.5, 169313.5],
                        [358078.6, 169852.9],
                        [357164, 169013.7],
                        [356760.9, 167387.9],
                        [357634.9, 167092.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001987",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25514,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 290.95,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357762.5 168437.2",
            "NAME": "Hartcliffe Ward",
            "BOUNDING_BOX": "356760.9 167092.1 358764.1 169852.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [356023.1, 170024.4],
                        [357567.5, 170503.1],
                        [358070.3, 170206.8],
                        [358335.7, 170327.3],
                        [358406.7, 171105.4],
                        [358272, 171555.1],
                        [356966.5, 171032.5],
                        [356696.5, 171489],
                        [356287.4, 171354],
                        [356023.1, 170024.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001974",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25515,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 253.971,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357276.6 170789.8",
            "NAME": "Bedminster Ward",
            "BOUNDING_BOX": "356023.1 170024.4 358406.7 171555.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [358764.1, 168481.4],
                        [358814.2, 168516.5],
                        [360217, 169686.5],
                        [359848.8, 169730.8],
                        [359729.3, 170898.3],
                        [359111.3, 170774.6],
                        [358568.1, 170107.5],
                        [358335.7, 170327.3],
                        [358070.3, 170206.8],
                        [358078.6, 169852.9],
                        [358114.5, 169313.5],
                        [358764.1, 168481.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001985",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25516,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 274.209,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359139.3 169689.8",
            "NAME": "Filwood Ward",
            "BOUNDING_BOX": "358070.3 168481.4 360217.0 170898.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357286.5, 175319.3],
                        [357696.3, 175374.4],
                        [358368.1, 176134.7],
                        [359025.5, 176649.6],
                        [358189.8, 177261.6],
                        [357302.9, 177062.2],
                        [357239.8, 175798.1],
                        [357286.5, 175319.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001990",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25517,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 209.82,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "358132.7 176558.5",
            "NAME": "Henleaze Ward",
            "BOUNDING_BOX": "357239.8 175319.3 359025.5 177261.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [355183.4, 179448.2],
                        [356317.8, 179608.6],
                        [355391.8, 179928.3],
                        [358812.2, 181667.7],
                        [359558, 182647.2],
                        [360687, 183295.5],
                        [361792.4, 183755.8],
                        [362684.1, 182172.1],
                        [363135, 182493.2],
                        [362592.2, 182760.9],
                        [362793.3, 183188.1],
                        [364293.7, 184230.1],
                        [364536.3, 184607.7],
                        [364148.7, 184839.4],
                        [364256.8, 185342.8],
                        [363301.9, 185423.1],
                        [362961, 184849],
                        [361683, 185238.1],
                        [361266.7, 184743.3],
                        [360195.8, 185699.3],
                        [359724.4, 185031.1],
                        [358654.8, 185386.3],
                        [357382.6, 183976.9],
                        [356871.8, 184176.9],
                        [356538.6, 183337.5],
                        [355689.5, 182522.6],
                        [353995, 181612.4],
                        [354900.6, 180399.9],
                        [354853.3, 179539.7],
                        [355183.4, 179448.2]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002043",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25518,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2426.548,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357622.4 182573.8",
            "NAME": "Almondsbury Ward",
            "BOUNDING_BOX": "353995.0 179448.2 364536.3 185699.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [356317.8, 179608.6],
                        [358756.1, 179771.6],
                        [359783.1, 179992.2],
                        [359984.5, 180706.8],
                        [360626.5, 180701.5],
                        [360797.8, 181501.4],
                        [360755.8, 182869.9],
                        [360687, 183295.5],
                        [359558, 182647.2],
                        [358812.2, 181667.7],
                        [355391.8, 179928.3],
                        [356317.8, 179608.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002064",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25521,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 866.486,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "359587.7 181452.0",
            "NAME": "Patchway Ward",
            "BOUNDING_BOX": "355391.8 179608.6 360797.8 183295.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361808.8, 174012],
                        [362476.5, 174234.3],
                        [362274.8, 174851.4],
                        [362869, 175446.5],
                        [362928.9, 175886],
                        [362030.2, 176263.6],
                        [361994.1, 176845],
                        [361269.3, 176216.7],
                        [360997.3, 174934.6],
                        [361471.7, 174501.8],
                        [361888.2, 174617.2],
                        [361808.8, 174012]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001984",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25524,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 306.801,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361963.1 175440.8",
            "NAME": "Eastville Ward",
            "BOUNDING_BOX": "360997.3 174012.0 362928.9 176845.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361279.1, 179799.9],
                        [363408.3, 179618.9],
                        [363709.1, 179701.8],
                        [363426.8, 179864.2],
                        [363643.4, 180372.6],
                        [362073.5, 180918.4],
                        [361448.1, 181658.6],
                        [360797.8, 181501.4],
                        [360626.5, 180701.5],
                        [361279.1, 179799.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002070",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25525,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 362.863,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361774.9 180638.8",
            "NAME": "Stoke Gifford Ward",
            "BOUNDING_BOX": "360626.5 179618.9 363709.1 181658.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [359271.7, 178197.4],
                        [360438.9, 178012.1],
                        [360713.5, 177909.4],
                        [361456, 178820.9],
                        [361164, 179231.7],
                        [361279.1, 179799.9],
                        [360626.5, 180701.5],
                        [359984.5, 180706.8],
                        [359783.1, 179992.2],
                        [359641.3, 179504.3],
                        [359066, 179138.6],
                        [359303, 178452.6],
                        [359271.7, 178197.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002055",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25526,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 406.755,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "360261.0 179372.4",
            "NAME": "Filton Ward",
            "BOUNDING_BOX": "359066.0 177909.4 361456.0 180706.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361448.1, 181658.6],
                        [362203.9, 181904.2],
                        [362807.7, 181439.8],
                        [363034.6, 181623.3],
                        [362684.1, 182172.1],
                        [362147.3, 182673],
                        [360755.8, 182869.9],
                        [360797.8, 181501.4],
                        [361448.1, 181658.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002046",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25528,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 194.431,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361736.4 182154.8",
            "NAME": "Bradley Stoke Central and Stoke Lodge Ward",
            "BOUNDING_BOX": "360755.8 181439.8 363034.6 182869.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362352.3, 158235.6],
                        [362612.9, 158551.8],
                        [363262.6, 157473.9],
                        [363721.2, 157543.1],
                        [364078.1, 158163.8],
                        [363567.6, 158829.5],
                        [364160.2, 159162.5],
                        [363684.1, 160746],
                        [364677.3, 161438.7],
                        [363598.7, 162615],
                        [363469.8, 163158.1],
                        [363010.8, 162086.8],
                        [362029.5, 162021.4],
                        [362290.7, 162367.2],
                        [361532.1, 163284.9],
                        [361572.4, 163884.8],
                        [361193.2, 163938.5],
                        [360869, 164484],
                        [359176.3, 163646.4],
                        [359388.7, 163432.8],
                        [358601.6, 163258.9],
                        [360230.2, 161177.9],
                        [361035.3, 160952.6],
                        [361472.5, 160471.7],
                        [360912.6, 159396.7],
                        [362352.3, 158235.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001942",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25529,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1806.963,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361639.4 160982.8",
            "NAME": "Clutton Ward",
            "BOUNDING_BOX": "358601.6 157473.9 364677.3 164484.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [363677.505003732, 170671.9924653],
                        [363701.6, 170530.9],
                        [364401.8, 170195.1],
                        [364607.9, 170099.2],
                        [363677.505003732, 170671.9924653]
                    ]
                ],
                [
                    [
                        [363677.505003732, 170671.9924653],
                        [363487.5, 171784.6],
                        [362703.3, 171893.6],
                        [362874.9, 172175.6],
                        [362653.6, 173008.2],
                        [362101, 172991.1],
                        [361736, 172702.2],
                        [361330.7, 172442.9],
                        [362100.9, 172185],
                        [361693.4, 170716.5],
                        [363719.5, 169811.3],
                        [363512.3, 170773.7],
                        [363677.505003732, 170671.9924653]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001977",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25530,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 411.043,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "362525.1 171674.6",
            "NAME": "Brislington East Ward",
            "BOUNDING_BOX": "361330.7 169811.3 364607.9 173008.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [363936.7, 166958],
                        [364038.9, 167444.2],
                        [363766.8, 167546],
                        [364123.1, 168674],
                        [363426.5, 168223.7],
                        [362180.9, 166944.7],
                        [362080.8, 166483.8],
                        [363309.3, 165410.5],
                        [363469.8, 163158.1],
                        [363598.7, 162615],
                        [364677.3, 161438.7],
                        [363684.1, 160746],
                        [364160.2, 159162.5],
                        [364233, 158666.2],
                        [365160.4, 158963.1],
                        [365391.2, 158781.1],
                        [365529.1, 159698.4],
                        [367676.8, 159846.5],
                        [367515.6, 161967.6],
                        [369263.4, 162839.1],
                        [368597.6, 163212.2],
                        [370081.7, 165820.1],
                        [369285.3, 166371.5],
                        [369026.2, 166056.4],
                        [368729.5, 166384.9],
                        [368187.7, 165968.7],
                        [367470.1, 165946.7],
                        [367332.3, 165517.9],
                        [366744.8, 165798.3],
                        [365428.7, 165990.6],
                        [365596.6, 167043],
                        [364316.9, 166691],
                        [363936.7, 166958]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001944",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25532,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3630.926,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366081.3 162815.9",
            "NAME": "Farmborough Ward",
            "BOUNDING_BOX": "362080.8 158666.2 370081.7 168674.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [364401.8, 170195.1],
                        [364697.8, 171335.8],
                        [365523.2, 172368.9],
                        [365687, 172539.8],
                        [365263.1, 172650.4],
                        [364072.8, 173092],
                        [363803.1, 172442.8],
                        [362874.9, 172175.6],
                        [362703.3, 171893.6],
                        [363487.5, 171784.6],
                        [363701.6, 170530.9],
                        [364401.8, 170195.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002058",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25533,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 359.208,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "364195.2 171670.4",
            "NAME": "Hanham Ward",
            "BOUNDING_BOX": "362703.3 170195.1 365687.0 173092.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [365923.7, 177181.4],
                        [365363.5, 178007.6],
                        [365730.2, 178549.1],
                        [364521, 178310.3],
                        [364283.3, 177340.2],
                        [364618.1, 176906.2],
                        [364217.7, 176371.7],
                        [364325, 175993.1],
                        [364658.6, 176375.7],
                        [365654.8, 176164],
                        [365476.6, 176815.5],
                        [365923.7, 177181.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002053",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25534,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 264.578,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "365070.7 177353.5",
            "NAME": "Downend Ward",
            "BOUNDING_BOX": "364217.7 175993.1 365923.7 178549.1"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [364181.7, 178205.8],
                        [364479.8, 178588.3],
                        [364521, 178310.3],
                        [365730.2, 178549.1],
                        [366028.5, 179156.5],
                        [365669.9, 180000],
                        [366294.9, 180752.5],
                        [366182.3, 181405.6],
                        [364779.6, 182424.8],
                        [363739.9, 181920.4],
                        [363135, 182493.2],
                        [362684.1, 182172.1],
                        [363034.6, 181623.3],
                        [363643.4, 180372.6],
                        [363426.8, 179864.2],
                        [363709.1, 179701.8],
                        [363408.3, 179618.9],
                        [362575, 179151.6],
                        [362327, 178592.5],
                        [364181.7, 178205.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002074",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25535,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1066.127,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "364310.9 180284.5",
            "NAME": "Winterbourne Ward",
            "BOUNDING_BOX": "362327.0 178205.8 366294.9 182493.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366518.7, 171452.1],
                        [366557.9, 171845.3],
                        [367055.3, 172013.7],
                        [367126.9, 172628],
                        [366746.1, 172684.1],
                        [366865.5, 173258.2],
                        [366594.5, 173463.9],
                        [365263.1, 172650.4],
                        [365687, 172539.8],
                        [365523.2, 172368.9],
                        [366174.4, 172050.7],
                        [365979.6, 171471.3],
                        [366518.7, 171452.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002063",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25537,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 184.49,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366195.0 172341.7",
            "NAME": "Parkwall Ward",
            "BOUNDING_BOX": "365263.1 171452.1 367126.9 173463.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366590, 173539.3],
                        [366197.4, 174642.2],
                        [365381, 174552.9],
                        [365262.6, 175098.8],
                        [364599.7, 175000],
                        [364470.8, 174370.7],
                        [364517.3, 173911.9],
                        [366590, 173539.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002059",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25538,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 194.375,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "365394.2 174319.0",
            "NAME": "Kings Chase Ward",
            "BOUNDING_BOX": "364470.8 173539.3 366590.0 175098.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [365381, 174552.9],
                        [366197.4, 174642.2],
                        [366219.3, 175284.9],
                        [366250.2, 176024.9],
                        [366688, 176280.6],
                        [366376.4, 177104.8],
                        [366625.7, 177377.9],
                        [365923.7, 177181.4],
                        [365476.6, 176815.5],
                        [365654.8, 176164],
                        [365262.6, 175098.8],
                        [365381, 174552.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002066",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25539,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 220.992,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "365975.3 175906.9",
            "NAME": "Rodway Ward",
            "BOUNDING_BOX": "365262.6 174552.9 366688.0 177377.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [369189.7, 183631],
                        [368741.9, 184608.7],
                        [369095.5, 185247.3],
                        [367397.9, 185518.9],
                        [367515, 186027.1],
                        [366991, 186426.6],
                        [365886.6, 186001.7],
                        [365642.9, 185070.6],
                        [365884.6, 184674.5],
                        [364749.6, 183936.4],
                        [364293.7, 184230.1],
                        [362793.3, 183188.1],
                        [362592.2, 182760.9],
                        [363135, 182493.2],
                        [363739.9, 181920.4],
                        [364779.6, 182424.8],
                        [366182.3, 181405.6],
                        [366294.9, 180752.5],
                        [367415.8, 180774.8],
                        [367896.2, 181514.7],
                        [367270.4, 182541.6],
                        [367499.6, 183065.3],
                        [368786.7, 182354.1],
                        [369573.5, 182707.5],
                        [368932.2, 183255.4],
                        [369189.7, 183631]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002056",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25540,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1884.82,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366266.3 183589.5",
            "NAME": "Frampton Cotterell Ward",
            "BOUNDING_BOX": "362592.2 180752.5 369573.5 186426.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [367415.8, 180774.8],
                        [366294.9, 180752.5],
                        [365669.9, 180000],
                        [366028.5, 179156.5],
                        [366045.2, 178822.2],
                        [366953.5, 178260.2],
                        [367358.6, 178508.1],
                        [367636.3, 178317.1],
                        [368029.1, 178718.6],
                        [368139.6, 178486.9],
                        [368414.9, 178888.6],
                        [369592.2, 178236.5],
                        [370333.1, 178303.8],
                        [370621.3, 177740.1],
                        [373631.6, 177757.1],
                        [375756.7, 178164.8],
                        [375736.8, 178528],
                        [376290.6, 179041.6],
                        [376202.3, 180053.5],
                        [375284.4, 180464.2],
                        [373674.2, 180478.3],
                        [372701.1, 181038.8],
                        [372596.9, 181534.7],
                        [371517.4, 180924],
                        [369883.3, 180290],
                        [370174.4, 180686.5],
                        [369834, 181475.2],
                        [370105.8, 182540],
                        [370138.7, 182630.2],
                        [369940.7, 183044.9],
                        [369573.5, 182707.5],
                        [368786.7, 182354.1],
                        [367499.6, 183065.3],
                        [367270.4, 182541.6],
                        [367896.2, 181514.7],
                        [367415.8, 180774.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002073",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25543,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3056.77,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "372797.8 180402.7",
            "NAME": "Westerleigh Ward",
            "BOUNDING_BOX": "365669.9 177740.1 376290.6 183065.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366137.6, 169832.7],
                        [365821.3, 168930.1],
                        [366648.1, 169284.8],
                        [367436.4, 168651.2],
                        [368042.7, 168728.5],
                        [369088.7, 168924.1],
                        [369394.2, 169012.5],
                        [369223.8, 169378.2],
                        [371507.3, 169754.8],
                        [372073.7, 170365.5],
                        [372112.8, 171143.3],
                        [371777.6, 170926],
                        [370166, 171552.8],
                        [369924.7, 171036.4],
                        [369620.8, 171410.5],
                        [368780, 171559.3],
                        [368180, 171341.5],
                        [368148.3, 171008.5],
                        [366917.1, 171146.9],
                        [366446.9, 170786.4],
                        [366513.1, 170142.2],
                        [366137.6, 169832.7]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002044",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25546,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1150.111,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "369150.3 170105.3",
            "NAME": "Bitton Ward",
            "BOUNDING_BOX": "365821.3 168651.2 372112.8 171559.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [369883.3, 180290],
                        [371517.4, 180924],
                        [371689, 181581.7],
                        [370750.3, 181435.7],
                        [370389.2, 181718.8],
                        [370100.2, 181366.5],
                        [369834, 181475.2],
                        [370174.4, 180686.5],
                        [369883.3, 180290]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002052",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25547,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 146.196,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "370787.8 181004.4",
            "NAME": "Dodington Ward",
            "BOUNDING_BOX": "369834.0 180290.0 371689.0 181718.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [370100.2, 181366.5],
                        [370389.2, 181718.8],
                        [370750.3, 181435.7],
                        [371689, 181581.7],
                        [371961.4, 182271.7],
                        [372322.3, 182352.1],
                        [372240.9, 183047.2],
                        [371407.8, 182991],
                        [371032.6, 182500.4],
                        [370105.8, 182540],
                        [369834, 181475.2],
                        [370100.2, 181366.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002076",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25548,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 249.105,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "370978.3 182206.8",
            "NAME": "Yate Central Ward",
            "BOUNDING_BOX": "369834.0 181366.5 372322.3 183047.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [371032.6, 182500.4],
                        [371407.8, 182991],
                        [372240.9, 183047.2],
                        [372226.1, 184516],
                        [373208, 185094.4],
                        [373481.5, 184970.3],
                        [373584, 185173],
                        [372649.1, 185682.3],
                        [370356.9, 185130.1],
                        [370138.7, 182630.2],
                        [370105.8, 182540],
                        [371032.6, 182500.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002077",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25550,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 567.932,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "371844.9 184254.5",
            "NAME": "Yate North Ward",
            "BOUNDING_BOX": "370105.8 182500.4 373584.0 185682.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [368932.2, 183255.4],
                        [369573.5, 182707.5],
                        [369940.7, 183044.9],
                        [370138.7, 182630.2],
                        [370356.9, 185130.1],
                        [372649.1, 185682.3],
                        [373584, 185173],
                        [373630.2, 186518.1],
                        [373035.7, 188771.1],
                        [372642.9, 189102.8],
                        [372738.5, 189636.3],
                        [371810.4, 189511.1],
                        [371701.8, 189776.3],
                        [370465.8, 189447.7],
                        [368593.3, 188169.9],
                        [368270.7, 188507.4],
                        [368557.6, 188995.1],
                        [367326.9, 189438.7],
                        [366849.4, 189468.5],
                        [366376.3, 189991.8],
                        [366281.3, 189705.2],
                        [365516.5, 188843.6],
                        [365016.5, 187567.1],
                        [365510.8, 186630.9],
                        [365432.8, 186109.3],
                        [365886.6, 186001.7],
                        [366991, 186426.6],
                        [367515, 186027.1],
                        [367397.9, 185518.9],
                        [369095.5, 185247.3],
                        [368741.9, 184608.7],
                        [369189.7, 183631],
                        [368932.2, 183255.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002060",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25551,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3250.586,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "370382.9 186311.0",
            "NAME": "Ladden Brook Ward",
            "BOUNDING_BOX": "365016.5 182630.2 373630.2 189991.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [374155.3, 159335.1],
                        [373813.6, 159144.3],
                        [373338.7, 159673.1],
                        [372842.8, 159596.6],
                        [372637.6, 159174.9],
                        [371626.8, 159332.2],
                        [371132.9, 158520.6],
                        [371356.7, 157172.8],
                        [370698.6, 156324.9],
                        [370795.7, 155631.8],
                        [370549.8, 155446.3],
                        [370794.7, 155361.6],
                        [372148.2, 156263.6],
                        [372929.3, 155126.2],
                        [373493.8, 155732],
                        [374798.3, 156042.8],
                        [376285.4, 156787],
                        [376917.9, 156644.9],
                        [377457.4, 157211.5],
                        [379952.6, 158503.6],
                        [380000, 159003.8],
                        [379131.5, 159391.1],
                        [379585.2, 159838.6],
                        [379450.5, 160439.6],
                        [378605, 160119.3],
                        [377527.9, 161014.7],
                        [376117.6, 160758.8],
                        [376597.8, 161427],
                        [377606.4, 162003.8],
                        [378495.9, 162097.6],
                        [378484.5, 162581.6],
                        [377935.7, 162790.5],
                        [376993.9, 162779.7],
                        [376563.4, 161990.8],
                        [375937.6, 161645.8],
                        [374746.3, 161866],
                        [374171.3, 161826.8],
                        [374043.4, 161368.6],
                        [373460.8, 161461.1],
                        [374528.6, 160502.3],
                        [374155.3, 159335.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001937",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25555,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3517.984,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "375697.5 158958.3",
            "NAME": "Bathavon South Ward",
            "BOUNDING_BOX": "370549.8 155126.2 380000.0 162790.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [369292.9, 172369.8],
                        [369212.7, 171733.3],
                        [370166, 171552.8],
                        [371777.6, 170926],
                        [372112.8, 171143.3],
                        [372073.7, 170365.5],
                        [373871.1, 170493.4],
                        [374571, 170959.5],
                        [375234.1, 170821],
                        [376235.6, 171227.2],
                        [377503.6, 170938.6],
                        [378276.8, 170036.6],
                        [378359.5, 169317.3],
                        [379613.9, 170018.9],
                        [380276.7, 173255.6],
                        [379548.9, 173332.1],
                        [380036.3, 175505.5],
                        [379921.6, 176474.4],
                        [378473.1, 176537.7],
                        [378188.8, 175918.9],
                        [377544.3, 176180],
                        [376006, 175056],
                        [374717.6, 174818.2],
                        [375762, 177408.1],
                        [375525, 177672.2],
                        [375756.7, 178164.8],
                        [373631.6, 177757.1],
                        [370621.3, 177740.1],
                        [370333.1, 178303.8],
                        [369592.2, 178236.5],
                        [368414.9, 178888.6],
                        [368139.6, 178486.9],
                        [368029.1, 178718.6],
                        [367636.3, 178317.1],
                        [367358.6, 178508.1],
                        [366953.5, 178260.2],
                        [367675.8, 177831.8],
                        [367271.6, 175722.8],
                        [367593.3, 175943.1],
                        [368310, 175560.3],
                        [370020.6, 175753.3],
                        [369711.8, 174247.2],
                        [368328.8, 173721.5],
                        [368877.8, 172847.6],
                        [368653, 172625.6],
                        [369292.9, 172369.8]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002045",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25556,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 7162.445,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "374527.0 174103.0",
            "NAME": "Boyd Valley Ward",
            "BOUNDING_BOX": "366953.5 169317.3 380276.7 178888.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [376559.8, 164676],
                        [377592.2, 164856.7],
                        [377996, 164246.3],
                        [378051.3, 163275.4],
                        [377935.7, 162790.5],
                        [378484.5, 162581.6],
                        [378687.1, 162926.7],
                        [379204.5, 162604.2],
                        [379453.5, 162846.2],
                        [379890, 163769.7],
                        [379394, 165139.4],
                        [379447.6, 166247.8],
                        [380490.5, 166504],
                        [379864.7, 167450],
                        [380726, 168577.7],
                        [380298, 169418.2],
                        [379561.7, 169735.6],
                        [379613.9, 170018.9],
                        [378359.5, 169317.3],
                        [378276.8, 170036.6],
                        [377503.6, 170938.6],
                        [376235.6, 171227.2],
                        [375234.1, 170821],
                        [374571, 170959.5],
                        [373871.1, 170493.4],
                        [372073.7, 170365.5],
                        [371507.3, 169754.8],
                        [369223.8, 169378.2],
                        [369394.2, 169012.5],
                        [369088.7, 168924.1],
                        [369611.8, 168334],
                        [368719.3, 167134],
                        [369285.3, 166371.5],
                        [370081.7, 165820.1],
                        [371456.3, 166047.3],
                        [371718.4, 166378],
                        [372252.5, 166156.8],
                        [372414, 166426],
                        [372049.4, 167571.8],
                        [372845.6, 167371.5],
                        [373162.3, 167583.5],
                        [373770, 168080.5],
                        [374298.3, 168020.8],
                        [374536.4, 167756.1],
                        [374155.8, 167344],
                        [374707.1, 166955],
                        [375065.7, 167221.8],
                        [375701.5, 166911.3],
                        [376420.2, 167297.4],
                        [377489.8, 167262],
                        [377316.7, 166768.4],
                        [376462.6, 166149.9],
                        [376275, 165956],
                        [376811.4, 165433.3],
                        [376559.8, 164676]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001936",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25557,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 4754.801,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "374722.7 168947.2",
            "NAME": "Bathavon North Ward",
            "BOUNDING_BOX": "368719.3 162581.6 380726.0 171227.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [375762, 177408.1],
                        [374717.6, 174818.2],
                        [376006, 175056],
                        [377544.3, 176180],
                        [378188.8, 175918.9],
                        [378473.1, 176537.7],
                        [377582.3, 177668.9],
                        [379451.6, 178629.1],
                        [379527.3, 179021.5],
                        [380677.2, 179731.3],
                        [381797.8, 179993],
                        [382587.2, 180914.9],
                        [381611.9, 181962.5],
                        [381946.8, 182904.3],
                        [381487.9, 183456.6],
                        [381474.3, 184570.7],
                        [382055.4, 185702.1],
                        [381117.3, 185981.5],
                        [381208.9, 186560.4],
                        [380932.5, 186817.9],
                        [380503.4, 186666.1],
                        [380633.3, 186976.6],
                        [380191.4, 187183.4],
                        [380453.7, 187383.3],
                        [379722.1, 187787.7],
                        [379894, 188356.7],
                        [379554.3, 188502.5],
                        [379306.9, 188112.8],
                        [378742.6, 188269],
                        [378165, 187934.4],
                        [377940, 188389.3],
                        [377161.9, 188135.5],
                        [376948.8, 188696],
                        [376873, 188431.7],
                        [376259.3, 188431.8],
                        [376266.9, 188684.2],
                        [375659.8, 188709],
                        [374777.4, 189496.2],
                        [374428, 188817.2],
                        [373035.7, 188771.1],
                        [373630.2, 186518.1],
                        [373584, 185173],
                        [373481.5, 184970.3],
                        [373926.5, 182815.8],
                        [373249.4, 182676.5],
                        [373744.6, 181713.5],
                        [373054.8, 181643],
                        [373154.6, 181241.2],
                        [372701.1, 181038.8],
                        [373674.2, 180478.3],
                        [375284.4, 180464.2],
                        [376202.3, 180053.5],
                        [376290.6, 179041.6],
                        [375736.8, 178528],
                        [375756.7, 178164.8],
                        [375525, 177672.2],
                        [375762, 177408.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002051",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 25558,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 8179.631,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "377644.2 182996.7",
            "NAME": "Cotswold Edge Ward",
            "BOUNDING_BOX": "372701.1 174818.2 382587.2 189496.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [333508.6, 162744.1],
                        [333906.4, 161936.1],
                        [334789.3, 161981.2],
                        [335817.3, 162495.6],
                        [335660.2, 162803.5],
                        [335909.5, 162766.1],
                        [336020.3, 163164.7],
                        [335801.9, 163359.6],
                        [335535.8, 163038.4],
                        [335124.4, 163485.6],
                        [332876, 163174.8],
                        [332602.4, 162646.9],
                        [333508.6, 162744.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002034",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39071,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 299.949,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "334616.2 162710.8",
            "NAME": "Weston-Super-Mare Milton and Old Worle Ward",
            "BOUNDING_BOX": "332602.4 161936.1 336020.3 163485.6"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [333917.7, 160307.4],
                        [333544.5, 159851.9],
                        [333588.9, 158768.9],
                        [334006.6, 158825.1],
                        [333785.8, 159203.1],
                        [335349.2, 159991.7],
                        [335204.3, 161004.1],
                        [336338.8, 161558.7],
                        [335982, 161966.3],
                        [334958.5, 161620.7],
                        [334789.3, 161981.2],
                        [333906.4, 161936.1],
                        [332846.5, 161668],
                        [332739.3, 161078.6],
                        [333303.3, 161099.8],
                        [333181.5, 160567.6],
                        [333917.7, 160307.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008606",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39072,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 550.651,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "334539.1 160775.7",
            "NAME": "Weston-Super-Mare East Ward",
            "BOUNDING_BOX": "332739.3 158768.9 336338.8 161981.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [335124.4, 163485.6],
                        [335133.1, 164081.3],
                        [336125.2, 163991.1],
                        [336620.3, 164385.4],
                        [337001.9, 163953.2],
                        [337479.3, 164095.1],
                        [337652.2, 163742.5],
                        [338079.3, 163756.4],
                        [338928.3, 162769.4],
                        [339337.9, 163085.1],
                        [339530.7, 162784.6],
                        [339935.3, 162955.1],
                        [340192.8, 162505],
                        [341597.2, 161995.7],
                        [341656.2, 164774.5],
                        [340933.8, 165286.1],
                        [340486.3, 164989.2],
                        [339435, 165209.5],
                        [338998.6, 164786.9],
                        [338939.6, 165522.6],
                        [336559.5, 166630.5],
                        [336459.9, 167241],
                        [335521.7, 166926.4],
                        [334657.9, 167085.8],
                        [331633.8, 165949.8],
                        [331801.6, 165068.3],
                        [331142.5, 163762.8],
                        [332876, 163174.8],
                        [335124.4, 163485.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05008604",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39073,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 2761.638,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "336613.7 164618.3",
            "NAME": "Kewstoke Ward",
            "BOUNDING_BOX": "331142.5 161995.7 341656.2 167241.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [340271.1, 169129.5],
                        [340685.2, 169863.2],
                        [340839.9, 170661],
                        [340089.5, 170538.5],
                        [339818.1, 169649.8],
                        [339113.5, 169405.6],
                        [339136.7, 168855.8],
                        [339573.9, 168379.2],
                        [340129.3, 168923.2],
                        [340392.4, 168813.9],
                        [340271.1, 169129.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002016",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39074,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 186.295,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "339976.7 169471.4",
            "NAME": "Clevedon Yeo Ward",
            "BOUNDING_BOX": "339113.5 168379.2 340839.9 170661.0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [357717.4, 172868.4],
                        [357809.9, 173848.7],
                        [357344, 174907.3],
                        [357012.2, 174308],
                        [357382.5, 173516.6],
                        [357144.5, 173368.6],
                        [357717.4, 172868.4]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001981",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39075,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 95.153,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "357411.1 173945.4",
            "NAME": "Clifton East Ward",
            "BOUNDING_BOX": "357012.2 172868.4 357809.9 174907.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [352653, 175006],
                        [352411.5, 174532],
                        [352623.1, 174094.6],
                        [352986.6, 174627.1],
                        [352747.6, 175099],
                        [353264.2, 175338.3],
                        [353221.5, 174850.2],
                        [353583.1, 175170.8],
                        [353655.5, 176019.1],
                        [352554.7, 175948.1],
                        [352190.9, 176511.4],
                        [351904.1, 175804.4],
                        [352653, 175006]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002024",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39076,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 163.412,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "352779.8 175538.3",
            "NAME": "Pill Ward",
            "BOUNDING_BOX": "351904.1 174094.6 353655.5 176511.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [343732.7, 174984.1],
                        [344073, 175250.9],
                        [344460.5, 174983.2],
                        [345304.5, 175108],
                        [345409.2, 175205.1],
                        [344656.5, 176029],
                        [344044.6, 176244.4],
                        [343220.4, 175246.4],
                        [343732.7, 174984.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002028",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39077,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 146.476,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "344279.8 175613.8",
            "NAME": "Portishead Redcliffe Bay Ward",
            "BOUNDING_BOX": "343220.4 174983.2 345409.2 176244.4"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361532.1, 163284.9],
                        [362290.7, 162367.2],
                        [362029.5, 162021.4],
                        [363010.8, 162086.8],
                        [363469.8, 163158.1],
                        [363309.3, 165410.5],
                        [362080.8, 166483.8],
                        [362180.9, 166944.7],
                        [363426.5, 168223.7],
                        [362924.5, 168450.3],
                        [362304.2, 167738.6],
                        [361231.7, 168172.1],
                        [360615.7, 167297.2],
                        [360390.8, 166859],
                        [359609.1, 167034.6],
                        [359041.1, 166666.8],
                        [359238, 166398.5],
                        [360568.1, 166693.1],
                        [360728, 167012.4],
                        [361664.4, 166261.9],
                        [361307.4, 164770.6],
                        [360869, 164484],
                        [361193.2, 163938.5],
                        [361572.4, 163884.8],
                        [361532.1, 163284.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001961",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39078,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 1040.326,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "362370.3 165235.8",
            "NAME": "Publow and Whitchurch Ward",
            "BOUNDING_BOX": "359041.1 162021.4 363469.8 168450.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [364669, 154832.5],
                        [364697.9, 155981.1],
                        [364350.1, 156206.3],
                        [364302.1, 156904.4],
                        [365634.1, 157663.7],
                        [365758.6, 158038.3],
                        [365243.4, 158419.8],
                        [365391.2, 158781.1],
                        [365160.4, 158963.1],
                        [364233, 158666.2],
                        [364160.2, 159162.5],
                        [363567.6, 158829.5],
                        [364078.1, 158163.8],
                        [363721.2, 157543.1],
                        [363262.6, 157473.9],
                        [362874.9, 157501.9],
                        [362620, 156954],
                        [362419.1, 157167.2],
                        [361854.9, 156831.6],
                        [361208.6, 156097.2],
                        [361557.5, 155945.1],
                        [361460.4, 155653.2],
                        [361751.4, 155854.5],
                        [363279.9, 155025.3],
                        [364669, 154832.5]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001945",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39079,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 842.06,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "363483.6 156252.1",
            "NAME": "High Littleton Ward",
            "BOUNDING_BOX": "361208.6 154832.5 365758.6 159162.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [365979.6, 171471.3],
                        [366174.4, 172050.7],
                        [365523.2, 172368.9],
                        [364697.8, 171335.8],
                        [364401.8, 170195.1],
                        [364607.9, 170099.2],
                        [364776.9, 169637.5],
                        [365735.4, 170161.7],
                        [366137.6, 169832.7],
                        [366513.1, 170142.2],
                        [366446.9, 170786.4],
                        [366917.1, 171146.9],
                        [366518.7, 171452.1],
                        [365979.6, 171471.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002061",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39080,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 368.612,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "365659.4 171211.2",
            "NAME": "Longwell Green Ward",
            "BOUNDING_BOX": "364401.8 169637.5 366917.1 172368.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [363643.4, 180372.6],
                        [363034.6, 181623.3],
                        [362807.7, 181439.8],
                        [362203.9, 181904.2],
                        [361448.1, 181658.6],
                        [362073.5, 180918.4],
                        [363643.4, 180372.6]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002048",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39081,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 163.282,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "362579.1 181138.4",
            "NAME": "Bradley Stoke South Ward",
            "BOUNDING_BOX": "361448.1 180372.6 363643.4 181904.2"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [372097.6, 163058.3],
                        [372307.1, 163332.5],
                        [371643.5, 163378.7],
                        [371746.3, 163898.8],
                        [371274.5, 164286.7],
                        [371877.1, 165471],
                        [371456.3, 166047.3],
                        [370081.7, 165820.1],
                        [368597.6, 163212.2],
                        [369263.4, 162839.1],
                        [367515.6, 161967.6],
                        [367676.8, 159846.5],
                        [367930.1, 158523.5],
                        [367255.9, 157601.8],
                        [367705.5, 156553.5],
                        [368128.4, 156305.9],
                        [368478.6, 156018],
                        [368940.4, 156368.9],
                        [369627.9, 156130.4],
                        [370186.9, 155135.8],
                        [370549.8, 155446.3],
                        [370130.6, 155595.4],
                        [369203.7, 156941],
                        [369063, 157877.9],
                        [369565.9, 158506],
                        [371132.9, 158520.6],
                        [371626.8, 159332.2],
                        [372637.6, 159174.9],
                        [372842.8, 159596.6],
                        [373338.7, 159673.1],
                        [373813.6, 159144.3],
                        [374155.3, 159335.1],
                        [374528.6, 160502.3],
                        [373460.8, 161461.1],
                        [372995.6, 162834.7],
                        [372695.1, 162609.3],
                        [372456.3, 162866],
                        [372097.6, 163058.3]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05001938",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 39082,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 3562.113,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "370892.3 162236.2",
            "NAME": "Bathavon West Ward",
            "BOUNDING_BOX": "367255.9 155135.8 374528.6 166047.3"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [361541.3, 177228.9],
                        [361801, 177176.5],
                        [363003.8, 177669.4],
                        [363476.5, 177211],
                        [364283.3, 177340.2],
                        [364521, 178310.3],
                        [364479.8, 178588.3],
                        [364181.7, 178205.8],
                        [362327, 178592.5],
                        [362575, 179151.6],
                        [363408.3, 179618.9],
                        [361279.1, 179799.9],
                        [361164, 179231.7],
                        [361456, 178820.9],
                        [360713.5, 177909.4],
                        [360888.3, 177548.6],
                        [361592, 177635.8],
                        [361541.3, 177228.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002057",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 43398,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 536.241,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "362006.1 178488.2",
            "NAME": "Frenchay and Stoke Park Ward",
            "BOUNDING_BOX": "360713.5 177176.5 364521.0 179799.9"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366219.3, 175284.9],
                        [367024.4, 175392.9],
                        [367271.6, 175722.8],
                        [367675.8, 177831.8],
                        [366953.5, 178260.2],
                        [366045.2, 178822.2],
                        [366028.5, 179156.5],
                        [365730.2, 178549.1],
                        [365363.5, 178007.6],
                        [365923.7, 177181.4],
                        [366625.7, 177377.9],
                        [366376.4, 177104.8],
                        [366688, 176280.6],
                        [366250.2, 176024.9],
                        [366219.3, 175284.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002054",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 43399,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 425.19,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "366519.7 177938.4",
            "NAME": "Emersons Green Ward",
            "BOUNDING_BOX": "365363.5 175284.9 367675.8 179156.5"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [362684.1, 182172.1],
                        [361792.4, 183755.8],
                        [360687, 183295.5],
                        [360755.8, 182869.9],
                        [362147.3, 182673],
                        [362684.1, 182172.1]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002047",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 43400,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 121.312,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "361489.4 182964.0",
            "NAME": "Bradley Stoke North Ward",
            "BOUNDING_BOX": "360687.0 182172.1 362684.1 183755.8"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [366917.1, 171146.9],
                        [368148.3, 171008.5],
                        [368180, 171341.5],
                        [368780, 171559.3],
                        [369620.8, 171410.5],
                        [369924.7, 171036.4],
                        [370166, 171552.8],
                        [369212.7, 171733.3],
                        [369292.9, 172369.8],
                        [368653, 172625.6],
                        [368018.2, 172595.8],
                        [367678.2, 172930.6],
                        [367126.9, 172628],
                        [367055.3, 172013.7],
                        [366557.9, 171845.3],
                        [366518.7, 171452.1],
                        [366917.1, 171146.9]
                    ]
                ]
            ]
        },
        "properties": {
            "CENSUS_CODE": "E05002062",
            "RESOLUTION": 200,
            "ADMIN_UNIT_ID": 172233,
            "AREA_CODE": "UTW",
            "DESCRIPTION": "Unitary Authority Ward",
            "TYPE_CODE": "VA",
            "HECTARES": 380.544,
            "TYPE_DESCRIPTION": "CIVIL VOTING AREA",
            "CENTROID": "368083.7 171969.5",
            "NAME": "Oldland Common Ward",
            "BOUNDING_BOX": "366518.7 171008.5 370166.0 172930.6"
        }
    }]
};

