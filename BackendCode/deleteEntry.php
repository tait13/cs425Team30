<?php

    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }


    //Insert POST values into database
    $sql = 'DELETE FROM Assets WHERE creationTime= "' . $_POST["creationTime"] . '";';
        
    //Check if successful    
    if($connection->query($sql) === TRUE)
    {
        print "Record Deleted " . $sql;
    }
    else
    {
        print "Error: " . $sql . "<br>" . $connection->error;
    }

?>
