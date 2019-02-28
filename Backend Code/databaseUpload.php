<?php

    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "1phO3a17gX", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }

    //Insert POST values into database
    $sql = "INSERT INTO Assets (creationTime, originalImageLoc, boxedImageLoc, name, AssetJSON) VALUES
        ('".date("Y-m-d H:i:s")."', '"
        .$_POST["originalImageLoc"]."', '"
        .$_POST["boxedImageLoc"]."', '"
        .$_POST["name"]."', '"
        .$_POST["json"]."');";
        
    //Check if successful    
    if($connection->query($sql) === TRUE)
    {
        print "New Record Created";
    }
    else
    {
        print "Error: " . $sql . "<br>" . $conn->error;
    }

?>
