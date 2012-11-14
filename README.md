# hoods

Is a project for using crowdsourcing to define the boundaries of a city's neighborhoods, as seen by the people who live there (ideally).

### Configuration

1. Create a MySQL database on your host server, with 
	* One table that contains a reeeeeaaaaalllly long text field named "json"
    * You might also want a timestamp field for sorting things out later    
2. Configure [hoods.php](https://github.com/wboykinm/hoodsproj/blob/master/hoods.php) and [gethoods.php](https://github.com/wboykinm/hoodsproj/blob/master/gethoods.php) with your database details
3. Configure [hoods.js](https://github.com/wboykinm/hoodsproj/blob/master/hoods.js) with your list of neighborhood names, city centerpoint and splash screen intro text
4. Visit the site, draw a few test polygons and watch them pile up in [results.html](https://github.com/wboykinm/hoodsproj/blob/master/results.html)


### Authors
* Andy Woodruff (Author)
* Bill Morris (Repo monkey)