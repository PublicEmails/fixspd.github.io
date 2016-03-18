/*
Add <script src="https://fixspd.org/js/webmaster_toolkit_for_socrata.js"></script> to your webpage
To add a count(*) add something similar to
<p>There are <span class="socrata_count" data-url="https://data.seattle.gov/resource/a4j2-uu8v.json?$select=count(*)&$where=completed_date IS NULL"></span> open Seattle Police records requests.</p>

*/
if (typeof console == "undefined") {
    this.console = {log: function() {}};
}

function updateItemWithSimpleCount(item, data) {
  item.text(data[0][Object.keys(data[0])[0]]);
}

function handleSimpleCount() {
  $.each($('.socrata_count'), function(item) {
    console.log($(this).attr('data-url'))
    var socrataUrl = $(this).attr('data-url');
    var item = $(this)
    $.get(socrataUrl, function(data) {
      updateItemWithSimpleCount(item, data);
    });
  });
}

function handleSimpleCountsSum() {
  $.each($('.socrata_sum_of_counts'), function(item) {
    console.log($(this).attr('data-urls'))
    var socrataUrls = $(this).attr('data-urls');
    var item = $(this);
    var total = 0;
    $.each(socrataUrls.split(';'), function(i, url) {
        var data = JSON.parse($.ajax({
            type: "GET",
            url: url,
            async: false
        }).responseText);
        total += parseInt(data[0][Object.keys(data[0])[0]]);
    });
    item.text(total);
  });
}
function main() {
    var plugins = ['https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/excanvas.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.BezierCurveRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.barRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.blockRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.bubbleRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.canvasAxisLabelRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.canvasAxisTickRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.canvasOverlay.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.canvasTextRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.categoryAxisRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.ciParser.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.cursor.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.dateAxisRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.donutRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.dragable.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.enhancedLegendRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.funnelRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.highlighter.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.json2.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.logAxisRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.mekkoAxisRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.mekkoRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.meterGaugeRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.mobile.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.ohlcRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pieRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pointLabels.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pyramidAxisRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pyramidGridRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pyramidRenderer.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.trendline.min.js'];
    $.each(plugins, function(i,url){
        var script = document.createElement("SCRIPT");
        script.src = url;
        script.type = 'text/javascript';
        document.getElementsByTagName("head")[0].appendChild(script);
    })
    handleSimpleCount();
    handleSimpleCountsSum();
}

if (!window.jQuery) {
// Anonymous "self-invoking" function
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };

    // Start polling...
    checkReady(function($) {
        main();
    });
})();
} else {
    main();
}
