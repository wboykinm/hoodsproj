# Hoods

Is a project for using crowdsourcing to define the boundaries of a city's neighborhoods, as seen by the people who live there (ideally).

## Configuration

1. Create a MySQL database on your host server, with 
	* One table that contains a reeeeeaaaaalllly long text field named "json"
    * You might also want a timestamp field for sorting things out later
    
2. Configure [hoods.php]() and [gethoods.php] with your database details