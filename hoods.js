//CONFIGURE AND EXTEND THIS LIST AS NEEDED FOR YOUR OWN NEIGHBORHOODS
var hoods = [
	{name:"Speer",color:"#A6CEE3"},
	{name:"East Colfax",color:"#1F78B4"},
	{name:"Capitol Hill",color:"#B2DF8A"},
	{name:"Five Points",color:"#33A02C"},
	{name:"Westwood",color:"#FB9A99"},
	{name:"University Park",color:"#E31A1C"},
	{name:"Hilltop",color:"#FDBF6F"},
	{name:"Globeville",color:"#FF7F00"},
	{name:"Berkeley",color:"#CAB2D6"},
	{name:"Virginia Village",color:"#6A3D9A"},
	{name:"Ruby Hill",color:"#D47384"},
	{name:"Mar Lee",color:"#604860"},
        {name:"Hale",color:"#00688B"},
        {name:"Congress Park",color:"#236B8E"},
        {name:"custom",color:"cornflowerblue"},
	];

var currentHood = Math.round( Math.random()*(hoods.length-1) );
var drawingManager;
var drawingOptions;
var polygonOptions;

var polygons = [];

var drawText = "Click points on the map to trace the shape. Double-click or click the starting point to finish the shape. Don't worry, you can edit it after you're finished!";
var editText = "Drag the white squares to edit the shape.";

//THIS SUPER-CLEAN BASEMAP WILL GIVE NO ONE ANY IDEAS 
//ABOUT WHERE THE NEIGHBORHOOD BOUNDARIES ALREADY ARE . . .

function initialize() {
	var styler = [
	  {
		stylers: [
		  { saturation: -99 },
		  { visibility: "simplified" },
		  { lightness: 30 }
		]
	  },{
		featureType: "water",
		stylers: [
		  { saturation: 10 },
		  { hue: "#5f6074" },
		  { lightness: -19 },
		  { visibility: "simplified" }
		]
	  },{
		featureType: "road",
		elementType: "geometry",
		stylers: [
		  { visibility: "simplified" },
		  { lightness: 100 }
		]
	  },{
	   featureType: "road",
	   elementType: "labels",
	   stylers: [
		 { visibility: "on" },
		 { saturation: -98 },
		 { lightness: 30 }
	   ]
	 },{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [
		  { visibility: "on" },
		  { hue: "#a07c62" },
		  { saturation: 10 }
		]
	  },{
		featureType: "administrative.land_parcel",
		stylers: [
		  { hue: "#ff001a" },
		  { saturation: 95 },
		  { visibility: "off" }
		]
	  }
	];
	var myOptions = {
	//CONFIGURE WITH YOUR OWN CITY CENTERPOINT (GETLATLON.COM)
		center: new google.maps.LatLng(39.737, -104.985),
		zoom: 11,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var hoodMapType = new google.maps.StyledMapType(hoodMapType,{name: "Hoods"});
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	map.setOptions({styles:styler});
	//UNCOMMENT BELOW IF YOU HAVE A KML OF YOUR STUDY BOUNDARY TO INCLUDE
	//var cityBorder = new //google.maps.KmlLayer('http://data.denvergov.org/download/gis/county_boundary/kml/county_boundary.kmz', {clickable: false, //preserveViewport: true});
	//cityBorder.setMap(map);
	
	polygonOptions = {
			fillColor: hoods[currentHood].color,
			fillOpacity: .6,
			strokeWeight: 1,
			strokeColor: "#666666",
			clickable: false,
			editable: true,
			zIndex: 1
		};
	drawingOptions = { drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: false,
		polygonOptions: polygonOptions
	}
	drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
	
	drawingManager.setMap(map);
	
	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
		drawingManager.setDrawingMode(null);
		polygons[currentHood] = polygon;
		$(".hood:eq("+currentHood+")").append("<span class='edit'>(edit)</span>");
		$("#instruction-details").html( editText );
	});
	
        for ( var i in hoods ){
		  if (hoods[i].name == 'custom') {
		 $("#hoodlist").append( "<div class='hood'><div class='colorchip' style='background:"+hoods[i].color+";'></div><p style='display:inline;'><input id='customhood' type='text' value='Submit your own' size='14'/></p></div>");
		} else {
		  $("#hoodlist").append( "<div class='hood'><div class='colorchip' style='background:"+hoods[i].color+";'></div><p style='display:inline;'>"+hoods[i].name+"</p></div>" );
		}
        }

        //$(".hood").change(function() { alert( hoods[hoods.length - 1].name );      });
        $(".hood").change(function() { hoods[hoods.length - 1].name = $("#customhood").val() });
	
	//$("#hoodlist").append( "<p id='finished'>Done drawing neighborhoods?</p><p id='submit'>SUBMIT YOUR MAP</p>");
	
	$(".hood").click( function(){
		selectHood( $(".hood").index( $(this) ) );
	});
	
	$("#next").click( function(){
		if ( currentHood < hoods.length - 1 )
			selectHood( currentHood + 1 );
		else selectHood(0);
	});
	
	$(".hood:eq("+currentHood+")").addClass("active");
	var name = hoods[currentHood].name;
	if ( hoods[currentHood].prefix ) name = hoods[currentHood].prefix + " " + name;
	$("#currenthoodname").html( name.toUpperCase() );
	
	$("#submit").on("click", function(){
		var str = "";
		for ( var i in polygons ){
			if ( polygons[i] ){
				str += hoodToJson(i) + ",";
			}
		}
		if ( str != "" ){
			$("#submit").off("click");
			$.post("hoods.php",{hoods: str},function(data){window.location.href = 'http://www.geosprocket.com/core/index.php/btvwards-thanks/';});
		}
	});
	$( window ).resize( sizeMap );
	sizeMap(null);
	function sizeMap(event){
		$('#map_canvas').css( 'height',Math.max( $(window).height(), $('#hoodlist').height() ) - $('#instructions').height() - 4 );
		$("#instructions").css('width',$(window).width() - $('#hoodlist').width() - 10 );
	}
}

