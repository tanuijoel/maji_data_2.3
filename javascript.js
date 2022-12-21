let public_url = 'http://102.37.157.16:8080/geoserver';
                let workspace = 'PUBLIC_PORTAL';
                      
                let bounds = [ 3400961.92,-340390.53,5257464.46,393404.94];
                let format  = 'image/png';

                        get_kpi_array()
                        get_water_service_area_utilities_array()

                        var osmLayer = new ol.layer.Tile({
                                source: new ol.source.OSM()
                            });

                            
                            let view = new ol.View({ zoom: 15, center: [0.340505, 37.310292] });
                            let viewProjection = view.getProjection();
                            let viewResolution = view.getResolution();
                            // The Map
                            let map = new ol.Map({
                            target: 'map',
                            view: view
                            });


                            map.getView().fit(bounds, map.getSize());
                            // Add a layer switcher outside the map
                            var lswitcher = new ol.control.LayerSwitcher({
                            target:$(".layerSwitcher").get(0),
                            selection:true,
                            allwaysOnTop:true,
                            extent:true

                            });

                            var tooltip = document.getElementById('tooltip');
                            var overlay = new ol.Overlay({
                            element: tooltip,
                            offset: [10, 0],
                            positioning: 'bottom-left'
                            });
                            map.addOverlay(overlay);

                            function displayTooltip(evt) {
                            console.log("Tooltip", evt);
                            var pixel = evt.pixel;
                            var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                                return feature;
                            });
                            //tooltip.style.display = feature ? '' : 'none';
                            //if (feature) {
                                overlay.setPosition(evt.coordinate);
                                tooltip.innerHTML = 'Hapa hapa hapa';
                            //}
                            };


                            // Show or hide elements
                            $("#county_level").hide();


                            var fullscreen = new ol.control.FullScreen();
                            map.addControl(fullscreen);

                            var parser = new ol.format.WMSGetFeatureInfo();
                            const root = map.getLayerGroup();

                            let county_boundaries_json1 = new ol.source.Vector({
                                                                projection : 'EPSG:3857',
                                                                url: 'http://102.37.157.16:8080/geoserver/WASREB/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WASREB%3Acounty&maxFeatures=50&outputFormat=application%2Fjson&authkey=488c54cd-6392-4d20-953d-b522f791a23e',
                                                                format: new ol.format.GeoJSON()
                                                            });

                            let topography = new ol.source.XYZ({
                                        attributions:
                                        'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                                        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                                        url:
                                        'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                                        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                            });                               
                            
                            //Default Map layers
                            
                            let county_boundaries = new ol.layer.Vector({ displayInLayerSwitcher: false, visible: true, source: county_boundaries_json1, title:'County Boundaries' });
                            let topography_basemap = new ol.layer.Tile({ displayInLayerSwitcher: true, visible: true, source: topography, title:'Topography Basemap' });
                            let kpi_wms = new ol.layer.Tile({ displayInLayerSwitcher: false, visible: true, source: new ol.source.TileWMS({url:"http://102.37.157.16:8080/geoserver/PUBLIC_PORTAL/wms",params:{FORMAT:format,VERSION:"1.1.1",tiled:!0,STYLES:'water_coverage',LAYERS:"PUBLIC_PORTAL:kpi_county",exceptions:"application/vnd.ogc.se_inimage",tilesOrigin:"3774876.0657275263,-521207.0057444413"}}), title:'Topography' });
                            let labeled_county_boundaries = new ol.layer.Tile({ displayInLayerSwitcher: false, visible: true, source: new ol.source.TileWMS({url:"http://102.37.157.16:8080/geoserver/WASREB/wms",params:{FORMAT:format,VERSION:"1.1.1",tiled:!0,STYLES:'admin_poly_grey',LAYERS:"WASREB:county",exceptions:"application/vnd.ogc.se_inimage",tilesOrigin:"3774876.0657275263,-521207.0057444413"}})});
                            //let admin_poly_wms = new ol.layer.Tile({ displayInLayerSwitcher: false, visible: true, source: new ol.source.TileWMS({url:"http://102.37.157.16:8080/geoserver/WASREB/wms",params:{FORMAT:format,VERSION:"1.1.1",tiled:!0,STYLES:'admin_poly_grey',LAYERS:"WASREB:county",exceptions:"application/vnd.ogc.se_inimage",tilesOrigin:"3774876.0657275263,-521207.0057444413"}}), title:'Counties' });
                            map.addLayer(topography_basemap);
                            map.addLayer(kpi_wms);
                            county_boundaries.setOpacity(0.5);
                            map.addLayer(county_boundaries);
                            
                            //map.addLayer(admin_poly_wms);
                            window.localStorage.setItem('myCat', '');
                            // Hide water service providers layer
                            $(".layer_list").addClass('hidden').removeClass('show');
                            
                            document.getElementById('legend_kpi').innerHTML = "<img  height='200' width='120' src='http://102.37.157.16:8080/geoserver/PUBLIC_PORTAL/wms?Service=WMS&REQUEST=GetLegendGraphic&STYLE=water_coverage&VERSION=1.0.0&FORMAT=image/png&WIDTH=50&HEIGHT=30&LAYER=kpi_wsp_v'>";
                            document.getElementById('legend-title_kpi').innerHTML = "Water Coverage";
                            document.getElementById('national_indicator_name').innerHTML = "Water Coverage";
                            document.getElementById('main_title').innerHTML = "INDICATORS";
                            $(".circle_water_coverage").addClass('show').removeClass('hidden');
                            //Make water coverage default
                            window.localStorage.setItem('LayerInfo', "'KPI'|'kpi_county'|'water_coverage'");
                            $("#legend_introduction_kpi").show();
                            $("#legend_introduction_wusa").hide();
                            

                            // On select layer toggle 
                            $(document).on('click', '#layers-toggle', function(){
                              
                                $("#national_level").hide();
                                $("#legend_kpi").hide();
                                $("#county_level").hide();
                                $("#legend_introduction_wusa").show();
                                $("#legend_introduction_kpi").hide();


                                document.getElementById('main_title').innerHTML = "LAYERS";

                                //map.addLayer(county_boundaries);
                                map.getLayers().forEach(function(layer) {
                                    const layer_title_bridge = localStorage.getItem('layer_title_bridge');
                                    //alert(layer_title_bridge);
                                    //console.log("T1", layer_title_bridge,"T2", layer.get('title'));
                                    if(layer.get('visible') && layer.get('title') != 'Topography Basemap' && layer.get('title') != 'County Boundaries')
                                    {
                                        console.log("LAYERS", layer.get('visible'),"LAYER NAME", layer.get('name'));
                                    
                                        layer.setVisible(false);

                                    }


                                });
                                map.addLayer(county_boundaries);

                            });
                            
                             $(document).on('click', '#kpi_list', function(){
                                document.getElementById('main_title').innerHTML = "INDICATORS";
                                //alert($(this).data("metering_ratio"))
                                const LayerInfo = localStorage.getItem('LayerInfo');
                                window.localStorage.setItem('layer_title_bridge', $(this).data("layertitle"));
                                $(".layer_list").addClass('hidden').removeClass('show');

                                map.getLayers().forEach(function(layer) {
                                    const layer_title_bridge = localStorage.getItem('layer_title_bridge');
                                    //alert(layer_title_bridge);
                                    //console.log("T1", layer_title_bridge,"T2", layer.get('title'));
                                    if(layer.get('visible') && layer.get('title') != 'County Boundaries' && layer.get('title') != 'Topography Basemap')
                                    {
                                        console.log("LAYERS", layer.get('visible'),"LAYER NAME", layer.get('name'));
                                    
                                        layer.setVisible(false);

                                    }


                                });

                                
                                let kpi_wms = new ol.layer.Tile({ displayInLayerSwitcher: false, visible: true, source: new ol.source.TileWMS({url:"http://102.37.157.16:8080/geoserver/PUBLIC_PORTAL/wms",params:{FORMAT:format,VERSION:"1.1.1",tiled:!0,STYLES:$(this).data("stylename"),LAYERS:"PUBLIC_PORTAL:"+ $(this).data("layername"),exceptions:"application/vnd.ogc.se_inimage",tilesOrigin:"3774876.0657275263,-521207.0057444413"}}), title:$(this).data("layertitle") });
                                //alert($(this).data("layertitle"));
                                //map.removeLayer(kpi_wms)
                                //Add KPI layer to map  size1,size0,legendurl
                                
                               //window.localStorage.setItem('myCat', '');

                               let added_map = map.addLayer(kpi_wms);
                                window.localStorage.setItem('LayerInfo', "KPI|"+ $(this).data("layername")+"|"+ $(this).data("stylename")+"");
                               
                                //var link = document.getElementById('kpi_list');
                                //link.click();
                              
                               
                                    //    let check = window.localStorage.getItem('myCat');

                                    //     if(check == '' || check == 'Tom'){
                                    //         window.localStorage.setItem('myCat', 'Brian');
                                    //         kpi_wms.setVisible(false);
                                    //     } else if(check == 'Tom'){

                                    //         window.localStorage.setItem('myCat', 'Brian');
                                    //         kpi_wms.setVisible(false);

                                    //     } else if(check == 'Brian'){

                                    //         window.localStorage.setItem('myCat', 'Tom');
                                    //         kpi_wms.setVisible(true);

                                    //      }

                                    //Hide and show 
                                    
                                    document.getElementById('national_indicator_name').innerHTML = $(this).data("layertitle").replaceAll('_', ' ');
                                    
                                    if($(this).data("layertitle") == 'water_coverage')
                                    {

                                        $(".water_coverage").addClass('show').removeClass('hidden');
                                        $(".nrw").addClass('hidden').removeClass('show');
                                        $(".metering_ratio").addClass('hidden').removeClass('show');
                                        $(".staff_productivity").addClass('hidden').removeClass('show');

                                        $(".circle_water_coverage").addClass('show').removeClass('hidden');
                                        $(".circle_non_revenue").addClass('hidden').removeClass('show');
                                        $(".circle_metering_ratio").addClass('hidden').removeClass('show');
                                        $(".circle_staff_productivity").addClass('hidden').removeClass('show');
                                   
                                    } else if($(this).data("layertitle") == 'non_revenue_water')
                                    {

                                        $(".water_coverage").addClass('hidden').removeClass('show');
                                        $(".nrw").addClass('show').removeClass('hidden');
                                        $(".metering_ratio").addClass('hidden').removeClass('show');
                                        $(".staff_productivity").addClass('hidden').removeClass('show');

                                        $(".circle_water_coverage").addClass('hidden').removeClass('show');
                                        $(".circle_non_revenue").addClass('show').removeClass('hidden');
                                        $(".circle_metering_ratio").addClass('hidden').removeClass('show');
                                        $(".circle_staff_productivity").addClass('hidden').removeClass('show');

                                        
                                        
                                    }else if($(this).data("layertitle") == 'metering_ratio')
                                    {
                                        $(".metering_ratio").addClass('show').removeClass('hidden');
                                        $(".water_coverage").addClass('hidden').removeClass('show');
                                        $(".nrw").addClass('hidden').removeClass('show');
                                        $(".staff_productivity").addClass('hidden').removeClass('show');

                                        $(".circle_water_coverage").addClass('hidden').removeClass('show');
                                        $(".circle_non_revenue").addClass('hidden').removeClass('show');
                                        $(".circle_metering_ratio").addClass('show').removeClass('hidden');
                                        $(".circle_staff_productivity").addClass('hidden').removeClass('show');

                                    }else if($(this).data("layertitle") == 'staff_productivity')
                                    {
                                        $(".metering_ratio").addClass('hidden').removeClass('show');
                                        $(".water_coverage").addClass('hidden').removeClass('show');
                                        $(".nrw").addClass('hidden').removeClass('show');
                                        $(".staff_productivity").addClass('show').removeClass('hidden');

                                        $(".circle_water_coverage").addClass('hidden').removeClass('show');
                                        $(".circle_non_revenue").addClass('hidden').removeClass('show');
                                        $(".circle_metering_ratio").addClass('hidden').removeClass('show');
                                        $(".circle_staff_productivity").addClass('show').removeClass('hidden');

                                    }
                                
                                   document.getElementById('legend_kpi').innerHTML = "<img  height='200' width='120' src='"+ $(this).data("legendurl") +"'>";
                                   document.getElementById('legend-title_kpi').innerHTML = ""+ $(this).data("layertitle").replaceAll('_', ' ') +"";

                             });
                       
                           async function get_kpi_array(){

                            

                           await fetch("http://102.37.157.16:8080/geoserver/PUBLIC_PORTAL/ows?service=wms&version=1.1.1&request=GetCapabilities")
                            .then(function(response) {
                                return response.text();
                            }).then(function(text) {

                                    var parser = new ol.format.WMSCapabilities();

                                    var result = parser.read(text);
                                    var layers = result.Capability.Layer.Layer;
                                    //console.log("WATER_UTILITIES", layers);
                                    //get_water_utilities_service_area(layers)
                                    return layers;
                                }).then(function(layers) {
                                //console.log("LAYERSS", layers)
                                //stored_layer = layers;
                                window.localStorage.setItem('performance_indicators', JSON.stringify(layers));
                                let performance_indicators = [];
                                var container = $("#indicator_title_below");
                                
                                
                                let icons;

                                for (var i = 0; i < layers.length; i++) {

                                    let style = layers[i].Style;
                                    //let name = "John Doe";
                                    //console.log("Title " + layers[i].Title,"Name " + layers[i].Name, "STYLE", layers[i].Style[0].Name, "LegendURL", layers[i].Style[0].LegendURL[0].OnlineResource);
                                    
                                    container.append('<h5 class="text-bold text-center"><b>'+ layers[i].Title.replaceAll('_', ' ') +'</b></h5><br>');
                                    for (var w = 0; w < style.length; w++) {
                                        
                                        console.log("Name",style[w]);

                                        if(style[w].Title == 'non_revenue_water'){
                                            icons = './img/icons/non-revenue-06.svg';
                                        } else if (style[w].Title == 'staff_productivity'){
                                            icons = './img/icons/staff-productivity-03.svg';
                                        } else if(style[w].Title == 'metering_ratio')
                                        {
                                            icons = './img/icons/metering-ratio-02.svg';
                                        } else if(style[w].Title == 'water_coverage')
                                        {
                                            icons = './img/icons/drinking-water-01.svg';
                                        }
                                        
                                        console.log("Layersss  "+ layers[i].Name +"",style[w].Title);
                                        // <p>92</p> <div class="metric-element bg-red-500"></div>
                                        if(style[w].Title != 'staff_productivity'){
                                            container.append('<div id="kpi_list" data-size1="'+ style[w].LegendURL[0].size[1] +'" data-size0="'+ style[w].LegendURL[0].size[0] +'" data-legendurl="'+ style[w].LegendURL[0].OnlineResource +'" data-layertitle="'+ style[w].Title +'" data-stylename="'+ style[w].Name +'" data-layername="'+ layers[i].Name +'" class="metric-container"> <div class="metric-element border border-slate-300"> <img src="'+ icons +'" class="h-4 w-4 mx-auto"> </div> <div class="flex flex-col justify-center"> <p class="metric-label text-xs">'+ style[w].Title.replaceAll('_', ' ') +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p> </div></div>'); 
                                        }
                                       
                                   
                                        
                                    }
                                    

                                    //for (var w = 0; w < layers[i].Style.length; i++) {


                                   // }



                                    //water_services_utilities_layers.push()

                                    // map.addLayer(new ol.layer.Tile({
                                    //     visible: false,
                                    //     source: new ol.source.TileWMS({
                                    //         url: "http://102.37.157.16:8080/geoserver/WASREB/wms",
                                    //         params: {
                                    //             FORMAT: format,
                                    //             VERSION: "1.1.1",
                                    //             tiled: !0,
                                    //             STYLES: layers[i].Style[0].Name,
                                    //             LAYERS: "PUBLIC_PORTAL:" + layers[i].Name,
                                    //             exceptions: "application/vnd.ogc.se_inimage",
                                    //             tilesOrigin: "3774876.0657275263,-521207.0057444413"
                                    //         }
                                    //     }),
                                    //     title: layers[i].Title
                                    // }));

                                    // console.log("Performance", layers[i].Style.length);
                                    // //$("#indicator_title_below" ).html(layers[i].Title);
                                    // //container.append('<h5 class="text-center">'+ layers[i].Title +'</h5>');
                                    // //
                                    
                                    // for (var w = 0; w < layers[i].Style.length; i++) {

                                    //     console.log(layers[i].Style[w].Title);

                                    //     //container.append('<div class="metric-container"> <div class="metric-element border border-slate-300"> <img src="./img/icons/drinking-water-01.svg" class="h-4 w-4 mx-auto"> </div> <div class="flex flex-col justify-center"> <p class="metric-label text-xs">Drinking water quality %</p> </div> <div class="metric-element bg-red-500"> <p>92</p> </div> </div>'); 

                                    // }


                                  }

                                 //return performance_indicators;




                                }).then(function(water_services_utilities_layers) {

                                //console.log("LAYERSS", water_services_utilities_layers);

                                //map.addLayer([water_services_utilities_layers]);

                                });

                        }

                        
                        async function get_water_service_area_utilities_array(){

                            await fetch("http://102.37.157.16:8080/geoserver/WASREB/ows?service=wms&version=1.1.1&request=GetCapabilities")
                            .then(function(response) {
                                return response.text();
                            }).then(function(text) {

                                var parser = new ol.format.WMSCapabilities();

                                var result = parser.read(text);
                                var layers = result.Capability.Layer.Layer;
                                //console.log("WATER_UTILITIES", layers);
                                 //get_water_utilities_service_area(layers)
                                 return layers;
                             }).then(function(layers) {
                                  //console.log("LAYERSS", layers)
                                  //stored_layer = layers;
                                  window.localStorage.setItem('water_utilities_service_area', JSON.stringify(layers));
                                  let water_services_utilities_layers = [];
                                  for (var i = 0; i < layers.length; i++) {
                                        //let name = "John Doe";
                                        //console.log("Title " + layers[i].Title,"Name " + layers[i].Name, "STYLE", layers[i].Style[0].Name, "LegendURL", layers[i].Style[0].LegendURL[0].OnlineResource);
                                    
                                        //water_services_utilities_layers.push()
                                   
                                        map.addLayer(new ol.layer.Tile({ zIndex: 9, visible: false, source: new ol.source.TileWMS({url:"http://102.37.157.16:8080/geoserver/WASREB/wms",params:{FORMAT:format,VERSION:"1.1.1",tiled:!0,STYLES:layers[i].Style[0].Name,LAYERS:"PUBLIC_PORTAL:"+ layers[i].Name,exceptions:"application/vnd.ogc.se_inimage",tilesOrigin:"3774876.0657275263,-521207.0057444413"}}), title:layers[i].Title }));

                                    }

                                   return water_services_utilities_layers;

                                   


                             }).then(function(water_services_utilities_layers) {

                                   //console.log("LAYERSS", water_services_utilities_layers);

                                   //map.addLayer([water_services_utilities_layers]);

                             });

                            //map.addLayer(osmLayer)

                         }

                         map.on('pointermove', function(evt) { 
                            //alert("Show me");
                            $("#legend_introduction").hide();
                            displayTooltip
                            const map_clicked = window.localStorage.getItem('map_clicked');
                            if(map_clicked == 'on'){

                                //alert("Show me");

                                const wusa_layers = map.getLayerGroup().getLayers().getArray();
                                for (let f = 0; f < wusa_layers.length; f++) { 

                                     let wusa_each_layer =  wusa_layers[f];
                                     

                                     if(wusa_each_layer.get('visible') && wusa_each_layer.get('title') != 'Topography Basemap' && wusa_each_layer.get('title') != 'County Boundaries'){

                                        var url = wusa_each_layer.getSource().getFeatureInfoUrl(
                                                    evt.coordinate, viewResolution, viewProjection,
                                                                    {'INFO_FORMAT': 'application/json'});

                                        $.ajax({url: url, dataType: 'json', success:function(response) {  
                                                        
                                            var result = response;
                                            if(result.features.length != 0){
                                                  //map.getView().setZoom(8);
                                                 console.log("Resutlts Features", result.features[0].properties);
                                                
                                                 $("#wusa_attribute_info").html(result.features[0].properties);
                                                 
                                                 const myObj = JSON.parse(JSON.stringify(result.features[0].properties));
                                                    let text = "<div style='margin-right:30px !important;'><h5>"+ wusa_each_layer.get('title') +"</h5><br><table id='layer_info_table' class='text-left' style='margin-left: 10px !important;; font-size:12px!important;'>"
                                                    for (let x in myObj) {
                                                        console.log(myObj[x]);
                                                        if(myObj[x] != 'null'){
                                                            text += "<tr><td style='padding: 4; margin:4;'>"+ x +"</td><td style='padding: 4; margin:4;'>" + myObj[x] + "</td></tr>";
                                                        }
                                                     }
                                                    text += "</table></div>"    
                                                    document.getElementById("wusa_info_box").innerHTML = text;

                                                    $("#county_level").show();

                                                    const LayerInfo = localStorage.getItem('LayerInfo').split("|");
                                                    
                                                    if(LayerInfo[0] == "'KPI'" || LayerInfo[0] == "KPI"){

                                                        document.getElementById("tooltip_county").innerHTML = '<b>County:</b> '+ result.features[0].properties.name +'';

                                                        if(LayerInfo[2] == "'water_coverage'" || LayerInfo[2] == "water_coverage"){

                                                            document.getElementById("tooltip_kpi").innerHTML = '<b>Water Coverage:</b> '+ result.features[0].properties.water_coverage +'';

                                                        } else if(LayerInfo[2] == "'non_revenue_water'" ||LayerInfo[2] == "non_revenue_water"){

                                                            document.getElementById("tooltip_kpi").innerHTML = '<b>Non Revenue Water:</b> '+ result.features[0].properties.nrw +'';

                                                        }
                                                        else if(LayerInfo[2] == "'metering_ration'" || LayerInfo[2] == "metering_ratio"){

                                                           document.getElementById("tooltip_kpi").innerHTML = '<b>Metering Ratio:</b> '+ result.features[0].properties.metering_ration +'';

                                                        }
                                                        else if(LayerInfo[2] == "'staff_productivity'" || LayerInfo[2] == "staff_productivity"){

                                                          document.getElementById("tooltip_kpi").innerHTML = '<b>Staff Productivity:</b> '+ result.features[0].properties.staff_productivity +'';

                                                        }

                                                    }





                                                    
                                            }
                                        }});             
                                     }




                                }

                             }


                         });
                           //singleclick
                         map.on('singleclick', function(evt) { 
                                
                                window.localStorage.setItem('map_clicked', 'on');
                                //Hide Later List DIV 
                                //$(".all_layers").addClass('show').removeClass('hidden');
                                //$("#county_level").hide();
                                $("#legend_introduction").hide();

                                //Zoom to county

                                const LayerInfo = window.localStorage.getItem('LayerInfo');
                                 const LayerInfoSplit = LayerInfo.split("|");

                                 console.log("LayerInfo", LayerInfoSplit[2]);
                                 

                                let feature = map.forEachFeatureAtPixel (evt.pixel, function (feature) {return feature;});
                                
                                map.getView().fit(feature.getGeometry())
                                map.getView().setZoom(9);

                                 

                                //var change_county_style = '';

                                var change_county_style = new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                color: '#E43F32',
                                                width: 3,
                                                opacity: 1.0
                                                }),
                                                fill: new ol.style.Fill({
                                                color: [245, 141, 66]
                                                }),
                                                zIndex: 1
                                                
                                });

                                // const wusa_layers = map.getLayerGroup().getLayers().getArray();
                                // for (let f = 0; f < wusa_layers.length; f++) { 

                                //      let wusa_each_layer =  wusa_layers[f];
                                     

                                //      if(wusa_each_layer.get('visible') && wusa_each_layer.get('title') != 'Topography Basemap' && wusa_each_layer.get('title') != 'County Boundaries'){

                                //         var url = wusa_each_layer.getSource().getFeatureInfoUrl(
                                //                     evt.coordinate, viewResolution, viewProjection,
                                //                                     {'INFO_FORMAT': 'application/json'});

                                //         $.ajax({url: url, dataType: 'json', success:function(response) {  
                                                        
                                //             var result = response;
                                //             if(result.features.length != 0){
                                                  
                                //                  console.log("Resutlts Features", result.features[0].properties);
                                                
                                //             }
                                //         }});             
                                //      }




                                // }
                                //console.log("Roots", wusa_layers);
                                
                               // feature.setStyle(change_county_style);






                            });

                         lswitcher.on('select', function(e) {
                                
                               // Hide indicators
                               $("#national_level").hide();
                                $("#county_level").hide();
                                $("#legend_kpi").hide();
                                //map.addLayer(labeled_county_boundaries);
                                document.getElementById("wusa_info_box").innerHTML = '';

                                $("#legend_introduction_wusa").show();
                                $("#legend_introduction_kpi").hide();

                                

                                let selected_layer = e.layer;
                                //console.log("Layer", e.layer.get('title'));

                                document.getElementById('main_title').innerHTML = "MAP LAYERS";
                            
                                const water_utilities_service_area = window.localStorage.getItem('water_utilities_service_area');
      
                                //console.log("Stored array", );
                                let wusa_array = JSON.parse(water_utilities_service_area);
                                
                                let filtered_capabilities = wusa_array.find(item => {
                                     return item.Title == ''+ e.layer.get('title') +''
                                 })

                                 console.log("Capabilities", filtered_capabilities.Name);
                                 document.getElementById('legend').innerHTML = "<img  height='"+ filtered_capabilities.Style[0].LegendURL[0].size[0] +"' width='"+ filtered_capabilities.Style[0].LegendURL[0].size[1] +"' src='"+ filtered_capabilities.Style[0].LegendURL[0].OnlineResource +"'>";
                                 document.getElementById('legend-title').innerHTML = ""+ e.layer.get('title') +"";
                                     
                                 const LayerInfo = window.localStorage.getItem('LayerInfo');
                                 const LayerInfoSplit = LayerInfo.split("|");

                                 console.log("LayerInfo", LayerInfoSplit[2]);
                                 if(LayerInfoSplit[0] == 'KPI'){

                                     map.getLayers().forEach(function(layer) {

                                     //console.log("Layer Title", layer.get('title'));
                                   
                                     if(layer.get('visible') && LayerInfoSplit[2] == layer.get('title'))
                                     {
                                        console.log("LAYERS", LayerInfoSplit[2],"LAYER NAME", layer.get('Title'));
                                        layer.setVisible(false);

                                     }
                                  });
                                 }
                            });
                       
                        get_analytics_geojson();

                        async function get_analytics_geojson(){

                            let res = await axios.get('http://102.37.157.16:8080/geoserver/PUBLIC_PORTAL/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PUBLIC_PORTAL%3Akpi_county&maxFeatures=2350&outputFormat=application%2Fjson');  
                            const all_indicators = JSON.parse(JSON.stringify(res.data.features));

                            let sum_ps = 0;
                            let sum_psa = 0;
                            let wp = 0;
                            let bv = 0;
                            let nac = 0;
                            let ntc = 0;

                            let awc = 0;
                            let nmc = 0;


                            for (let i = 0; i < all_indicators.length; i++) {
                                const pop_served = all_indicators[i].properties.population_served;
                                const pop_service_area = all_indicators[i].properties.population_service_area;

                                const water_produced = all_indicators[i].properties.water_produced;
                                const billed_volume = all_indicators[i].properties.billed_volume;

                                const active_connections = all_indicators[i].properties.active_connections;
                                const staff_total = all_indicators[i].properties.staff_total;

                                const active_water_connections = all_indicators[i].properties.active_water_connections;
                                const metered_connections = all_indicators[i].properties.metered_connections;

                            //Water coverge
                                sum_ps += pop_served;
                                sum_psa += pop_service_area;

                                //Non Revenue Water
                                wp += water_produced;
                                bv += billed_volume;

                                //Staff productivity
                                nac += active_connections;
                                ntc += staff_total;

                                //Metering Ratio
                                awc += active_water_connections;
                                nmc += metered_connections;

                            }
                        
                            let national_water_coverage = ((sum_ps/sum_psa) * 100).toFixed(0);
                            let non_revenue_water = (((wp-bv)/wp) * 100).toFixed(0);
                            let staff_productivity = ((ntc/nac) * 1000).toFixed(0);
                            let metering_ratio = (((nmc/awc)) * 100).toFixed(0);

                            $('#national_wc').html(national_water_coverage);
                            $('#national_nrw').html(non_revenue_water);
                            $('#national_metering_ratio').html(metering_ratio);
                            $('#population_served').html(sum_ps.toLocaleString());
                            $('#population_service_area').html(sum_psa.toLocaleString());
                            $('#active_water_connections').html(awc.toLocaleString());
                            $('#water_produced').html(wp.toLocaleString());

                            $('#national_legend_title').hide();
                            
                            console.log("Natioanl", nmc);
                            //$("#county_level").hide();
                        // $('#myTable tbody').append('<tr class ="table_class" id="table_id" data-name="' + name + '"><td>XXXX</td></tr>');
                        //$('#water_coverage').append('<div data-end-value="' + national_water_coverage + '" class="circular-progress circular-progress-small mx-auto"><div class="value-container value-container-small text-slate-600">0%</div></div>');
                        // $("#water_coverage").data-end("92", national_water_coverage);

                        //var startTime = national_water_coverage.getAttribute('data-end-value');
                        // var startTime = $('.water_coverage').getAttribute('data-end-value');
                        // console.log("Startr",startTime)


                        //const element = document.querySelector("#water_coverage");
                    //  delete element.dataset.attributeName;

                          const t = '67';
                       //  $("#water_coverage_analytics").attr("data-end-value", t); 
                         // console.log("Jujuuu",$("#water_coverage_analytics").data("end-value"));

                         

                        
                        }


                        var popup = new ol.Overlay({ element: document.getElementById('popup')});

                        
                         map.on('pointermove', function(evt) {

                                

                                // const root = map.getLayerGroup();
                                
                                // const water_utilities_service_area = root.getLayers().item(1);
                                // const performance_indicators_analytics = root.getLayers().item(3);
                                // const wsp_performance_indicators_analytics = root.getLayers().item(2);

                                // //console.log("Point Move", performance_indicators_analytics);

                                // for (let f = 0; f < wsp_performance_indicators_analytics.getLayers().getArray().length; f++) { 
                                    
                                //     let pia =  wsp_performance_indicators_analytics.getLayers().item(f);
                                //     console.log("PIA PIS", pia);
                                //         if(pia.get('visible')){

                                             

                                //         }

                                // }

                            });

                        
                            $("#nrw").hide();
                            $("#water_coverage").hide();
                            $("#nrw_county").hide();
                            $("#metering_ratio_county").hide();
                            $("#water_coverage_county").hide();  
                            $("#water_coverage_stats").hide();
                            $("#metering_ratio_stats").hide();
                            $("#non_revenue_county").hide();
                            $("#non_revenue_stats").hide();

                        
                            //class="form-control" style="margin-bottom:20px !important;"
                            map.addControl(lswitcher);

                            // The serach input
                            var search = $('<input id="main-search" class="form-control" style="color:#293445; margin-bottom:0px !important;">').attr('placeholder','Type To Filter..e.g Water Coverage');
                            function filterLayers(rex, layers) {
                            
                            var found = false;
                            layers.forEach(function(l){
                                // Layer Group
                                if (l.getLayers) {
                                if (filterLayers(rex, l.getLayers().getArray())) {
                                    l.set('noLayer', false);
                                    found = true;
                                } else {
                                    //l.set('noLayer', true);
                                }
                                } else {
                                if (rex.test(l.get('title'))) {
                                    l.setVisible(true);
                                    found = true;
                                } else {
                                    l.setVisible(false);
                                }
                                }
                               });
                               return found;
                            }

                            search.on('keyup change', function(){
                            var rex = new RegExp(search.val());
                            filterLayers(rex, layers);
                            // Force layer switcher redraw
                            //layers[0].changed();
                            });

                            // Add search input in the switcher header
                            lswitcher.setHeader(search.get(0));

                            lswitcher.on('toggle', function(e) {

                                const performance_indicators_analytics = root.getLayers().item(3);
                               

                            });
                            //

                            // When switcher is drawn hide/show the list item according to its visility
                            lswitcher.on('drawlist', function(e) {
                                
                            // console.log("E layers", e.layer);
                            // Hide Layer Group with no layers visible
                            if (e.layer.get('noLayer')) {
                                if (e.layer.get('noLayer')) {
                              //  $(e.li).hide();
                                } else {
                               // $(e.li).show();
                                }
                            } else {
                                var rex = new RegExp(search.val());
                                if (rex.test(e.layer.get('title'))) {
                                $(e.li).show();
                                } else {
                                $(e.li).hide();
                                }
                            }
                            });

                        