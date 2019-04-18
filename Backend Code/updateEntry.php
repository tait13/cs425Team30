<?php

    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "1phO3a17gX", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }

    //Insert POST values into database
    $sql = "UPDATE Assets SET AssetJSON='" . $_POST["json"] . "' WHERE creationTime='" . $_POST["creationTime"] . "';";

    
    //Check if successful    
    if($connection->query($sql) === TRUE)
    {
        print "Record Updated";
    }
    else
    {
        print "Error: " . $sql . "<br>" . $conn->error;
    }

?>