function selectHood( index ){
	if ( polygons[currentHood] ){
		polygons[currentHood].setOptions( {editable: false} );
	}
	$(".active").removeClass("active");
	$(".hood:eq("+index+")").addClass("active");
	//$(this).addClass("active");
	currentHood = index;
	var name = hoods[currentHood].name;
	if ( hoods[currentHood].prefix ) name = hoods[currentHood].prefix + " " + name;
	$("#currenthoodname").html( name.toUpperCase() );
	if ( polygons[currentHood] ){
		drawingManager.setDrawingMode(null);
		polygons[currentHood].setOptions( {editable: true} );
		$("#instruction-details").html( editText );
	} else {
		drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
		polygonOptions.fillColor = hoods[currentHood].color;
		drawingOptions.polygonOptions = null;
		drawingOptions.polygonOptions = polygonOptions;
		drawingManager.setOptions(null);
		drawingManager.setOptions(drawingOptions);
		$("#instruction-details").html( drawText );
	}
}

function hoodToJson( hood ) {
	var polygon = polygons[hood];
	var array = polygon.getPath().getArray();
	var coords = []; 
	for ( var i=0; i<array.length; i++ ){
		coords.push( [ array[i].lng(), array[i].lat() ] );
	}
	return JSON2.stringify( { type: "Feature", geometry: { type: "Polygon", coordinates: [ coords ] }, properties: { name: hoods[hood].name } } );
}
//BELOW IS YOUR STARTING SPLASH SCREEN. DENVER'S INFO IS CURRENTLY IN THERE, 
//BUT ADD YOUR OWN EXPLANATORY TEXT - PLEASE CREDIT BOSTONOGRAPHY FOR THE IDEA
$(document).ready(function() {
	$.fancybox(
		"<h2>Mapping Denver's neighborhoods</h2><hr><p>From East Colfax to Capitol Hill, Denver is composed of distinctive neighborhoods. Some of these are defined by natural features, but there is still much disagreement on where one neighborhood ends and another begins. Because both formal and informal lines have consequences on city services, politics, and identity, we want to make a map of Denver's neighborhoods by its residents and those who know the city well.</p><p>This map is a tool for drawing neighborhood boundaries as <strong>you</strong> see them, and submitting them to a collective map. You can submit as many or as few neighborhoods as you'd like, but <strong>please only draw a neighborhood if you think you have a decent idea of where it is</strong>. <br/><br/><i>We'd like to thank the mappers at <a href='http://bostonography.com/2012/crowdsourced-neighborhood-boundaries-part-one-consensus/' target='_blank'>Bostonography</a> for developing this concept from scratch.</i><br/><hr>",
		{
        	'autoDimensions'	: false,
			'width'         		: 500,
			'height'        		: 500,
			'transitionIn'		: 'elastic',
			'transitionOut'		: 'elastic'
		}
		
	);
});
