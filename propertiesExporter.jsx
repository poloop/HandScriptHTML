var currentComp = app.project.activeItem;

function stripFloat(x, n) {
    return x.toFixed (n);
}

function createPanel(obj) {
        var panel = (obj instanceof Window) ? obj : new Window("dialog", "Properties exporter", [100, 100, 500, 550]);
        var startFrameLabel = panel.add("statictext", [10, 10, 50, 30], "Start : ");
        var startFrameArea = panel.add("edittext", [50, 10, 80, 30], "0");
        
        var endFrameLabel = panel.add("statictext", [100, 10, 140, 30], "End : ");
        var endFrameArea = panel.add("edittext", [140, 10, 170, 30], "0");
        
        var rateLabel = panel.add("statictext", [10, 40, 100, 50], "Rate : ");
        var rateArea = panel.add("edittext", [50, 40, 100, 60], "10");
        
        panel.add("statictext", [10, 80, 150, 30], "Selected properties");
        var layer;
        var yLayerLabel = 100;
        for(var i = 0; i < currentComp.selectedLayers.length; i++) {
                layer = currentComp.selectedLayers[i];
                panel.add("statictext", [20, yLayerLabel, 200, 30], "_" + layer.name);
                for(var j = 0; j < currentComp.selectedProperties.length; j++) {
                    if(layer.selectedProperties[j] instanceof Property)
                    {
                         panel.add("statictext", [30, yLayerLabel + 15, 200, 30], "+" + layer.selectedProperties[j].parentProperty.name + " : " + layer.selectedProperties[j].name);
                         yLayerLabel += 20;
                    }
                }
                yLayerLabel += 20;
        }
        var fps = currentComp.frameRate;
        var button = panel.add("button", [310, 10, 390, 30], "Export");
        /*
          var outputLabel = panel.add("statictext", [10, yLayerLabel + 30, 100, 30], "OutputData : ");
          var outputArea = panel.add("edittext", [10, yLayerLabel + 50, 390, yLayerLabel + 300], "");
         */
        button.onClick = function() {
                var value;
                var tmp = '[';
                var rate = parseInt (rateArea.text, 10);
                
                var start = parseInt (startFrameArea.text, 10); //eval(prompt("Start frame",  "1 * " + fps + " 0")) * rate;
                var end = parseInt (endFrameArea.text, 10); //eval(prompt("End frame",  "1 * " + fps + " 0")) * rate;
                
                var ln;
                for(var i = 0; i < currentComp.selectedLayers.length; i++) {
                        ln = currentComp.selectedLayers[i];
                        tmp += '{\n\t"name":"' + ln.name + '",  \n\t"effects":[';
                        var parentProp = '';
                        for(var j = 0; j < ln.selectedProperties.length; j++) {
                            if(ln.selectedProperties[j] instanceof Property)
                            {
                                 if(ln.selectedProperties[j].parentProperty.name != parentProp)
                                 {
                                     tmp += '{\n\t\t"name":"' + ln.selectedProperties[j].parentProperty.name + '", \n\t\t"props":[{\n\t\t\t"name":"' + ln.selectedProperties[j].name + '", \n\t\t\t"values":[';
                                 } else {
                                     tmp += '{\n\t\t\t"name":"' + ln.selectedProperties[j].name + '", \n\t\t\t"values":[';
                                 }
                                 for(var t = (start * rate); t < (end * rate); t++) {
                                    value = ln.selectedProperties[j].valueAtTime(t/(fps * rate), true);
                
                                    //tmp += (value instanceof Array) ? '[' + value.join(",") + ']' :  value;
                                    
                                    if(value instanceof Array)
                                    {
                                        tmp += '[';
                                        for(var n = 0; n < value.length; n++)
                                        {
                                            tmp += (n == 0) ? stripFloat(value[n], 3) : ', ' + stripFloat(value[n], 3);
                                        }
                                        tmp += ']';
                                    } else tmp += stripFloat(value, 3);
                                    
                                    if(t < (end * rate) - 1) tmp += ',';
                                    else tmp += ']';
                                    //outputArea.text = tmp;
                                 }
                                 parentProp = ln.selectedProperties[j].parentProperty.name;
                                 if(j < ln.selectedProperties.length - 1)
                                 {
                                     tmp += (ln.selectedProperties[j + 1].parentProperty.name != parentProp) ? '\n\t\t}]},' : '\n\t\t},';
                                 } else{
                                     tmp += '\n\t\t}]\n\t}]';
                                 }
                            }
                        }
                        if(i < currentComp.selectedLayers.length - 1) tmp += '\n},';
                        else tmp += '\n}]';
                }
                    

                var myTextFile = File.saveDialog ("Save points", "*.json");
                myTextFile.open("W");
                myTextFile.write(tmp);
                myTextFile.close();

        }
        return panel;
}

//alert(currentComp.layer(1).selectedProperties[1].value);
var exporterPanel = createPanel (this);
exporterPanel.show();